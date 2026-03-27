import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils.ts'

interface FavouriteButtonProps {
  isFavourite: boolean
  onToggle: () => void
}

export function FavouriteButton({
  isFavourite,
  onToggle,
}: FavouriteButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className="hover:bg-accent rounded-md p-1 transition-colors"
      aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
    >
      <motion.div
        whileTap={{ scale: 1.3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <Star
          className={cn(
            'h-4 w-4 transition-colors',
            isFavourite
              ? 'fill-amber-400 text-amber-400'
              : 'text-muted-foreground',
          )}
        />
      </motion.div>
    </button>
  )
}
