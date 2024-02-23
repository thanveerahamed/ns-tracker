import TripRouteTimeLine from './routes/TripRouteTimeLine.tsx';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Button, Collapse, Stack } from '@mui/material';

import { useShow } from '../hooks/useShow.ts';
import { Leg } from '../types/trip.ts';

export default function LegShowMore({ leg }: { leg: Leg }) {
  const moreInfo = useShow();

  return (
    <>
      <Collapse in={moreInfo.visible}>
        <TripRouteTimeLine stops={leg.stops} />
      </Collapse>

      <Stack direction="row" justifyContent="flex-end">
        <Button
          onClick={moreInfo.toggle}
          endIcon={
            moreInfo.visible ? <KeyboardArrowUp /> : <KeyboardArrowDown />
          }
        >
          {moreInfo.visible ? 'Less information' : 'More information'}
        </Button>
      </Stack>
    </>
  );
}
