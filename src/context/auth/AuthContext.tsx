import { useEffect, useState } from 'react';
import { AuthContext } from './useAuth';
import { auth } from '@services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

type User = {
  email: string;
  id: string;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser({
        email: firebaseUser.email ?? '',
        id: firebaseUser.uid,
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ loading, logout, setUser, user }}>
      {children}
    </AuthContext.Provider>
  );
}
