import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getDb } from '@/lib/db';
import { authConfig } from '@/lib/auth.config';

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        if (!email || !email.includes('@')) return null;

        const db = getDb();

        // Find or create user
        let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as {
          id: string;
          name: string | null;
          email: string;
        } | undefined;

        if (!user) {
          const id = generateId();
          db.prepare('INSERT INTO users (id, email) VALUES (?, ?)').run(id, email);
          user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as {
            id: string;
            name: string | null;
            email: string;
          };
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
