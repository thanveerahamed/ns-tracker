import { ArrowLeftRight } from 'lucide-react'

export function NumberOfConnectionsDisplay({
  connections,
}: {
  connections: number
}) {
  return (
    <div className="text-muted-foreground flex items-center gap-1 text-xs">
      <ArrowLeftRight className="h-3.5 w-3.5" />
      <span>
        {connections === 0
          ? 'Direct'
          : `${connections} transfer${connections > 1 ? 's' : ''}`}
      </span>
    </div>
  )
}
