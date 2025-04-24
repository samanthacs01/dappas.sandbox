'use client';

import { Button } from '@/core/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export const LogoutButton = () => {
  const onLogOut = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/login' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button onClick={onLogOut}>
      <LogOut />
      Log out
    </Button>
  );
};
