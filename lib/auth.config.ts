import type { NextAuthConfig } from 'next-auth';

// Minimal config for Edge middleware — no DB imports
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/login' },
  providers: [], // populated in auth.ts (Node.js only)
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      // Always allow auth pages and auth API
      if (pathname.startsWith('/auth') || pathname.startsWith('/api/auth')) return true;

      // API routes: return false so Next.js returns 401 (not redirect)
      if (pathname.startsWith('/api/')) return isLoggedIn;

      // Pages: redirect to login if not authenticated
      if (!isLoggedIn) return false;
      return true;
    },
  },
};
