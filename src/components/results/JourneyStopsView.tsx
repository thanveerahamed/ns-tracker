import { useMemo } from 'react'
import dayjs from 'dayjs'
import {
  Train,
  Milestone,
  TrainFront,
  MapPin,
  CircleX,
  Clock,
  ArrowRight,
  Footprints,
} from 'lucide-react'
import { useQueries } from '@tanstack/react-query'

import { Badge } from '@/components/ui/badge.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { CrowdForecast } from '@/components/results/CrowdForecast.tsx'
import { cn } from '@/lib/utils.ts'
import { getJourneyInformation } from '@/services/trip.ts'
import type { Trip, Leg } from '@/types/trip.ts'
import type { JourneyResponse, JourneyStop } from '@/types/journey.ts'

/* ─── Constants ─── */

const LEG_COLORS = [
  {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-500',
    dot: 'bg-blue-500',
  },
  {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-500',
    dot: 'bg-violet-500',
  },
  {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-500',
    dot: 'bg-cyan-500',
  },
  {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-500',
    dot: 'bg-amber-500',
  },
  {
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    text: 'text-pink-500',
    dot: 'bg-pink-500',
  },
  {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-500',
    dot: 'bg-emerald-500',
  },
]

/* ─── Helpers ─── */

function formatTime(iso?: string) {
  return iso ? dayjs(iso).format('HH:mm') : '—'
}

/* ─── Stop Row ─── */

type StopRole = 'board' | 'alight' | 'traveled' | 'before' | 'after'

function getStopIcon(role: StopRole, cancelled: boolean, colorText: string) {
  if (cancelled) return { Icon: CircleX, cls: 'text-destructive' }
  if (role === 'board') return { Icon: Train, cls: 'text-emerald-500' }
  if (role === 'alight') return { Icon: Milestone, cls: 'text-amber-500' }
  if (role === 'traveled') return { Icon: TrainFront, cls: colorText }
  return { Icon: MapPin, cls: 'text-muted-foreground/40' }
}

function StopRow({
  stop,
  role,
  legColorIdx,
}: Readonly<{
  stop: JourneyStop
  role: StopRole
  legColorIdx: number
}>) {
  const colors = LEG_COLORS[legColorIdx % LEG_COLORS.length]
  const isTraveled =
    role === 'board' || role === 'alight' || role === 'traveled'
  const isOutside = role === 'before' || role === 'after'

  const arrival = stop.arrivals?.[0]
  const departure = stop.departures?.[0]

  // Show the most relevant single time: departure for board, arrival for alight, arrival otherwise
  const time = role === 'board' ? departure : (arrival ?? departure)
  const delay = time?.delayInSeconds ? Math.round(time.delayInSeconds / 60) : 0
  const isCancelled = arrival?.cancelled || departure?.cancelled
  const track = departure?.actualTrack || arrival?.actualTrack
  const crowd = arrival?.crowdForecast || departure?.crowdForecast

  const { Icon, cls } = getStopIcon(role, !!isCancelled, colors.text)

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5',
        isTraveled && `${colors.bg} border-l-2 ${colors.border}`,
        isOutside && 'opacity-45',
        isCancelled && 'opacity-60',
      )}
    >
      {/* Icon */}
      <Icon className={cn('h-3.5 w-3.5 shrink-0', cls)} />

      {/* Name */}
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-xs',
          isTraveled ? 'font-medium' : 'text-muted-foreground',
          isCancelled && 'line-through',
        )}
      >
        {stop.stop.name}
      </span>

      {/* Time */}
      {time && (
        <span className="shrink-0 text-[11px] tabular-nums">
          {delay > 0 && (
            <span className="text-destructive mr-1">
              {formatTime(time.actualTime)}
            </span>
          )}
          <span
            className={cn(delay > 0 && 'text-muted-foreground/50 line-through')}
          >
            {formatTime(time.plannedTime)}
          </span>
        </span>
      )}

      {/* Track */}
      {track && isTraveled && (
        <Badge
          variant="secondary"
          className="shrink-0 px-1 py-0 font-mono text-[9px]"
        >
          P.{track}
        </Badge>
      )}

      {/* Crowd */}
      {isTraveled && crowd && crowd !== 'UNKNOWN' && (
        <CrowdForecast crowdForecast={crowd} />
      )}
    </div>
  )
}

/* ─── Leg Stops List ─── */

function LegStopsList({
  leg,
  journeyStops,
  legIndex,
  isLoading,
}: Readonly<{
  leg: Leg
  journeyStops: JourneyStop[] | undefined
  legIndex: number
  isLoading: boolean
}>) {
  const colors = LEG_COLORS[legIndex % LEG_COLORS.length]

  // Only keep STOP / ORIGIN / DESTINATION — skip PASSING
  const classifiedStops = useMemo(() => {
    if (!journeyStops || journeyStops.length === 0) return []

    const visible = journeyStops.filter(
      (s) =>
        s.status === 'STOP' ||
        s.status === 'ORIGIN' ||
        s.status === 'DESTINATION',
    )

    const boardUic = leg.origin.uicCode
    const alightUic = leg.destination.uicCode
    const boardIdx = visible.findIndex((s) => s.stop.uicCode === boardUic)
    const alightIdx = visible.findIndex((s) => s.stop.uicCode === alightUic)

    return visible.map((stop, idx) => {
      let role: StopRole
      if (idx === boardIdx) {
        role = 'board'
      } else if (idx === alightIdx) {
        role = 'alight'
      } else if (
        boardIdx !== -1 &&
        alightIdx !== -1 &&
        idx > boardIdx &&
        idx < alightIdx
      ) {
        role = 'traveled'
      } else if (boardIdx !== -1 && idx < boardIdx) {
        role = 'before'
      } else if (alightIdx !== -1 && idx > alightIdx) {
        role = 'after'
      } else {
        role = 'before'
      }
      return { stop, role }
    })
  }, [journeyStops, leg.origin.uicCode, leg.destination.uicCode])

  const content = isLoading ? (
    <div className="space-y-2 p-3">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-5 w-full" />
      ))}
    </div>
  ) : classifiedStops.length > 0 ? (
    <div>
      {classifiedStops.map(({ stop, role }) => (
        <StopRow key={stop.id} stop={stop} role={role} legColorIdx={legIndex} />
      ))}
    </div>
  ) : (
    <FallbackLegStops leg={leg} legIndex={legIndex} />
  )

  return (
    <div className="mb-3">
      {/* Leg header */}
      <div
        className={cn(
          'flex items-center gap-2 border-b px-3 py-2',
          leg.cancelled
            ? 'bg-destructive/10 border-b-destructive/30'
            : leg.partCancelled
              ? 'border-b-amber-500/30 bg-amber-500/10'
              : colors.bg,
        )}
      >
        <div
          className={cn(
            'h-2 w-2 shrink-0 rounded-full',
            leg.cancelled ? 'bg-destructive' : colors.dot,
          )}
        />
        <Badge
          variant="outline"
          className={cn(
            'shrink-0 gap-1 text-[10px] font-normal',
            leg.cancelled &&
              'border-destructive/40 text-destructive line-through',
          )}
        >
          <TrainFront className="h-3 w-3" />
          {leg.product.displayName}
        </Badge>
        {leg.cancelled && (
          <Badge variant="destructive" className="shrink-0 gap-0.5 text-[9px]">
            <CircleX className="h-2.5 w-2.5" />
            Cancelled
          </Badge>
        )}
        {!leg.cancelled && leg.partCancelled && (
          <Badge className="shrink-0 gap-0.5 bg-amber-500 text-[9px] text-white hover:bg-amber-600">
            Disrupted
          </Badge>
        )}
        {leg.direction && !leg.cancelled && (
          <span className="text-muted-foreground flex min-w-0 items-center gap-0.5 truncate text-[10px]">
            <ArrowRight className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate">{leg.direction}</span>
          </span>
        )}
        {leg.plannedDurationInMinutes > 0 && (
          <span className="text-muted-foreground ml-auto flex shrink-0 items-center gap-1 text-[10px]">
            <Clock className="h-3 w-3" />
            {leg.plannedDurationInMinutes}m
          </span>
        )}
      </div>

      {content}
    </div>
  )
}

/* ─── Fallback: trip-level stops when journey data unavailable ─── */

function FallbackLegStops({
  leg,
  legIndex,
}: Readonly<{ leg: Leg; legIndex: number }>) {
  const colors = LEG_COLORS[legIndex % LEG_COLORS.length]
  const stops = (leg.stops ?? []).filter((s) => !s.passing)
  const originUic = leg.origin.uicCode
  const destUic = leg.destination.uicCode
  const originIdx = stops.findIndex((s) => s.uicCode === originUic)
  const destIdx = stops.findIndex((s) => s.uicCode === destUic)

  return (
    <div>
      {stops.map((stop, idx) => {
        const isBoard = idx === originIdx
        const isAlight = idx === destIdx
        const isTraveled =
          isBoard ||
          isAlight ||
          (originIdx !== -1 &&
            destIdx !== -1 &&
            idx > originIdx &&
            idx < destIdx)
        const isOutside = !isTraveled

        const { Icon, cls } = getStopIcon(
          isBoard
            ? 'board'
            : isAlight
              ? 'alight'
              : isTraveled
                ? 'traveled'
                : 'before',
          stop.cancelled,
          colors.text,
        )

        const delay =
          stop.actualArrivalDateTime && stop.plannedArrivalDateTime
            ? dayjs(stop.actualArrivalDateTime).diff(
                dayjs(stop.plannedArrivalDateTime),
                'minute',
              )
            : 0

        return (
          <div
            key={stop.uicCode}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5',
              isTraveled && `${colors.bg} border-l-2 ${colors.border}`,
              isOutside && 'opacity-45',
            )}
          >
            <Icon className={cn('h-3.5 w-3.5 shrink-0', cls)} />
            <span
              className={cn(
                'min-w-0 flex-1 truncate text-xs',
                isTraveled ? 'font-medium' : 'text-muted-foreground',
                stop.cancelled && 'line-through',
              )}
            >
              {stop.name}
            </span>
            {stop.plannedArrivalDateTime && (
              <span className="shrink-0 text-[11px] tabular-nums">
                {delay > 0 && (
                  <span className="text-destructive mr-1">
                    {formatTime(stop.actualArrivalDateTime)}
                  </span>
                )}
                <span
                  className={cn(
                    delay > 0 && 'text-muted-foreground/50 line-through',
                  )}
                >
                  {formatTime(stop.plannedArrivalDateTime)}
                </span>
              </span>
            )}
            {(stop.actualArrivalTrack || stop.plannedArrivalTrack) &&
              isTraveled && (
                <Badge
                  variant="secondary"
                  className="shrink-0 px-1 py-0 font-mono text-[9px]"
                >
                  P.{stop.actualArrivalTrack || stop.plannedArrivalTrack}
                </Badge>
              )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Transfer ─── */

function TransferSeparator({
  stationName,
  minutes,
}: Readonly<{ stationName: string; minutes: number }>) {
  return (
    <div className="flex items-center gap-2 border-y border-amber-500/20 bg-amber-500/5 px-3 py-2">
      <Footprints className="h-3.5 w-3.5 shrink-0 text-amber-500" />
      <span className="truncate text-[11px] font-medium text-amber-600 dark:text-amber-400">
        Transfer at {stationName}
      </span>
      <Badge
        variant="outline"
        className="ml-auto shrink-0 gap-1 border-amber-500/30 text-[10px] text-amber-600 dark:text-amber-400"
      >
        <Clock className="h-2.5 w-2.5" />
        {minutes}m
      </Badge>
    </div>
  )
}

/* ─── Main ─── */

interface JourneyStopsViewProps {
  trip: Trip
}

export function JourneyStopsView({ trip }: Readonly<JourneyStopsViewProps>) {
  const journeyQueries = useQueries({
    queries: trip.legs.map((leg) => ({
      queryKey: ['trips', 'trip', 'journey', leg.journeyDetailRef],
      queryFn: () => getJourneyInformation({ id: leg.journeyDetailRef }),
      enabled: Boolean(leg.journeyDetailRef),
      staleTime: 5 * 60 * 1000,
    })),
  })

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="py-2">
        {trip.legs.map((leg, legIndex) => {
          const journeyData = journeyQueries[legIndex]?.data as
            | JourneyResponse
            | undefined
          const isLoading = journeyQueries[legIndex]?.isLoading ?? false

          const prevLeg = legIndex > 0 ? trip.legs[legIndex - 1] : null
          let waitMins = 0
          if (prevLeg) {
            const arr =
              prevLeg.destination.actualDateTime ??
              prevLeg.destination.plannedDateTime
            const dep = leg.origin.actualDateTime ?? leg.origin.plannedDateTime
            waitMins = dayjs(dep).diff(dayjs(arr), 'minute')
          }

          return (
            <div key={leg.idx}>
              {prevLeg && waitMins > 0 && (
                <TransferSeparator
                  stationName={leg.origin.name}
                  minutes={waitMins}
                />
              )}
              <LegStopsList
                leg={leg}
                journeyStops={journeyData?.payload?.stops}
                legIndex={legIndex}
                isLoading={isLoading}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
