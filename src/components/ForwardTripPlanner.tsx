import { useEffect, useState } from 'react';
import * as React from 'react';

import StationSelectionDialog from './StationSelectionDialog.tsx';
import TripInformationDialog from './TripInformationDialog.tsx';
import TripsList from './TripsList.tsx';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';

import { useForwardTripsInformationContext } from '../context';
import { ForwardTripsInformationProvider } from '../context/ForwardTripsInformationContext.tsx';
import { useDialog } from '../hooks/useDialog.ts';
import { NSStation } from '../types/station.ts';
import { Trip } from '../types/trip.ts';

function ForwardTripPlannerTripList() {
  const context = useForwardTripsInformationContext();
  const journeyInfoDialog = useDialog();
  const [selectedTrip, setSelectedTrip] = useState<Trip>();

  const handleTripSelected = (trip: Trip) => {
    setSelectedTrip(trip);
    journeyInfoDialog.open();
  };

  const handleTripModalClose = () => {
    setSelectedTrip(undefined);
    journeyInfoDialog.close();
  };

  return (
    <>
      <TripsList {...context} onTripSelected={handleTripSelected} />
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

export default function ForwardTripPlanner({
  trip,
  show,
}: {
  trip: Trip;
  show: boolean;
}) {
  const [destination, setDestination] = useState<NSStation>();
  const origin = trip.legs[trip.legs.length - 1].destination;
  const destinationSelectionDialog = useDialog();

  const handleStationSelectorClosed = (newDestination?: NSStation) => {
    setDestination(newDestination);
    destinationSelectionDialog.close();
  };

  useEffect(() => {
    if (!show) {
      setDestination(undefined);
    }
  }, [show]);

  if (!show) {
    return <></>;
  }

  return (
    <>
      <TextField
        size="small"
        label="New destination"
        variant="outlined"
        fullWidth
        value={destination?.namen?.lang ?? ''}
        onClick={() => destinationSelectionDialog.open()}
        onFocus={(event) => event.target.blur()}
        margin="normal"
      />

      <Box height="400px" overflow="scroll">
        {destination && (
          <ForwardTripsInformationProvider
            originUICCode={origin.uicCode}
            departureDateTime={dayjs(
              origin.actualDateTime ?? origin.plannedDateTime,
            )}
            destinationUICCode={destination.UICCode}
          >
            <ForwardTripPlannerTripList />
          </ForwardTripsInformationProvider>
        )}
      </Box>

      {destinationSelectionDialog.isOpen && (
        <StationSelectionDialog
          open={destinationSelectionDialog.isOpen}
          onClose={handleStationSelectorClosed}
        />
      )}
    </>
  );
}
