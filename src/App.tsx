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

const TripDetailPage = lazy(() =>
  import('@/pages/TripDetailPage.tsx').then((m) => ({
    default: m.TripDetailPage,
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
  const hideChrome =
    location.pathname.startsWith('/results') || location.pathname === '/trip'

  // Group /results/* under the same key so ResultsPage stays mounted
  // when navigating to /results/trip (preserves scroll, loaded trips, etc.)
  const routeKey = location.pathname.startsWith('/results')
    ? '/results'
    : location.pathname

  return (
    <div className="flex min-h-dvh flex-col">
      {!hideChrome && <Header />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={routeKey}>
              <Route path="/" element={<SearchPage />} />
              <Route path="/results" element={<ResultsPage />}>
                <Route path="trip" element={<TripDetailPage />} />
              </Route>
              <Route path="/trip" element={<TripDetailPage />} />
              <Route path="/compare" element={<SplitViewPage />} />
              <Route path="/favourites" element={<FavouritesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      {!hideChrome && <BottomNav />}
    </div>
  )
}
