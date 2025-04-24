import { userSchema } from './../../../../src/modules/admin/user-management/libs/schema';

describe('userSchema', () => {
  const validData = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    status: true,
  };

  it('should validate a correct user object', () => {
    expect(() => userSchema.parse(validData)).not.toThrow();
  });

  it('should fail if first_name is empty', () => {
    const invalidData = { ...validData, first_name: '' };

    expect(() => userSchema.parse(invalidData)).toThrow(
      'First name is required',
    );
  });

  it('should fail if last_name is empty', () => {
    const invalidData = { ...validData, last_name: '' };

    expect(() => userSchema.parse(invalidData)).toThrow(
      'Last name is required',
    );
  });

  it('should fail if email is not valid', () => {
    const invalidData = { ...validData, email: 'invalid-email' };

    expect(() => userSchema.parse(invalidData)).toThrow('Invalid email');
  });

  it('should fail if role is empty', () => {
    const invalidData = { ...validData, role: '' };

    expect(() => userSchema.parse(invalidData)).toThrow('Role is required');
  });

  it('should fail if status is missing', () => {
    const { status, ...invalid } = { ...validData };

    expect(() => userSchema.parse(invalid)).toThrow();
  });

  it('should fail if status is not a boolean', () => {
    const invalidData = { ...validData, status: 'active' };

    expect(() => userSchema.parse(invalidData)).toThrow();
  });
});
