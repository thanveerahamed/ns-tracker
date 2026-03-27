import { motion, AnimatePresence } from 'framer-motion'
import { Star, LogIn, TrainFront } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import dayjs from 'dayjs'

import { Button } from '@/components/ui/button.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { useAuth } from '@/contexts/AuthContext.tsx'
import { getFavouriteTrips, removeFavouriteTrip } from '@/services/trip.ts'
import { extendedDayjs } from '@/utils/date.ts'
import type { Trip } from '@/types/trip.ts'

export function FavouritesPage() {
  const { user, signInWithGoogle } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: favourites, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ['favouriteTrips', user?.uid],
    queryFn: () => getFavouriteTrips(user!.uid),
  })

  const handleRemove = async (docId: string) => {
    if (!user) return
    try {
      await removeFavouriteTrip(user.uid, docId)
      toast.success('Removed from favourites')
      queryClient.invalidateQueries({ queryKey: ['favouriteTrips', user.uid] })
    } catch {
      toast.error('Failed to remove')
    }
  }

  const handleTripClick = (trip: Trip) => {
    navigate(`/trip?ctxRecon=${encodeURIComponent(trip.ctxRecon)}`, {
      state: { trip },
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex w-full max-w-lg flex-col px-4 pt-4 pb-20"
    >
      <div className="mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
        <h1 className="text-lg font-semibold">Favourite trips</h1>
      </div>

      {/* Not logged in */}
      {!user && (
        <div className="bg-card flex flex-col items-center gap-4 rounded-xl border p-8 text-center">
          <Star className="text-muted-foreground h-10 w-10" />
          <div>
            <p className="text-sm font-medium">
              Sign in to see your favourites
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Save trips you travel often for quick access
            </p>
          </div>
          <Button onClick={signInWithGoogle} className="gap-2">
            <LogIn className="h-4 w-4" />
            Sign in with Google
          </Button>
        </div>
      )}

      {/* Loading */}
      {user && isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted h-20 animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty */}
      {user && !isLoading && (!favourites || favourites.length === 0) && (
        <div className="bg-card flex flex-col items-center gap-3 rounded-xl border p-8 text-center">
          <Star className="text-muted-foreground h-10 w-10" />
          <p className="text-muted-foreground text-sm">
            No favourite trips yet. Star a trip from the search results to save
            it here.
          </p>
        </div>
      )}

      {/* Favourite list */}
      {user && favourites && favourites.length > 0 && (
        <AnimatePresence mode="popLayout">
          <div className="space-y-2">
            {favourites.map((trip) => (
              <FavouriteTripCard
                key={trip.docId}
                trip={trip}
                onRemove={() => handleRemove(trip.docId)}
                onClick={() => handleTripClick(trip)}
              />
            ))}
          </div>
        </AnimatePresence>
      )}
    </motion.div>
  )
}

function FavouriteTripCard({
  trip,
  onRemove,
  onClick,
}: {
  trip: Trip & { docId: string }
  onRemove: () => void
  onClick: () => void
}) {
  const firstLeg = trip.legs?.[0]
  const lastLeg = trip.legs?.[trip.legs.length - 1]

  const durationText = trip.plannedDurationInMinutes
    ? extendedDayjs
        .duration(trip.plannedDurationInMinutes, 'minutes')
        .format('H[h] m[m]')
    : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-xl border p-3 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        {/* Tap to search this route now */}
        <button
          type="button"
          onClick={onClick}
          className="min-w-0 flex-1 space-y-1.5 text-left"
        >
          {/* Route */}
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <span className="truncate">{firstLeg?.origin.name}</span>
            <span className="text-muted-foreground">→</span>
            <span className="truncate">{lastLeg?.destination.name}</span>
          </div>

          {/* Trip date */}
          {firstLeg && (
            <p className="text-muted-foreground text-[11px]">
              {dayjs(firstLeg.origin.plannedDateTime).format(
                'ddd, D MMM YYYY · HH:mm',
              )}
              {' → '}
              {lastLeg &&
                dayjs(lastLeg.destination.plannedDateTime).format('HH:mm')}
            </p>
          )}

          {/* Train types + duration */}
          <div className="flex flex-wrap items-center gap-1.5">
            {trip.legs.map((leg) => (
              <Badge
                key={leg.idx}
                variant="secondary"
                className="gap-1 text-[10px] font-normal"
              >
                <TrainFront className="h-2.5 w-2.5" />
                {leg.product.displayName}
              </Badge>
            ))}
            {durationText && (
              <span className="text-muted-foreground text-[11px]">
                · {durationText}
              </span>
            )}
            {trip.transfers > 0 && (
              <span className="text-muted-foreground text-[11px]">
                · {trip.transfers} transfer{trip.transfers > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </button>

        {/* Unfavourite */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="hover:bg-accent shrink-0 rounded-md p-1.5 transition-colors"
          aria-label="Remove from favourites"
        >
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        </button>
      </div>
    </motion.div>
  )
}
