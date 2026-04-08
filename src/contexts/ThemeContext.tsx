import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

type Theme = 'light' | 'dark'
export type ColorTheme = 'green' | 'blue' | 'violet'

const COLOR_THEME_CLASSES: Record<ColorTheme, string | null> = {
  green: null, // default — no extra class needed
  blue: 'theme-blue',
  violet: 'theme-violet',
}

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  colorTheme: ColorTheme
  setColorTheme: (color: ColorTheme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
  colorTheme: 'green',
  setColorTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const stored = localStorage.getItem('colorTheme') as ColorTheme | null
    if (stored && stored in COLOR_THEME_CLASSES) return stored
    return 'green'
  })

  useEffect(() => {
    const root = document.documentElement

    // Light / dark
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem('theme', theme)

    // Color theme
    Object.values(COLOR_THEME_CLASSES).forEach((cls) => {
      if (cls) root.classList.remove(cls)
    })
    const colorClass = COLOR_THEME_CLASSES[colorTheme]
    if (colorClass) root.classList.add(colorClass)
    localStorage.setItem('colorTheme', colorTheme)
  }, [theme, colorTheme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, colorTheme, setColorTheme }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext)
