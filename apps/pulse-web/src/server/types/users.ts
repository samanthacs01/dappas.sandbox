export type UserStatus = 'active' | 'inactive';
export type UserRole = 'admin' | 'production';

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  status: boolean;
};

export type UserDTO = Omit<User, 'id'>;
