import TripRouteTimeLine from './routes/TripRouteTimeLine.tsx';
import { Button, Collapse } from '@mui/material';

import { useShow } from '../hooks/useShow.ts';
import { Leg } from '../types/trip.ts';

export default function LegShowMore({ leg }: { leg: Leg }) {
  const moreInfo = useShow();

  return (
    <>
      <Button onClick={moreInfo.toggle}>Show More</Button>
      <Collapse in={moreInfo.visible}>
        <TripRouteTimeLine stops={leg.stops} />
      </Collapse>
    </>
  );
}
