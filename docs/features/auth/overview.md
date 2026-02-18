# `Authentication` Feature Overview

## Description

The authentication feature handles user sign-up, login, and logout using Firebase Authentication.
It provides form validation, loading feedback, toast notifications, and redirects users to their collection after successful authentication.

## Scope

This feature currently includes:

- Account registration with email and password
- Login with email and password
- Password visibility toggles on auth forms
- Auth-aware navigation actions (Login/Sign Up vs Logout)
- Success and error feedback via toast notifications

## Routes

| Route     | Component | Purpose                  |
| --------- | --------- | ------------------------ |
| `/login`  | `Login`   | Existing user sign-in    |
| `/signup` | `SignUp`  | New user account sign-up |

## Main Flow

### Sign-up

1. User enters email, password, and confirmation password.
2. Formik + Yup validates the input.
3. `createUserWithEmailAndPassword` is called.
4. On success, a success toast is shown and the user is redirected to `/collection`.

### Login

1. User enters email and password.
2. Formik + Yup validates the input.
3. `signInWithEmailAndPassword` is called.
4. On success, a success toast is shown and the user is redirected to `/collection`.

### Logout

1. User clicks `Logout` in the top navigation.
2. Firebase `signOut` is called.
3. User is redirected to `/encyclopedia`.

## Validation Rules

Validation is defined in `src/utils/validation.ts`:

- Email must be a valid email format.
- Password is required for login.
- Sign-up password must be at least 8 characters and include:
  - one uppercase letter
  - one lowercase letter
  - one number
  - one special character from `@$!%*?&`
- Confirm password must match the password.

## Dependencies

- `firebase/auth` for authentication actions and auth state listeners
- `formik` for form state and submission handling
- `yup` for validation schemas
- Toast context (`useToast`) for user feedback

## Error Handling

Firebase errors are mapped to user-friendly toast messages for common cases, including:

- Invalid email
- Invalid credentials
- Email already in use
- Operation not allowed

Unknown errors fall back to a generic message with optional details.

## Current Limitations

- Route-level protection is not implemented yet, so private pages can still be accessed by URL.
- Social login providers are not implemented.
- Password reset and email verification flows are not implemented.

## Related Files

- `src/features/auth/Login.tsx`
- `src/features/auth/SignUp.tsx`
- `src/navigation/Navigation.tsx`
- `src/utils/validation.ts`
- `src/services/firebase.ts`
