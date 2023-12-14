import { useEffect } from 'react';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';

import GoogleIcon from '@mui/icons-material/Google';
import LoadingButton from '@mui/lab/LoadingButton';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

import ShapedBackground from '../components/ShapedBackground.tsx';
import BigTrainIcon from '../components/icons/BigTrainIcon.tsx';
import FullPageLoader from '../components/loaders/FullPageLoader.tsx';

import { useSnackbarContext } from '../context';
import { auth } from '../services/firebase.ts';
import { createUserDocument } from '../services/user.ts';

export default function Login() {
  const [
    signInWithGoogle,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    credentials,
    signInLoading,
    signInError,
  ] = useSignInWithGoogle(auth);

  const [user, loading, error] = useAuthState(auth);
  const { showNotification } = useSnackbarContext();

  const handleLogin = () => {
    if (signInLoading) {
      return;
    }

    (async () => {
      const userCredential = await signInWithGoogle();
      if (userCredential !== undefined) {
        const { user } = userCredential;
        await createUserDocument({
          id: user.uid,
          email: user.email ?? '',
          displayName: user.displayName ?? '',
          ...(user.photoURL ? { photoUrl: user.photoURL } : {}),
        });
      }
    })();
  };

  useEffect(() => {
    if (signInError) {
      showNotification('Login error! Try again.', 'error');
    }
  }, [signInError, showNotification]);

  if (error) {
    return <p>error</p>;
  }

  if (loading) {
    return <FullPageLoader />;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexGrow: 1,
        position: 'absolute',
        height: '100%',
        top: 0,
        width: '100%',
      }}
    >
      <ShapedBackground />
      <Box>
        <BigTrainIcon sx={{ width: '256px', height: '256px' }} />
        <Typography variant="h3">NS Tracker</Typography>
      </Box>
      <LoadingButton
        variant="contained"
        onClick={handleLogin}
        endIcon={signInLoading ? undefined : <GoogleIcon />}
        color={signInLoading ? 'secondary' : 'primary'}
      >
        {signInLoading ? 'Signing in..' : 'Login with Google'}
      </LoadingButton>
    </Box>
  );
}
