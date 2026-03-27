import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Map, {
  Source,
  Layer,
  Marker,
  NavigationControl,
} from 'react-map-gl/maplibre'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Train, Milestone, TrainFront, Footprints } from 'lucide-react'
import { useQueries, useQuery } from '@tanstack/react-query'

import { Skeleton } from '@/components/ui/skeleton.tsx'
import { cn } from '@/lib/utils.ts'
import { getJourneyInformation } from '@/services/trip.ts'
import {
  fetchSpoorkaart,
  getTrackCoords,
  findNearestStationCode,
  type SpoorkaartData,
} from '@/services/spoorkaart.ts'
import type { Trip, Leg } from '@/types/trip.ts'
import type { JourneyResponse, JourneyStop } from '@/types/journey.ts'

/* ─── Constants ─── */

const MAP_STYLE =
  'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
const DARK_MAP_STYLE =
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

const LEG_COLORS = [
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#f59e0b', // amber-500
  '#ec4899', // pink-500
  '#10b981', // emerald-500
]

/* ─── Helpers ─── */

/* ─── Polyline segment types ─── */

interface RouteSegment {
  coords: [number, number][]
  traveled: boolean // true = your journey (solid), false = rest of train route (dashed)
}

/** Fallback: get approximate coordinates from leg data when Spoorkaart is unavailable. */
function getLegFallbackCoords(leg: Leg): [number, number][] {
  if (leg.coordinates && leg.coordinates.length > 1) {
    return leg.coordinates.map((c) => [c[0], c[1]] as [number, number])
  }
  if (leg.overviewPolyLine && leg.overviewPolyLine.length > 1) {
    return leg.overviewPolyLine.map((p) => [p.lng, p.lat] as [number, number])
  }
  return [
    [leg.origin.lng, leg.origin.lat],
    [leg.destination.lng, leg.destination.lat],
  ]
}

/**
 * Resolve a station code for a journey stop.
 * Journey stops have coordinates but not always a station code,
 * so we match against the Spoorkaart station positions.
 */
function resolveStationCode(
  stop: JourneyStop,
  spoorkaart: SpoorkaartData | undefined,
): string | null {
  if (!spoorkaart) return null
  return findNearestStationCode(
    spoorkaart.positions,
    stop.stop.lng,
    stop.stop.lat,
  )
}

/**
 * Get track-following coordinates between two station codes using the Spoorkaart graph,
 * falling back to a straight line between the given coordinates.
 */
function getTrackOrFallback(
  spoorkaart: SpoorkaartData | undefined,
  fromCode: string | null,
  toCode: string | null,
  fallbackCoords: [number, number][],
): [number, number][] {
  if (!spoorkaart || !fromCode || !toCode) return fallbackCoords
  return getTrackCoords(spoorkaart.graph, fromCode, toCode) ?? fallbackCoords
}

/**
 * Build coordinates by walking through consecutive journey stops,
 * using Spoorkaart BFS between each pair so the route follows the
 * actual train path rather than a possibly-wrong shortest graph path.
 */
function buildCoordsViaStops(
  stops: JourneyStop[],
  spoorkaart: SpoorkaartData | undefined,
): [number, number][] {
  if (stops.length === 0) return []
  if (stops.length === 1) return [[stops[0].stop.lng, stops[0].stop.lat]]

  const coords: [number, number][] = []

  for (let i = 0; i < stops.length - 1; i++) {
    const fromCode = resolveStationCode(stops[i], spoorkaart)
    const toCode = resolveStationCode(stops[i + 1], spoorkaart)
    const fallback: [number, number][] = [
      [stops[i].stop.lng, stops[i].stop.lat],
      [stops[i + 1].stop.lng, stops[i + 1].stop.lat],
    ]

    const segCoords = getTrackOrFallback(spoorkaart, fromCode, toCode, fallback)

    if (coords.length === 0) {
      coords.push(...segCoords)
    } else {
      // Skip first point — overlaps with the last point of the previous segment
      coords.push(...segCoords.slice(1))
    }
  }

  return coords
}

/**
 * Build route segments for a leg.
 *
 * Uses the NS Spoorkaart railway track geometry for ALL segments
 * (traveled and untraveled), providing curve-following polylines.
 *
 * Untraveled segments are built stop-by-stop through the journey
 * stops so that the dashed line follows the actual train route.
 *
 * Falls back to leg coordinates / journey stop coordinates when
 * Spoorkaart data is unavailable (e.g. non-NL stations).
 */
function buildLegSegments(
  leg: Leg,
  journeyStops: JourneyStop[] | undefined,
  spoorkaart: SpoorkaartData | undefined,
): RouteSegment[] {
  const boardCode = leg.origin.stationCode?.toLowerCase() ?? null
  const alightCode = leg.destination.stationCode?.toLowerCase() ?? null

  // Simple fallback traveled coords (single BFS or leg coordinates)
  const fallbackTraveledCoords = getTrackOrFallback(
    spoorkaart,
    boardCode,
    alightCode,
    getLegFallbackCoords(leg),
  )

  if (!journeyStops || journeyStops.length === 0) {
    return [{ coords: fallbackTraveledCoords, traveled: true }]
  }

  const boardUic = leg.origin.uicCode
  const alightUic = leg.destination.uicCode
  const boardIdx = journeyStops.findIndex((s) => s.stop.uicCode === boardUic)
  const alightIdx = journeyStops.findIndex((s) => s.stop.uicCode === alightUic)

  if (boardIdx === -1 || alightIdx === -1) {
    return [{ coords: fallbackTraveledCoords, traveled: true }]
  }

  const segments: RouteSegment[] = []

  // Before boarding: walk stop-by-stop from train origin → boarding station
  if (boardIdx > 0) {
    const beforeStops = journeyStops.slice(0, boardIdx + 1)
    const beforeCoords = buildCoordsViaStops(beforeStops, spoorkaart)
    if (beforeCoords.length >= 2) {
      segments.push({ coords: beforeCoords, traveled: false })
    }
  }

  // Traveled segment: walk stop-by-stop from boarding → alighting station
  const traveledStops = journeyStops.slice(boardIdx, alightIdx + 1)
  const traveledCoords = buildCoordsViaStops(traveledStops, spoorkaart)
  segments.push({
    coords:
      traveledCoords.length >= 2 ? traveledCoords : fallbackTraveledCoords,
    traveled: true,
  })

  // After alighting: walk stop-by-stop from alighting station → train destination
  if (alightIdx < journeyStops.length - 1) {
    const afterStops = journeyStops.slice(alightIdx)
    const afterCoords = buildCoordsViaStops(afterStops, spoorkaart)
    if (afterCoords.length >= 2) {
      segments.push({ coords: afterCoords, traveled: false })
    }
  }

  return segments
}

function coordsToGeoJSON(
  coords: [number, number][],
): GeoJSON.Feature<GeoJSON.LineString> {
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'LineString', coordinates: coords },
  }
}

function getBoundsFromSegments(
  allSegments: RouteSegment[][],
): [[number, number], [number, number]] {
  let minLng = Infinity
  let maxLng = -Infinity
  let minLat = Infinity
  let maxLat = -Infinity

  for (const segments of allSegments) {
    for (const seg of segments) {
      for (const [lng, lat] of seg.coords) {
        if (lng < minLng) minLng = lng
        if (lng > maxLng) maxLng = lng
        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
      }
    }
  }

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ]
}

/* ─── Station marker ─── */

function StationMarker({
  lat,
  lng,
  name,
  type,
  color,
}: Readonly<{
  lat: number
  lng: number
  name: string
  type: 'origin' | 'destination' | 'intermediate' | 'transfer'
  color?: string
}>) {
  const [showTooltip, setShowTooltip] = useState(false)

  let Icon = TrainFront
  let iconClass = 'text-muted-foreground'
  let size = 'h-5 w-5'
  let bgClass: string

  if (type === 'origin') {
    Icon = Train
    iconClass = 'text-emerald-500'
    size = 'h-6 w-6'
    bgClass = 'bg-background shadow-lg ring-2 ring-emerald-500/30'
  } else if (type === 'destination') {
    Icon = Milestone
    iconClass = 'text-amber-500'
    size = 'h-6 w-6'
    bgClass = 'bg-background shadow-lg ring-2 ring-amber-500/30'
  } else if (type === 'transfer') {
    Icon = Footprints
    iconClass = 'text-amber-500'
    bgClass = 'bg-background shadow-md ring-1 ring-amber-500/20'
  } else {
    bgClass = 'bg-background shadow-sm ring-1 ring-border'
  }

  return (
    <Marker longitude={lng} latitude={lat} anchor="center">
      <button
        type="button"
        className="relative flex flex-col items-center outline-none"
        onClick={(e) => {
          e.stopPropagation()
          setShowTooltip((v) => !v)
        }}
      >
        {/* Tooltip above */}
        {showTooltip && (
          <div className="bg-popover text-popover-foreground pointer-events-none absolute -top-9 z-20 rounded-md border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap shadow-lg">
            {name}
          </div>
        )}

        {/* Icon container */}
        <div
          className={cn(
            'cursor-pointer rounded-full p-1 transition-transform hover:scale-110',
            bgClass,
          )}
          style={color ? { borderColor: color } : undefined}
        >
          <Icon className={cn(size, iconClass)} />
        </div>

        {/* Always-visible label for origin & destination */}
        {(type === 'origin' || type === 'destination') && (
          <span className="text-foreground bg-background/80 pointer-events-none mt-0.5 rounded px-1 text-[9px] font-semibold whitespace-nowrap">
            {name}
          </span>
        )}
      </button>
    </Marker>
  )
}

/* ─── Main component ─── */

interface TripMapViewProps {
  trip: Trip
}

export function TripMapView({ trip }: Readonly<TripMapViewProps>) {
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Detect dark mode
  const isDark = useMemo(() => {
    if (typeof globalThis.window === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  }, [])

  // Fetch journey data for each leg (gives all stop coordinates including passing)
  const journeyQueries = useQueries({
    queries: trip.legs.map((leg) => ({
      queryKey: ['trips', 'trip', 'journey', leg.journeyDetailRef],
      queryFn: () => getJourneyInformation({ id: leg.journeyDetailRef }),
      enabled: Boolean(leg.journeyDetailRef),
      staleTime: 5 * 60 * 1000,
    })),
  })

  // Fetch the Dutch railway track network (once, cached for 24h — ~800 KB, rarely changes)
  const { data: spoorkaart } = useQuery({
    queryKey: ['spoorkaart'],
    queryFn: fetchSpoorkaart,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  })

  // Build polyline segments per leg using Spoorkaart track geometry
  // Both traveled (solid) and untraveled (dashed) segments follow actual railway curves
  const legSegments = useMemo(() => {
    return trip.legs.map((leg, idx) => {
      const journeyData = journeyQueries[idx]?.data as
        | JourneyResponse
        | undefined
      return buildLegSegments(leg, journeyData?.payload?.stops, spoorkaart)
    })
  }, [trip.legs, journeyQueries, spoorkaart])

  // Compute bounds from all polyline coords
  const bounds = useMemo(
    () => getBoundsFromSegments(legSegments),
    [legSegments],
  )

  // Fit bounds on load and when trip changes
  const handleLoad = useCallback(() => {
    setMapLoaded(true)
  }, [])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return
    mapRef.current.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 40, right: 40 },
      duration: 600,
    })
  }, [mapLoaded, bounds])

  // Build station markers from journey data when available, otherwise from trip data
  const markers = useMemo(() => {
    const seen = new Set<string>()
    const result: Array<{
      lat: number
      lng: number
      name: string
      type: 'origin' | 'destination' | 'intermediate' | 'transfer'
      color?: string
    }> = []

    // Collect passenger's boarding/alighting uicCodes across all legs
    const tripOriginUic = trip.legs[0]?.origin.uicCode
    const tripDestinationUic =
      trip.legs[trip.legs.length - 1]?.destination.uicCode
    const transferUics = new Set<string>()
    for (let i = 0; i < trip.legs.length; i++) {
      // A transfer station is where one leg ends and the next begins
      if (i < trip.legs.length - 1) {
        transferUics.add(trip.legs[i].destination.uicCode)
      }
      if (i > 0) {
        transferUics.add(trip.legs[i].origin.uicCode)
      }
    }

    trip.legs.forEach((leg, legIndex) => {
      const journeyData = journeyQueries[legIndex]?.data as
        | JourneyResponse
        | undefined
      const journeyStops = journeyData?.payload?.stops

      if (journeyStops && journeyStops.length > 0) {
        // Use journey stops for accurate positions
        for (const jStop of journeyStops) {
          if (seen.has(jStop.stop.uicCode)) continue
          if (jStop.status === 'PASSING') continue

          seen.add(jStop.stop.uicCode)

          // Determine marker type based on the passenger's trip, not the train's journey
          let markerType:
            | 'origin'
            | 'destination'
            | 'intermediate'
            | 'transfer' = 'intermediate'
          if (jStop.stop.uicCode === tripOriginUic) {
            markerType = 'origin'
          } else if (jStop.stop.uicCode === tripDestinationUic) {
            markerType = 'destination'
          } else if (transferUics.has(jStop.stop.uicCode)) {
            markerType = 'transfer'
          }

          result.push({
            lat: jStop.stop.lat,
            lng: jStop.stop.lng,
            name: jStop.stop.name,
            type: markerType,
            color:
              markerType === 'intermediate'
                ? LEG_COLORS[legIndex % LEG_COLORS.length]
                : undefined,
          })
        }
      } else {
        // Fallback: use trip leg origin/destination/stops
        if (!seen.has(leg.origin.uicCode)) {
          seen.add(leg.origin.uicCode)
          let fallbackType: 'origin' | 'destination' | 'transfer' = 'transfer'
          if (leg.origin.uicCode === tripOriginUic) fallbackType = 'origin'
          else if (leg.origin.uicCode === tripDestinationUic)
            fallbackType = 'destination'
          result.push({
            lat: leg.origin.lat,
            lng: leg.origin.lng,
            name: leg.origin.name,
            type: fallbackType,
          })
        }

        if (leg.stops) {
          for (const stop of leg.stops) {
            if (
              stop.passing ||
              stop.uicCode === leg.origin.uicCode ||
              stop.uicCode === leg.destination.uicCode ||
              seen.has(stop.uicCode)
            )
              continue
            seen.add(stop.uicCode)
            result.push({
              lat: stop.lat,
              lng: stop.lng,
              name: stop.name,
              type: 'intermediate',
              color: LEG_COLORS[legIndex % LEG_COLORS.length],
            })
          }
        }

        if (!seen.has(leg.destination.uicCode)) {
          seen.add(leg.destination.uicCode)
          let fallbackType: 'origin' | 'destination' | 'transfer' = 'transfer'
          if (leg.destination.uicCode === tripDestinationUic)
            fallbackType = 'destination'
          else if (leg.destination.uicCode === tripOriginUic)
            fallbackType = 'origin'
          result.push({
            lat: leg.destination.lat,
            lng: leg.destination.lng,
            name: leg.destination.name,
            type: fallbackType,
          })
        }
      }
    })

    return result
  }, [trip.legs, journeyQueries])

  if (!trip.legs || trip.legs.length === 0) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        No route data available.
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      {/* Loading overlay */}
      {!mapLoaded && (
        <div className="bg-background absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-full space-y-3 px-8">
            <Skeleton className="h-full min-h-50 w-full rounded-lg" />
          </div>
        </div>
      )}

      <Map
        ref={(r) => {
          if (r) mapRef.current = r.getMap()
        }}
        mapLib={maplibregl}
        mapStyle={isDark ? DARK_MAP_STYLE : MAP_STYLE}
        initialViewState={{
          longitude: (bounds[0][0] + bounds[1][0]) / 2,
          latitude: (bounds[0][1] + bounds[1][1]) / 2,
          zoom: 8,
        }}
        style={{ width: '100%', height: '100%' }}
        onLoad={handleLoad}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {/* Route polylines per leg — solid for traveled, dashed for rest of train route */}
        {legSegments.map((segments, legIdx) =>
          segments.map((seg, segIdx) => {
            const id = `route-${trip.legs[legIdx].idx}-${segIdx}`
            return (
              <Source
                key={id}
                id={id}
                type="geojson"
                data={coordsToGeoJSON(seg.coords)}
              >
                <Layer
                  id={`${id}-line`}
                  type="line"
                  paint={{
                    'line-color': LEG_COLORS[legIdx % LEG_COLORS.length],
                    'line-width': seg.traveled ? 4 : 3,
                    'line-opacity': seg.traveled ? 0.85 : 0.35,
                    ...(seg.traveled ? {} : { 'line-dasharray': [2, 2] }),
                  }}
                  layout={{
                    'line-join': 'round',
                    'line-cap': 'round',
                  }}
                />
              </Source>
            )
          }),
        )}

        {/* Station markers */}
        {markers.map((m) => (
          <StationMarker
            key={`${m.lat}-${m.lng}`}
            lat={m.lat}
            lng={m.lng}
            name={m.name}
            type={m.type}
            color={m.color}
          />
        ))}
      </Map>

      {/* Leg color legend */}
      {trip.legs.length > 1 && (
        <div className="bg-background/90 absolute bottom-3 left-3 z-10 space-y-1 rounded-lg border p-2 backdrop-blur-sm">
          {trip.legs.map((leg, idx) => (
            <div key={leg.idx} className="flex items-center gap-2 text-[11px]">
              <div
                className="h-2 w-4 rounded-full"
                style={{ backgroundColor: LEG_COLORS[idx % LEG_COLORS.length] }}
              />
              <span className="text-muted-foreground">
                {leg.product.displayName}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
