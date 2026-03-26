import { Columns2, Heart, LayoutDashboard, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { LayoutGroup, motion } from 'framer-motion';

import MenuDrawer from '../components/MenuDrawer.tsx';
import FullPageLoader from '../components/loaders/FullPageLoader.tsx';

import { auth } from '../services/firebase.ts';

const NAV_ITEMS = [
  { path: '/', label: 'Planner', icon: LayoutDashboard },
  { path: '/favourites', label: 'Favorites', icon: Heart },
  { path: '/splitview', label: 'Split View', icon: Columns2 },
] as const;

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleMenuDrawerClose = () => {
    setShowMenu(false);
  };

  const isPlannerActive = ['/', '/trips'].includes(location.pathname);

  const getActiveForItem = (path: string) => {
    if (path === '/') return isPlannerActive;
    return location.pathname.startsWith(path);
  };

  const handleNavItemClick = (path: string) => {
    if (path === '/') {
      navigate(isPlannerActive && location.pathname === '/' ? '/trips' : '/');
    } else {
      navigate(path);
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
      {user && (
        // Reserve space for bottom nav + safe-area-inset-bottom
        <div style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
          <Outlet />
        </div>
      )}

      {/* Bottom navigation bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          // Extra height to fill the safe-area below the bar
          paddingBottom: 'env(safe-area-inset-bottom)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          backgroundColor: 'rgba(10,10,10,0.94)',
          zIndex: 1100,
        }}
      >
        <LayoutGroup>
          <nav
            style={{
              display: 'flex',
              alignItems: 'stretch',
              height: 56,
            }}
          >
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const isActive = getActiveForItem(path);
              return (
                <button
                  key={path}
                  onClick={() => handleNavItemClick(path)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '6px 4px',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '25%',
                        right: '25%',
                        height: 2,
                        borderRadius: '0 0 3px 3px',
                        backgroundColor: '#2b8257',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 38 }}
                    />
                  )}
                  <motion.span
                    animate={{ color: isActive ? '#2b8257' : '#666' }}
                    transition={{ duration: 0.15 }}
                    style={{ display: 'flex' }}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                  </motion.span>
                  <motion.span
                    animate={{ color: isActive ? '#2b8257' : '#666' }}
                    transition={{ duration: 0.15 }}
                    style={{
                      fontSize: 10,
                      fontFamily: 'Geist Variable, sans-serif',
                      fontWeight: isActive ? 600 : 400,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {label}
                  </motion.span>
                </button>
              );
            })}

            {/* More button */}
            <button
              onClick={() => setShowMenu(true)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 4px',
                color: '#666',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Menu size={20} strokeWidth={1.8} />
              <span style={{ fontSize: 10, fontFamily: 'Geist Variable, sans-serif', letterSpacing: '0.02em' }}>
                More
              </span>
            </button>
          </nav>
        </LayoutGroup>
      </div>

      <MenuDrawer open={showMenu} onClose={handleMenuDrawerClose} />
    </>
  );
}

export default App;
