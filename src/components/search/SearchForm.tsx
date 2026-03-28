import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpDown, Search, Waypoints } from 'lucide-react'
import dayjs from 'dayjs'

import { Button } from '@/components/ui/button.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import { Label } from '@/components/ui/label.tsx'
import { StationCombobox } from '@/components/search/StationCombobox.tsx'
import { DateTimePicker } from '@/components/search/DateTimePicker.tsx'
import type { NSStation } from '@/types/station.ts'
import { useAuth } from '@/contexts/AuthContext.tsx'
import { createRecentSearch } from '@/services/recent.ts'
import { displayName } from '@/utils/station.ts'
import {
  getStationFromCache,
  saveStationToCache,
  getHasIntermediateStopCache,
  saveHasIntermediateStopCache,
  getSearchDateTimeFromCache,
  saveSearchDateTimeToCache,
  getArrivalToggleFromCache,
  saveArrivalToggleToCache,
} from '@/services/cache.ts'
import { LocationType } from '@/types/station.ts'

const stationSchema = z.custom<NSStation>(
  (val) => val != null && typeof val === 'object' && 'UICCode' in val,
)

const searchSchema = z.object({
  origin: stationSchema,
  destination: stationSchema,
  via: stationSchema.optional(),
  dateTime: z.union([z.literal('now'), z.date()]),
  isArrival: z.boolean(),
})

type SearchFormValues = z.infer<typeof searchSchema>

// Module-level flag: true on fresh page load, false after first mount.
// Modules re-initialise on full page refresh but stay alive during SPA navigation,
// so this lets us distinguish "refresh / new session" from "navigated back".
let isInitialPageLoad = true

interface SearchFormProps {
  onSearchComplete?: () => void
}

export function SearchForm({ onSearchComplete }: SearchFormProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showVia, setShowVia] = useState(() => getHasIntermediateStopCache())

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { isValid },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      origin: getStationFromCache(LocationType.Origin),
      destination: getStationFromCache(LocationType.Destination),
      via: getStationFromCache(LocationType.Via),
      dateTime: (() => {
        // Fresh page load / refresh → always start with "now"
        if (isInitialPageLoad) return 'now'
        // SPA navigation back → restore the previously selected datetime
        const cached = getSearchDateTimeFromCache()
        if (cached === 'now') return 'now'
        return cached.toDate()
      })(),
      isArrival: getArrivalToggleFromCache(),
    },
    mode: 'onChange',
  })

  // After the first mount, clear the flag so subsequent SPA navigations
  // (e.g. results → back) restore the cached datetime instead of resetting.
  useEffect(() => {
    isInitialPageLoad = false
  }, [])

  // Persist origin / destination / via to localStorage on every change
  const watchedOrigin = watch('origin')
  const watchedDestination = watch('destination')
  const watchedVia = watch('via')
  const watchedDateTime = watch('dateTime')
  const watchedIsArrival = watch('isArrival')

  useEffect(() => {
    saveStationToCache(LocationType.Origin, watchedOrigin)
  }, [watchedOrigin])

  useEffect(() => {
    saveStationToCache(LocationType.Destination, watchedDestination)
  }, [watchedDestination])

  useEffect(() => {
    saveStationToCache(LocationType.Via, watchedVia)
  }, [watchedVia])

  useEffect(() => {
    saveSearchDateTimeToCache(
      watchedDateTime === 'now' ? 'now' : dayjs(watchedDateTime),
    )
  }, [watchedDateTime])

  useEffect(() => {
    saveArrivalToggleToCache(watchedIsArrival)
  }, [watchedIsArrival])

  const swapStations = useCallback(() => {
    const origin = getValues('origin')
    const destination = getValues('destination')
    if (origin) setValue('destination', origin, { shouldValidate: true })
    if (destination) setValue('origin', destination, { shouldValidate: true })
  }, [getValues, setValue])

  const onSubmit = async (data: SearchFormValues) => {
    const dt =
      data.dateTime === 'now'
        ? dayjs().toISOString()
        : dayjs(data.dateTime).toISOString()

    if (user) {
      createRecentSearch({
        userId: user.uid,
        origin: data.origin,
        destination: data.destination,
        via: data.via,
      }).catch(() => {})
    }

    const params = new URLSearchParams({
      origin: data.origin.UICCode,
      originName: displayName(data.origin.namen),
      destination: data.destination.UICCode,
      destinationName: displayName(data.destination.namen),
      dateTime: dt,
      isArrival: String(data.isArrival),
    })

    if (data.via) {
      params.set('via', data.via.UICCode)
      params.set('viaName', displayName(data.via.namen))
    }

    navigate(`/results?${params.toString()}`)
    onSearchComplete?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      {/* Origin + Swap + Destination compact group */}
      <div className="flex items-start gap-1.5">
        <div className="flex-1 space-y-1.5">
          <Controller
            name="origin"
            control={control}
            render={({ field }) => (
              <StationCombobox
                value={field.value}
                onChange={(s) => field.onChange(s)}
                placeholder="From…"
              />
            )}
          />
          <Controller
            name="destination"
            control={control}
            render={({ field }) => (
              <StationCombobox
                value={field.value}
                onChange={(s) => field.onChange(s)}
                placeholder="To…"
              />
            )}
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

      {/* Via stop — animatedly expand */}
      <AnimatePresence>
        {showVia && (
          <motion.div
            initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
            animate={{ height: 'auto', opacity: 1, overflow: 'visible' }}
            exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
            transition={{ duration: 0.15 }}
          >
            <Controller
              name="via"
              control={control}
              render={({ field }) => (
                <StationCombobox
                  value={field.value}
                  onChange={(s) => field.onChange(s)}
                  placeholder="Via…"
                />
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls row: via toggle | datetime | arrival toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant={showVia ? 'secondary' : 'outline'}
          size="sm"
          className="h-8 gap-1 px-2.5 text-xs"
          onClick={() => {
            const next = !showVia
            setShowVia(next)
            saveHasIntermediateStopCache(next)
            if (!next) setValue('via', undefined)
          }}
        >
          <Waypoints className="h-3 w-3" />
          Via
        </Button>

        <div className="bg-border h-4 w-px" />

        <Controller
          name="dateTime"
          control={control}
          render={({ field }) => (
            <DateTimePicker value={field.value} onChange={field.onChange} />
          )}
        />

        <div className="bg-border h-4 w-px" />

        <Controller
          name="isArrival"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-1.5">
              <Label
                htmlFor="arrival-toggle"
                className="text-muted-foreground cursor-pointer text-xs"
              >
                Dep
              </Label>
              <Switch
                id="arrival-toggle"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="scale-75"
              />
              <Label
                htmlFor="arrival-toggle"
                className="text-muted-foreground cursor-pointer text-xs"
              >
                Arr
              </Label>
            </div>
          )}
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full gap-2" disabled={!isValid}>
        <Search className="h-4 w-4" />
        Search
      </Button>
    </form>
  )
}
