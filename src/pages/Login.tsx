import { useEffect, useState } from 'react';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';

import { motion } from 'framer-motion';

import BigTrainIcon from '../components/icons/BigTrainIcon.tsx';
import FullPageLoader from '../components/loaders/FullPageLoader.tsx';

import { useSnackbarContext } from '../context';
import { auth } from '../services/firebase.ts';
import { createUserDocument } from '../services/user.ts';

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 24 },
  },
};

/** Google-branded icon — real four-colour version */
function GoogleColorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function Login() {
  const [signInWithGoogle, , signInLoading, signInError] = useSignInWithGoogle(auth);
  const [user, loading, error] = useAuthState(auth);
  const { showNotification } = useSnackbarContext();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleLogin = async () => {
    if (signInLoading || isSigningIn) return;
    setIsSigningIn(true);
    try {
      const userCredential = await signInWithGoogle();
      if (userCredential) {
        const { user } = userCredential;
        await createUserDocument({
          id: user.uid,
          email: user.email ?? '',
          displayName: user.displayName ?? '',
          ...(user.photoURL ? { photoUrl: user.photoURL } : {}),
        });
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    if (signInError) showNotification('Login error! Try again.', 'error');
  }, [signInError, showNotification]);

  if (error) return <p className="text-error p-4 text-sm">Error occurred</p>;
  if (loading) return <FullPageLoader />;
  if (user) return <Navigate to="/" />;

  const busy = signInLoading || isSigningIn;

  return (
    <div
      className="flex flex-col items-center justify-between min-h-screen px-6 pt-safe"
      style={{
        background: 'linear-gradient(170deg, #0d0d0d 0%, #0d0d0d 55%, #0a1a10 100%)',
      }}
    >
      {/* Top spacer */}
      <div />

      {/* Centre content */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } } }}
        className="flex flex-col items-center gap-6 w-full max-w-sm"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-3">
          <div
            className="rounded-3xl p-4"
            style={{
              background: 'linear-gradient(135deg, #1a2e20 0%, #0f1f14 100%)',
              boxShadow: '0 0 0 1px rgba(43,130,87,0.25), 0 20px 60px rgba(43,130,87,0.15)',
            }}
          >
            <BigTrainIcon style={{ width: 80, height: 80 }} />
          </div>

          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/35 mb-1">
              Welcome to
            </p>
            <h1
              className="text-[42px] font-bold tracking-tight leading-none"
              style={{
                background: 'linear-gradient(135deg, #ffffff 30%, #2b8257 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              NS Tracker
            </h1>
            <p className="text-sm text-white/35 mt-2">
              Plan your NS train journeys
            </p>
          </div>
        </motion.div>

        {/* Feature pills */}
        <motion.div variants={itemVariants} className="flex gap-2 flex-wrap justify-center">
          {['Real-time trips', 'Favourites', 'Split view'].map((f) => (
            <span
              key={f}
              className="px-3 py-1 rounded-full text-xs text-white/50 border border-white/10 bg-white/5"
            >
              {f}
            </span>
          ))}
        </motion.div>

        {/* Sign-in button */}
        <motion.div variants={itemVariants} className="w-full">
          <button
            onClick={handleLogin}
            disabled={busy}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-sm transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: busy ? 'rgba(255,255,255,0.08)' : '#fff',
              color: busy ? '#fff' : '#111',
              boxShadow: busy ? 'none' : '0 2px 20px rgba(255,255,255,0.12)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {busy ? (
              <span className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <GoogleColorIcon />
            )}
            {busy ? 'Signing in…' : 'Continue with Google'}
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom note + safe area */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-[11px] text-white/25 text-center pb-8 pb-safe"
      >
        Your data is stored securely with Firebase
      </motion.p>
    </div>
  );
}
