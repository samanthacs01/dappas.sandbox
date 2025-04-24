import { ResultObject } from '@/server/exceptions/result';
import { securityAuth } from '@/server/services/auth';
import { LoginResponse, UserLogin } from '@/server/types/login';
import { setUser } from '@sentry/nextjs';
import { AuthOptions, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvide from 'next-auth/providers/credentials';
import { getEntityIdFromToken } from './jwt';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvide({
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const body: UserLogin = {
          email: credentials?.email ?? '',
          password: credentials?.password ?? '',
        };

        const res: ResultObject<LoginResponse | null> =
          await securityAuth(body);

        if (!res.success || !res.data || !res.data.token) {
          return null;
        }

        setUser({
          fullName: res.data.user.name,
          email: res.data.user.email,
        });

        return {
          id: credentials.email,
          email: res.data.user.email,
          name: res.data.user.name,
          role: res.data.role,
          token: res.data.token,
          token_expires: Date.now() + res.data.expire_in * 1000,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: process.env.NEXTAUTH_SESSION_EXPIRE
      ? +process.env.NEXTAUTH_SESSION_EXPIRE
      : 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt: ({ token, user }) => {
      
      const userSession = user as unknown as User & JWT;
      if (token && userSession) {
        token.user = {
          email: userSession.email ?? '',
          name: userSession.name ?? '',
          role: userSession.role ?? '',
        };
        token.token = userSession.token;
        token.role = userSession.role;
      }

      return token;
    },
    session: async ({ token, session }) => {
      if (token) {
        session.user.token = token.token;
        session.user.role = token.role;
        session.user.productionId = getEntityIdFromToken(token.token);
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session;
    },
  },
};
