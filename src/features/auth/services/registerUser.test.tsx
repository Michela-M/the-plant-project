import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { registerUser } from './registerUser';
import { FirebaseError } from 'firebase/app';

// --- Mock Firestore ---
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ path: 'mock/doc/path' })),
  setDoc: vi.fn(),
}));

// Mock your firebase service exports
vi.mock('@services/firebase', () => ({
  auth: {},
  db: {},
}));

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc } from 'firebase/firestore';

describe('registerUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers a user and writes to Firestore', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };

    (createUserWithEmailAndPassword as Mock).mockResolvedValue({
      user: mockUser,
    });

    (setDoc as Mock).mockResolvedValue(undefined);

    const result = await registerUser('test@example.com', 'password123');

    expect(result.user).toEqual(mockUser);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      {},
      'test@example.com',
      'password123'
    );
    expect(setDoc).toHaveBeenCalled();
  });

  it('throws mapped error for email already in use', async () => {
    const error = new FirebaseError(
      'auth/email-already-in-use',
      'Email already exists'
    );

    (createUserWithEmailAndPassword as Mock).mockRejectedValue(error);

    await expect(
      registerUser('test@example.com', 'password123')
    ).rejects.toThrow('Email is already in use');
  });

  it('throws mapped error for invalid email', async () => {
    const error = new FirebaseError('auth/invalid-email', 'Invalid email');

    (createUserWithEmailAndPassword as Mock).mockRejectedValue(error);

    await expect(registerUser('bad-email', 'password123')).rejects.toThrow(
      'Invalid email address'
    );
  });

  it('throws mapped error for operation not allowed', async () => {
    const error = new FirebaseError(
      'auth/operation-not-allowed',
      'Not allowed'
    );

    (createUserWithEmailAndPassword as Mock).mockRejectedValue(error);

    await expect(
      registerUser('test@example.com', 'password123')
    ).rejects.toThrow('Operation not allowed');
  });

  it('throws unknown error for non-Firebase errors', async () => {
    (createUserWithEmailAndPassword as Mock).mockRejectedValue(
      new Error('Something else')
    );

    await expect(
      registerUser('test@example.com', 'password123')
    ).rejects.toThrow('Unknown error during registration');
  });
});
