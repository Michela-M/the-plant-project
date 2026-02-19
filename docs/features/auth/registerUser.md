# `registerUser` Service

## Description

`registerUser` creates a new Firebase Authentication user with an email and password, then creates a matching user profile document in Firestore under the `users` collection.

After successful registration, it stores:

- `email`
- `createdAt` (current timestamp using `new Date()`)

Firebase signup errors are mapped to user-friendly `Error` messages so UI layers can display consistent feedback.

## Parameters

| Name       | Type     | Required | Description                              |
| ---------- | -------- | -------- | ---------------------------------------- |
| `email`    | `string` | Yes      | The user email used to create account    |
| `password` | `string` | Yes      | The user password used to create account |

## Return Value

| Type                      | Description                                         |
| ------------------------- | --------------------------------------------------- |
| `Promise<{ user: User }>` | Resolves with the Firebase Auth `user` on success   |
| `Throws`                  | Throws an `Error` with a mapped or fallback message |

## Usage

```tsx
import { registerUser } from './registerUser';

try {
  const { user } = await registerUser('michela@example.com', 'P@ssword123');
  console.log('Registered user:', user.uid);
} catch (error) {
  console.error('Registration failed:', error);
}
```

## Edge Cases

### Email already in use

The following Firebase codes are mapped to the same message:

- `auth/email-already-exists`
- `auth/email-already-in-use`

Returned error message: `Email is already in use`.

### Invalid email

Firebase code `auth/invalid-email` returns: `Invalid email address`.

### Operation not allowed

Firebase code `auth/operation-not-allowed` returns: `Operation not allowed`.

### Unknown Firebase errors

Any unhandled Firebase Auth error code returns `new Error(error.message)`.

### Non-Firebase errors

If the thrown error is not a `FirebaseError`, the service throws: `Unknown error during registration`.
