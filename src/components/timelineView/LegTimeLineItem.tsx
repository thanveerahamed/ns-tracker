import React, { Fragment, useCallback } from 'react';

import TrainIcon from '@mui/icons-material/Train';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';

import { Leg } from '../../types/trip.ts';
import {
  getPaletteColorFromNesProperties,
  isInValidLeg,
} from '../../utils/trips.ts';
import CrowdForecast from '../CrowdForecast.tsx';
import LegShowMore from '../LegShowMore.tsx';
import { StyledDivider } from '../StyledDivider.tsx';
import Track from '../Track.tsx';
import TripTiming from '../TripTiming.tsx';

export default function LegTimeLineItem({
  legs,
  leg,
  index,
}: {
  legs: Leg[];
  leg: Leg;
  index: number;
}) {
  const getTimeLineDotColor = useCallback(() => {
    if (index === 0 && isInValidLeg(leg)) {
      return 'error';
    }

    if (index > 0 && isInValidLeg(legs[index - 1])) {
      return 'error';
    }

    return 'primary';
  }, [legs, leg, index]);

  const getCurrentLegColor = useCallback(() => {
    if (isInValidLeg(leg)) {
      return 'error.main';
    }

    return 'primary.main';
  }, [leg]);

  return (
    <TimelineItem key={index}>
      <TimelineOppositeContent color="textSecondary">
        {index > 0 && <TripTiming location={legs[index - 1].destination} />}
        <TripTiming location={leg.origin} />
        <TrainIcon sx={{ mt: index > 0 ? 7 : 4 }} />
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot color={getTimeLineDotColor()} />
        <TimelineConnector
          sx={{
            bgcolor: getCurrentLegColor(),
          }}
        />
      </TimelineSeparator>
      <TimelineContent>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography sx={{ color: getCurrentLegColor() }}>
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
                  leg.transferMessages.map((transferMessage, index) => {
                    return (
                      <React.Fragment key={index}>
                        <br />
                        <Typography
                          sx={{
                            color: getPaletteColorFromNesProperties(
                              transferMessage.messageNesProperties,
                            ),
                          }}
                          variant="caption"
                        >
                          {transferMessage.message}
                        </Typography>
                      </React.Fragment>
                    );
                  })}
              </>
            )}
          </Box>
          <Stack direction="column" justifyContent="space-evenly">
            {index > 0 && (
              <Track
                plannedTrack={legs[index - 1].destination.plannedTrack}
                actualTrack={legs[index - 1].destination.actualTrack}
              />
            )}
            <Track
              plannedTrack={leg.origin.plannedTrack}
              actualTrack={leg.origin.actualTrack}
            />
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
                  color: getPaletteColorFromNesProperties(
                    message.nesProperties,
                  ),
                }}
              >
                {message.text ?? message.head}
              </Typography>
              <StyledDivider />
            </Fragment>
          );
        }) ?? <></>}
        <LegShowMore leg={leg} />
      </TimelineContent>
    </TimelineItem>
  );
}
