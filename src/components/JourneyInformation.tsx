/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  APIProvider,
  AdvancedMarker,
  Map,
  MapCameraChangedEvent,
  Pin,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import React, { useEffect, useState } from 'react';

import StopTiming from './StopTiming.tsx';
import Track from './Track.tsx';
import { SlideUpTransition } from './transitions/SlideUp.tsx';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Timeline, TimelineSeparator } from '@mui/lab';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import { Chip, Dialog, IconButton, Stack, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import dayjs from 'dayjs';

import { useJourney } from '../apis/trips.ts';
import { JourneyStop } from '../types/journey.ts';

const env = import.meta.env;

interface TransportStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  plotMarker: boolean;
}

interface Route {
  from: string;
  to: string;
}

interface PublicTransportMapProps {
  stops: TransportStop[];
  routes: Route[];
  departureTime: string;
}

function Directions({ stops, departureTime }: PublicTransportMapProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routeIndex] = useState(0);

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(
      new routesLibrary.DirectionsRenderer({ map, suppressMarkers: true }),
    );
  }, [routesLibrary, map]);

  // Use directions service
  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    const origin = stops[0];
    const destination = stops[stops.length - 1];

    directionsService
      .route({
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: google.maps.TravelMode.TRANSIT, // For public transport
        transitOptions: {
          modes: [google.maps.TransitMode.TRAIN],
          departureTime: dayjs(departureTime).toDate(),
        },
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      });

    return () => directionsRenderer.setMap(null);
  }, [directionsService, directionsRenderer, stops, departureTime]);

  // Update direction route
  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  return <></>;
}

const PublicTransportMap = ({
  stops,
  routes,
  departureTime,
}: PublicTransportMapProps) => {
  const googleMapsApiKey = env.VITE_GOOGLE_MAP_API;

  return (
    <APIProvider
      apiKey={googleMapsApiKey}
      onLoad={() => console.log('Maps API has loaded.')}
    >
      <Map
        style={{ width: '100%', height: '500px' }}
        mapId="journey_id"
        defaultZoom={12}
        defaultCenter={{ lat: stops[0].lat, lng: stops[0].lng }}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log(
            'camera changed:',
            ev.detail.center,
            'zoom:',
            ev.detail.zoom,
          )
        }
      >
        <Directions
          stops={stops}
          routes={routes}
          departureTime={departureTime}
        />
        {stops
          .filter((stop) => stop.plotMarker)
          .map((poi) => (
            <AdvancedMarker
              key={poi.id}
              position={{ lat: poi.lat, lng: poi.lng }}
            >
              <Pin
                background={'#FBBC04'}
                glyphColor={'#000'}
                borderColor={'#000'}
              />
            </AdvancedMarker>
          ))}
      </Map>
    </APIProvider>
  );
};

const JourneyTimeline = ({ journeyStop }: { journeyStop: JourneyStop[] }) => {
  const stopsToDisplay = journeyStop.filter(
    (j: JourneyStop) => j.status !== 'PASSING',
  );

  const stopsForMap: TransportStop[] = journeyStop.map((j: JourneyStop) => ({
    id: j.id,
    name: j.stop.name,
    lat: j.stop.lat,
    lng: j.stop.lng,
    plotMarker: j.status !== 'PASSING',
  }));
  const journeyRoutes = stopsToDisplay.map(
    (j: JourneyStop): Route => ({ from: j.id, to: j.nextStopId[0] }),
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
              <TimelineDot color="primary" />
              {index < stopsToDisplay.length - 1 && <TimelineConnector />}
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
                    icon={<KeyboardDoubleArrowRightIcon />}
                    label={
                      <StopTiming
                        actualTime={stop.arrivals[0]?.actualTime}
                        plannedTime={stop.arrivals[0]?.plannedTime}
                        variant="caption"
                      />
                    }
                  />
                )}
                {stop.departures.length > 0 && (
                  <Chip
                    size="small"
                    sx={{ width: 'fit-content' }}
                    icon={<KeyboardDoubleArrowLeftIcon />}
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
      <PublicTransportMap
        stops={stopsForMap}
        routes={journeyRoutes}
        departureTime={stopsToDisplay[0]?.departures[0]?.plannedTime}
      />
    </>
  );
};

export const JourneyInformation = ({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) => {
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
          <JourneyTimeline journeyStop={journey.data?.payload.stops ?? []} />
        )}
      </Box>
    </Dialog>
  );
};
