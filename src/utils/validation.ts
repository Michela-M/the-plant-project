import * as Yup from 'yup';

const PASSWORD_REGEX = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[@$!%*?&]/,
};

const email = Yup.string().email('Invalid email').required('Email is required');

const basePassword = Yup.string().required('Password is required');

const strongPassword = basePassword
  .min(8, 'Password must be at least 8 characters')
  .matches(
    PASSWORD_REGEX.uppercase,
    'Password must contain at least one uppercase letter'
  )
  .matches(
    PASSWORD_REGEX.lowercase,
    'Password must contain at least one lowercase letter'
  )
  .matches(PASSWORD_REGEX.number, 'Password must contain at least one number')
  .matches(
    PASSWORD_REGEX.special,
    'Password must contain at least one special character (@$!%*?&)'
  );

export const signupValidationSchema = Yup.object({
  email,
  password: strongPassword,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const loginValidationSchema = Yup.object({
  email,
  password: basePassword,
});
