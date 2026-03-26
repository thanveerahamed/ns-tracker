import { Train } from 'lucide-react';

import { Leg } from '../../types/trip.ts';
import { isInValidLeg } from '../../utils/trips.ts';
import Track from '../Track.tsx';
import TripTiming from '../TripTiming.tsx';

export default function DestinationLegTimeLineItem({
  destinationLeg,
}: {
  destinationLeg: Leg;
}) {
  const isValid = !isInValidLeg(destinationLeg);
  const dotColor = isValid
    ? 'bg-primary border-primary/50'
    : 'bg-error border-error/50';
  const textColor = isValid ? 'text-primary' : 'text-error';

  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center z-10 shrink-0">
        <div
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${dotColor}`}
        >
          <Train size={12} className="text-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <TripTiming
          location={destinationLeg.destination}
          direction="row"
          className="text-sm font-medium"
        />
        <div className="flex items-center justify-between">
          <p className={`text-sm font-medium ${textColor}`}>
            {destinationLeg.destination.name}
          </p>
          <Track
            plannedTrack={destinationLeg.destination.plannedTrack}
            actualTrack={destinationLeg.destination.actualTrack}
          />
        </div>
        {destinationLeg.destination.exitSide && (
          <p className="text-xs text-white/50">
            Exit: {destinationLeg.destination.exitSide}
          </p>
        )}
      </div>
    </div>
  );
}
