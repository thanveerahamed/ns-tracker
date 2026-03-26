import DestinationLegTimeLineItem from './DestinationLegTimeLineItem.tsx';
import LegTimeLineItem from './LegTimeLineItem.tsx';

import { Trip } from '../../types/trip.ts';

export function TripTimelineView({ trip }: { trip: Trip }) {
  const { legs } = trip;
  const destinationLeg = legs[trip.legs.length - 1];

  return (
    <div className="relative px-4 pb-4">
      {/* Vertical connecting line */}
      <div className="absolute left-[30px] top-8 bottom-8 w-0.5 bg-border" />
      {legs.map((leg, index) => (
        <LegTimeLineItem key={index} legs={legs} leg={leg} index={index} />
      ))}
      {destinationLeg && (
        <DestinationLegTimeLineItem destinationLeg={destinationLeg} />
      )}
    </div>
  );
}
