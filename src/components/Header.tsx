import { useSignOut } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import TrainIcon from './icons/TrainIcon.tsx';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { auth } from '../services/firebase.ts';

function Header() {
  const navigate = useNavigate();
  const [signOut] = useSignOut(auth);
  const handleSignOut = () => {
    (async () => {
      await signOut();
      navigate('/login');
    })();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <TrainIcon sx={{ marginRight: '10px' }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            NS Tracker
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleSignOut}
              color="inherit"
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
