import { Link, useNavigate } from 'react-router-dom';
import Button from '@components/Button';
import { useAuth } from '@context/auth/useAuth';

export default function Navigation() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="p-4 px-8 flex justify-between items-center text-green-900">
        <Link to="/" className="text-4xl font-bold p-4 align-middle">
          the plant project
        </Link>
        <MenuItem label="Encyclopedia" link="/encyclopedia" />
        <MenuItem label="My Collection" link="/collection" />
        <MenuItem label="Dashboard" link="/dashboard" />
        {user ? (
          <Button
            label="Logout"
            onClick={async () => {
              try {
                await logout();
              } catch (error) {
                console.error('Failed to log out:', error);
                window.alert('Logout failed. Please try again.');
              }
            }}
          />
        ) : (
          <div className="flex gap-2">
            <Button label="Login" onClick={() => navigate('/login')} />
            <Button
              label="Sign Up"
              variant="outlined"
              onClick={() => navigate('/signup')}
            />
          </div>
        )}
      </nav>
    </>
  );
}

function MenuItem({ label, link }: { label: string; link?: string }) {
  return (
    <Link to={link || '/'}>
      <div className="p-4 hover:underline text-xl">{label}</div>
    </Link>
  );
}
