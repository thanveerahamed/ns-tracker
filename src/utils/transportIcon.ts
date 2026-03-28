import {
  TrainFront,
  Bus,
  Footprints,
  Ship,
  TramFront,
  TrainFrontTunnel,
  type LucideIcon,
} from 'lucide-react'
import type { Leg } from '@/types/trip.ts'

export type TransportType =
  | 'TRAIN'
  | 'BUS'
  | 'WALK'
  | 'FERRY'
  | 'TRAM'
  | 'METRO'
  | 'UNKNOWN'

interface TransportInfo {
  icon: LucideIcon
  iconClass: string
  label: string
}

const transportMap: Record<TransportType, TransportInfo> = {
  TRAIN: { icon: TrainFront, iconClass: 'text-blue-500', label: 'Train' },
  BUS: {
    icon: Bus,
    iconClass: 'text-amber-600 dark:text-amber-400',
    label: 'Bus',
  },
  WALK: { icon: Footprints, iconClass: 'text-muted-foreground', label: 'Walk' },
  FERRY: { icon: Ship, iconClass: 'text-cyan-500', label: 'Ferry' },
  TRAM: { icon: TramFront, iconClass: 'text-emerald-500', label: 'Tram' },
  METRO: {
    icon: TrainFrontTunnel,
    iconClass: 'text-violet-500',
    label: 'Metro',
  },
  UNKNOWN: {
    icon: TrainFront,
    iconClass: 'text-muted-foreground',
    label: 'Transport',
  },
}

/** Resolve the transport type from a product or leg */
export function getTransportType(leg: Leg): TransportType {
  // Walk legs have travelType WALK and/or product.type WALK
  if (leg.travelType === 'WALK' || leg.product?.type === 'WALK') return 'WALK'

  const productType = leg.product?.type?.toUpperCase() ?? ''

  if (productType === 'BUS') return 'BUS'
  if (productType === 'FERRY') return 'FERRY'
  if (productType === 'TRAM') return 'TRAM'
  if (productType === 'METRO') return 'METRO'
  if (productType === 'TRAIN') return 'TRAIN'

  // Fallback: check categoryCode for bus-like types
  const catCode = leg.product?.categoryCode?.toUpperCase() ?? ''
  if (catCode === 'BSN' || catCode === 'BUS') return 'BUS'

  // If it's public transit, assume train
  if (leg.travelType === 'PUBLIC_TRANSIT') return 'TRAIN'

  return 'UNKNOWN'
}

/** Get icon and styling info for a transport type */
export function getTransportInfo(type: TransportType): TransportInfo {
  return transportMap[type] ?? transportMap.UNKNOWN
}

/** Get icon and styling info directly from a leg */
export function getLegTransportInfo(leg: Leg): TransportInfo {
  return getTransportInfo(getTransportType(leg))
}

/** Whether a leg is a walking segment */
export function isWalkLeg(leg: Leg): boolean {
  return getTransportType(leg) === 'WALK'
}

/** Whether a leg is a non-train public transit (bus, tram, metro, ferry) */
export function isNonTrainTransit(leg: Leg): boolean {
  const t = getTransportType(leg)
  return t === 'BUS' || t === 'TRAM' || t === 'METRO' || t === 'FERRY'
}

/** Whether a leg has a valid journey detail ref that can be queried */
export function hasTrainJourneyDetail(leg: Leg): boolean {
  if (!leg.journeyDetailRef) return false
  // BTM (Bus/Tram/Metro) journey details use a different API and format
  // Only TRAIN_XML type can be queried via getJourneyInformation
  const journeyDetails = leg.journeyDetail ?? []
  if (journeyDetails.length > 0) {
    return journeyDetails.some((jd) => jd.type === 'TRAIN_XML')
  }
  // If no journeyDetail array, check if it's a train
  return getTransportType(leg) === 'TRAIN'
}

/** Whether platform/track info is relevant for this leg type */
export function hasTrackInfo(leg: Leg): boolean {
  const t = getTransportType(leg)
  return t === 'TRAIN' || t === 'METRO' || t === 'TRAM'
}
