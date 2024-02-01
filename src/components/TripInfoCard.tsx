import { useCallback } from 'react';

import { TripInfoDetail } from './TripInfoDetail.tsx';
import { TripInfoDetailSmall } from './TripInfoDetailSmall.tsx';
import TripStartAndEndTime from './TripStartAndEndTime.tsx';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material';
import { ButtonOwnProps } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ListItem from '@mui/material/ListItem';

import { NSStation } from '../types/station.ts';
import { Trip } from '../types/trip.ts';

interface TripInfoCardActions {
  name: string;
  onClick: () => void;
  color: ButtonOwnProps['color'];
}

interface Props {
  trip: Trip;
  via?: NSStation;
  isFavourite: boolean;
  onSelect: (trip: Trip) => void;
  variant?: 'small' | 'regular';
  actions?: TripInfoCardActions[];
}

export default function TripInfoCard({
  trip,
  via,
  onSelect,
  isFavourite,
  actions,
  variant = 'regular',
}: Props) {
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

  return trip.status === 'CANCELLED' ? (
    <ListItem sx={{ padding: '0' }}>
      <Accordion sx={{ padding: '2px 5px', width: '100%' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ backgroundColor: 'rgb(118 66 66)' }}
        >
          <Box>
            <Typography>{trip.status}</Typography>
            <TripStartAndEndTime trip={trip} />
          </Box>
        </AccordionSummary>
        <AccordionDetails
          onClick={() => onSelect(trip)}
          sx={{ border: '1px solid rgb(118 66 66)' }}
        >
          {variant === 'small' ? (
            <TripInfoDetailSmall trip={trip} hideStartAndEndTime />
          ) : (
            <TripInfoDetail
              trip={trip}
              isChangeInIntermediateStop={isChangeInIntermediateStop(trip)}
              hideStartAndEndTime
              isFavourite={isFavourite}
            />
          )}
          {actions && actions.length > 0 && (
            <Stack direction="row" justifyContent="flex-end">
              {actions.map((action) => (
                <Button
                  key={action.name}
                  onClick={action.onClick}
                  color={action.color}
                >
                  {action.name}
                </Button>
              ))}
            </Stack>
          )}
        </AccordionDetails>
      </Accordion>
    </ListItem>
  ) : (
    <ListItem sx={{ padding: '0' }}>
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
            {variant === 'small' ? (
              <TripInfoDetailSmall trip={trip} />
            ) : (
              <TripInfoDetail
                trip={trip}
                isChangeInIntermediateStop={isChangeInIntermediateStop(trip)}
                isFavourite={isFavourite}
              />
            )}
          </CardContent>
          {actions && actions.length > 0 && (
            <Stack direction="row" justifyContent="flex-end">
              {actions.map((action) => (
                <Button onClick={action.onClick} color={action.color}>
                  {action.name}
                </Button>
              ))}
            </Stack>
          )}
        </Card>
      </ListItemButton>
    </ListItem>
  );
}
