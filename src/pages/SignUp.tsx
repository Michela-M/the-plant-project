import TextField from '../components/TextField';
import Button from '../components/Button';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../firebase';
import Toast from '../components/Toast';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from '../components/Link';

const PASSWORD_REGEX = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[@$!%*?&]/,
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
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
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm Password is required'),
});

export default function SignUp() {
  const [toast, setToast] = useState({
    message: '',
    detail: '',
    type: 'info' as 'info' | 'error' | 'success' | 'warning',
    open: false,
  });

  const showToast = (
    message: string,
    type: 'success' | 'error',
    detail?: string
  ) => {
    setToast({ message, detail: detail || '', type, open: true });
  };

  const showErrorToast = (message: string, detail?: string) => {
    showToast(message, 'error', detail);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const PasswordToggleIcon = ({
    visible,
    onToggle,
  }: {
    visible: boolean;
    onToggle: () => void;
  }) =>
    visible ? (
      <EyeOff onClick={onToggle} className="cursor-pointer" />
    ) : (
      <Eye onClick={onToggle} className="cursor-pointer" />
    );

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        showToast('User registered successfully!', 'success');
      } catch (error) {
        if (error instanceof FirebaseError) {
          switch (error.code) {
            case 'auth/email-already-in-use':
              showErrorToast('Email is already in use.');
              break;
            case 'auth/invalid-email':
              showErrorToast('Invalid email address.');
              break;
            case 'auth/operation-not-allowed':
              showErrorToast('Operation not allowed.');
              break;
            case 'auth/weak-password':
              showErrorToast('Password is too weak.');
              break;
            default:
              showErrorToast('Error registering user', error.message);
          }
        } else if (error instanceof Error) {
          showErrorToast('Error registering user', error.message);
        } else {
          showErrorToast('An unknown error occurred.');
        }
      }
    },
  });

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col gap-2 py-8 px-4 shadow-md rounded-md w-1/3 bg-stone-50">
        <p className="text-3xl text-green-900 font-bold">Sign up</p>
        <form className="flex flex-col gap-4 " onSubmit={formik.handleSubmit}>
          <TextField
            name="email"
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : ''
            }
          />
          <TextField
            name="password"
            label="Password"
            placeholder="Enter your password"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : ''
            }
            icon={
              <PasswordToggleIcon
                visible={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
            }
          />
          <TextField
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            type={showConfirmPassword ? 'text' : 'password'}
            icon={
              <PasswordToggleIcon
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? formik.errors.confirmPassword
                : ''
            }
          />
          <Button label="Sign Up" variant="filled" type="submit" />
        </form>
        <p className="text-sm">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
      <Toast
        message={toast.message}
        detail={toast.detail}
        type={toast.type}
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
}
