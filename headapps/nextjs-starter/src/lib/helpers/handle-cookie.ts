// Cookie handling utilities
// Client-side and server-side compatible cookie functions

interface CookieOptions {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Get cookie value by name (client-side only)
 * @param name Cookie name
 * @returns Cookie value as string or null if not found
 */
function getCookie(name: string): string | null {
  if (typeof window === 'undefined') {
    return null; // Server-side, return null
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }

  return null;
}

/**
 * Set cookie (client-side only)
 * @param name Cookie name
 * @param value Cookie value
 * @param options Cookie options
 */
function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof window === 'undefined') {
    return; // Server-side, do nothing
  }

  const { maxAge, path = '/', domain, secure = false, sameSite = 'lax' } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (maxAge !== undefined) {
    if (maxAge <= 0) {
      // Delete cookie by setting past expiry date
      cookieString += '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } else {
      const expiry = new Date(Date.now() + maxAge * 1000);
      cookieString += `; expires=${expiry.toUTCString()}`;
    }
  }

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += '; secure';
  }

  cookieString += `; samesite=${sameSite}`;

  document.cookie = cookieString;
}

/**
 * Delete cookie by name
 * @param name Cookie name
 * @param options Cookie options (path and domain should match the original cookie)
 */
export function deleteCookie(
  name: string,
  options: Pick<CookieOptions, 'path' | 'domain'> = {}
): void {
  setCookie(name, '', { ...options, maxAge: -1 });
}

/**
 * Parse JSON cookie safely
 * @param cookieValue Cookie value as string
 * @returns Parsed object or null if parsing fails
 */
function parseJsonCookie<T>(cookieValue: string | null): T | null {
  if (!cookieValue) return null;

  try {
    return JSON.parse(cookieValue) as T;
  } catch (error) {
    console.error('Error parsing JSON cookie:', error);
    return null;
  }
}

/**
 * Set JSON cookie
 * @param name Cookie name
 * @param value Object to stringify and store
 * @param options Cookie options
 */
export function setJsonCookie(name: string, value: unknown, options: CookieOptions = {}): void {
  try {
    const jsonString = JSON.stringify(value);
    setCookie(name, jsonString, options);
  } catch (error) {
    console.error('Error setting JSON cookie:', error);
  }
}

/**
 * Get JSON cookie
 * @param name Cookie name
 * @returns Parsed object or null
 */
export function getJsonCookie<T>(name: string): T | null {
  const cookieValue = getCookie(name);
  return parseJsonCookie<T>(cookieValue);
}
