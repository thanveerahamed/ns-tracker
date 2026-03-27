import { useCallback, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { TripCard } from '@/components/results/TripCard.tsx'
import { LoadMoreButton } from '@/components/results/LoadMoreButton.tsx'
import {
  useTripsInformation,
  useTripsInformationWithContext,
} from '@/apis/trips.ts'
import { useAuth } from '@/contexts/AuthContext.tsx'
import {
  addFavouriteTrip,
  removeFavouriteTrip,
  getFavouriteTrips,
} from '@/services/trip.ts'
import type { Trip } from '@/types/trip.ts'
import { LoadMoreAction } from '@/types/trip.ts'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export function ResultsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const originUicCode = searchParams.get('origin') ?? ''
  const destinationUicCode = searchParams.get('destination') ?? ''
  const originName = searchParams.get('originName') ?? ''
  const destinationName = searchParams.get('destinationName') ?? ''
  const viaUicCode = searchParams.get('via') ?? undefined
  const viaName = searchParams.get('viaName') ?? undefined
  const dateTimeStr = searchParams.get('dateTime') ?? dayjs().toISOString()
  const isArrival = searchParams.get('isArrival') === 'true'

  const dateTime = dayjs(dateTimeStr)

  // Main query
  const { data, isLoading, error } = useTripsInformation({
    originUicCode,
    destinationUicCode,
    viaUicCode,
    dateTime,
    searchForArrival: isArrival || undefined,
  })

  // Load more mutation
  const loadMoreMutation = useTripsInformationWithContext()

  // Extra trips loaded via earlier/later
  const [earlierTrips, setEarlierTrips] = useState<Trip[]>([])
  const [laterTrips, setLaterTrips] = useState<Trip[]>([])

  // Track scroll contexts from loaded batches
  const [earliestContext, setEarliestContext] = useState<string | undefined>()
  const [latestContext, setLatestContext] = useState<string | undefined>()

  // Track scroll contexts from loaded batches
  const backwardContext = earliestContext ?? data?.scrollRequestBackwardContext
  const forwardContext = latestContext ?? data?.scrollRequestForwardContext

  // Favourite trips
  const { data: favouriteTrips } = useQuery({
    enabled: !!user,
    queryKey: ['favouriteTrips', user?.uid],
    queryFn: () => getFavouriteTrips(user!.uid),
  })

  const favouriteCtxRecons = useMemo(
    () => new Set((favouriteTrips ?? []).map((f) => f.ctxRecon)),
    [favouriteTrips],
  )

  const allTrips = useMemo(() => {
    const base = data?.trips ?? []
    return [...earlierTrips, ...base, ...laterTrips]
  }, [data?.trips, earlierTrips, laterTrips])

  // Find the next preferred trip: first non-cancelled trip departing at or after now
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

  const handleLoadMore = useCallback(
    (action: LoadMoreAction) => {
      const context =
        action === LoadMoreAction.Earlier ? backwardContext : forwardContext
      if (!context) return

      loadMoreMutation.mutate(
        {
          props: {
            originUicCode,
            destinationUicCode,
            viaUicCode,
            dateTime,
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
      originUicCode,
      destinationUicCode,
      viaUicCode,
      dateTime,
      isArrival,
      loadMoreMutation,
    ],
  )

  const handleToggleFavourite = useCallback(
    async (trip: Trip) => {
      if (!user) return
      const existing = favouriteTrips?.find((f) => f.ctxRecon === trip.ctxRecon)
      try {
        if (existing) {
          await removeFavouriteTrip(user.uid, existing.docId)
          toast.success('Removed from favourites')
        } else {
          await addFavouriteTrip(user.uid, trip)
          toast.success('Added to favourites')
        }
        queryClient.invalidateQueries({
          queryKey: ['favouriteTrips', user.uid],
        })
      } catch {
        toast.error('Failed to update favourite')
      }
    },
    [user, favouriteTrips, queryClient],
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
      className="pb-safe mx-auto flex w-full max-w-lg flex-col px-4 py-4 sm:py-8"
    >
      {/* Back + route summary header */}
      <div className="mb-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 truncate text-sm font-semibold">
            <span className="truncate">{originName}</span>
            {viaName && (
              <>
                <ArrowRight className="text-muted-foreground h-3 w-3 shrink-0" />
                <span className="text-muted-foreground truncate text-xs">
                  {viaName}
                </span>
              </>
            )}
            <ArrowRight className="text-muted-foreground h-3 w-3 shrink-0" />
            <span className="truncate">{destinationName}</span>
          </div>
          <p className="text-muted-foreground text-xs">
            {dateTime.format('ddd, D MMM YYYY')} ·{' '}
            {isArrival ? 'Arrive by' : 'Depart at'} {dateTime.format('HH:mm')}
          </p>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="border-destructive/30 bg-destructive/5 rounded-xl border p-6 text-center">
          <p className="text-destructive text-sm font-medium">
            Failed to load trips
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            {(error as Error).message}
          </p>
        </div>
      )}

      {/* Results */}
      {data && (
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

          {/* Trip list */}
          <AnimatePresence mode="popLayout">
            {allTrips.map((trip, index) => {
              const firstLeg = trip.legs?.[0]
              const thisDepartureDay = firstLeg
                ? dayjs(
                    firstLeg.origin.actualDateTime ??
                      firstLeg.origin.plannedDateTime,
                  ).format('YYYY-MM-DD')
                : null

              const prevTrip = index > 0 ? allTrips[index - 1] : null
              const prevFirstLeg = prevTrip?.legs?.[0]
              const prevDepartureDay = prevFirstLeg
                ? dayjs(
                    prevFirstLeg.origin.actualDateTime ??
                      prevFirstLeg.origin.plannedDateTime,
                  ).format('YYYY-MM-DD')
                : null

              const showDayDivider =
                thisDepartureDay &&
                prevDepartureDay &&
                thisDepartureDay !== prevDepartureDay

              return (
                <div key={trip.ctxRecon}>
                  {showDayDivider && (
                    <div className="flex items-center gap-3 py-2">
                      <div className="bg-border h-px flex-1" />
                      <span className="text-muted-foreground text-[11px] font-medium whitespace-nowrap">
                        {dayjs(thisDepartureDay).format('ddd, D MMM')}
                      </span>
                      <div className="bg-border h-px flex-1" />
                    </div>
                  )}
                  <TripCard
                    trip={trip}
                    viaUicCode={viaUicCode}
                    isFavourite={favouriteCtxRecons.has(trip.ctxRecon)}
                    onToggleFavourite={() => handleToggleFavourite(trip)}
                    isNextDeparture={trip.ctxRecon === nextDepartureCtx}
                    index={index}
                    onClick={() =>
                      navigate(
                        `/trip?ctxRecon=${encodeURIComponent(trip.ctxRecon)}`,
                        { state: { trip } },
                      )
                    }
                  />
                </div>
              )
            })}
          </AnimatePresence>

          {allTrips.length === 0 && !isLoading && (
            <div className="text-muted-foreground py-12 text-center text-sm">
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
    </motion.div>
  )
}
