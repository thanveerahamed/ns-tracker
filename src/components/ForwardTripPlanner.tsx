import { useEffect, useState } from 'react';

import StationSelectionDialog from './StationSelectionDialog.tsx';
import TripInformationDialog from './TripInformationDialog.tsx';
import TripsList from './TripsList.tsx';
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

  return (
    <>
      <TripsList {...context} onTripSelected={handleTripSelected} />
      {journeyInfoDialog.isOpen && selectedTrip && (
        <TripInformationDialog
          journeyInfoDialog={journeyInfoDialog}
          onClose={() => {
            setSelectedTrip(undefined);
            journeyInfoDialog.close();
          }}
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
  const dialog = useDialog();

  useEffect(() => {
    if (!show) setDestination(undefined);
  }, [show]);

  if (!show) return null;

  return (
    <div className="mt-3">
      <button
        onClick={dialog.open}
        className="w-full px-3 py-2 text-left rounded-xl bg-surface-2 border border-border text-sm text-white/60 hover:border-primary/50 transition-colors"
      >
        {destination?.namen?.lang || 'Select new destination…'}
      </button>

      <div className="h-96 overflow-y-auto mt-2">
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
      </div>

      {dialog.isOpen && (
        <StationSelectionDialog
          open={dialog.isOpen}
          onClose={(station) => {
            if (station) setDestination(station);
            dialog.close();
          }}
        />
      )}
    </div>
  );
}
