import Link from '../components/Link';
import TextField from '../components/TextField';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../firebase';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

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

export default function Login() {
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

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        showToast('Logged in successfully', 'success');
      } catch (error) {
        if (error instanceof FirebaseError) {
          showErrorToast('Login failed', error.message);
        } else {
          showErrorToast('Login failed', 'An unexpected error occurred');
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
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
}
