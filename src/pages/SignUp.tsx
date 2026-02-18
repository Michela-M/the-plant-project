import TextField from '../components/TextField';
import Button from '../components/Button';
import { useFormik } from 'formik';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../services/firebase';
import { useState } from 'react';
import PasswordToggleIcon from '../components/PasswordToggleIcon';
import Link from '../components/Link';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@context/toast/useToast';
import { signupValidationSchema } from '../utils/validation';
import { onAuthStateChanged } from 'firebase/auth';

export default function SignUp() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signupValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        showSuccess('Registration successful');

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            unsubscribe();
            navigate('/collection');
          }
        });
      } catch (error) {
        if (error instanceof FirebaseError) {
          switch (error.code) {
            case 'auth/email-already-exists':
              showError('Email is already in use.');
              break;
            case 'auth/invalid-email':
              showError('Invalid email address.');
              break;
            case 'auth/operation-not-allowed':
              showError('Operation not allowed.');
              break;
            default:
              showError('Error registering user', error.message);
          }
        } else if (error instanceof Error) {
          showError('Error registering user', error.message);
        } else {
          showError('Error registering user', 'An unknown error occurred');
        }
      } finally {
        setLoading(false);
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
          <Button
            label="Sign Up"
            variant="filled"
            type="submit"
            loading={loading}
          />
        </form>
        <p className="text-sm">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
