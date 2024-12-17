import { JourneyInformation } from './JourneyInformation.tsx';
import TrainIcon from './icons/TrainIcon.tsx';
import TripRouteTimeLine from './routes/TripRouteTimeLine.tsx';
import RouteIcon from '@mui/icons-material/Route';
import { Collapse, IconButton, Stack } from '@mui/material';

import { useShow } from '../hooks/useShow.ts';
import { Leg } from '../types/trip.ts';

export default function LegShowMore({ leg }: { leg: Leg }) {
  const moreInfo = useShow();
  const journeyInfo = useShow();

  return (
    <>
      <Stack direction="row" justifyContent="flex-start">
        <IconButton size="large" onClick={moreInfo.toggle} color="inherit">
          <TrainIcon />
        </IconButton>
        <IconButton size="large" onClick={journeyInfo.show} color="inherit">
          <RouteIcon />
        </IconButton>
      </Stack>
      <Collapse in={moreInfo.visible}>
        <TripRouteTimeLine stops={leg.stops} />
      </Collapse>
      {journeyInfo.visible && (
        <JourneyInformation
          id={leg.journeyDetailRef}
          onClose={journeyInfo.hide}
        />
      )}
    </>
  );
}
