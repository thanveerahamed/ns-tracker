import { useState } from 'react';

import ToggleWithLabel from './ToggleWithLabel.tsx';
import { Divider } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import {
  useStationArrivalsQuery,
  useStationDeparturesQuery,
} from '../apis/stations.ts';
import { JourneyInformation } from '../types/station.ts';
import { Trip } from '../types/trip.ts';

const journeyOptions = [
  {
    label: 'Arrivals',
    value: 'arrivals',
  },
  {
    label: 'Departures',
    value: 'departures',
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

function DisplayList({
  journeyInformationList,
}: {
  journeyInformationList: JourneyInformation[];
}) {
  return (
    <List>
      {journeyInformationList.map((information: JourneyInformation) => (
        <ListItem
          divider
          sx={{ color: information.cancelled ? 'error.main' : 'inherit' }}
        >
          <ListItemText
            primary={`${information.direction ?? information.origin} (${
              information.product.longCategoryName
            }) - Track: ${information.actualTrack ?? information.plannedTrack}`}
            secondary={`${dayjs(
              information.actualDateTime ?? information.plannedDateTime,
            ).format('LLL')} - ${
              information.departureStatus ?? information.arrivalStatus
            }`}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default function ArrivalDepartures({ trip }: Props) {
  const [journeyType, setJourneyType] = useState<string>('departures');
  const [location, setLocation] = useState<string>('destination');

  const { data: departureJourney } = useStationDeparturesQuery({
    enabled: journeyType === 'departures',
    query: {
      uicCode: trip.legs[trip.legs.length - 1].destination.uicCode,
      dateTime:
        trip.legs[trip.legs.length - 1].destination.actualDateTime ??
        trip.legs[trip.legs.length - 1].destination.plannedDateTime,
      maxJourneys: 5,
    },
  });

  const { data: arrivalJourney } = useStationArrivalsQuery({
    enabled: journeyType === 'arrivals',
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
      <DisplayList
        journeyInformationList={
          journeyType === 'arrivals'
            ? arrivalJourney?.arrivals ?? []
            : departureJourney?.departures ?? []
        }
      />
    </>
  );
}
