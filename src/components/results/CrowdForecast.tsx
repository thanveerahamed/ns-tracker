import { User, Users, UsersRound } from 'lucide-react'

export function CrowdForecast({ crowdForecast }: { crowdForecast: string }) {
  if (crowdForecast === 'HIGH') {
    return <UsersRound className="text-destructive h-4 w-4" />
  }

  if (crowdForecast === 'MEDIUM') {
    return <Users className="h-4 w-4 text-amber-500" />
  }

  if (crowdForecast === 'LOW') {
    return <User className="h-4 w-4 text-emerald-500" />
  }

  return null
}
