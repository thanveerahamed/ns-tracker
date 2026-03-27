import { motion } from 'framer-motion'
import { TrainFront, CircleX } from 'lucide-react'
import { Badge } from '@/components/ui/badge.tsx'
import type { Trip } from '@/types/trip.ts'
import { TripStartAndEndTime } from '@/components/results/TripStartAndEndTime.tsx'
import { DurationDisplay } from '@/components/results/DurationDisplay.tsx'
import { CrowdForecast } from '@/components/results/CrowdForecast.tsx'
import { NumberOfConnectionsDisplay } from '@/components/results/NumberOfConnectionsDisplay.tsx'
import { getPaletteColorFromNesProperties } from '@/utils/trips.ts'
import { cn } from '@/lib/utils.ts'
import { useAuth } from '@/contexts/AuthContext.tsx'
import { FavouriteButton } from '@/components/results/FavouriteButton.tsx'

interface TripCardProps {
  readonly trip: Trip
  readonly viaUicCode?: string
  readonly isFavourite: boolean
  readonly onToggleFavourite: () => void
  readonly isNextDeparture?: boolean
  readonly index: number
  readonly onClick?: () => void
}

export function TripCard({
  trip,
  viaUicCode,
  isFavourite,
  onToggleFavourite,
  isNextDeparture,
  index,
  onClick,
}: Readonly<TripCardProps>) {
  const { user } = useAuth()

  const isChangeInVia =
    viaUicCode && trip.legs.some((leg) => leg.origin.uicCode === viaUicCode)

  const isCancelled = trip.status === 'CANCELLED'
  const isNotNormal = isCancelled || trip.status === 'DISRUPTION'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'bg-card relative overflow-hidden rounded-xl border p-3 transition-shadow sm:p-4',
        'cursor-pointer hover:shadow-md active:shadow-md',
        isCancelled &&
          'border-destructive/50 bg-destructive/5 dark:bg-destructive/10',
        isNotNormal && !isCancelled && 'border-amber-500/40 bg-amber-500/5',
        !isNotNormal &&
          isNextDeparture &&
          'border-emerald-500 bg-emerald-500/[0.03] shadow-[0_0_12px_-3px_rgba(16,185,129,0.4)] dark:shadow-[0_0_16px_-3px_rgba(16,185,129,0.3)]',
      )}
    >
      {/* Diagonal stripes for cancelled */}
      {isCancelled && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent, transparent 8px, currentColor 8px, currentColor 9px)',
          }}
        />
      )}

      <div className="flex gap-3">
        {/* Left: times + trains */}
        <div className="min-w-0 flex-1 space-y-2">
          {/* Cancelled inline label */}
          {isCancelled && (
            <div className="flex items-center gap-1.5">
              <CircleX className="text-destructive h-3.5 w-3.5" />
              <span className="text-destructive text-[11px] font-semibold tracking-wide uppercase">
                Cancelled
              </span>
            </div>
          )}

          <TripStartAndEndTime trip={trip} />

          {/* Train legs */}
          <div className="flex flex-wrap gap-1.5">
            {trip.legs.map((leg) => (
              <Badge
                key={leg.idx}
                variant="secondary"
                className={cn(
                  'gap-1 text-[11px] font-normal whitespace-nowrap',
                  leg.cancelled && 'line-through opacity-60',
                )}
              >
                <TrainFront className="h-3 w-3" />
                {leg.product.displayName}
                <span className="text-muted-foreground">
                  P.{leg.origin.actualTrack ?? leg.origin.plannedTrack}
                </span>
              </Badge>
            ))}
          </div>

          {/* Label items */}
          {trip.labelListItems && trip.labelListItems.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {trip.labelListItems.map((item) => (
                <Badge
                  key={item.label}
                  variant="outline"
                  className="text-[10px]"
                >
                  {item.label}
                </Badge>
              ))}
            </div>
          )}

          {/* Primary message */}
          {trip.primaryMessage && (
            <p
              className={cn(
                'text-xs leading-snug',
                getPaletteColorFromNesProperties(
                  trip.primaryMessage.nesProperties,
                ),
              )}
            >
              {trip.primaryMessage.title}
            </p>
          )}
        </div>

        {/* Right: metadata column */}
        <div className="flex shrink-0 flex-col items-end justify-between gap-1">
          <DurationDisplay trip={trip} />

          <NumberOfConnectionsDisplay connections={trip.legs.length - 1} />

          {trip.crowdForecast !== 'UNKNOWN' && (
            <CrowdForecast crowdForecast={trip.crowdForecast} />
          )}

          {isChangeInVia && (
            <Badge variant="outline" className="gap-1 text-[10px]">
              Via
            </Badge>
          )}

          {user && (
            <FavouriteButton
              isFavourite={isFavourite}
              onToggle={onToggleFavourite}
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}
