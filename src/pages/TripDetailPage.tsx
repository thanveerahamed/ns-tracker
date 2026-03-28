import { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  TrainFront,
  Train,
  Milestone,
  Clock,
  Footprints,
  AlertTriangle,
  Info,
  CircleX,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Route,
  Map as MapIcon,
  List,
  Navigation,
  Search,
  LogIn,
  ChevronDown,
  Bus,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { CrowdForecast } from '@/components/results/CrowdForecast.tsx'
import { StationCombobox } from '@/components/search/StationCombobox.tsx'
import {
  getTransportType,
  getTransportInfo,
  getLegTransportInfo,
  isWalkLeg,
  hasTrackInfo,
} from '@/utils/transportIcon.ts'

const TripMapView = lazy(() =>
  import('@/components/results/TripMapView.tsx').then((m) => ({
    default: m.TripMapView,
  })),
)
const JourneyStopsView = lazy(() =>
  import('@/components/results/JourneyStopsView.tsx').then((m) => ({
    default: m.JourneyStopsView,
  })),
)
import { useTrip, useTripsInformation } from '@/apis/trips.ts'
import { useAuth } from '@/contexts/AuthContext.tsx'
import { getPaletteColorFromNesProperties } from '@/utils/trips.ts'
import { extendedDayjs } from '@/utils/date.ts'
import { cn } from '@/lib/utils.ts'
import type { NSStation } from '@/types/station.ts'
import type { Trip, Leg, Stop, TripLocation } from '@/types/trip.ts'

/* ─── Helpers ─── */

function formatTime(iso?: string) {
  return iso ? dayjs(iso).format('HH:mm') : '—'
}

function delayMinutes(planned?: string, actual?: string): number | null {
  if (!planned || !actual) return null
  const diff = dayjs(actual).diff(dayjs(planned), 'minute')
  return diff === 0 ? null : diff
}

function formatDuration(minutes: number) {
  return extendedDayjs.duration(minutes, 'minutes').format('H[h] m[m]')
}

function waitMinutesBetween(prevLeg: Leg, nextLeg: Leg): number {
  const arrivalTime =
    prevLeg.destination.actualDateTime ?? prevLeg.destination.plannedDateTime
  const departureTime =
    nextLeg.origin.actualDateTime ?? nextLeg.origin.plannedDateTime
  return dayjs(departureTime).diff(dayjs(arrivalTime), 'minute')
}

/* ─── Sub-components ─── */

function TimeWithDelay({
  planned,
  actual,
  className,
}: Readonly<{
  planned?: string
  actual?: string
  className?: string
}>) {
  const delay = delayMinutes(planned, actual)
  return (
    <span className={cn('font-semibold tabular-nums', className)}>
      {delay !== null && (
        <span className="text-destructive mr-1">{formatTime(actual)}</span>
      )}
      <span
        className={cn(
          delay !== null && 'text-muted-foreground text-xs line-through',
        )}
      >
        {formatTime(planned)}
      </span>
    </span>
  )
}

function TrackBadge({
  planned,
  actual,
}: Readonly<{ planned?: string; actual?: string }>) {
  if (!planned && !actual) return null
  const changed = actual && planned && actual !== planned
  return (
    <Badge
      variant="secondary"
      className={cn(
        'font-mono text-xs tabular-nums',
        changed && 'border-destructive/50 text-destructive',
      )}
    >
      P.{actual ?? planned}
    </Badge>
  )
}

/* ─── Station node (icon on the timeline) ─── */

function StationNode({
  name,
  plannedTime,
  actualTime,
  plannedTrack,
  actualTrack,
  isOrigin,
  isFinal,
  cancelled,
  transportType,
  showTrack = true,
}: Readonly<{
  name: string
  plannedTime?: string
  actualTime?: string
  plannedTrack?: string
  actualTrack?: string
  isOrigin?: boolean
  isFinal?: boolean
  cancelled?: boolean
  transportType?: ReturnType<typeof getTransportType>
  showTrack?: boolean
}>) {
  let iconClass = 'text-muted-foreground'

  if (cancelled) {
    iconClass = 'text-destructive'
  } else if (isOrigin) {
    iconClass = 'text-emerald-500'
  } else if (isFinal) {
    iconClass = 'text-amber-500'
  }

  // Pick icon based on transport type
  let StationIcon = TrainFront
  if (cancelled) {
    StationIcon = CircleX
  } else if (isOrigin) {
    StationIcon = Train
  } else if (isFinal) {
    StationIcon = Milestone
  } else if (transportType === 'BUS') {
    StationIcon = Bus
  } else if (transportType === 'WALK') {
    StationIcon = Footprints
  } else if (transportType) {
    const info = getTransportInfo(transportType)
    StationIcon = info.icon
  }

  return (
    <div className="relative flex items-start gap-3">
      {/* Station icon */}
      <div className="relative z-10 flex w-5 shrink-0 justify-center pt-0.5">
        <StationIcon className={cn('h-5 w-5', iconClass)} />
      </div>

      {/* Content */}
      <div className="-mt-0.5 min-w-0 flex-1 pb-1">
        <div className="flex flex-wrap items-center gap-2">
          <TimeWithDelay planned={plannedTime} actual={actualTime} />
          {showTrack && (
            <TrackBadge planned={plannedTrack} actual={actualTrack} />
          )}
        </div>
        <p
          className={cn(
            'truncate text-sm font-medium',
            cancelled && 'text-muted-foreground line-through',
          )}
        >
          {name}
        </p>
      </div>
    </div>
  )
}

/* ─── Leg segment (train info between two station nodes) ─── */

function LegSegment({ leg }: Readonly<{ leg: Leg }>) {
  const transportInfo = getLegTransportInfo(leg)
  const TransportIcon = transportInfo.icon

  return (
    <div className="relative flex items-start gap-3 py-1.5">
      {/* Keeps alignment with the icon column */}
      <div className="w-5 shrink-0" />

      {/* Leg info */}
      <div className="flex-1 space-y-1.5">
        {/* Transport badge */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              'gap-1.5 text-xs font-normal',
              leg.cancelled &&
                'border-destructive/40 text-destructive line-through',
              leg.alternativeTransport &&
                !leg.cancelled &&
                'border-amber-500/40 text-amber-600 dark:text-amber-400',
            )}
          >
            <TransportIcon className="h-3.5 w-3.5" />
            {leg.product?.displayName ?? transportInfo.label}
          </Badge>

          {leg.cancelled && (
            <Badge variant="destructive" className="gap-1 text-xs">
              <CircleX className="h-3.5 w-3.5" />
              Cancelled
            </Badge>
          )}

          {!leg.cancelled && leg.partCancelled && (
            <Badge className="gap-1 bg-amber-500 text-xs text-white hover:bg-amber-600">
              <AlertTriangle className="h-3.5 w-3.5" />
              Disrupted
            </Badge>
          )}

          {leg.direction && !leg.cancelled && (
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <ArrowRight className="h-3.5 w-3.5" />
              {leg.direction}
            </span>
          )}

          {leg.crowdForecast && leg.crowdForecast !== 'UNKNOWN' && (
            <CrowdForecast crowdForecast={leg.crowdForecast} />
          )}
        </div>

        {/* Duration */}
        {leg.plannedDurationInMinutes > 0 && (
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <Clock className="h-3.5 w-3.5" />
            {formatDuration(leg.plannedDurationInMinutes)}
          </div>
        )}

        {/* Notes */}
        {leg.notes && leg.notes.length > 0 && (
          <div className="space-y-0.5">
            {leg.notes
              .filter((n) => n.isPresentationRequired)
              .map((note) => (
                <div
                  key={note.key}
                  className="text-muted-foreground flex items-start gap-1.5 text-xs"
                >
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
                  <span>{note.value}</span>
                </div>
              ))}
          </div>
        )}

        {/* Transfer messages */}
        {leg.transferMessages && leg.transferMessages.length > 0 && (
          <div className="space-y-0.5">
            {leg.transferMessages.map((msg) => (
              <div
                key={msg.message}
                className={cn(
                  'flex items-start gap-1.5 text-xs',
                  getPaletteColorFromNesProperties(msg.messageNesProperties),
                )}
              >
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{msg.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Leg-level messages */}
        {leg.messages && leg.messages.length > 0 && (
          <div className="space-y-0.5">
            {leg.messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex items-start gap-1.5 text-xs',
                  getPaletteColorFromNesProperties(msg.nesProperties),
                )}
              >
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{msg.head || msg.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Alternative transport info */}
        {leg.alternativeTransport && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Alternative transport
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Intermediate stops within a leg ─── */

function IntermediateStops({
  stops,
  originUicCode,
  destinationUicCode,
  showTrack = true,
}: Readonly<{
  stops: Stop[]
  originUicCode: string
  destinationUicCode: string
  showTrack?: boolean
}>) {
  const [expanded, setExpanded] = useState(false)

  // Filter to only stops between origin and destination (exclude them)
  const intermediateStops = useMemo(() => {
    const originIdx = stops.findIndex((s) => s.uicCode === originUicCode)
    const destIdx = stops.findIndex((s) => s.uicCode === destinationUicCode)
    if (originIdx === -1 || destIdx === -1) return []
    return stops.slice(originIdx + 1, destIdx).filter((s) => !s.passing)
  }, [stops, originUicCode, destinationUicCode])

  if (intermediateStops.length === 0) return null

  return (
    <div className="relative flex items-start gap-3 py-1">
      {/* Icon column spacer */}
      <div className="w-5 shrink-0" />

      <div className="flex-1">
        {/* Collapsible toggle */}
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 py-1 text-xs transition-colors"
          onClick={() => setExpanded((v) => !v)}
        >
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-200',
              expanded && 'rotate-180',
            )}
          />
          <span>
            {intermediateStops.length} stop
            {intermediateStops.length !== 1 && 's'}
          </span>
        </button>

        {/* Expanded stop list */}
        {expanded && (
          <div className="space-y-1 pt-0.5">
            {intermediateStops.map((stop) => {
              const arrDelay = delayMinutes(
                stop.plannedArrivalDateTime,
                stop.actualArrivalDateTime,
              )
              const trackChanged =
                stop.actualArrivalTrack &&
                stop.plannedArrivalTrack &&
                stop.actualArrivalTrack !== stop.plannedArrivalTrack

              return (
                <div
                  key={stop.uicCode}
                  className={cn(
                    'flex items-center gap-2 text-xs',
                    stop.cancelled && 'line-through opacity-50',
                  )}
                >
                  <MapPin className="text-muted-foreground/60 h-3 w-3 shrink-0" />
                  <span className="text-muted-foreground flex-1 truncate">
                    {stop.name}
                  </span>

                  {/* Arrival time */}
                  {stop.plannedArrivalDateTime && (
                    <span className="text-muted-foreground shrink-0 tabular-nums">
                      {arrDelay !== null && (
                        <span className="text-destructive mr-1">
                          {formatTime(stop.actualArrivalDateTime)}
                        </span>
                      )}
                      <span
                        className={cn(
                          arrDelay !== null &&
                            'text-muted-foreground/50 line-through',
                        )}
                      >
                        {formatTime(stop.plannedArrivalDateTime)}
                      </span>
                    </span>
                  )}

                  {/* Track */}
                  {showTrack &&
                    (stop.actualArrivalTrack || stop.plannedArrivalTrack) && (
                      <span
                        className={cn(
                          'text-muted-foreground shrink-0 text-xs tabular-nums',
                          trackChanged && 'text-destructive font-medium',
                        )}
                      >
                        P.{stop.actualArrivalTrack || stop.plannedArrivalTrack}
                      </span>
                    )}

                  {/* Cancelled marker */}
                  {stop.cancelled && (
                    <CircleX className="text-destructive h-3 w-3 shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Walk leg segment (compact inline) ─── */

function WalkLegBlock({
  leg,
  isFirstLeg,
  isLastLeg,
}: Readonly<{ leg: Leg; isFirstLeg: boolean; isLastLeg: boolean }>) {
  const distanceNote = leg.product?.notes
    ?.flat()
    ?.find((n) => n?.key === 'PRODUCT_DISTANCE')
  const distanceText =
    distanceNote?.value ?? `${leg.plannedDurationInMinutes} min walk`

  return (
    <div className="relative rounded-md">
      <div className="relative">
        {/* Vertical dashed line */}
        <div className="border-muted-foreground/30 absolute top-2.5 bottom-0 left-[9.5px] w-px border-l border-dashed" />

        {/* Origin */}
        <StationNode
          name={leg.origin.name}
          plannedTime={leg.origin.plannedDateTime}
          actualTime={leg.origin.actualDateTime}
          isOrigin={isFirstLeg}
          transportType="WALK"
          showTrack={false}
        />

        {/* Walk info */}
        <div className="relative flex items-start gap-3 py-1.5">
          <div className="w-5 shrink-0" />
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-muted-foreground/30 text-muted-foreground gap-1.5 text-xs font-normal"
            >
              <Footprints className="h-3.5 w-3.5" />
              {distanceText}
            </Badge>
          </div>
        </div>
      </div>

      {/* Destination */}
      <div className="relative">
        <div className="border-muted-foreground/30 absolute top-0 left-[9.5px] h-2.5 w-px border-l border-dashed" />
        <StationNode
          name={leg.destination.name}
          plannedTime={leg.destination.plannedDateTime}
          actualTime={leg.destination.actualDateTime}
          isFinal={isLastLeg}
          transportType="WALK"
          showTrack={false}
        />
      </div>
    </div>
  )
}

/* ─── Wait / Transfer block ─── */

function TransferBlock({
  minutes,
  stationName,
}: Readonly<{ minutes: number; stationName: string }>) {
  return (
    <div className="relative flex items-start gap-3 py-1.5">
      {/* Icon aligned with icon column */}
      <div className="relative z-10 flex w-5 shrink-0 justify-center">
        <Footprints className="h-5 w-5 text-amber-500" />
      </div>

      {/* Transfer info */}
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
            Transfer at {stationName}
          </span>
          <Badge
            variant="outline"
            className="gap-1 border-amber-500/30 text-xs text-amber-600 dark:text-amber-400"
          >
            <Clock className="h-3 w-3" />
            {minutes} min
          </Badge>
        </div>
      </div>
    </div>
  )
}

/* ─── Connecting search (inline) ─── */

type ConnectingMode = 'to-origin' | 'from-destination'

interface ConnectingSearchState {
  mode: ConnectingMode
  /** The known station (trip origin or destination) */
  fixedStation: TripLocation
  /** The station the user picks */
  pickedStation?: NSStation
}

function ConnectingSearchPanel({
  state,
  onSelectTrip,
  onBack,
}: Readonly<{
  state: ConnectingSearchState
  onSelectTrip: (trip: Trip) => void
  onBack: () => void
}>) {
  const [picked, setPicked] = useState<NSStation | undefined>(
    state.pickedStation,
  )

  const isToOrigin = state.mode === 'to-origin'

  // Auto-search when station is picked
  const searchParams = useMemo(() => {
    if (!picked) return {}
    const fixedUic = state.fixedStation.uicCode

    if (isToOrigin) {
      return {
        originUicCode: picked.UICCode,
        destinationUicCode: fixedUic,
        dateTime: dayjs(
          state.fixedStation.actualDateTime ??
            state.fixedStation.plannedDateTime,
        ),
        searchForArrival: true,
      }
    }
    return {
      originUicCode: fixedUic,
      destinationUicCode: picked.UICCode,
      dateTime: dayjs(
        state.fixedStation.actualDateTime ?? state.fixedStation.plannedDateTime,
      ),
    }
  }, [picked, state.fixedStation, isToOrigin])

  const { data, isLoading } = useTripsInformation(searchParams)

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Search header */}
      <div className="space-y-2 border-b px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {isToOrigin ? 'Journey to' : 'Journey from'}{' '}
            <span className="text-primary">{state.fixedStation.name}</span>
          </span>
        </div>

        {/* Fixed station shown as badge, editable station as combobox */}
        <div className="space-y-1.5">
          {isToOrigin ? (
            <>
              <StationCombobox
                value={picked}
                onChange={setPicked}
                placeholder="From where?"
                label="From"
              />
              <div className="text-muted-foreground flex items-center gap-2 px-1 text-xs">
                <ArrowRight className="h-3 w-3" />
                <span>{state.fixedStation.name}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  Arrive by{' '}
                  {formatTime(
                    state.fixedStation.actualDateTime ??
                      state.fixedStation.plannedDateTime,
                  )}
                </Badge>
              </div>
            </>
          ) : (
            <>
              <div className="text-muted-foreground flex items-center gap-2 px-1 text-xs">
                <span>{state.fixedStation.name}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  Depart after{' '}
                  {formatTime(
                    state.fixedStation.actualDateTime ??
                      state.fixedStation.plannedDateTime,
                  )}
                </Badge>
              </div>
              <StationCombobox
                value={picked}
                onChange={setPicked}
                placeholder="To where?"
                label="To"
              />
            </>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {!picked && (
          <div className="text-muted-foreground flex flex-col items-center gap-2 py-12">
            <Search className="h-8 w-8" />
            <p className="text-sm">Select a station to search</p>
          </div>
        )}

        {picked && isLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        )}

        {picked && data && data.trips && (
          <div className="space-y-2 p-3">
            {data.trips.map((t) => {
              const tFirstLeg = t.legs[0]
              const tLastLeg = t.legs[t.legs.length - 1]
              const isCancelled = t.status === 'CANCELLED'

              return (
                <button
                  key={t.uid}
                  type="button"
                  className={cn(
                    'bg-card w-full rounded-lg border p-3 text-left transition-shadow hover:shadow-md',
                    isCancelled &&
                      'border-destructive/40 bg-destructive/5 opacity-70',
                  )}
                  onClick={() => onSelectTrip(t)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-sm font-semibold tabular-nums">
                      <span>
                        {formatTime(tFirstLeg?.origin.plannedDateTime)}
                      </span>
                      <ArrowRight className="text-muted-foreground h-3 w-3" />
                      <span>
                        {formatTime(tLastLeg?.destination.plannedDateTime)}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {formatDuration(
                        t.actualDurationInMinutes || t.plannedDurationInMinutes,
                      )}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {t.legs.map((leg) => {
                      const info = getLegTransportInfo(leg)
                      const LegIcon = info.icon
                      return (
                        <Badge
                          key={leg.idx}
                          variant="secondary"
                          className="gap-1 text-xs font-normal"
                        >
                          <LegIcon className="h-3 w-3" />
                          {leg.product?.displayName ?? info.label}
                        </Badge>
                      )
                    })}
                    {t.transfers > 0 && (
                      <span className="text-muted-foreground self-center text-xs">
                        · {t.transfers} transfer{t.transfers !== 1 && 's'}
                      </span>
                    )}
                    {isCancelled && (
                      <Badge variant="destructive" className="gap-0.5 text-xs">
                        <CircleX className="h-3 w-3" />
                        Cancelled
                      </Badge>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {picked && data && (!data.trips || data.trips.length === 0) && (
          <div className="text-muted-foreground flex flex-col items-center gap-2 py-12">
            <p className="text-sm">No trips found</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Main page component ─── */

interface TripDetailPageProps {
  /** When provided, uses this trip directly instead of reading from route state */
  trip?: Trip | null
  /** When provided, calls this instead of navigate(-1) to go back */
  onClose?: () => void
}

export function TripDetailPage({
  trip: propTrip,
  onClose,
}: TripDetailPageProps = {}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // Trip passed via props (dialog mode), router state, or refetch via ctxRecon
  const stateTrip =
    propTrip ?? (location.state as { trip?: Trip } | null)?.trip ?? null
  const ctxRecon =
    propTrip?.ctxRecon ?? searchParams.get('ctxRecon') ?? undefined

  // Fetch detailed trip data
  const { data: fetchedTrip, isLoading: isTripLoading } = useTrip({
    ctxRecon: ctxRecon,
  })

  // Stack of trips for forward/backward navigation
  const [tripStack, setTripStack] = useState<Trip[]>([])
  const [connectingSearch, setConnectingSearch] =
    useState<ConnectingSearchState | null>(null)
  const { user, signInWithGoogle } = useAuth()

  const [activeTab, setActiveTab] = useState<
    'timeline' | 'stops' | 'map' | 'connect'
  >('timeline')

  // Initialise trip stack from the source trip
  const sourceTrip = fetchedTrip ?? stateTrip
  const [prevSource, setPrevSource] = useState<Trip | null>(null)
  if (sourceTrip && sourceTrip !== prevSource) {
    setPrevSource(sourceTrip)
    setTripStack([sourceTrip])
    setConnectingSearch(null)
    setActiveTab('timeline')
  }

  // The current trip is the top of the stack
  const currentTrip =
    tripStack.length > 0 ? tripStack[tripStack.length - 1] : sourceTrip

  // Fetch detailed data for current trip in stack
  const { data: detailedTrip } = useTrip({
    ctxRecon:
      currentTrip && currentTrip !== sourceTrip
        ? currentTrip.ctxRecon
        : undefined,
  })

  // Use detailed data when available, fall back to the list-level trip
  const displayTrip =
    currentTrip === sourceTrip
      ? (fetchedTrip ?? stateTrip)
      : (detailedTrip ?? currentTrip)

  const firstLeg = displayTrip?.legs?.[0]
  const lastLeg =
    displayTrip?.legs?.[
      displayTrip?.legs?.length ? displayTrip.legs.length - 1 : 0
    ]

  const headerText = useMemo(() => {
    if (!firstLeg || !lastLeg) return ''
    return `${firstLeg.origin.name} → ${lastLeg.destination.name}`
  }, [firstLeg, lastLeg])

  const durationText = useMemo(() => {
    if (!displayTrip) return ''
    return formatDuration(
      displayTrip.actualDurationInMinutes ||
        displayTrip.plannedDurationInMinutes,
    )
  }, [displayTrip])

  const handleBack = useCallback(() => {
    if (connectingSearch) {
      setConnectingSearch(null)
    } else if (tripStack.length > 1) {
      setTripStack((s) => s.slice(0, -1))
      setActiveTab('timeline')
    } else if (onClose) {
      onClose()
    } else {
      navigate(-1)
    }
  }, [connectingSearch, tripStack.length, navigate, onClose])

  const handleSelectConnectingTrip = useCallback((t: Trip) => {
    setTripStack((s) => [...s, t])
    setConnectingSearch(null)
    setActiveTab('timeline')
  }, [])

  // Loading state when no trip data is available yet
  if (!displayTrip) {
    if (isTripLoading) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-3">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-32 rounded" />
          <div className="mt-4 w-full max-w-lg space-y-3 px-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </div>
      )
    }
    // No trip and not loading - go back
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground text-sm">Trip not found</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Go back
        </Button>
      </div>
    )
  }

  const isDialog = !!onClose

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden',
        isDialog
          ? 'bg-background h-full'
          : 'bg-background fixed inset-0 z-[60]',
      )}
    >
      {/* ── Header ── */}
      <div
        className={cn(
          'bg-background pt-safe z-50 flex shrink-0 items-start justify-between border-b px-4 py-3 sm:px-6',
          displayTrip.status === 'CANCELLED' &&
            'bg-destructive/5 border-b-destructive/30',
          displayTrip.status === 'DISRUPTION' &&
            'border-b-amber-500/30 bg-amber-500/5',
          displayTrip.status === 'ALTERNATIVE_TRANSPORT' &&
            'border-b-amber-500/30 bg-amber-500/5',
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {/* Back button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-semibold">{headerText}</h1>
              {displayTrip.status === 'CANCELLED' && (
                <Badge variant="destructive" className="shrink-0 gap-1 text-xs">
                  <CircleX className="h-3.5 w-3.5" />
                  Cancelled
                </Badge>
              )}
              {displayTrip.status === 'DISRUPTION' && (
                <Badge className="shrink-0 gap-1 bg-amber-500 text-xs text-white hover:bg-amber-600">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Disruption
                </Badge>
              )}
              {displayTrip.status === 'ALTERNATIVE_TRANSPORT' && (
                <Badge className="shrink-0 gap-1 bg-amber-500 text-xs text-white hover:bg-amber-600">
                  <Bus className="h-3.5 w-3.5" />
                  Alt. transport
                </Badge>
              )}
            </div>
            {!connectingSearch && (
              <p className="text-muted-foreground flex items-center gap-2 text-xs">
                <Clock className="h-3.5 w-3.5" />
                {durationText}
                <span className="text-muted-foreground">·</span>
                {displayTrip.transfers} transfer
                {displayTrip.transfers !== 1 && 's'}
                {displayTrip.crowdForecast !== 'UNKNOWN' && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <CrowdForecast crowdForecast={displayTrip.crowdForecast} />
                  </>
                )}
              </p>
            )}
            {connectingSearch && (
              <p className="text-muted-foreground text-xs">
                Finding connecting journey…
              </p>
            )}

            {/* Label items (supplements, deals, etc.) */}
            {!connectingSearch &&
              displayTrip.labelListItems &&
              displayTrip.labelListItems.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {displayTrip.labelListItems.map((item) => (
                    <Badge
                      key={item.label}
                      variant="outline"
                      className="text-xs"
                    >
                      {item.label}
                    </Badge>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* ── Connecting search mode ── */}
      {connectingSearch && (
        <ConnectingSearchPanel
          state={connectingSearch}
          onSelectTrip={handleSelectConnectingTrip}
          onBack={handleBack}
        />
      )}

      {/* ── Normal trip detail view ── */}
      {!connectingSearch && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* ── Trip-level message ── */}
          {displayTrip.primaryMessage && (
            <div className="border-b px-4 py-2 sm:px-6">
              <div
                className={cn(
                  'rounded-lg border px-3 py-2 text-xs',
                  getPaletteColorFromNesProperties(
                    displayTrip.primaryMessage.nesProperties,
                  ),
                  'bg-muted/50',
                )}
              >
                {displayTrip.primaryMessage.title}
              </div>
            </div>
          )}

          {/* ── Tab bar ── */}
          <div className="flex border-b px-4 sm:px-6">
            <button
              type="button"
              className={cn(
                'flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
                activeTab === 'timeline'
                  ? 'border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground border-transparent',
              )}
              onClick={() => setActiveTab('timeline')}
            >
              <Route className="h-4 w-4" />
              Timeline
            </button>
            <button
              type="button"
              className={cn(
                'flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
                activeTab === 'stops'
                  ? 'border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground border-transparent',
              )}
              onClick={() => setActiveTab('stops')}
            >
              <List className="h-4 w-4" />
              Stops
            </button>
            <button
              type="button"
              className={cn(
                'flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
                activeTab === 'map'
                  ? 'border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground border-transparent',
              )}
              onClick={() => setActiveTab('map')}
            >
              <MapIcon className="h-4 w-4" />
              Map
            </button>
            {tripStack.length <= 1 && (
              <button
                type="button"
                className={cn(
                  'flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
                  activeTab === 'connect'
                    ? 'border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground border-transparent',
                )}
                onClick={() => setActiveTab('connect')}
              >
                <Navigation className="h-4 w-4" />
                Connect
              </button>
            )}
          </div>

          {/* ── Timeline view ── */}
          {activeTab === 'timeline' && (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="px-4 py-5 sm:px-6">
                {displayTrip.legs.map((leg, legIndex) => {
                  const isFirstLeg = legIndex === 0
                  const isLastLeg = legIndex === displayTrip.legs.length - 1
                  const prevLeg =
                    legIndex > 0 ? displayTrip.legs[legIndex - 1] : null
                  const waitMins = prevLeg
                    ? waitMinutesBetween(prevLeg, leg)
                    : 0

                  const legTransportType = getTransportType(leg)
                  const showTrack = hasTrackInfo(leg)

                  // Walk legs are rendered as compact blocks
                  if (isWalkLeg(leg)) {
                    return (
                      <div key={leg.idx}>
                        {prevLeg && waitMins > 0 && (
                          <TransferBlock
                            minutes={waitMins}
                            stationName={leg.origin.name}
                          />
                        )}
                        <WalkLegBlock
                          leg={leg}
                          isFirstLeg={isFirstLeg}
                          isLastLeg={isLastLeg}
                        />
                      </div>
                    )
                  }

                  return (
                    <div key={leg.idx}>
                      {/* Transfer between legs */}
                      {prevLeg && waitMins > 0 && (
                        <TransferBlock
                          minutes={waitMins}
                          stationName={leg.origin.name}
                        />
                      )}

                      {/* Leg wrapper with disruption/cancellation styling */}
                      <div
                        className={cn(
                          'relative rounded-md',
                          leg.cancelled &&
                            'bg-destructive/5 ring-destructive/20 my-1 py-1 ring-1',
                          !leg.cancelled &&
                            leg.partCancelled &&
                            'my-1 bg-amber-500/5 py-1 ring-1 ring-amber-500/20',
                        )}
                      >
                        {/* Diagonal stripes for cancelled leg */}
                        {leg.cancelled && (
                          <div
                            className="pointer-events-none absolute inset-0 rounded-md opacity-[0.03]"
                            style={{
                              backgroundImage:
                                'repeating-linear-gradient(135deg, transparent, transparent 8px, currentColor 8px, currentColor 9px)',
                            }}
                          />
                        )}

                        {/* Origin → content (with vertical line) */}
                        <div className="relative">
                          {/* Vertical line — dashed for alternative transport */}
                          <div
                            className={cn(
                              'absolute top-2.5 bottom-0 left-[9.5px] w-px',
                              leg.cancelled
                                ? 'bg-destructive/30'
                                : leg.alternativeTransport
                                  ? 'border-l border-dashed border-amber-500/50 bg-transparent'
                                  : 'bg-border',
                            )}
                          />

                          {/* Departure station */}
                          <StationNode
                            name={leg.origin.name}
                            plannedTime={leg.origin.plannedDateTime}
                            actualTime={leg.origin.actualDateTime}
                            plannedTrack={leg.origin.plannedTrack}
                            actualTrack={leg.origin.actualTrack}
                            isOrigin={isFirstLeg}
                            cancelled={leg.cancelled}
                            transportType={legTransportType}
                            showTrack={showTrack}
                          />

                          {/* Leg info */}
                          <LegSegment leg={leg} />

                          {/* Intermediate stops */}
                          {leg.stops && leg.stops.length > 0 && (
                            <IntermediateStops
                              stops={leg.stops}
                              originUicCode={leg.origin.uicCode}
                              destinationUicCode={leg.destination.uicCode}
                              showTrack={showTrack}
                            />
                          )}
                        </div>

                        {/* Destination */}
                        <div className="relative">
                          {/* Short line from top to icon center */}
                          <div
                            className={cn(
                              'absolute top-0 left-[9.5px] h-2.5 w-px',
                              leg.cancelled
                                ? 'bg-destructive/30'
                                : leg.alternativeTransport
                                  ? 'border-l border-dashed border-amber-500/50 bg-transparent'
                                  : 'bg-border',
                            )}
                          />

                          <StationNode
                            name={leg.destination.name}
                            plannedTime={leg.destination.plannedDateTime}
                            actualTime={leg.destination.actualDateTime}
                            plannedTrack={leg.destination.plannedTrack}
                            actualTrack={leg.destination.actualTrack}
                            isFinal={isLastLeg}
                            cancelled={leg.cancelled}
                            transportType={legTransportType}
                            showTrack={showTrack}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Stops list view ── */}
          {activeTab === 'stops' && (
            <Suspense
              fallback={
                <div className="flex flex-1 items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </div>
              }
            >
              <JourneyStopsView trip={displayTrip} />
            </Suspense>
          )}

          {/* ── Map view ── */}
          {activeTab === 'map' &&
            (user ? (
              <div className="flex-1">
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center">
                      <Skeleton className="h-full w-full" />
                    </div>
                  }
                >
                  <TripMapView trip={displayTrip} />
                </Suspense>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <MapIcon className="text-muted-foreground/40 h-10 w-10" />
                <p className="text-muted-foreground text-sm">
                  Sign in to view the journey map
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={signInWithGoogle}
                >
                  <LogIn className="h-4 w-4" />
                  Sign in with Google
                </Button>
              </div>
            ))}

          {/* ── Connect tab ── */}
          {activeTab === 'connect' &&
            (user ? (
              <div className="flex flex-1 flex-col items-center gap-4 px-4 py-8 sm:px-6">
                <p className="text-muted-foreground text-sm">
                  Find a connecting journey to or from this trip
                </p>
                <div className="flex w-full max-w-sm flex-col gap-3">
                  <Button
                    variant="outline"
                    className="h-12 gap-2"
                    onClick={() =>
                      setConnectingSearch({
                        mode: 'to-origin',
                        fixedStation: firstLeg!.origin,
                      })
                    }
                  >
                    <Navigation className="h-4 w-4" />
                    Journey to {firstLeg?.origin.name}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 gap-2"
                    onClick={() =>
                      setConnectingSearch({
                        mode: 'from-destination',
                        fixedStation: lastLeg!.destination,
                      })
                    }
                  >
                    Journey from {lastLeg?.destination.name}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <Navigation className="text-muted-foreground/40 h-10 w-10" />
                <p className="text-muted-foreground text-sm">
                  Sign in to find connecting journeys
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={signInWithGoogle}
                >
                  <LogIn className="h-4 w-4" />
                  Sign in with Google
                </Button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
