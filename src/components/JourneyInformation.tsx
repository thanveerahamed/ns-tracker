/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
  useMap,
} from '@vis.gl/react-google-maps';
import React, { useEffect, useMemo } from 'react';

import { DeckGlOverlay } from './DeckLayer.tsx';
import StopTiming from './StopTiming.tsx';
import Track from './Track.tsx';
import { SlideUpTransition } from './transitions/SlideUp.tsx';
import { PathLayer } from '@deck.gl/layers/typed';
import CloseIcon from '@mui/icons-material/Close';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import TrainIcon from '@mui/icons-material/Train';
import { Timeline, TimelineSeparator } from '@mui/lab';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import {
  Avatar,
  Chip,
  Dialog,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { green, orange } from '@mui/material/colors';

import { useJourney } from '../apis/trips.ts';
import { JourneyStop, PartOfLeg } from '../types/journey.ts';

const env = import.meta.env;

interface TransportStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  plotMarker: boolean;
  partOfLeg: PartOfLeg;
}

interface PublicTransportMapProps {
  stops: TransportStop[];
}

interface PathPoint {
  position: [number, number]; // [longitude, latitude]
}

interface TransitRoute {
  id: string;
  name?: string;
  path: PathPoint[];
  color?: [number, number, number]; // RGB color
  width?: number;
  type?: 'train' | 'subway' | 'light-rail';
}

interface PreciseTransitLayerProps {
  routes: TransitRoute[];
  defaultWidth?: number;
  defaultColor?: [number, number, number];
  opacity?: number;
  // onClick?: (info: any) => void;
  // onHover?: (info: any) => void;
}

interface LegInformation {
  legOriginUicCode: string;
  destinationUicCode: string;
  intermediateStopsUicCodes: string[];
}

function getDeckGlLayers({
  routes,
  defaultWidth = 4,
  defaultColor = [0, 128, 255],
  opacity = 0.8,
}: PreciseTransitLayerProps) {
  return new PathLayer({
    id: 'precise-transit-paths',
    data: routes,
    pickable: true,
    widthScale: 1,
    widthMinPixels: 2,
    getPath: (d: TransitRoute) => d.path.map((p) => p.position),
    getColor: (d: TransitRoute) => [
      ...(d.color || defaultColor),
      Math.floor(opacity * 255),
    ],
    getWidth: (d: TransitRoute) => d.width || 4,
    // Enable high precision rendering
    parameters: {
      depthTest: false, // Ensure lines are always visible
      antialias: true, // Smooth line rendering
    },
    // Enable rounded caps and joins for smoother appearance
    capRounded: true,
    jointRounded: true,
    // Optional: Add miter limit to prevent sharp spikes at joins
    miterLimit: 2,
    // Enable billboard mode for consistent width at all zoom levels
    billboard: true,
    // Add interaction handlers
    // onClick,
    // onHover,
    updateTriggers: {
      getColor: [opacity, defaultColor],
      getWidth: [defaultWidth],
    },
  });
}

const PublicTransportMap = ({ stops }: PublicTransportMapProps) => {
  const map = useMap();
  const trainRoutes: TransitRoute[] = useMemo(() => {
    const coordinates = stops.map(
      (stop): PathPoint => ({ position: [stop.lng, stop.lat] }),
    );

    const smoothedPath: PathPoint[] = [];
    const interpolationCount = 5;

    for (let i = 0; i < coordinates.length - 1; i++) {
      const start = coordinates[i];
      const end = coordinates[i + 1];

      for (let j = 0; j <= interpolationCount; j++) {
        const t = j / interpolationCount;
        smoothedPath.push({
          position: [
            start.position[0] + (end.position[0] - start.position[0]) * t,
            start.position[1] + (end.position[1] - start.position[1]) * t,
          ],
        });
      }
    }

    return [
      {
        id: 'red-line',
        name: '',
        color: [254, 167, 38],
        width: 4,
        type: 'train',
        path: smoothedPath,
      },
    ];
  }, [stops]);

  useEffect(() => {
    if (map) {
      const bounds = new google.maps.LatLngBounds();
      stops.forEach((stop) => {
        bounds.extend(new google.maps.LatLng(stop.lat, stop.lng));
      });
      map.fitBounds(bounds);
    }
  }, [map, stops]);

  return (
    <Map
      style={{ width: '100%', height: '500px' }}
      mapId="503d8b250ce1efd6"
      defaultZoom={12}
      defaultCenter={{ lat: stops[0].lat, lng: stops[0].lng }}
      disableDefaultUI
      // onCameraChanged={(ev: MapCameraChangedEvent) =>
      //   console.log(
      //     'camera changed:',
      //     ev.detail.center,
      //     'zoom:',
      //     ev.detail.zoom,
      //   )
      // }
    >
      {stops
        .filter((stop) => stop.plotMarker)
        .map((poi) => {
          const backgroundColor = poi.partOfLeg ? green[900] : orange[500];
          return (
            <AdvancedMarker
              key={poi.id}
              position={{ lat: poi.lat, lng: poi.lng }}
            >
              <Pin
                background={backgroundColor}
                glyphColor={'#000'}
                borderColor={'#000'}
              />
            </AdvancedMarker>
          );
        })}
      <DeckGlOverlay layers={[getDeckGlLayers({ routes: trainRoutes })]} />
    </Map>
  );
};

const calculatePartOfLeg = (
  uicCode: string,
  legInformation: LegInformation,
): PartOfLeg => {
  if (legInformation.legOriginUicCode === uicCode) {
    return 'origin';
  }

  if (legInformation.destinationUicCode === uicCode) {
    return 'destination';
  }

  if (legInformation.intermediateStopsUicCodes.includes(uicCode)) {
    return 'intermediate';
  }

  return undefined;
};

const JourneyTimeline = ({
  journeyStop,
  legInformation,
}: {
  journeyStop: JourneyStop[];
  legInformation: LegInformation;
}) => {
  const stopsToDisplay = useMemo(
    () =>
      journeyStop
        .filter((j) => j.status !== 'PASSING')
        .map((j) => ({
          ...j,
          partOfLeg: calculatePartOfLeg(j.stop.uicCode, legInformation),
        })),
    [journeyStop, legInformation],
  );

  const stopsForMap = useMemo(
    () =>
      journeyStop.map((j) => ({
        id: j.id,
        name: j.stop.name,
        lat: j.stop.lat,
        lng: j.stop.lng,
        plotMarker: j.status !== 'PASSING',
        partOfLeg: calculatePartOfLeg(j.stop.uicCode, legInformation),
      })),
    [journeyStop, legInformation],
  );

  return (
    <>
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {stopsToDisplay.map((stop, index) => (
          <TimelineItem key={stop.id}>
            <TimelineSeparator>
              {stop.partOfLeg ? (
                <TimelineDot color="primary" variant="outlined">
                  <TrainIcon color="primary" />
                </TimelineDot>
              ) : (
                <TimelineDot variant="outlined" color="warning">
                  <PanoramaFishEyeIcon color="warning" />
                </TimelineDot>
              )}

              {index < stopsToDisplay.length - 1 && (
                <TimelineConnector
                  sx={{
                    bgcolor:
                      stop.partOfLeg && stop.partOfLeg !== 'destination'
                        ? 'primary.main'
                        : 'warning.main',
                  }}
                />
              )}
            </TimelineSeparator>
            <TimelineContent>
              <Stack direction="column" spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body1">{stop.stop.name}</Typography>
                  <Track
                    plannedTrack={
                      stop.departures[0]?.plannedTrack ??
                      stop.arrivals[0]?.plannedTrack
                    }
                    actualTrack={
                      stop.departures[0]?.actualTrack ??
                      stop.arrivals[0]?.actualTrack
                    }
                  />
                </Stack>

                {stop.arrivals.length > 0 && (
                  <Chip
                    size="small"
                    sx={{ width: 'fit-content' }}
                    avatar={<Avatar sx={{ bgcolor: orange[900] }}>A</Avatar>}
                    label={
                      <>
                        <StopTiming
                          actualTime={stop.arrivals[0]?.actualTime}
                          plannedTime={stop.arrivals[0]?.plannedTime}
                          variant="caption"
                        />
                      </>
                    }
                  />
                )}
                {stop.departures.length > 0 && (
                  <Chip
                    size="small"
                    sx={{ width: 'fit-content' }}
                    avatar={<Avatar sx={{ bgcolor: green[900] }}>D</Avatar>}
                    label={
                      <StopTiming
                        actualTime={stop.departures[0]?.actualTime}
                        plannedTime={stop.departures[0]?.plannedTime}
                        variant="caption"
                      />
                    }
                  />
                )}
              </Stack>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
      <APIProvider
        apiKey={env.VITE_GOOGLE_MAP_API}
        onLoad={() => console.log('Maps API has loaded.')}
      >
        <PublicTransportMap stops={stopsForMap} />
      </APIProvider>
    </>
  );
};

export const JourneyInformation = ({
  id,
  onClose,
  ...legInformation
}: {
  id: string;
  onClose: () => void;
} & LegInformation) => {
  const journey = useJourney({ id });

  return (
    <Dialog
      fullScreen
      open={true}
      onClose={onClose}
      TransitionComponent={SlideUpTransition}
    >
      <AppBar sx={{ position: 'fixed' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Journey information
          </Typography>
        </Toolbar>
      </AppBar>
      <Box mt={6}>
        {journey.isLoading ? (
          <>Loading...</>
        ) : (
          <JourneyTimeline
            journeyStop={journey.data?.payload.stops ?? []}
            legInformation={legInformation}
          />
        )}
      </Box>
    </Dialog>
  );
};
