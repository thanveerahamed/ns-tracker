import DurationDisplay from './DurationDisplay.tsx';
import TripStartAndEndTime from './TripStartAndEndTime.tsx';
import { Chip } from './ui/alert.tsx';

import { Trip } from '../types/trip.ts';
import { getPaletteColorFromNesProperties } from '../utils/trips.ts';

export function TripInfoDetailSmall({
  trip,
  hideStartAndEndTime,
}: {
  trip: Trip;
  hideStartAndEndTime?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      {!hideStartAndEndTime && <TripStartAndEndTime trip={trip} />}
      <div className="flex flex-wrap gap-1">
        {trip.legs.map((leg, index) => (
          <Chip
            key={index}
            color="primary"
            label={`${leg.product.displayName} · Track ${
              leg.origin.actualTrack ?? leg.origin.plannedTrack
            }`}
          />
        ))}
        {trip.labelListItems && trip.labelListItems.length > 0 && (
          <Chip
            color="default"
            label={trip.labelListItems.map((item) => item.label).join(', ')}
          />
        )}
      </div>
      <DurationDisplay trip={trip} />
      {trip.primaryMessage && (
        <p
          className="text-xs"
          style={{
            color: getPaletteColorFromNesProperties(
              trip.primaryMessage.nesProperties,
            ),
          }}
        >
          {trip.primaryMessage.title}
        </p>
      )}
    </div>
  );
}
