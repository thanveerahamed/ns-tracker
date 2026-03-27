import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { History, ArrowRight } from 'lucide-react'
import { getRecentSearches } from '@/services/recent.ts'
import { useAuth } from '@/contexts/AuthContext.tsx'
import type { RecentSearch } from '@/types/recent.ts'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { displayName } from '@/utils/station.ts'

interface RecentSearchesProps {
  onSelect: (recent: RecentSearch) => void
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
}

export function RecentSearches({ onSelect }: RecentSearchesProps) {
  const { user } = useAuth()

  const { data: recents, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ['recentSearches', user?.uid],
    queryFn: () => getRecentSearches(user!.uid),
  })

  if (!user) return null

  if (isLoading) {
    return (
      <div className="mt-4 space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!recents || recents.length === 0) return null

  return (
    <div className="mt-6">
      <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-medium">
        <History className="h-3.5 w-3.5" />
        Recent searches
      </div>
      <motion.ul
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-1.5"
      >
        {recents.map((recent) => (
          <motion.li
            key={`${recent.origin.UICCode}-${recent.destination.UICCode}-${recent.via?.UICCode ?? ''}`}
            variants={itemVariants}
          >
            <button
              type="button"
              onClick={() => onSelect(recent)}
              className="bg-card hover:bg-accent flex w-full items-center gap-2 rounded-lg border p-3 text-left text-sm transition-colors active:scale-[0.98]"
            >
              <span className="truncate font-medium">
                {displayName(recent.origin.namen, 'kort')}
              </span>
              {recent.via && (
                <>
                  <ArrowRight className="text-muted-foreground h-3 w-3 shrink-0" />
                  <span className="text-muted-foreground truncate">
                    {displayName(recent.via.namen, 'kort')}
                  </span>
                </>
              )}
              <ArrowRight className="text-muted-foreground h-3 w-3 shrink-0" />
              <span className="truncate font-medium">
                {displayName(recent.destination.namen, 'kort')}
              </span>
            </button>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
