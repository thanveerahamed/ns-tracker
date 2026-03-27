import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { Columns2, Star, Map, LogIn, Sparkles } from 'lucide-react'
import { SearchForm } from '@/components/search/SearchForm.tsx'
import { RecentSearches } from '@/components/search/RecentSearches.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useAuth } from '@/contexts/AuthContext.tsx'
import type { RecentSearch } from '@/types/recent.ts'
import { displayName } from '@/utils/station.ts'

const features = [
  {
    icon: Columns2,
    label: 'Compare routes',
    desc: 'Side-by-side route comparison',
  },
  {
    icon: Star,
    label: 'Favourite trips & stations',
    desc: 'Save trips and stations for quick access',
  },
  {
    icon: Map,
    label: 'Journey map',
    desc: 'View your route on an interactive map',
  },
] as const

export function SearchPage() {
  const navigate = useNavigate()
  const { user, signInWithGoogle } = useAuth()

  const handleRecentSelect = useCallback(
    (recent: RecentSearch) => {
      const params = new URLSearchParams({
        origin: recent.origin.UICCode,
        originName: displayName(recent.origin.namen),
        destination: recent.destination.UICCode,
        destinationName: displayName(recent.destination.namen),
        dateTime: dayjs().toISOString(),
        isArrival: 'false',
      })
      if (recent.via) {
        params.set('via', recent.via.UICCode)
        params.set('viaName', displayName(recent.via.namen))
      }
      navigate(`/results?${params.toString()}`)
    },
    [navigate],
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex w-full max-w-lg flex-col px-4 pt-4 pb-20 sm:pt-8"
    >
      <SearchForm />

      <RecentSearches onSelect={handleRecentSelect} />

      {/* Hero card — sign-in prompt for premium features */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="bg-card mt-6 rounded-xl border p-4 shadow-sm"
        >
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="text-primary h-4 w-4" />
            <h3 className="text-sm font-semibold">Unlock more features</h3>
          </div>

          <div className="mb-4 space-y-2.5">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="text-primary h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium">{label}</p>
                  <p className="text-muted-foreground text-[11px]">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="default"
            size="sm"
            className="w-full gap-2"
            onClick={signInWithGoogle}
          >
            <LogIn className="h-4 w-4" />
            Sign in with Google
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
