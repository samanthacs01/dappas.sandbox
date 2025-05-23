'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

interface AuthProviderProps {
  children: ReactNode;
}
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => (
  <SessionProvider>{children}</SessionProvider>
);

export default AuthProvider;
