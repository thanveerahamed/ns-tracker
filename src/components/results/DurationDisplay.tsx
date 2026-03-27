import { Clock } from 'lucide-react'
import type { Trip } from '@/types/trip.ts'
import { extendedDayjs } from '@/utils/date.ts'
import { cn } from '@/lib/utils.ts'

export function DurationDisplay({ trip }: { trip: Trip }) {
  const hasDelay =
    trip.actualDurationInMinutes &&
    trip.actualDurationInMinutes !== trip.plannedDurationInMinutes

  const formatDuration = (mins: number) =>
    extendedDayjs.duration(mins, 'minutes').format('H[h] m[m]')

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Clock className="text-muted-foreground h-3.5 w-3.5" />
      <div className="flex items-baseline gap-1">
        {hasDelay && (
          <span className="text-destructive font-medium">
            {formatDuration(trip.actualDurationInMinutes)}
          </span>
        )}
        <span
          className={cn(
            'font-medium',
            hasDelay
              ? 'text-muted-foreground text-[10px] line-through'
              : 'text-foreground',
          )}
        >
          {formatDuration(trip.plannedDurationInMinutes)}
        </span>
      </div>
    </div>
  )
}
