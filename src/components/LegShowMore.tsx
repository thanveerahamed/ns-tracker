import { JourneyInformation } from './JourneyInformation.tsx';
import RouteIcon from '@mui/icons-material/Route';
import { IconButton, Stack } from '@mui/material';

import { useShow } from '../hooks/useShow.ts';
import { Leg } from '../types/trip.ts';

export default function LegShowMore({ leg }: { leg: Leg }) {
  const journeyInfo = useShow();

  return (
    <>
      <Stack direction="row" justifyContent="flex-start">
        <IconButton size="large" onClick={journeyInfo.show} color="inherit">
          <RouteIcon />
        </IconButton>
      </Stack>
      {journeyInfo.visible && (
        <JourneyInformation
          id={leg.journeyDetailRef}
          onClose={journeyInfo.hide}
          legOriginUicCode={leg.origin.uicCode}
          destinationUicCode={leg.destination.uicCode}
          intermediateStopsUicCodes={leg.stops.map((s) => s.uicCode)}
        />
      )}
    </>
  );
}
