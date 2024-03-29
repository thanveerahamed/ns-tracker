import * as React from 'react';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import SplitViewTimeLineView from './SplitViewTimeLineView.tsx';
import { Button, Chip, Divider, LinearProgress, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import dayjs, { Dayjs } from 'dayjs';

import { useDialog } from '../../hooks/useDialog.ts';
import { useTrips } from '../../hooks/useTrips.ts';
import { auth } from '../../services/firebase.ts';
import { updateSplitViewDate } from '../../services/splitView.ts';
import { IView } from '../../types/splitView.ts';
import { Trip } from '../../types/trip.ts';
import TripInfoCard from '../TripInfoCard.tsx';
import TripInformationDialog from '../TripInformationDialog.tsx';
import DateTimePickerModal from '../datetime/DateTimePickerModal.tsx';

interface Props {
  splitViewId: string;
  view: IView;
  viewType: 'view1' | 'view2';
}

export default function SplitViewTripInfoViewCard({
  view,
  splitViewId,
  viewType,
}: Props) {
  const [user] = useAuthState(auth);
  const [dateTime, setDateTime] = useState<Dayjs>(dayjs(view.dateTime));
  const dateTimeDialog = useDialog();
  const journeyInfoDialog = useDialog();
  const {
    isInitialLoading: isLoading,
    trips: data,
    loadLater,
    loadEarlier,
    isLoadMoreLoading,
  } = useTrips({
    dateTime,
    originUicCode: view.origin.UICCode,
    destinationUicCode: view.destination.UICCode,
  });
  const [selectedTrip, setSelectedTrip] = useState<Trip>();

  const handleDateTimeChange = (newDateTime: Dayjs | 'now') => {
    if (newDateTime !== 'now') {
      setDateTime(newDateTime);
      updateSplitViewDate(
        user?.uid ?? '',
        splitViewId,
        viewType,
        newDateTime,
      ).then(() => console.log('time updated'));
    }

    dateTimeDialog.close();
  };

  const handleTripModalOpen = (value: Trip) => {
    setSelectedTrip(value);
    journeyInfoDialog.open();
  };

  const handleTripModalClose = () => {
    setSelectedTrip(undefined);
    journeyInfoDialog.close();
  };

  return (
    <>
      <Box sx={{ p: 1, overflow: 'scroll', height: '87vh' }}>
        <Box sx={{ minHeight: '130px' }}>
          <SplitViewTimeLineView
            from={view.origin.namen.lang}
            to={view.destination.namen.lang}
          />
        </Box>
        <Stack justifyContent="center">
          <Chip
            label={dateTime.format('LLL')}
            onClick={() => dateTimeDialog.open()}
          />
        </Stack>
        <Divider>
          <Typography variant="caption">Departures</Typography>
        </Divider>
        {isLoading && <LinearProgress />}
        <Button
          fullWidth
          size="small"
          onClick={loadEarlier}
          disabled={isLoadMoreLoading}
        >
          {isLoadMoreLoading ? 'Loading...' : 'Earlier'}
        </Button>
        {data &&
          data
            .filter((trip) => trip.status !== 'CANCELLED')
            .map((trip, index) => {
              return (
                <TripInfoCard
                  key={index}
                  trip={trip}
                  isFavourite={false}
                  onSelect={() => handleTripModalOpen(trip)}
                  variant="small"
                />
              );
            })}
        <Button
          fullWidth
          size="small"
          onClick={loadLater}
          disabled={isLoadMoreLoading}
        >
          {isLoadMoreLoading ? 'Loading...' : 'Later'}
        </Button>
      </Box>

      {dateTimeDialog.isOpen && (
        <DateTimePickerModal
          onChange={handleDateTimeChange}
          value={dateTime}
          open={dateTimeDialog.isOpen}
          onClose={() => dateTimeDialog.close()}
        />
      )}

      {journeyInfoDialog.isOpen && selectedTrip && (
        <TripInformationDialog
          journeyInfoDialog={journeyInfoDialog}
          onClose={handleTripModalClose}
          trip={selectedTrip}
        />
      )}
    </>
  );
}
