import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      token: string;
      productionId: string;
      token_expires: number;
    };
    error?: string;
  }

  interface User {
    role: string;
    token: string;
    email: string;
    name: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    token: string;
    role: string;
    token_expires: number;
    name: string;
    email: string;
  }
}
