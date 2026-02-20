import { auth, db } from '@services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

export async function registerUser(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      email,
      createdAt: new Date(),
    });

    return { user };
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw mapFirebaseSignupError(error);
    }
    throw new Error('Unknown error during registration');
  }
}

function mapFirebaseSignupError(error: FirebaseError) {
  switch (error.code) {
    case 'auth/email-already-exists':
    case 'auth/email-already-in-use':
      return new Error('Email is already in use');
    case 'auth/invalid-email':
      return new Error('Invalid email address');
    case 'auth/operation-not-allowed':
      return new Error('Operation not allowed');
    default:
      return new Error(error.message);
  }
}
