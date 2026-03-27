import { Moon, Sun, Train } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { motion } from 'framer-motion'

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="border-border bg-background/80 pt-safe sticky top-0 z-50 border-b backdrop-blur-md"
    >
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-md">
            <Train className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight">NS Tracker</span>
        </a>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </motion.header>
  )
}
