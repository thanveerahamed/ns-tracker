import * as React from 'react';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import ClockLoader from '../../components/loaders/ClockLoader.tsx';
import SplitViewTripInfoViewCard from '../../components/splitView/SplitViewTripInfoViewCard.tsx';

import { auth } from '../../services/firebase.ts';
import {
  toggleSplitViewOpened,
  useSplitViewDocument,
} from '../../services/splitView.ts';
import { ISplitViewWithId } from '../../types/splitView.ts';

export default function SplitViewTripsInformation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [splitViewDocument, splitViewIsLoading] = useSplitViewDocument(
    id ?? undefined,
    user?.uid,
  );

  const splitView: ISplitViewWithId = {
    ...splitViewDocument,
    id: id,
  } as ISplitViewWithId;

  const handleBack = () => {
    if (user?.uid && id) {
      toggleSplitViewOpened(user.uid, id, false).then(() =>
        console.log('completed'),
      );
    }
    navigate('/splitview');
  };

  useEffect(() => {
    if (user?.uid && id) {
      toggleSplitViewOpened(user.uid, id, true).then(() =>
        console.log('completed'),
      );
    }
  }, [id, user?.uid]);

  if (splitViewIsLoading) {
    return (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <ClockLoader />
      </Stack>
    );
  }

  return (
    <>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            aria-label="close"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Split view
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack direction="row" justifyContent="space-evenly">
        <Box sx={{ width: '50%' }}>
          <SplitViewTripInfoViewCard
            view={splitView.view1}
            splitViewId={splitView.id}
            viewType="view1"
          />
        </Box>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Box sx={{ width: '50%' }}>
          <SplitViewTripInfoViewCard
            view={splitView.view2}
            splitViewId={splitView.id}
            viewType="view2"
          />
        </Box>
      </Stack>
    </>
  );
}
