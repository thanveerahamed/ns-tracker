import { useRef, useState, useMemo } from 'react'
import { MapPin, X, Loader2, Star } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useStationsQuery, useFavouriteStationsQuery } from '@/apis/stations.ts'
import {
  addFavouriteStation,
  removeFavouriteStation,
} from '@/services/station.ts'
import { useDebounce } from '@/hooks/useDebounce.ts'
import { useAuth } from '@/contexts/AuthContext.tsx'
import type { NSStation } from '@/types/station.ts'
import { cn } from '@/lib/utils.ts'
import { displayName } from '@/utils/station.ts'
import { getStationIconInfo } from '@/utils/stationIcon.ts'

interface StationComboboxProps {
  value?: NSStation
  onChange: (station: NSStation | undefined) => void
  placeholder?: string
  label?: string
}

export function StationCombobox({
  value,
  onChange,
  placeholder = 'Search station…',
  label,
}: StationComboboxProps) {
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)
  const debouncedSearch = useDebounce(search, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Search results
  const { data: stations, isLoading } = useStationsQuery({
    query: debouncedSearch,
    enabled: debouncedSearch.length >= 2,
  })

  // Favourite stations
  const { data: favourites } = useFavouriteStationsQuery(user?.uid)

  const favouriteUics = useMemo(
    () => new Set((favourites ?? []).map((s) => s.UICCode)),
    [favourites],
  )

  const handleSelect = (station: NSStation) => {
    onChange(station)
    setSearch('')
    setFocused(false)
    inputRef.current?.blur()
  }

  const handleClear = () => {
    onChange(undefined)
    setSearch('')
    inputRef.current?.focus()
  }

  const handleBlur = (e: React.FocusEvent) => {
    if (containerRef.current?.contains(e.relatedTarget as Node)) return
    setTimeout(() => setFocused(false), 150)
  }

  const toggleFavourite = async (station: NSStation) => {
    if (!user) return
    if (favouriteUics.has(station.UICCode)) {
      await removeFavouriteStation(user.uid, station)
    } else {
      await addFavouriteStation(user.uid, station)
    }
    queryClient.invalidateQueries({ queryKey: ['favouriteStations', user.uid] })
  }

  // What to show in the dropdown
  const isTyping = debouncedSearch.length >= 2
  const showSearchResults =
    focused && isTyping && (isLoading || (stations && stations.length > 0))
  const showEmpty =
    focused && isTyping && !isLoading && stations && stations.length === 0
  const showFavourites =
    focused && !isTyping && favourites && favourites.length > 0

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <span className="text-muted-foreground text-xs font-medium">
          {label}
        </span>
      )}

      <div className="relative">
        {/* Input row */}
        <div
          className={cn(
            'bg-background flex h-9 items-center gap-2 rounded-lg border px-3 transition-colors',
            focused ? 'border-ring ring-ring ring-1' : 'border-input',
          )}
        >
          <MapPin className="text-muted-foreground h-4 w-4 shrink-0" />

          {value && !focused ? (
            <button
              type="button"
              className="flex-1 truncate text-left text-sm"
              onClick={() => {
                setSearch('')
                setFocused(true)
                setTimeout(() => inputRef.current?.focus(), 0)
              }}
            >
              {displayName(value.namen)}
            </button>
          ) : (
            <input
              ref={inputRef}
              type="text"
              className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={handleBlur}
              autoComplete="off"
            />
          )}

          {isLoading && focused ? (
            <Loader2 className="text-muted-foreground h-4 w-4 shrink-0 animate-spin" />
          ) : value ? (
            <button
              type="button"
              onClick={handleClear}
              className="hover:bg-accent rounded-sm p-0.5"
            >
              <X className="text-muted-foreground h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>

        {/* Favourites dropdown (shown on focus when not typing) */}
        {showFavourites && (
          <div className="bg-popover absolute z-50 mt-1 w-full rounded-lg border shadow-lg">
            <div className="flex items-center gap-1.5 px-3 pt-2 pb-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-muted-foreground text-[11px] font-medium">
                Favourites
              </span>
            </div>
            <ul className="max-h-[40dvh] overflow-y-auto py-1">
              {favourites.map((station) => (
                <li key={station.UICCode}>
                  <StationRow
                    station={station}
                    isSelected={value?.UICCode === station.UICCode}
                    isFavourite
                    onSelect={handleSelect}
                    onToggleFavourite={user ? toggleFavourite : undefined}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Search results dropdown */}
        {showSearchResults && (
          <div className="bg-popover absolute z-50 mt-1 w-full rounded-lg border shadow-lg">
            <ul className="max-h-[40dvh] overflow-y-auto py-1">
              {isLoading
                ? Array.from({ length: 3 }, (_, i) => (
                    <li key={i} className="flex items-center gap-3 px-3 py-2">
                      <div className="bg-muted h-4 w-4 animate-pulse rounded" />
                      <div className="flex-1 space-y-1">
                        <div className="bg-muted h-3.5 w-3/4 animate-pulse rounded" />
                        <div className="bg-muted h-3 w-1/3 animate-pulse rounded" />
                      </div>
                    </li>
                  ))
                : stations?.map((station) => (
                    <li key={station.UICCode}>
                      <StationRow
                        station={station}
                        isSelected={value?.UICCode === station.UICCode}
                        isFavourite={favouriteUics.has(station.UICCode)}
                        onSelect={handleSelect}
                        onToggleFavourite={user ? toggleFavourite : undefined}
                      />
                    </li>
                  ))}
            </ul>
          </div>
        )}

        {/* No results */}
        {showEmpty && (
          <div className="bg-popover absolute z-50 mt-1 w-full rounded-lg border p-4 text-center shadow-lg">
            <p className="text-muted-foreground text-sm">No stations found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Station row used in both favourites and search results ── */

function StationRow({
  station,
  isSelected,
  isFavourite,
  onSelect,
  onToggleFavourite,
}: {
  station: NSStation
  isSelected: boolean
  isFavourite: boolean
  onSelect: (s: NSStation) => void
  onToggleFavourite?: (s: NSStation) => void
}) {
  const {
    icon: StationIcon,
    className: iconColor,
    label: iconLabel,
  } = getStationIconInfo(station.stationType)

  return (
    <div
      className={cn(
        'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors',
        'hover:bg-accent',
        isSelected && 'bg-accent',
      )}
    >
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
        onMouseDown={(e) => {
          e.preventDefault()
          onSelect(station)
        }}
      >
        <StationIcon
          className={cn('h-4 w-4 shrink-0', iconColor)}
          aria-label={iconLabel}
        />
        <div className="flex min-w-0 flex-col">
          <span className={cn('truncate', isSelected && 'font-medium')}>
            {displayName(station.namen)}
          </span>
          <span className="text-muted-foreground text-[11px]">
            {station.land === 'NL' ? 'Netherlands' : station.land}
          </span>
        </div>
      </button>

      {onToggleFavourite && (
        <button
          type="button"
          className="hover:bg-background/60 shrink-0 rounded p-1"
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleFavourite(station)
          }}
          aria-label={
            isFavourite ? 'Remove from favourites' : 'Add to favourites'
          }
        >
          <Star
            className={cn(
              'h-3.5 w-3.5 transition-colors',
              isFavourite
                ? 'fill-amber-400 text-amber-400'
                : 'text-muted-foreground',
            )}
          />
        </button>
      )}
    </div>
  )
}
