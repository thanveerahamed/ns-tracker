import { TrainFront } from 'lucide-react'
import type { ComponentType } from 'react'

interface StationIconInfo {
  icon: ComponentType<{ className?: string }>
  className: string // tailwind color classes
  label: string
}

const stationTypeMap: Record<string, StationIconInfo> = {
  MEGA_STATION: {
    icon: TrainFront,
    className: 'text-amber-500',
    label: 'Major hub',
  },
  KNOOPPUNT_INTERCITY_STATION: {
    icon: TrainFront,
    className: 'text-blue-500',
    label: 'IC junction',
  },
  INTERCITY_STATION: {
    icon: TrainFront,
    className: 'text-sky-500',
    label: 'Intercity',
  },
  KNOOPPUNT_STOPTREIN_STATION: {
    icon: TrainFront,
    className: 'text-emerald-500',
    label: 'Local junction',
  },
  STOPTREIN_STATION: {
    icon: TrainFront,
    className: 'text-muted-foreground',
    label: 'Local stop',
  },
  FACULTATIEF_STATION: {
    icon: TrainFront,
    className: 'text-muted-foreground/60',
    label: 'Optional stop',
  },
}

const fallback: StationIconInfo = {
  icon: TrainFront,
  className: 'text-muted-foreground',
  label: 'Station',
}

export function getStationIconInfo(stationType?: string): StationIconInfo {
  if (!stationType) return fallback
  return stationTypeMap[stationType] ?? fallback
}
