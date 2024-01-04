import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams } from 'react-router-dom';

import { Box, Stack } from '@mui/material';
import Divider from '@mui/material/Divider';

import ClockLoader from '../../components/loaders/ClockLoader.tsx';
import SplitViewTripInfoViewCard from '../../components/splitView/SplitViewTripInfoViewCard.tsx';

import { auth } from '../../services/firebase.ts';
import { useSplitViewDocument } from '../../services/splitView.ts';
import { IView } from '../../types/splitView.ts';

export default function SplitViewTripsInformation() {
  const { id } = useParams();
  const [user] = useAuthState(auth);
  const [splitViewDocument, splitViewIsLoading] = useSplitViewDocument(
    id ?? undefined,
    user?.uid,
  );

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
    <Stack direction="row" justifyContent="space-evenly">
      <Box sx={{ width: '50%' }}>
        <SplitViewTripInfoViewCard view={splitViewDocument?.view1 as IView} />
      </Box>
      <Divider orientation="vertical" variant="middle" flexItem />
      <Box sx={{ width: '50%' }}>
        <SplitViewTripInfoViewCard view={splitViewDocument?.view2 as IView} />
      </Box>
    </Stack>
  );
}
