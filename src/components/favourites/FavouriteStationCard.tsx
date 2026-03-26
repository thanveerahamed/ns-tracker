import { Train } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { motion } from 'framer-motion';

import { useSnackbarContext } from '../../context';
import { useDialog } from '../../hooks/useDialog.ts';
import { auth } from '../../services/firebase.ts';
import { removeFavouriteStation } from '../../services/station.ts';
import { NSStation } from '../../types/station.ts';
import ConfirmationDialog from '../ConfirmationDialog.tsx';

export default function FavouriteStationCard({
  station,
}: {
  station: NSStation;
}) {
  const dialog = useDialog();
  const [user] = useAuthState(auth);
  const { showNotification } = useSnackbarContext();

  const handleClose = () => {
    dialog.close();
    if (user) {
      removeFavouriteStation(user.uid, station)
        .then(() => showNotification('Removed from favourite!', 'success'))
        .catch(() => showNotification('Some error occurred!', 'error'));
    }
  };

  return (
    <>
      <ConfirmationDialog
        open={dialog.isOpen}
        onClose={dialog.close}
        onConfirm={handleClose}
        title="Remove favourite station"
        text={`Remove ${station.namen.lang} from favourites?`}
      />
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={dialog.open}
        className="flex flex-col items-center gap-1 p-3 rounded-xl bg-surface border border-border hover:border-primary/40 transition-colors w-full text-center"
      >
        <Train size={20} className="text-primary" />
        <span className="text-xs text-white/70 leading-tight">
          {station.namen.lang}
        </span>
      </motion.button>
    </>
  );
}
