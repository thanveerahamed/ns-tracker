import { useEffect } from 'react';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import Header from '../components/Header.tsx';
import FullPageLoader from '../components/loaders/FullPageLoader.tsx';

import { auth } from '../services/firebase.ts';

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (error) {
      (async () => {
        await signOut();
        navigate('/login');
      })();
    }
  }, [error, navigate, signOut]);

  if (loading) {
    return <FullPageLoader />;
  }

  if (!user) {
    return <Navigate to={'/login'} />;
  }

  return (
    <>
      {location.pathname !== '/' && <Header />}
      {user && <Outlet />}
    </>
  );
}

export default App;
