import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import { expect, describe, it, vi, beforeEach, type Mock } from 'vitest';
import * as firebaseAuth from 'firebase/auth';
import type { Auth, User } from 'firebase/auth';

function TestPage({ label }: { label: string }) {
  return <div>{label}</div>;
}

vi.mock('firebase/auth', async () => {
  const original =
    await vi.importActual<typeof import('firebase/auth')>('firebase/auth');
  return {
    ...original,
    auth: {},
    onAuthStateChanged: vi.fn(),
    signOut: vi.fn(),
  };
});

beforeEach(() => {
  vi.resetAllMocks();
});

describe('Header', () => {
  const mockedOnAuthStateChanged =
    firebaseAuth.onAuthStateChanged as unknown as Mock;
  const mockedSignOut = firebaseAuth.signOut as unknown as Mock;

  function mockAuthState(user: Partial<User> | null) {
    mockedOnAuthStateChanged.mockImplementation(
      (auth: Auth, callback: (user: User | null) => void) => {
        callback(user as User | null);
        return () => {};
      }
    );
  }

  it('navigates to each page when clicking menu items', async () => {
    const user = userEvent.setup();

    mockAuthState({ email: 'test@example.com' });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
        <Routes>
          <Route path="/" element={<TestPage label="Dashboard Page" />} />
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
        <Header />
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
        <Header />
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
    mockAuthState({ email: 'test@example.com' });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  it("logouts user and navigates to '/encyclopedia' when Logout button is clicked", async () => {
    const user = userEvent.setup();

    // simulate logged-in user
    mockAuthState({ email: 'test@example.com' });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
        <Routes>
          <Route
            path="/encyclopedia"
            element={<TestPage label="Encyclopedia Page" />}
          />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(mockedSignOut).toHaveBeenCalled();
    expect(screen.getByText('Encyclopedia Page')).toBeInTheDocument();
  });
});
