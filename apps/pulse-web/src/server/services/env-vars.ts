'use server';

type EnvVars = {
  NEXT_APP_API_URL: string;
};

export const getEnvVars = async (): Promise<EnvVars> => {
  return {
    NEXT_APP_API_URL: process.env.NEXT_APP_API_URL ?? '',
  };
};
