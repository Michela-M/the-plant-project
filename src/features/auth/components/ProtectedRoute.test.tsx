import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useAuth } from '@context/auth/useAuth';
import ProtectedRoute from './ProtectedRoute';

function TestPage({ label }: { label: string }) {
  return <div>{label}</div>;
}

vi.mock('@context/auth/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('ProtectedRoute', () => {
  const mockedUseAuth = useAuth as unknown as Mock;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows a spinner while auth state is loading', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: true,
      setUser: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestPage label="Protected Page" />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Page')).not.toBeInTheDocument();
  });

  it('redirects to login when user is unauthenticated', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: false,
      setUser: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestPage label="Protected Page" />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<TestPage label="Login Page" />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Page')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      loading: false,
      setUser: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestPage label="Protected Page" />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<TestPage label="Login Page" />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Page')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});
