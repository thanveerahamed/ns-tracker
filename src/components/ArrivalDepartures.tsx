import { useState } from 'react';

import ToggleWithLabel from './ToggleWithLabel.tsx';
import { Divider } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { useStationDeparturesQuery } from '../apis/stations.ts';
import { Trip } from '../types/trip.ts';

const journeyOptions = [
  {
    label: 'Arrival',
    value: 'arrival',
  },
  {
    label: 'Departure',
    value: 'departure',
  },
];

const journeyLocations = [
  {
    label: 'Destination',
    value: 'destination',
  },
  {
    label: 'Origin',
    value: 'origin',
  },
];

interface Props {
  trip: Trip;
}

export default function ArrivalDepartures({ trip }: Props) {
  const [journeyType, setJourneyType] = useState<string>('departure');
  const [location, setLocation] = useState<string>('destination');

  const { data: journey } = useStationDeparturesQuery({
    enabled: journeyType === 'departure',
    query: {
      uicCode: trip.legs[trip.legs.length - 1].destination.uicCode,
      dateTime:
        trip.legs[trip.legs.length - 1].destination.actualDateTime ??
        trip.legs[trip.legs.length - 1].destination.plannedDateTime,
      maxJourneys: 5,
    },
  });

  return (
    <>
      <ToggleWithLabel
        value={journeyType}
        label={'Journey'}
        options={journeyOptions}
        onChange={setJourneyType}
      />

      <ToggleWithLabel
        value={location}
        label={'Location'}
        options={journeyLocations}
        onChange={setLocation}
      />

      <Typography>{journeyType.toUpperCase()}</Typography>
      <Divider />
      <List>
        {journey?.departures &&
          journey.departures.map((departure) => (
            <ListItem
              divider
              sx={{ color: departure.cancelled ? 'error.main' : 'inherit' }}
            >
              <ListItemText
                primary={`${departure.direction} (${
                  departure.product.longCategoryName
                }) - Track: ${departure.actualTrack ?? departure.plannedTrack}`}
                secondary={`${dayjs(
                  departure.actualDateTime ?? departure.plannedDateTime,
                ).format('LLL')} - ${departure.departureStatus}`}
              />
            </ListItem>
          ))}
      </List>
    </>
  );
}
