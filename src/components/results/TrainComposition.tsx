import {
  Wifi,
  Plug,
  Bike,
  Accessibility,
  VolumeOff,
  Crown,
  Armchair,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge.tsx'
import { cn } from '@/lib/utils.ts'
import type { Stock } from '@/types/journey.ts'

/* ─── Facility icon mapping ─── */

const FACILITY_CONFIG: Record<
  string,
  { icon: typeof Wifi; label: string } | undefined
> = {
  TOILET: { icon: Armchair, label: 'Toilet' },
  WIFI: { icon: Wifi, label: 'WiFi' },
  FIRST_CLASS: { icon: Crown, label: '1st class' },
  QUIET: { icon: VolumeOff, label: 'Quiet zone' },
  POWER_SOCKETS: { icon: Plug, label: 'Power' },
  BICYCLE: { icon: Bike, label: 'Bicycle' },
  WHEELCHAIR_ACCESSIBLE: { icon: Accessibility, label: 'Accessible' },
}

/* ─── Component ─── */

interface TrainCompositionProps {
  readonly stock: Stock
  readonly className?: string
}

export function TrainComposition({ stock, className }: TrainCompositionProps) {
  // Aggregate all unique facilities across train parts
  const allFacilities = [
    ...new Set(stock.trainParts.flatMap((p) => p.facilities)),
  ]

  // Collect all train part images
  const images = stock.trainParts
    .map((p) => p.image?.uri)
    .filter((uri): uri is string => !!uri)

  return (
    <div className={cn('space-y-2', className)}>
      {/* Train images — horizontal scroll composition */}
      {images.length > 0 && (
        <div className="relative">
          <div className="scrollbar-none bg-muted/50 flex items-end gap-px overflow-x-auto overscroll-x-contain scroll-smooth rounded-lg px-2 py-2">
            {images.map((uri, i) => (
              <img
                key={`${uri}-${i}`}
                src={uri}
                alt=""
                className="h-10 shrink-0 object-contain sm:h-12"
                loading="lazy"
              />
            ))}
          </div>
          {/* Right fade hint */}
          <div className="from-muted/50 pointer-events-none absolute top-0 right-0 bottom-0 w-6 rounded-r-lg bg-linear-to-l to-transparent" />
        </div>
      )}

      {/* Train metadata + facilities */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Train type badge */}
        <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
          {stock.trainType}
        </Badge>

        {/* Coaches */}
        <span className="text-muted-foreground text-[10px]">
          {stock.numberOfParts}{' '}
          {stock.numberOfParts === 1 ? 'coach' : 'coaches'}
        </span>

        {/* Seats */}
        {stock.numberOfSeats > 0 && (
          <span className="text-muted-foreground text-[10px]">
            · {stock.numberOfSeats} seats
          </span>
        )}

        {/* Significant change warning */}
        {stock.hasSignificantChange && (
          <Badge
            variant="outline"
            className="gap-0.5 border-amber-500/40 text-[10px] text-amber-600 dark:text-amber-400"
          >
            Composition change
          </Badge>
        )}
      </div>

      {/* Facility icons */}
      {allFacilities.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {allFacilities.map((facility) => {
            const config = FACILITY_CONFIG[facility]
            if (!config) return null
            const FacilityIcon = config.icon
            return (
              <Badge
                key={facility}
                variant="outline"
                className="gap-1 text-[10px] font-normal"
              >
                <FacilityIcon className="h-3 w-3" />
                {config.label}
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
