import { LogOut } from 'lucide-react';
import { useSignOut } from 'react-firebase-hooks/auth';

import { Drawer } from './ui/drawer.tsx';

import { auth } from '../services/firebase.ts';

interface Props {
  open: boolean;
  onClose: () => void;
}
export default function MenuDrawer({ open, onClose }: Props) {
  const [signOut] = useSignOut(auth);
  return (
    <Drawer open={open} onClose={onClose}>
      <div className="pt-8 px-4">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/80 hover:bg-surface-2 hover:text-white transition-colors text-sm"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </Drawer>
  );
}
