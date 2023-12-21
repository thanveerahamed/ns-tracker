import { Fragment } from 'react';

import CrowdForecast from './CrowdForecast.tsx';
import DurationDisplay from './DurationDisplay.tsx';
import NumberOfConnectionsDisplay from './NumberOfConnectionsDisplay.tsx';
import { SlideLeftTransition } from './transitions/SlideLeft.tsx';
import styled from '@emotion/styled';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import TrainIcon from '@mui/icons-material/Train';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import {
  Card,
  CardContent,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import dayjs from 'dayjs';

import { NSStation } from '../types/station.ts';
import { Trip } from '../types/trip.ts';
import { makeTripStartAndEndTime } from '../utils/trips.ts';

interface Props {
  trip?: Trip;
  onClose: () => void;
  origin?: NSStation;
  destination?: NSStation;
}

const StyledDivider = styled(Divider)`
  margin: 10px 0;
`;

export default function TripInformation({
  trip,
  onClose,
  origin,
  destination,
}: Props) {
  const open = Boolean(trip);
  const destinationLeg = trip?.legs[trip?.legs.length - 1];

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={SlideLeftTransition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {origin?.namen.kort} to {destination?.namen.kort}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: '5px 0' }}>
        {trip ? (
          <>
            <Card variant="elevation" sx={{ mb: 2 }}>
              <CardContent>
                <Grid container>
                  <Grid item xs={9}>
                    <Typography variant="h6" component="div">
                      {makeTripStartAndEndTime(trip)}
                    </Typography>
                    <Typography variant="body1" component="div">
                      {dayjs(trip.legs[0].origin.plannedDateTime).format('LL')}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <NumberOfConnectionsDisplay
                      connections={trip.legs.length - 1}
                    />
                    <DurationDisplay trip={trip} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card variant="elevation">
              <CardContent sx={{ p: 0, pb: '0px !important' }}>
                <Timeline
                  sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                      flex: 0.3,
                    },
                    padding: 0,
                  }}
                >
                  {trip.legs.map((leg, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="textSecondary">
                        {index > 0 &&
                          dayjs(
                            trip.legs[index - 1].destination.plannedDateTime,
                          ).format('hh:mm a')}
                        {index > 0 && <br />}
                        {dayjs(leg.origin.plannedDateTime).format('hh:mm a')}
                        <br />
                        <TrainIcon sx={{ mt: index > 0 ? 7 : 4 }} />
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color="primary" />
                        <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography sx={{ color: 'primary.main' }}>
                            {leg.origin.name}
                          </Typography>
                          <Typography sx={{ color: 'primary.main' }}>
                            Track: {leg.origin.plannedTrack}
                          </Typography>
                        </Stack>
                        {index > 0 && (
                          <>
                            <Typography variant="caption">
                              Exit side: {leg.destination.exitSide}
                            </Typography>
                            {leg.transferMessages &&
                              leg.transferMessages.map((transferMessage) => {
                                //messageNesProperties
                                return (
                                  <>
                                    <br />
                                    <Typography
                                      sx={{
                                        color:
                                          transferMessage.messageNesProperties
                                            .type === 'error'
                                            ? 'error.main'
                                            : 'primary.main',
                                      }}
                                      variant="caption"
                                    >
                                      {transferMessage.message}
                                    </Typography>
                                  </>
                                );
                              })}
                          </>
                        )}
                        <StyledDivider />
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box>
                            <Typography>{leg.product.displayName}</Typography>
                            <Typography>to {leg.direction}</Typography>
                            {leg.notes?.find(
                              (note) => note.value === 'Supplement',
                            ) && (
                              <Typography sx={{ color: 'error.main' }}>
                                Supplement required
                              </Typography>
                            )}
                          </Box>
                          <CrowdForecast crowdForecast={leg.crowdForecast} />
                        </Stack>
                        <StyledDivider />
                        {leg.messages?.map((message, index) => {
                          return (
                            <Fragment key={index}>
                              <Typography
                                sx={{
                                  color:
                                    message.type === 'DISRUPTION'
                                      ? 'error.main'
                                      : 'inherit',
                                }}
                              >
                                {message.head}
                              </Typography>
                              <StyledDivider />
                            </Fragment>
                          );
                        }) ?? <></>}
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                  {destinationLeg && (
                    <TimelineItem>
                      <TimelineOppositeContent color="textSecondary">
                        {dayjs(
                          destinationLeg.destination.plannedDateTime,
                        ).format('hh:mm a')}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color="primary" />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography sx={{ color: 'primary.main' }}>
                            {destinationLeg.destination.name}
                          </Typography>
                          <Typography sx={{ color: 'primary.main' }}>
                            Track: {destinationLeg.destination.plannedTrack}
                          </Typography>
                        </Stack>
                        <Typography variant="caption">
                          Exit side: {destinationLeg.destination.exitSide}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  )}
                </Timeline>
              </CardContent>
            </Card>
          </>
        ) : (
          <Typography>Cannot display the information</Typography>
        )}
      </Box>
    </Dialog>
  );
}
