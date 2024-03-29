import { useEffect, useState } from 'react';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import DashboardIcon from '@mui/icons-material/Dashboard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';

import MenuDrawer from '../components/MenuDrawer.tsx';
import FullPageLoader from '../components/loaders/FullPageLoader.tsx';

import { auth } from '../services/firebase.ts';

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [dashboardState, setDashboardState] = useState<'initial' | 'info'>(
    'info',
  );

  const handleMenuDrawerClose = () => {
    setShowMenu(false);
  };

  const getSelectedBottomNav = () => {
    // eslint-disable-next-line no-restricted-globals
    return location.pathname;
  };

  const handleBottomNavigation = (route: string) => {
    navigate(route);
    setDashboardState('info');
  };

  const handlePlannerBottomNavigationClick = () => {
    if (dashboardState === 'info') {
      setDashboardState('initial');
      navigate('/trips');
    } else {
      setDashboardState('info');
      navigate('/');
    }
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
            onClick={handlePlannerBottomNavigationClick}
          />
          <BottomNavigationAction
            value="/favourites"
            label="Favorites"
            icon={<FavoriteIcon />}
            onClick={() => handleBottomNavigation('/favourites')}
          />
          <BottomNavigationAction
            value="/splitview"
            label="Split View"
            icon={<SplitscreenIcon sx={{ transform: 'rotate(90deg)' }} />}
            onClick={() => handleBottomNavigation('/splitview')}
          />
          <BottomNavigationAction
            label="More"
            icon={<MenuOpenIcon />}
            onClick={() => setShowMenu(true)}
          />
        </BottomNavigation>
      </Paper>
      <MenuDrawer open={showMenu} onClose={handleMenuDrawerClose} />
    </>
  );
}

export default App;
