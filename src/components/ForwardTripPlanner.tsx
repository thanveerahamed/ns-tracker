import { useState } from 'react';

import StationSelectionDialog from './StationSelectionDialog.tsx';
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
  return <TripsList {...context} />;
}

export default function ForwardTripPlanner({ trip }: { trip: Trip }) {
  const [destination, setDestination] = useState<NSStation>();
  const origin = trip.legs[trip.legs.length - 1].destination;
  const destinationSelectionDialog = useDialog();

  const handleStationSelectorClosed = (newDestination?: NSStation) => {
    setDestination(newDestination);
    destinationSelectionDialog.close();
  };

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
