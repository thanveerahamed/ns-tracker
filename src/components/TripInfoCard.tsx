import { useCallback } from 'react';

import { TripInfoDetail } from './TripInfoDetail.tsx';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ListItemButton,
  Typography,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ListItem from '@mui/material/ListItem';

import { NSStation } from '../types/station.ts';
import { Trip } from '../types/trip.ts';
import { makeTripStartAndEndTime } from '../utils/trips.ts';

interface Props {
  trip: Trip;
  via?: NSStation;
  onSelect: (trip: Trip) => void;
}

export default function TripInfoCard({ trip, via, onSelect }: Props) {
  const isChangeInIntermediateStop = useCallback(
    (trip: Trip) => {
      if (trip.legs.length > 1) {
        return Boolean(
          trip.legs.find((leg) => leg.destination.uicCode === via?.UICCode),
        );
      } else {
        return false;
      }
    },
    [via],
  );

  return (
    <ListItem sx={{ padding: '0' }}>
      {trip.status === 'CANCELLED' ? (
        <Accordion sx={{ padding: '2px 5px' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{ backgroundColor: 'rgb(118 66 66)' }}
          >
            <Box>
              <Typography>{trip.status}</Typography>
              <Typography variant="caption">
                {makeTripStartAndEndTime(trip)}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails
            onClick={() => onSelect(trip)}
            sx={{ border: '1px solid rgb(118 66 66)' }}
          >
            <TripInfoDetail
              trip={trip}
              isChangeInIntermediateStop={isChangeInIntermediateStop(trip)}
            />
          </AccordionDetails>
        </Accordion>
      ) : (
        <ListItemButton
          sx={{ padding: '2px 5px' }}
          onClick={() => onSelect(trip)}
        >
          <Card
            key={trip.idx}
            variant={trip.status === 'CANCELLED' ? 'elevation' : 'outlined'}
            elevation={trip.status === 'CANCELLED' ? 5 : undefined}
            sx={{
              border: '1px solid',
              borderColor: 'primary.main',
              width: '100%',
            }}
          >
            {trip.status !== 'NORMAL' && (
              <Alert severity="warning">{trip.status}</Alert>
            )}
            <CardContent>
              <TripInfoDetail
                trip={trip}
                isChangeInIntermediateStop={isChangeInIntermediateStop(trip)}
              />
            </CardContent>
          </Card>
        </ListItemButton>
      )}
    </ListItem>
  );
}
