import AddTripToFavourite from './AddTripToFavourite.tsx';
import DurationDisplay from './DurationDisplay.tsx';
import NumberOfConnectionsDisplay from './NumberOfConnectionsDisplay.tsx';
import TripStartAndEndTime from './TripStartAndEndTime.tsx';
import { TripTimelineView } from './timelineView/TripTimelineView.tsx';
import { Alert } from './ui/alert.tsx';
import dayjs from 'dayjs';

import { Trip } from '../types/trip.ts';
import { getColorFromNesProperties } from '../utils/trips.ts';

interface Props {
  trip: Trip;
  onFavouriteRemoved?: () => void;
}

export default function TripInformation({ trip, onFavouriteRemoved }: Props) {
  return (
    <>
      {/* Summary card */}
      <div className="bg-surface rounded-2xl border border-border p-4 mb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <TripStartAndEndTime trip={trip} large />
            <p className="text-xs text-white/40 mt-1">
              {dayjs(trip.legs[0].origin.plannedDateTime).format('LL')}
            </p>
            <div className="flex gap-3 mt-2">
              <NumberOfConnectionsDisplay connections={trip.legs.length - 1} />
              <DurationDisplay trip={trip} />
            </div>
          </div>
          <AddTripToFavourite
            trip={trip}
            onFavouriteRemoved={onFavouriteRemoved}
          />
        </div>
      </div>

      {/* Timeline card */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        {trip.primaryMessage && (
          <Alert
            severity={
              getColorFromNesProperties(
                trip.primaryMessage.nesProperties,
              ) as 'error' | 'warning' | 'success' | 'info'
            }
            className="rounded-none border-x-0 border-t-0 border-b"
          >
            {trip.primaryMessage.title}
          </Alert>
        )}
        <TripTimelineView trip={trip} />
      </div>
    </>
  );
}
