import dayjs from 'dayjs'
import type { Trip } from '@/types/trip.ts'
import { cn } from '@/lib/utils.ts'

export function TripStartAndEndTime({ trip }: { trip: Trip }) {
  if (!trip.legs || trip.legs.length === 0) return null

  const firstLeg = trip.legs[0]
  const lastLeg = trip.legs[trip.legs.length - 1]

  const plannedStart = dayjs(firstLeg.origin.plannedDateTime)
  const actualStart = firstLeg.origin.actualDateTime
    ? dayjs(firstLeg.origin.actualDateTime)
    : null

  const plannedEnd = dayjs(lastLeg.destination.plannedDateTime)
  const actualEnd = lastLeg.destination.actualDateTime
    ? dayjs(lastLeg.destination.actualDateTime)
    : null

  const startDelayed =
    actualStart && !actualStart.isSame(plannedStart, 'minute')
  const endDelayed = actualEnd && !actualEnd.isSame(plannedEnd, 'minute')

  // Check if arrival is on a different day than departure
  const departureDate = (actualStart ?? plannedStart).startOf('day')
  const arrivalDate = (actualEnd ?? plannedEnd).startOf('day')
  const dayDiff = arrivalDate.diff(departureDate, 'day')

  return (
    <div className="flex items-center gap-1.5 text-sm font-semibold tabular-nums">
      {/* Start time */}
      <span className="flex items-baseline gap-1">
        {startDelayed && (
          <span className="text-destructive">
            {actualStart.format('HH:mm')}
          </span>
        )}
        <span
          className={cn(
            startDelayed && 'text-muted-foreground text-xs line-through',
          )}
        >
          {plannedStart.format('HH:mm')}
        </span>
      </span>

      <span className="text-muted-foreground">—</span>

      {/* End time */}
      <span className="flex items-baseline gap-1">
        {endDelayed && (
          <span className="text-destructive">{actualEnd.format('HH:mm')}</span>
        )}
        <span
          className={cn(
            endDelayed && 'text-muted-foreground text-xs line-through',
          )}
        >
          {plannedEnd.format('HH:mm')}
        </span>
        {dayDiff > 0 && (
          <sup className="-ml-0.5 text-[9px] font-medium text-amber-500">
            +{dayDiff}
          </sup>
        )}
      </span>
    </div>
  )
}
