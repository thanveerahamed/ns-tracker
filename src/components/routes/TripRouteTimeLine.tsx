import { useMemo } from 'react';

import { Stop } from '../../types/trip.ts';
import StopTiming from '../StopTiming.tsx';
import Track from '../Track.tsx';
import { Alert } from '../ui/alert.tsx';

export default function TripRouteTimeLine({ stops }: { stops: Stop[] }) {
  const stopsWithoutDestinationAndOrigin = useMemo(
    () => stops.slice(1, -1).filter((stop) => !stop.passing),
    [stops],
  );

  if (stopsWithoutDestinationAndOrigin.length === 0) {
    return (
      <Alert severity="info" className="m-2">
        Single stop journey
      </Alert>
    );
  }

  return (
    <div className="relative py-2 px-4">
      {/* Vertical line */}
      <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-primary/30" />
      {stopsWithoutDestinationAndOrigin.map((stop, index) => (
        <div key={index} className="relative flex gap-3 mb-3">
          {/* Dot */}
          <div className="flex flex-col items-center z-10 shrink-0">
            <div className="w-6 h-6 rounded-full border-2 border-primary bg-bg" />
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0 pb-2 border-b border-border last:border-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-primary">{stop.name}</p>
              <Track
                plannedTrack={stop.plannedArrivalTrack}
                actualTrack={stop.actualArrivalTrack}
              />
            </div>
            <div className="flex gap-2 mt-0.5">
              <StopTiming
                actualTime={stop.actualArrivalDateTime}
                plannedTime={stop.plannedArrivalDateTime}
                className="text-xs text-white/60"
              />
              <StopTiming
                actualTime={stop.actualDepartureDateTime}
                plannedTime={stop.plannedDepartureDateTime}
                className="text-xs text-white/60"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
