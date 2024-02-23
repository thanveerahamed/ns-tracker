import * as React from 'react';

import TripInformation from './TripInformation.tsx';
import { SlideUpTransition } from './transitions/SlideUp.tsx';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { Trip } from '../types/trip.ts';

export default function TripInformationDialog(props: {
  journeyInfoDialog: { isOpen: boolean; close: () => void; open: () => void };
  onClose: () => void;
  trip: Trip;
}) {
  return (
    <Dialog
      fullScreen
      open={props.journeyInfoDialog.isOpen}
      onClose={props.onClose}
      TransitionComponent={SlideUpTransition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Trip info
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={props.onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 1 }}>
        <TripInformation trip={props.trip} />
      </Box>
    </Dialog>
  );
}
