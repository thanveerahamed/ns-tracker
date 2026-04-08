import { motion } from 'framer-motion'
import { LogIn, LogOut, Moon, Sun, UserRound } from 'lucide-react'

import { Button } from '@/components/ui/button.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { useAuth } from '@/contexts/AuthContext.tsx'
import { useTheme, type ColorTheme } from '@/contexts/ThemeContext.tsx'
import { cn } from '@/lib/utils.ts'

const COLOR_OPTIONS: { value: ColorTheme; label: string; swatch: string }[] = [
  { value: 'green', label: 'Green', swatch: 'bg-[oklch(0.45_0.16_155)]' },
  { value: 'blue', label: 'Blue', swatch: 'bg-[oklch(0.45_0.18_250)]' },
  { value: 'violet', label: 'Violet', swatch: 'bg-[oklch(0.48_0.17_295)]' },
]

export function ProfilePage() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  const { theme, toggleTheme, colorTheme, setColorTheme } = useTheme()

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

      {/* Appearance */}
      <div className="bg-card mt-4 rounded-xl border p-5">
        <h2 className="mb-3 text-sm font-semibold">Appearance</h2>

        {/* Dark / Light toggle */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Mode</span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 px-3 text-xs"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-3.5 w-3.5" /> Light
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5" /> Dark
              </>
            )}
          </Button>
        </div>

        <Separator className="my-3" />

        {/* Color theme picker */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Accent color</span>
          <div className="flex gap-2">
            {COLOR_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-label={opt.label}
                onClick={() => setColorTheme(opt.value)}
                className={cn(
                  'h-7 w-7 rounded-full transition-all',
                  opt.swatch,
                  colorTheme === opt.value
                    ? 'ring-ring ring-offset-background scale-110 ring-2 ring-offset-2'
                    : 'opacity-60 hover:opacity-100',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
