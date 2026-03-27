import { Loader2, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

interface LoadMoreButtonProps {
  direction: 'earlier' | 'later'
  onClick: () => void
  isLoading: boolean
}

export function LoadMoreButton({
  direction,
  onClick,
  isLoading,
}: LoadMoreButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={isLoading}
      className="text-muted-foreground w-full gap-1.5 text-xs"
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : direction === 'earlier' ? (
        <ChevronUp className="h-3.5 w-3.5" />
      ) : (
        <ChevronDown className="h-3.5 w-3.5" />
      )}
      {direction === 'earlier' ? 'Earlier trains' : 'Later trains'}
    </Button>
  )
}
