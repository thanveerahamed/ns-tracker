import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import TrainIcon from '@mui/icons-material/Train';
import { Card, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';

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
        ariaName="remove-favourite-station"
        title="Remove favourite station"
        text={`Are you sure you want to remove ${station.namen.lang} from favourites?`}
      />
      <Card
        sx={{
          marginRight: '5px',
          marginTop: '5px',
          flex: 1,
          flexBasis: '25%',
        }}
        variant="elevation"
        onClick={dialog.open}
      >
        <CardContent sx={{ textAlign: 'center' }}>
          <TrainIcon />
          <br />
          <Typography variant="caption">{station.namen.lang}</Typography>
        </CardContent>
      </Card>
    </>
  );
}
