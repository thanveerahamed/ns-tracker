import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import { ArrowUpDown, Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { StationCombobox } from '@/components/search/StationCombobox.tsx'
import { DateTimePicker } from '@/components/search/DateTimePicker.tsx'
import { TripCard } from '@/components/results/TripCard.tsx'
import { LoadMoreButton } from '@/components/results/LoadMoreButton.tsx'
import {
  useTripsInformation,
  useTripsInformationWithContext,
} from '@/apis/trips.ts'
import type { NSStation } from '@/types/station.ts'
import type { Trip } from '@/types/trip.ts'
import { LoadMoreAction } from '@/types/trip.ts'
import { loadPanelState, savePanelState } from '@/services/splitViewPanel.ts'

/* ─── Component ─── */

interface SplitViewPanelProps {
  title: string
  panelId: string
  onRemove?: () => void
}

export function SplitViewPanel({
  title,
  panelId,
  onRemove,
}: SplitViewPanelProps) {
  const saved = loadPanelState(panelId)
  const navigate = useNavigate()

  const [origin, setOrigin] = useState<NSStation | undefined>(saved?.origin)
  const [destination, setDestination] = useState<NSStation | undefined>(
    saved?.destination,
  )
  const [dateTime, setDateTime] = useState<'now' | Date>(() => {
    if (!saved || saved.dateTime === 'now') return 'now'
    const d = new Date(saved.dateTime)
    return isNaN(d.getTime()) ? 'now' : d
  })
  const [isArrival, setIsArrival] = useState(saved?.isArrival ?? false)
  const [submitted, setSubmitted] = useState(false)

  // Snapshot of the dateTime used for the current search.
  // This prevents `dayjs()` from producing a new value on every render,
  // which would change the React-Query key and cause an infinite refetch loop.
  const [searchDateTime, setSearchDateTime] = useState<
    dayjs.Dayjs | undefined
  >()

  // Persist whenever fields change
  useEffect(() => {
    savePanelState(panelId, {
      origin,
      destination,
      dateTime: dateTime === 'now' ? 'now' : (dateTime as Date).toISOString(),
      isArrival,
    })
  }, [panelId, origin, destination, dateTime, isArrival])

  const { data, isLoading, error } = useTripsInformation({
    originUicCode: submitted ? origin?.UICCode : undefined,
    destinationUicCode: submitted ? destination?.UICCode : undefined,
    dateTime: searchDateTime,
    searchForArrival: isArrival || undefined,
  })

  // Earlier / Later pagination
  const loadMoreMutation = useTripsInformationWithContext()
  const [earlierTrips, setEarlierTrips] = useState<Trip[]>([])
  const [laterTrips, setLaterTrips] = useState<Trip[]>([])
  const [earliestContext, setEarliestContext] = useState<string | undefined>()
  const [latestContext, setLatestContext] = useState<string | undefined>()

  const backwardContext = earliestContext ?? data?.scrollRequestBackwardContext
  const forwardContext = latestContext ?? data?.scrollRequestForwardContext

  const allTrips = useMemo(() => {
    const base = data?.trips ?? []
    return [...earlierTrips, ...base, ...laterTrips]
  }, [data?.trips, earlierTrips, laterTrips])

  const handleLoadMore = useCallback(
    (action: LoadMoreAction) => {
      const context =
        action === LoadMoreAction.Earlier ? backwardContext : forwardContext
      if (!context || !origin || !destination || !searchDateTime) return

      loadMoreMutation.mutate(
        {
          props: {
            originUicCode: origin.UICCode,
            destinationUicCode: destination.UICCode,
            dateTime: searchDateTime,
            searchForArrival: isArrival || undefined,
            context,
          },
          action,
        },
        {
          onSuccess: ({ action: a, response }) => {
            if (a === LoadMoreAction.Earlier) {
              setEarlierTrips((prev) => [...response.trips, ...prev])
              setEarliestContext(response.scrollRequestBackwardContext)
            } else {
              setLaterTrips((prev) => [...prev, ...response.trips])
              setLatestContext(response.scrollRequestForwardContext)
            }
          },
        },
      )
    },
    [
      backwardContext,
      forwardContext,
      origin,
      destination,
      searchDateTime,
      isArrival,
      loadMoreMutation,
    ],
  )

  const swapStations = useCallback(() => {
    setOrigin((prev) => {
      const old = prev
      setDestination(old)
      return destination
    })
  }, [destination])

  const canSearch = !!origin && !!destination

  const resetSearch = useCallback(() => {
    setSubmitted(false)
    setSearchDateTime(undefined)
    setEarlierTrips([])
    setLaterTrips([])
    setEarliestContext(undefined)
    setLatestContext(undefined)
  }, [])

  const handleSearch = () => {
    if (canSearch) {
      // Freeze the datetime so the query key stays stable
      setSearchDateTime(dateTime === 'now' ? dayjs() : dayjs(dateTime))
      setEarlierTrips([])
      setLaterTrips([])
      setEarliestContext(undefined)
      setLatestContext(undefined)
      setSubmitted(true)
    }
  }

  // Find the next preferred trip
  const nextDepartureCtx = useMemo(() => {
    const now = dayjs()
    for (const trip of allTrips) {
      if (trip.status === 'CANCELLED') continue
      const firstLeg = trip.legs?.[0]
      if (!firstLeg) continue
      const departure = dayjs(
        firstLeg.origin.actualDateTime ?? firstLeg.origin.plannedDateTime,
      )
      if (departure.isAfter(now) || departure.isSame(now, 'minute')) {
        return trip.ctxRecon
      }
    }
    return undefined
  }, [allTrips])

  return (
    <div className="flex flex-col gap-3">
      {/* Panel title */}
      <div className="flex items-center justify-between">
        <h2 className="text-muted-foreground text-sm font-semibold">{title}</h2>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive h-6 w-6 rounded-full"
            onClick={onRemove}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Station selectors */}
      <div className="flex items-start gap-1.5">
        <div className="flex-1 space-y-1.5">
          <StationCombobox
            value={origin}
            onChange={(s) => {
              setOrigin(s)
              resetSearch()
            }}
            placeholder="From…"
          />
          <StationCombobox
            value={destination}
            onChange={(s) => {
              setDestination(s)
              resetSearch()
            }}
            placeholder="To…"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mt-2.5 h-8 w-8 shrink-0 rounded-full"
          onClick={swapStations}
        >
          <motion.div
            whileTap={{ rotate: 180 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <ArrowUpDown className="h-4 w-4" />
          </motion.div>
        </Button>
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-2">
        <DateTimePicker
          value={dateTime}
          onChange={(v) => {
            setDateTime(v)
            resetSearch()
          }}
        />

        <div className="bg-border h-4 w-px" />

        <div className="flex items-center gap-1.5">
          <Label className="text-muted-foreground cursor-pointer text-xs">
            Dep
          </Label>
          <Switch
            checked={isArrival}
            onCheckedChange={(v) => {
              setIsArrival(v)
              resetSearch()
            }}
            className="scale-75"
          />
          <Label className="text-muted-foreground cursor-pointer text-xs">
            Arr
          </Label>
        </div>
      </div>

      {/* Search button */}
      <Button
        type="button"
        className="w-full gap-2"
        disabled={!canSearch}
        onClick={handleSearch}
      >
        <Search className="h-4 w-4" />
        Search
      </Button>

      {/* Loading state */}
      {submitted && isLoading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Error state */}
      {submitted && error && (
        <div className="border-destructive/30 bg-destructive/5 rounded-xl border p-4 text-center">
          <p className="text-destructive text-sm font-medium">
            Failed to load trips
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            {(error as Error).message}
          </p>
        </div>
      )}

      {/* Results */}
      {submitted && data && (
        <div className="space-y-2">
          {/* Earlier button */}
          {backwardContext && (
            <LoadMoreButton
              direction="earlier"
              onClick={() => handleLoadMore(LoadMoreAction.Earlier)}
              isLoading={
                loadMoreMutation.isPending &&
                loadMoreMutation.variables?.action === LoadMoreAction.Earlier
              }
            />
          )}

          <AnimatePresence mode="popLayout">
            {allTrips.map((trip, index) => (
              <TripCard
                key={trip.ctxRecon}
                trip={trip}
                isFavourite={false}
                onToggleFavourite={() => {}}
                isNextDeparture={trip.ctxRecon === nextDepartureCtx}
                index={index}
                onClick={() =>
                  navigate(
                    `/trip?ctxRecon=${encodeURIComponent(trip.ctxRecon)}`,
                    { state: { trip } },
                  )
                }
              />
            ))}
          </AnimatePresence>

          {allTrips.length === 0 && (
            <div className="text-muted-foreground py-8 text-center text-sm">
              No trips found for this route.
            </div>
          )}

          {/* Later button */}
          {forwardContext && (
            <LoadMoreButton
              direction="later"
              onClick={() => handleLoadMore(LoadMoreAction.Later)}
              isLoading={
                loadMoreMutation.isPending &&
                loadMoreMutation.variables?.action === LoadMoreAction.Later
              }
            />
          )}
        </div>
      )}
    </div>
  )
}
