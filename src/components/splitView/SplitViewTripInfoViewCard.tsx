import * as React from 'react';
import { useState } from 'react';

import SplitViewTimeLineView from './SplitViewTimeLineView.tsx';
import CloseIcon from '@mui/icons-material/Close';
import {
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import dayjs, { Dayjs } from 'dayjs';

import { useTripsInformation } from '../../apis/trips.ts';
import { useDialog } from '../../hooks/useDialog.ts';
import { IView } from '../../types/splitView.ts';
import { Trip } from '../../types/trip.ts';
import TripInfoCard from '../TripInfoCard.tsx';
import TripInformation from '../TripInformation.tsx';
import DateTimePickerModal from '../datetime/DateTimePickerModal.tsx';
import { SlideUpTransition } from '../transitions/SlideUp.tsx';

interface Props {
  view: IView;
}
export default function SplitViewTripInfoViewCard({ view }: Props) {
  const [dateTime, setDateTime] = useState<Dayjs>(dayjs());
  const dateTimeDialog = useDialog();
  const journeyInfoDialog = useDialog();
  const { isLoading, data } = useTripsInformation({
    dateTime,
    originUicCode: view.origin.UICCode,
    destinationUicCode: view.destination.UICCode,
  });
  const [selectedTrip, setSelectedTrip] = useState<Trip>();

  const handleDateTimeChange = (newDateTime: Dayjs | 'now') => {
    if (newDateTime !== 'now') {
      setDateTime(newDateTime);
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
      <Box sx={{ p: 1, overflow: 'scroll', height: '93vh' }}>
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

        {data &&
          data.trips
            .filter((trip) => trip.status !== 'CANCELLED')
            .map((trip) => {
              return (
                <TripInfoCard
                  trip={trip}
                  isFavourite={false}
                  onSelect={() => handleTripModalOpen(trip)}
                  variant="small"
                />
              );
            })}
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
        <Dialog
          fullScreen
          open={journeyInfoDialog.isOpen}
          onClose={handleTripModalClose}
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
                onClick={handleTripModalClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box sx={{ p: 1 }}>
            <TripInformation trip={selectedTrip} />
          </Box>
        </Dialog>
      )}
    </>
  );
}
