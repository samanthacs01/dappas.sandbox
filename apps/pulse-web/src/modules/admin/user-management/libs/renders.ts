import { UserRole } from '@/server/types/users';

export const renderUserRole = (role: UserRole) => {
  switch (role) {
    case 'admin': {
      return 'Admin';
    }
    case 'production': {
      return 'Production';
    }
    default: {
      return 'Unknown';
    }
  }
};

export const renderUserStatus = (status: boolean) => {
  return status ? 'Active' : 'Inactive';
};
