import { useAuthState } from 'react-firebase-hooks/auth';
import { Outlet } from 'react-router-dom';

import Header from '../components/Header.tsx';
import FullPageLoader from '../components/loaders/FullPageLoader.tsx';

import { auth } from '../services/firebase.ts';

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <>
      <Header />
      {user && <Outlet />}
      {error && <p>Error</p>}
    </>
  );
}

export default App;
