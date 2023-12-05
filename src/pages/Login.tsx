import { Navigate, useNavigate } from 'react-router-dom';

import GoogleIcon from '@mui/icons-material/Google';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function Login() {
  const loggedIn = localStorage.getItem('loggedIn');
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/');
  };

  if (loggedIn === 'true') {
    return <Navigate to={'/'} />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        height: '80vh',
      }}
    >
      <Button
        variant="contained"
        onClick={handleLogin}
        endIcon={<GoogleIcon />}
      >
        Login with
      </Button>
    </Box>
  );
}
