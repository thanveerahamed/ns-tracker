import { LogOut, Train } from 'lucide-react';
import { useSignOut } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import { auth } from '../services/firebase.ts';

function Header() {
  const navigate = useNavigate();
  const [signOut] = useSignOut(auth);
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header
      className="flex items-center px-4 bg-[rgba(10,10,10,0.92)] backdrop-blur border-b border-border sticky top-0 z-50"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 10px)',
        paddingBottom: 10,
      }}
    >
      <Train size={20} className="text-primary mr-2" />
      <span className="font-bold tracking-wide flex-1 text-sm">NS Tracker</span>
      <button
        onClick={handleSignOut}
        aria-label="Sign out"
        style={{ minWidth: 44, minHeight: 44, WebkitTapHighlightColor: 'transparent' }}
        className="flex items-center justify-center rounded-full text-white/50 transition-colors"
      >
        <LogOut size={18} strokeWidth={1.8} />
      </button>
    </header>
  );
}
export default Header;
