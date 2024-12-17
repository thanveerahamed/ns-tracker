import DestinationLegTimeLineItem from './DestinationLegTimeLineItem.tsx';
import LegTimeLineItem from './LegTimeLineItem.tsx';
import Timeline from '@mui/lab/Timeline';
import { timelineItemClasses } from '@mui/lab/TimelineItem';

import { Trip } from '../../types/trip.ts';

export function TripTimelineView({ trip }: { trip: Trip }) {
  const { legs } = trip;

  const destinationLeg = legs[trip?.legs.length - 1];

  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {legs.map((leg, index) => (
        <LegTimeLineItem key={index} legs={legs} leg={leg} index={index} />
      ))}
      {destinationLeg && (
        <DestinationLegTimeLineItem destinationLeg={destinationLeg} />
      )}
    </Timeline>
  );
}
