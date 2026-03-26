import { useNavigate, useSearchParams } from 'react-router-dom';

import CustomTabPanel from '../components/CustomTabPanel.tsx';
import FavouriteStations from '../components/favourites/FavouriteStations.tsx';
import FavouriteTrips from '../components/favourites/FavouriteTrips.tsx';

import { cn } from '../utils/cn.ts';

const TABS = ['Trips', 'Stations'];

export default function Favourites() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramTabIndex = searchParams.get('tabIndex');
  const tabIndex = paramTabIndex ? Number(paramTabIndex) : 0;

  const handleChange = (newValue: number) => {
    navigate(`/favourites?tabIndex=${newValue}`);
  };

  return (
    <div className="w-full">
      <header
        className="sticky top-0 z-40 bg-surface border-b border-border"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        {/* Title row */}
        <div className="flex items-center px-4 pt-3 pb-1">
          <h1 className="text-[17px] font-semibold tracking-tight">Favourites</h1>
        </div>

        {/* Tab bar */}
        <div className="flex px-2">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => handleChange(i)}
              style={{ minHeight: 40, WebkitTapHighlightColor: 'transparent' }}
              className={cn(
                'flex-1 text-[13px] font-medium px-2 transition-colors relative',
                tabIndex === i ? 'text-white' : 'text-white/35',
              )}
            >
              {tab}
              {tabIndex === i && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </header>

      <CustomTabPanel value={tabIndex} index={0}>
        <FavouriteTrips />
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={1}>
        <FavouriteStations />
      </CustomTabPanel>
    </div>
  );
}
