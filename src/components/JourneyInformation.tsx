/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';

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

import { useJourney } from '../apis/trips.ts';
import { JourneyStop } from '../types/journey.ts';
import { Coordinate } from '../types/trip.ts';

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
}

const PublicTransportMap = ({ stops, routes }: PublicTransportMapProps) => {
  const mapRef = useRef(null);
  const googleMapsApiKey = process.env.VITE_GOOGLE_MAP_API;

  useEffect(() => {
    if (!mapRef.current) return;

    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`;
    googleMapsScript.async = true;
    document.body.appendChild(googleMapsScript);

    googleMapsScript.onload = () => {
      const mapCenter = new google.maps.LatLng(37.7749, -122.4194); // Initial map center
      const mapOptions: google.maps.MapOptions = {
        zoom: 12,
        center: mapCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };

      const map = new google.maps.Map(
        mapRef.current as unknown as HTMLElement,
        mapOptions,
      );

      // Add Markers
      stops
        .filter((stop) => stop.plotMarker)
        .forEach((stop) => {
          new google.maps.Marker({
            position: new google.maps.LatLng(stop.lat, stop.lng),
            map: map,
            title: stop.name,
          });
        });

      const boundingBox = calculateBoundingBoxFromMarkers(
        stops.map(({ lat, lng }: TransportStop) => ({ lat, lng })),
      );
      const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(
          boundingBox.southWest.lat,
          boundingBox.southWest.lng,
        ),
        new google.maps.LatLng(
          boundingBox.northEast.lat,
          boundingBox.northEast.lng,
        ),
      );

      map.fitBounds(bounds);

      // stops.forEach((origin, index) => {
      //   const directionsService = new google.maps.DirectionsService();
      //   const directionsRenderer = new google.maps.DirectionsRenderer();
      //   directionsRenderer.setMap(map);
      //
      //   const destination = stops[index + 1];
      //
      //   const request = {
      //     origin: { lat: origin.lat, lng: origin.lng },
      //     destination: { lat: destination.lat, lng: destination.lng },
      //     travelMode: google.maps.TravelMode.TRANSIT, // For public transport
      //   };
      //
      //   directionsService.route(request, (result, status) => {
      //     if (status === google.maps.DirectionsStatus.OK && result !== null) {
      //       directionsRenderer.setDirections(result);
      //     } else {
      //       console.error(`Failed to get directions: ${status}`);
      //     }
      //   });
      // })
    };
  }, [googleMapsApiKey, stops, routes]);

  return <div ref={mapRef} style={{ height: '600px', width: 'auto' }} />;
};

const calculateBoundingBoxFromMarkers = (markers: Coordinate[]) => {
  const lats = markers.map((marker) => marker.lat);
  const lngs = markers.map((marker) => marker.lng);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const southWest: Coordinate = { lat: minLat, lng: minLng };
  const northEast: Coordinate = { lat: maxLat, lng: maxLng };

  return { southWest, northEast };
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
      <PublicTransportMap stops={stopsForMap} routes={journeyRoutes} />
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
