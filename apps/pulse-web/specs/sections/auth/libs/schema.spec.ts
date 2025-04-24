import { z } from 'zod';
import { loginSchemas } from './../../../../src/modules/auth/login/utils/loginSchemas';
import { recoverPasswordSchema } from './../../../../src/modules/auth/recover-password/utils/recoverPasswordSchema';
import { setPasswordSchema } from './../../../../src/modules/auth/reset-password/utils/setPasswordSchema';

describe('setPasswordSchema', () => {
  it('should validate correct input', () => {
    const validInput = {
      password: 'validPassword123',
      repeatPassword: 'validPassword123',
    };

    expect(() => setPasswordSchema().parse(validInput)).not.toThrow();
  });

  it('should throw an error if password is missing', () => {
    const invalidInput = {
      repeatPassword: 'validPassword123',
    };

    expect(() => setPasswordSchema().parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if repeatPassword is missing', () => {
    const invalidInput = {
      password: 'validPassword123',
    };

    expect(() => setPasswordSchema().parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if passwords do not match', () => {
    const invalidInput = {
      password: 'validPassword123',
      repeatPassword: 'differentPassword123',
    };

    expect(() => setPasswordSchema().parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if password is too short', () => {
    const invalidInput = {
      password: '',
      repeatPassword: '',
    };

    expect(() => setPasswordSchema().parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if password is too long', () => {
    const longPassword = 'a'.repeat(256);
    const invalidInput = {
      password: longPassword,
      repeatPassword: longPassword,
    };

    expect(() => setPasswordSchema().parse(invalidInput)).toThrow(z.ZodError);
  });
});

describe('loginSchemas', () => {
  it('should validate correct input', () => {
    const validInput = {
      email: 'test@example.com',
      password: 'validPassword123',
    };

    expect(() => loginSchemas().parse(validInput)).not.toThrow();
  });

  it('should throw an error if email is missing', () => {
    const invalidInput = {
      password: 'validPassword123',
    };

    expect(() => loginSchemas().parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if password is missing', () => {
    const invalidInput = {
      email: 'test@example.com',
    };

    expect(() => loginSchemas().parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if email is invalid', () => {
    const invalidInput = {
      email: 'invalid-email',
      password: 'validPassword123',
    };

    expect(() => loginSchemas().parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if email is empty', () => {
    const invalidInput = {
      email: '',
      password: 'validPassword123',
    };

    expect(() => loginSchemas().parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should throw an error if password is empty', () => {
    const invalidInput = {
      email: 'test@example.com',
      password: '',
    };

    expect(() => loginSchemas().parse(invalidInput)).toThrow(z.ZodError);
  });

  it('should trim the password', () => {
    const validInput = {
      email: 'test@example.com',
      password: '  validPassword123  ',
    };

    const result = loginSchemas().parse(validInput);
    expect(result.password).toBe('validPassword123'); // Ensure password is trimmed
  });
});

describe('recoverPasswordSchema', () => {
  it('should validate correct input', () => {
    const validInput = {
      email: 'test@example.com',
    };

    expect(() => recoverPasswordSchema().parse(validInput)).not.toThrow();
  });

  it('should throw an error if email is missing', () => {
    const invalidInput = {};

    expect(() => recoverPasswordSchema().parse(invalidInput)).toThrow(
      z.ZodError,
    );
  });

  it('should throw an error if email is invalid', () => {
    const invalidInput = {
      email: 'invalid-email',
    };

    expect(() => recoverPasswordSchema().parse(invalidInput)).toThrow(
      z.ZodError,
    );
  });

  it('should throw an error if email is empty', () => {
    const invalidInput = {
      email: '',
    };

    expect(() => recoverPasswordSchema().parse(invalidInput)).toThrow(
      z.ZodError,
    );
  });
});
