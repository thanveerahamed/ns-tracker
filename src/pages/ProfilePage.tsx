import { motion } from 'framer-motion'
import { LogIn, LogOut, UserRound } from 'lucide-react'

import { Button } from '@/components/ui/button.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { useAuth } from '@/contexts/AuthContext.tsx'

export function ProfilePage() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()

  const initials = user
    ? (user.displayName ?? user.email ?? 'U')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex w-full max-w-lg flex-col px-4 pt-4 pb-20"
    >
      {/* Signed in */}
      {user && (
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage
                src={user.photoURL ?? undefined}
                alt={user.displayName ?? ''}
              />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold">
                {user.displayName}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {user.email}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <Button
            variant="outline"
            className="text-destructive hover:text-destructive w-full gap-2"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      )}

      {/* Not signed in */}
      {!user && !loading && (
        <div className="bg-card flex flex-col items-center gap-5 rounded-xl border p-8 text-center">
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
            <UserRound className="text-muted-foreground h-8 w-8" />
          </div>
          <div>
            <p className="text-base font-semibold">Sign in to NS Tracker</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Save favourite trips and recent searches across devices
            </p>
          </div>
          <Button onClick={signInWithGoogle} className="w-full gap-2">
            <LogIn className="h-4 w-4" />
            Sign in with Google
          </Button>
        </div>
      )}
    </motion.div>
  )
}
