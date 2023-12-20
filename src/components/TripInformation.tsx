import { SlideLeftTransition } from './transitions/SlideLeft.tsx';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, IconButton, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import { NSStation } from '../types/station.ts';
import { Trip } from '../types/trip.ts';

interface Props {
  trip?: Trip;
  onClose: () => void;
  origin?: NSStation;
  destination?: NSStation;
}

export default function TripInformation({
  trip,
  onClose,
  origin,
  destination,
}: Props) {
  const open = Boolean(trip);
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={SlideLeftTransition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {origin?.namen.kort} - {destination?.namen.kort}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}></Box>
    </Dialog>
  );
}
