import Link from '../components/Link';
import TextField from '../components/TextField';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { loginValidationSchema } from '../utils/validation';
import PasswordToggleIcon from '../components/PasswordToggleIcon';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../firebase';
import { useToast } from '../hooks/useToast';
import { onAuthStateChanged } from 'firebase/auth';

export default function Login() {
  const navigate = useNavigate();
  const { toast, showSuccessToast, showErrorToast, closeToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        showSuccessToast('Login successful');

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            unsubscribe();
            navigate('/collection');
          }
        });
      } catch (error) {
        if (error instanceof FirebaseError) {
          switch (error.code) {
            case 'auth/invalid-email':
              showErrorToast('Invalid email address.');
              break;
            case 'auth/invalid-credential':
              showErrorToast('Invalid credentials.');
              break;
            default:
              showErrorToast('Login failed', error.message);
          }
        } else if (error instanceof Error) {
          showErrorToast('Login failed', error.message);
        } else {
          showErrorToast('Login failed', 'An unknown error occurred');
        }
      }
    },
  });

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col gap-2 py-8 px-4 shadow-md rounded-md w-1/3 bg-stone-50">
        <p className="text-3xl text-green-900 font-bold">Log in</p>
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
          <Button label="Log In" variant="filled" type="submit" />
        </form>
        <p className="text-sm">
          Don't have an account? <Link href="/signup">Sign up</Link>
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
