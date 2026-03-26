import { ArrowRightLeft, Star } from 'lucide-react';

import CrowdForecast from './CrowdForecast.tsx';
import DurationDisplay from './DurationDisplay.tsx';
import NumberOfConnectionsDisplay from './NumberOfConnectionsDisplay.tsx';
import TripStartAndEndTime from './TripStartAndEndTime.tsx';
import { Chip } from './ui/alert.tsx';

import { Trip } from '../types/trip.ts';
import { getPaletteColorFromNesProperties } from '../utils/trips.ts';

export function TripInfoDetail({
  trip,
  isChangeInIntermediateStop,
  hideStartAndEndTime,
  isFavourite,
}: {
  trip: Trip;
  isChangeInIntermediateStop: boolean;
  isFavourite: boolean;
  hideStartAndEndTime?: boolean;
}) {
  const connections = trip.legs.length - 1;

  return (
    <div className="flex flex-col gap-2">
      {/* Row 1: times (hero) + duration/connections */}
      {!hideStartAndEndTime && (
        <div className="flex items-center justify-between gap-2">
          <TripStartAndEndTime trip={trip} large />
          <div className="flex items-center gap-2.5 shrink-0">
            <DurationDisplay trip={trip} />
            {connections > 0 && (
              <NumberOfConnectionsDisplay connections={connections} />
            )}
          </div>
        </div>
      )}

      {/* Row 2: chips + status icons */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {trip.legs.map((leg, index) => (
            <Chip
              key={index}
              color="primary"
              label={`${leg.product.displayName} · ${leg.origin.actualTrack ?? leg.origin.plannedTrack}`}
            />
          ))}
          {trip.labelListItems && trip.labelListItems.length > 0 && (
            <Chip
              color="default"
              label={trip.labelListItems.map((item) => item.label).join(', ')}
            />
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
          {trip.crowdForecast !== 'UNKNOWN' && (
            <CrowdForecast crowdForecast={trip.crowdForecast} />
          )}
          {isChangeInIntermediateStop && (
            <ArrowRightLeft size={13} className="text-white/40" />
          )}
          {isFavourite && (
            <Star size={13} className="text-primary fill-primary" />
          )}
        </div>
      </div>

      {/* Row 3: primary message */}
      {trip.primaryMessage && (
        <p
          className="text-xs leading-snug"
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
