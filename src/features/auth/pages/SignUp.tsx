import TextField from '@components/TextField';
import Button from '@components/Button';
import { useFormik } from 'formik';
import { registerUser } from '../services/registerUser';
import { useState } from 'react';
import PasswordToggleIcon from '@components/PasswordToggleIcon';
import Link from '@components/Link';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@context/toast/useToast';
import { signupValidationSchema } from '@utils/validation';
import { useAuth } from '@context/auth/useAuth';

export default function SignUp() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { setUser } = useAuth();

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
        const { user } = await registerUser(values.email, values.password);
        setUser({ id: user.uid, email: user.email || '' });

        showSuccess('Registration successful');

        navigate('/collection');
      } catch (error) {
        showError(
          'Error registering user',
          error instanceof Error ? error.message : ''
        );
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
