/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
  useMap,
} from '@vis.gl/react-google-maps';
import { Circle, Train, X } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';

import { DeckGlOverlay } from './DeckLayer.tsx';
import StopTiming from './StopTiming.tsx';
import Track from './Track.tsx';
import { PathLayer } from '@deck.gl/layers/typed';
import { AnimatePresence, motion } from 'framer-motion';

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
          const backgroundColor = poi.partOfLeg ? '#1b5e20' : '#e65100';
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
      <div className="relative px-4 py-2">
        <div className="absolute left-[28px] top-6 bottom-6 w-0.5 bg-border" />
        {stopsToDisplay.map((stop, index) => {
          const isLeg = Boolean(stop.partOfLeg);
          const dotColor = isLeg
            ? 'bg-primary border-primary/50'
            : 'bg-warning/70 border-warning/40';
          const lineColor =
            stop.partOfLeg && stop.partOfLeg !== 'destination'
              ? 'bg-primary/50'
              : 'bg-warning/40';
          return (
            <div key={stop.id} className="relative flex gap-3 mb-3">
              <div className="flex flex-col items-center z-10 shrink-0">
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${dotColor}`}
                >
                  {isLeg ? (
                    <Train size={12} className="text-white" />
                  ) : (
                    <Circle size={10} className="text-white" />
                  )}
                </div>
                {index < stopsToDisplay.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 mt-0.5 ${lineColor}`}
                    style={{ minHeight: 24 }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-tight">
                    {stop.stop.name}
                  </p>
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
                </div>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {stop.arrivals.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-[#e65100]/20 border border-[#e65100]/30">
                      <span className="font-bold text-[#e65100]">A</span>
                      <StopTiming
                        actualTime={stop.arrivals[0]?.actualTime}
                        plannedTime={stop.arrivals[0]?.plannedTime}
                      />
                    </span>
                  )}
                  {stop.departures.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/30">
                      <span className="font-bold text-primary">D</span>
                      <StopTiming
                        actualTime={stop.departures[0]?.actualTime}
                        plannedTime={stop.departures[0]?.plannedTime}
                      />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
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
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="fixed inset-0 z-[201] bg-bg flex flex-col overflow-y-auto"
      >
        <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 border-b border-border bg-surface">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-2 text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <span className="font-semibold text-sm">Journey information</span>
        </div>
        <div>
          {journey.isLoading ? (
            <div className="flex items-center justify-center py-12 text-sm text-white/40">
              Loading…
            </div>
          ) : (
            <JourneyTimeline
              journeyStop={journey.data?.payload.stops ?? []}
              legInformation={legInformation}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
