'use client';

import { Button } from '@/core/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export const ProductionAppBarLogOut = () => {
  const onLogout = () => {
    signOut({ redirect: true, callbackUrl: '/login' });
  };

  return (
    <Button onClick={onLogout}>
      <LogOut />
      Logout
    </Button>
  );
};
