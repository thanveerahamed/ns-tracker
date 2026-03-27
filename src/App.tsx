import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/Header.tsx'
import { BottomNav } from '@/components/layout/BottomNav.tsx'
import { SearchPage } from '@/pages/SearchPage.tsx'
import { FavouritesPage } from '@/pages/FavouritesPage.tsx'
import { ProfilePage } from '@/pages/ProfilePage.tsx'
import { Loader2 } from 'lucide-react'

const ResultsPage = lazy(() =>
  import('@/pages/ResultsPage.tsx').then((m) => ({ default: m.ResultsPage })),
)

const SplitViewPage = lazy(() =>
  import('@/pages/SplitViewPage.tsx').then((m) => ({
    default: m.SplitViewPage,
  })),
)

function PageLoader() {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
    </div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<SearchPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/compare" element={<SplitViewPage />} />
              <Route path="/favourites" element={<FavouritesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  )
}
