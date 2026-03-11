// CUSTOMIZATION (Whole file) - Adding Auth0 support for secure pages
import { MiddlewareBase, MiddlewareBaseConfig } from '@sitecore-content-sdk/nextjs/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { SitecoreConfig } from '@sitecore-content-sdk/nextjs/config';
import { GetPageAuth } from 'graphql/generated/graphql-documents';

// Type definitions for GraphQL response
interface FieldData {
  name: string;
  value: string;
}

interface LayoutItem {
  field: FieldData;
}

interface LayoutData {
  item: LayoutItem;
}

interface GetPageAuthResponse {
  layout: LayoutData;
}

export type AuthMiddlewareConfig = MiddlewareBaseConfig & SitecoreConfig['api']['edge'];

/**
 * This is the authentication middleware for Next.js.
 * It checks if pages require authentication and redirects unauthenticated users.
 *
 * The `AuthMiddleware` will:
 *  1. Check if the current page has pageRequiresAuth.value set to 1
 *  2. If so, validate the JWT token using NextAuth's getToken utility
 *  3. Redirect to login if authentication is required but user is not authenticated or token is invalid
 */
export class AuthMiddleware extends MiddlewareBase {
  constructor(protected config: AuthMiddlewareConfig) {
    super(config);
  }

  protected disabled(req: NextRequest, res: NextResponse): boolean | undefined {
    // Check if API config is missing - if so, disable the middleware
    if (!this.config.contextId && !this.config.clientContextId) {
      console.warn(
        '[AuthMiddleware] Auth middleware requires Edge configuration (contextId/clientContextId). ' +
          'Auth features will be disabled. This is expected in local container development.'
      );
      return true;
    }

    return super.disabled(req, res);
  }

  /**
   * Parse exclusion paths from environment variable or return defaults
   */
  private getAuthExclusionPaths(): string[] {
    // Read pipe-delimited paths from environment variable
    // Format: "path1|path2|path3" (e.g., "/api/|/_next/|/favicon.ico|/")
    const envPaths = process.env.AUTH_EXCLUSION_PATHS;
    if (envPaths) {
      return envPaths
        .split('|')
        .map((path) => path.trim())
        .filter((path) => path.length > 0);
    }

    // Default exclusion paths if environment variable is not set
    return ['/api/', '/_next/', '/favicon.ico', '/'];
  }

  /**
   * Check if the current path should be excluded from authentication
   */
  private shouldExcludeFromAuth(pathname: string): boolean {
    const exclusionPaths = this.getAuthExclusionPaths();
    return exclusionPaths.some((excludePath) => {
      // Handle exact matches
      if (excludePath === pathname) {
        return true;
      }

      // Handle prefix matches (paths ending with / but not just "/")
      if (excludePath.endsWith('/') && excludePath !== '/' && pathname.startsWith(excludePath)) {
        return true;
      }

      // Handle file extension matches (paths containing .)
      if (excludePath.includes('.') && pathname.includes('.')) {
        return true;
      }

      return false;
    });
  }

  handle = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    if (this.disabled(req, res)) {
      console.log('[AuthMiddleware] skipped (auth middleware is disabled)');
      return res || NextResponse.next();
    }

    if (
      this.isPreview(req) // Disable auth for preview
    ) {
      console.log('[AuthMiddleware] skipped (preview)');
      return res || NextResponse.next();
    }

    // Skip auth check for configured exclusion paths
    if (this.shouldExcludeFromAuth(req.nextUrl.pathname)) {
      console.log('[AuthMiddleware] skipped (excluded path)');
      return res || NextResponse.next();
    }

    try {
      const site = this.getSite(req, res);
      // Check if page requires authentication using GraphQL client
      const pageRequiresAuth = await this.checkPageRequiresAuth(
        site.name,
        req.nextUrl.pathname,
        this.getLanguage(req)
      );

      // If page doesn't require auth, proceed normally
      if (!pageRequiresAuth) {
        return res || NextResponse.next();
      }

      // Validate JWT token using NextAuth's getToken utility
      const token = await getToken({
        req,
        secret: process.env.AUTH0_SECRET,
        // NextAuth.js will automatically detect the correct cookie name
      });

      // If no valid token found, redirect to login
      if (!token) {
        const loginUrl = new URL('/api/auth/signin', req.url);
        loginUrl.searchParams.set('callbackUrl', req.url);
        return NextResponse.redirect(loginUrl);
      }

      // User is authenticated, continue with the request
      return res || NextResponse.next();
    } catch (error) {
      // If there's an error checking auth requirements, log it and proceed
      console.error(
        `[AuthMiddleware] Error in auth middleware for ${req.nextUrl.pathname}:`,
        error
      );
      return res || NextResponse.next();
    }
  };

  /**
   * Check if a page requires authentication using the GraphQL client factory
   * Uses the same pattern as item-path.ts
   */
  private async checkPageRequiresAuth(
    siteName: string,
    pathname: string,
    language: string
  ): Promise<boolean> {
    try {
      const graphQLOptions = {
        api: {
          edge: {
            contextId: this.config.contextId,
            clientContextId: this.config.clientContextId,
            edgeUrl: this.config.edgeUrl,
          },
        },
      };
      const graphQLClient = this.getClientFactory(graphQLOptions)({ retries: 5 });

      const variables = {
        path: pathname,
        siteName: siteName,
        language: language,
      };
      const response = (await graphQLClient.request(GetPageAuth, variables)) as GetPageAuthResponse;
      // Find pageRequiresAuth field in the response
      const authField = response?.layout?.item?.field;

      return authField?.value === '1';
    } catch (error) {
      console.error(`[AuthMiddleware] Error checking page auth for ${pathname}:`, error);
      return false;
    }
  }
}
