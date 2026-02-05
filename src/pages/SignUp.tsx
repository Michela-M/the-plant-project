import TextField from '../components/TextField';
import Button from '../components/Button';
import { useFormik } from 'formik';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../firebase';
import Toast from '../components/Toast';
import { useState } from 'react';
import PasswordToggleIcon from '../components/PasswordToggleIcon';
import Link from '../components/Link';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { signupValidationSchema } from '../utils/validation';

export default function SignUp() {
  const navigate = useNavigate();
  const { toast, showSuccessToast, showErrorToast, closeToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signupValidationSchema,
    onSubmit: async (values) => {
      try {
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        showSuccessToast('Registration successful');
        navigate('/collection');
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
        onClose={closeToast}
      />
    </div>
  );
}
