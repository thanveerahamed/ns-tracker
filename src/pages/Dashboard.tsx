import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';

import SearchFilter from '../components/SearchFilter.tsx';

import { useTripsInformationContext } from '../context';
import { auth } from '../services/firebase.ts';
import { useRecentSearch } from '../services/recent.ts';
import { RecentSearch } from '../types/recent.ts';
import { UpdateRecentSearchProps } from '../types/search.ts';

const cardContainerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};
const cardItemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 340, damping: 30 } },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [recentSearchSnapshots] = useRecentSearch(user?.uid);
  const { updateRecentSearch } = useTripsInformationContext();

  const recentSearch = useMemo(
    () => recentSearchSnapshots?.docs.map((doc) => doc.data() as RecentSearch) ?? [],
    [recentSearchSnapshots],
  );

  const handleSearch = () => navigate('/trips');
  const handleRecentSearchClicked = (props: UpdateRecentSearchProps) => {
    updateRecentSearch(props);
    handleSearch();
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Hero / search area ── */}
      <div
        className="pb-6"
        style={{ background: 'linear-gradient(175deg, #111 0%, #0a1a10 100%)' }}
      >
        {/* App wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex items-center gap-2 px-4 pt-5 pb-4"
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)' }}
        >
          <div className="flex flex-col">
            <span
              className="text-[26px] font-bold tracking-tight leading-none"
              style={{
                background: 'linear-gradient(90deg, #fff 45%, #2b8257)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              NS Tracker
            </span>
            <span className="text-[12px] text-white/30 mt-1">Plan your next journey</span>
          </div>
        </motion.div>

        {/* Search panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.35, ease: 'easeOut' }}
          className="mx-3 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          }}
        >
          <SearchFilter onSearch={handleSearch} />
        </motion.div>
      </div>

      {/* ── Recent searches ── */}
      {recentSearch.length > 0 && (
        <div className="px-3 pt-5 pb-4 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25 mb-3 px-1">
            Recent
          </p>
          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-2"
          >
            {recentSearch.slice(0, 5).map((search, index) => (
              <motion.div key={index} variants={cardItemVariants}>
                <button
                  onClick={() =>
                    handleRecentSearchClicked({
                      via: search.via,
                      origin: search.origin,
                      destination: search.destination,
                    })
                  }
                  className="w-full text-left flex items-center gap-3.5 px-4 py-3.5 rounded-2xl active:scale-[0.98] transition-transform"
                  style={{
                    background: 'linear-gradient(145deg, rgba(28,28,28,0.9) 0%, rgba(20,20,20,0.9) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {/* Route mini-timeline */}
                  <div className="flex flex-col items-center gap-0.5 shrink-0 py-0.5">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    {search.via && <span className="w-px h-2.5 bg-white/15" />}
                    {search.via && <span className="w-2 h-2 rounded-full bg-warning/70" />}
                    <span className="w-px h-2.5 bg-white/15" />
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  </div>

                  {/* Station names */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white/85 truncate leading-snug">
                      {search.origin.namen.lang}
                    </p>
                    {search.via && (
                      <p className="text-[11px] text-white/35 truncate leading-snug">
                        via {search.via.namen.lang}
                      </p>
                    )}
                    <p className="text-[13px] font-medium text-primary truncate leading-snug">
                      {search.destination.namen.lang}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight size={14} className="text-white/20 shrink-0" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
