export type UserLogin = {
  email: string;
  password: string;
};

export type RecoverPassword = {
  email: string;
};

export type SetPassword = {
  password: string;
  repeatPassword: string;
  token: string;
};

export type LoginResponse = {
  role: string;
  token: string;
  expire_in: number;
  user: {
    name: string;
    email: string;
  }
};

export type SetPasswordDTO = Omit<SetPassword, 'repeatPassword'>;
