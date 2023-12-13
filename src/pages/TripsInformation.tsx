import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { useTripsInformation } from '../apis/stations';
import { useSearchFilterContext } from '../context';

export default function TripsInformation() {
  const { via, isArrival, selectedDateTime, destination, origin } =
    useSearchFilterContext();
  const { data, isLoading } = useTripsInformation({
    viaUicCode: via?.UICCode,
    searchForArrival: isArrival,
    dateTime:
      selectedDateTime === undefined && selectedDateTime === 'now'
        ? dayjs()
        : dayjs(selectedDateTime),
    destinationUicCode: destination?.UICCode,
    originUicCode: origin?.UICCode,
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <>
      {data?.trips.map((trip) => (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{trip.status}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{JSON.stringify(trip)}</Typography>
          </AccordionDetails>
        </Accordion>
      )) ?? ''}
    </>
  );
}
