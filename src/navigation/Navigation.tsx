import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const navigate = useNavigate();
  const [user, setUser] = useState<null | { email: string }>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({ email: currentUser.email || '' });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
              await signOut(auth);
              try {
                await signOut(auth);
                navigate('/encyclopedia');
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
