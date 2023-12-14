import { useEffect } from 'react';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import DashboardIcon from '@mui/icons-material/Dashboard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';

import FullPageLoader from '../components/loaders/FullPageLoader.tsx';

import { auth } from '../services/firebase.ts';

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedBottomNav = () => {
    // eslint-disable-next-line no-restricted-globals
    return location.pathname;
  };

  const handleBottomNavigation = (route: string) => {
    navigate(route);
  };

  useEffect(() => {
    if (error) {
      signOut().then(() => {});
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
      {user && <Outlet />}
      <Toolbar />
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: '1px solid gray',
        }}
        elevation={3}
      >
        <BottomNavigation showLabels value={getSelectedBottomNav()}>
          <BottomNavigationAction
            value="/"
            label="Planner"
            icon={<DashboardIcon />}
            onClick={() => handleBottomNavigation('/')}
          />
          <BottomNavigationAction
            label="Favorites"
            icon={<FavoriteIcon />}
            onClick={() => signOut()}
          />
          <BottomNavigationAction label="More" icon={<MenuOpenIcon />} />
        </BottomNavigation>
      </Paper>
    </>
  );
}

export default App;
