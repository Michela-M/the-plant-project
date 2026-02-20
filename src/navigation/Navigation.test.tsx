import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import { expect, describe, it, vi, beforeEach, type Mock } from 'vitest';
import { useAuth } from '@context/auth/useAuth';

function TestPage({ label }: { label: string }) {
  return <div>{label}</div>;
}

vi.mock('@context/auth/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Navigation', () => {
  const mockedUseAuth = useAuth as unknown as Mock;
  const mockedLogout = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    mockedLogout.mockResolvedValue(undefined);
  });

  function mockAuthState(user: { id: string; email: string } | null) {
    mockedUseAuth.mockReturnValue({
      user,
      loading: false,
      setUser: vi.fn(),
      logout: mockedLogout,
    });
  }

  it('navigates to each page when clicking menu items', async () => {
    const user = userEvent.setup();

    mockAuthState({ id: '1', email: 'test@example.com' });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Navigation />
        <Routes>
          <Route
            path="/dashboard"
            element={<TestPage label="Dashboard Page" />}
          />
          <Route
            path="/encyclopedia"
            element={<TestPage label="Encyclopedia Page" />}
          />
          <Route
            path="/collection"
            element={<TestPage label="Collection Page" />}
          />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByText('Dashboard'));
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();

    await user.click(screen.getByText('Encyclopedia'));
    expect(screen.getByText('Encyclopedia Page')).toBeInTheDocument();

    await user.click(screen.getByText('My Collection'));
    expect(screen.getByText('Collection Page')).toBeInTheDocument();
  });

  it('shows Login and Sign Up buttons when user is not authenticated', () => {
    mockAuthState(null);

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('navigates to Login and Sign Up pages when buttons are clicked', async () => {
    const user = userEvent.setup();

    mockAuthState(null);

    render(
      <MemoryRouter initialEntries={['/']}>
        <Navigation />
        <Routes>
          <Route path="/login" element={<TestPage label="Login Page" />} />
          <Route path="/signup" element={<TestPage label="Sign Up Page" />} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByText('Login'));
    expect(screen.getByText('Login Page')).toBeInTheDocument();

    await user.click(screen.getByText('Sign Up'));
    expect(screen.getByText('Sign Up Page')).toBeInTheDocument();
  });

  it('shows Logout button when user is authenticated', async () => {
    // simulate logged-in user
    mockAuthState({ id: '1', email: 'test@example.com' });

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  it('logs out user when Logout button is clicked', async () => {
    const user = userEvent.setup();

    // simulate logged-in user
    mockAuthState({ id: '1', email: 'test@example.com' });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Navigation />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(mockedLogout).toHaveBeenCalled();
  });
});
