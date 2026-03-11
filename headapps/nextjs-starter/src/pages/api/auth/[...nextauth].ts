// CUSTOMIZATION (whole file) - Auth0 authentication
import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import { isAuthEnabled } from 'lib/helpers/auth';
import { NextApiRequest, NextApiResponse } from 'next';

const authOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID || '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
      issuer: process.env.AUTH0_ISSUER_BASE_URL || '',
      authorization: {
        params: { prompt: 'login' },
      },
    }),
  ],
  secret: process.env.AUTH0_SECRET,
  callbacks: {
    // @ts-expect-error - Safe use of any type
    async jwt({ token }) {
      return token;
    },
    // @ts-expect-error - Safe use of any type
    async session({ session }) {
      return session;
    },
  },
};

// Create a handler that either returns 404 or uses NextAuth
const handler = isAuthEnabled()
  ? NextAuth(authOptions)
  : (_req: NextApiRequest, res: NextApiResponse) => {
      res.status(404).json({ error: 'Authentication is disabled' });
    };

export default handler;
