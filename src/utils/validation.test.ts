import { loginValidationSchema, signupValidationSchema } from './validation';
import { describe, it, expect } from 'vitest';

describe('validation utils', () => {
  it('valid login passes', async () => {
    const validData = { email: 'test@email.com', password: 'AnyPassword' };
    await expect(loginValidationSchema.validate(validData)).resolves.toEqual(
      validData
    );
  });

  it('valid signup passes', async () => {
    const validData = {
      email: 'test@email.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
    };
    await expect(signupValidationSchema.validate(validData)).resolves.toEqual(
      validData
    );
  });

  it('login validation fails for missing/invalid fields', async () => {
    await expect(
      loginValidationSchema.validate({ email: '', password: 'Password1!' })
    ).rejects.toThrow('Email is required');
    await expect(
      loginValidationSchema.validate({ email: 'invalid', password: 'pass' })
    ).rejects.toThrow('Invalid email');
    await expect(
      loginValidationSchema.validate({ email: 'test@email.com', password: '' })
    ).rejects.toThrow('Password is required');
  });

  it('signup password rules are enforced', async () => {
    const base = { email: 'test@email.com', confirmPassword: 'Password1!' };

    await expect(
      signupValidationSchema.validate({
        ...base,
        password: 'short',
        confirmPassword: 'short',
      })
    ).rejects.toThrow('Password must be at least 8 characters');

    await expect(
      signupValidationSchema.validate({
        ...base,
        password: 'lowercase1!',
        confirmPassword: 'lowercase1!',
      })
    ).rejects.toThrow('Password must contain at least one uppercase letter');

    await expect(
      signupValidationSchema.validate({
        ...base,
        password: 'UPPERCASE1!',
        confirmPassword: 'UPPERCASE1!',
      })
    ).rejects.toThrow('Password must contain at least one lowercase letter');

    await expect(
      signupValidationSchema.validate({
        ...base,
        password: 'NoNumbers!',
        confirmPassword: 'NoNumbers!',
      })
    ).rejects.toThrow('Password must contain at least one number');

    await expect(
      signupValidationSchema.validate({
        ...base,
        password: 'NoSpecial1',
        confirmPassword: 'NoSpecial1',
      })
    ).rejects.toThrow('Password must contain at least one special character');
  });

  it('signup confirm password rules', async () => {
    const base = { email: 'test@email.com', password: 'Password1!' };
    await expect(
      signupValidationSchema.validate({
        ...base,
        confirmPassword: 'Different1!',
      })
    ).rejects.toThrow('Passwords must match');

    await expect(signupValidationSchema.validate({ ...base })).rejects.toThrow(
      'Confirm Password is required'
    );
  });
});
