import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';

import GoogleIcon from '@mui/icons-material/Google';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';

import FullPageLoader from '../components/loaders/FullPageLoader.tsx';

import { auth } from '../services/firebase.ts';
import { createUserDocument } from '../services/user.ts';

export default function Login() {
  const [
    signInWithGoogle,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    credentials,
    signInLoading,
  ] = useSignInWithGoogle(auth);

  const [user, loading, error] = useAuthState(auth);

  const handleLogin = () => {
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
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        height: '80vh',
      }}
    >
      <LoadingButton
        variant="contained"
        onClick={handleLogin}
        endIcon={<GoogleIcon />}
        loading={signInLoading}
      >
        Login with Google
      </LoadingButton>
    </Box>
  );
}
