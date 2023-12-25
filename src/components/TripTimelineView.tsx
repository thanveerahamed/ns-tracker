import { Fragment } from 'react';

import CrowdForecast from './CrowdForecast.tsx';
import { StyledDivider } from './StyledDivider.tsx';
import TripTiming from './TripTiming.tsx';
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
import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';

import { Trip } from '../types/trip.ts';
import { getColorFromNesProperties } from '../utils/trips.ts';

export function TripTimelineView({ trip }: { trip: Trip }) {
  const { legs } = trip;

  const destinationLeg = legs[trip?.legs.length - 1];

  return (
    <Timeline
      sx={{
        [`& .${timelineOppositeContentClasses.root}`]: {
          flex: 0.3,
        },
        padding: 0,
      }}
    >
      {legs.map((leg, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent color="textSecondary">
            {index > 0 && <TripTiming location={legs[index - 1].destination} />}
            <TripTiming location={leg.origin} />
            <TrainIcon sx={{ mt: index > 0 ? 7 : 4 }} />
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot
              color={
                index > 0 &&
                (legs[index - 1].cancelled ||
                  legs[index - 1].partCancelled ||
                  !legs[index - 1].changePossible)
                  ? 'error'
                  : 'primary'
              }
            />
            <TimelineConnector
              sx={{
                bgcolor:
                  leg.cancelled || leg.partCancelled || !leg.changePossible
                    ? 'error.main'
                    : 'primary.main',
              }}
            />
          </TimelineSeparator>
          <TimelineContent>
            <Stack direction="row" justifyContent="space-between">
              <Box>
                <Typography sx={{ color: 'primary.main' }}>
                  {leg.origin.name}
                </Typography>
                {index > 0 && (
                  <>
                    {leg.destination.exitSide && (
                      <Typography variant="caption">
                        Exit side: {leg.destination.exitSide}
                      </Typography>
                    )}

                    {leg.transferMessages &&
                      leg.transferMessages.map((transferMessage) => {
                        return (
                          <>
                            <br />
                            <Typography
                              sx={{
                                color: getColorFromNesProperties(
                                  transferMessage.messageNesProperties,
                                ),
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
              </Box>
              <Stack direction="column" justifyContent="space-evenly">
                {index > 0 && (
                  <Typography sx={{ color: 'primary.main' }}>
                    Track: {legs[index - 1].destination.plannedTrack}
                  </Typography>
                )}
                <Typography sx={{ color: 'primary.main' }}>
                  Track: {leg.origin.plannedTrack}
                </Typography>
              </Stack>
            </Stack>
            <StyledDivider />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography>{leg.product.displayName}</Typography>
                <Typography>to {leg.direction}</Typography>
                {leg.notes?.find((note) => note.value === 'Supplement') && (
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
                      color: getColorFromNesProperties(message.nesProperties),
                    }}
                  >
                    {message.text ?? message.head}
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
            <TripTiming location={destinationLeg.destination} />
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot
              color={
                destinationLeg.partCancelled ||
                destinationLeg.cancelled ||
                !destinationLeg.changePossible
                  ? 'error'
                  : 'primary'
              }
            />
          </TimelineSeparator>
          <TimelineContent>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: 'primary.main' }}>
                {destinationLeg.destination.name}
              </Typography>
              <Typography sx={{ color: 'primary.main' }}>
                Track:{' '}
                {destinationLeg.destination.actualTrack ??
                  destinationLeg.destination.plannedTrack}
              </Typography>
            </Stack>
            {destinationLeg.destination.exitSide && (
              <Typography variant="caption">
                Exit side: {destinationLeg.destination.exitSide}
              </Typography>
            )}
          </TimelineContent>
        </TimelineItem>
      )}
    </Timeline>
  );
}
