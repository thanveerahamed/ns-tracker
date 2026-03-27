import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Star, UserRound, Columns2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import { cn } from '@/lib/utils.ts'

const tabs = [
  { key: '/', label: 'Search', icon: Search, requiresAuth: false },
  { key: '/compare', label: 'Compare', icon: Columns2, requiresAuth: true },
  { key: '/favourites', label: 'Favourites', icon: Star, requiresAuth: true },
] as const

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Don't show on the results page — user is focused on trip details
  if (location.pathname === '/results') return null

  const activePath = location.pathname

  const visibleTabs = tabs.filter((t) => !t.requiresAuth || user)

  const initials = user
    ? (user.displayName ?? user.email ?? 'U')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : null

  return (
    <nav className="border-border bg-background/90 pb-safe fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-stretch">
        {visibleTabs.map(({ key, label, icon: Icon }) => {
          const isActive = activePath === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => navigate(key)}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon
                className={cn('h-5 w-5', isActive && 'fill-primary/20')}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className="font-medium">{label}</span>
            </button>
          )
        })}

        {/* Profile tab */}
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors',
            activePath === '/profile'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {user ? (
            <Avatar
              className={cn(
                'h-5 w-5 text-[8px]',
                activePath === '/profile' &&
                  'ring-primary ring-offset-background ring-2 ring-offset-1',
              )}
            >
              <AvatarImage
                src={user.photoURL ?? undefined}
                alt={user.displayName ?? ''}
              />
              <AvatarFallback className="text-[8px]">{initials}</AvatarFallback>
            </Avatar>
          ) : (
            <UserRound
              className="h-5 w-5"
              strokeWidth={activePath === '/profile' ? 2.5 : 1.5}
            />
          )}
          <span className="font-medium">{user ? 'Profile' : 'Sign in'}</span>
        </button>
      </div>
    </nav>
  )
}
