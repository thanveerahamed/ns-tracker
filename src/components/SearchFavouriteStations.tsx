import { Train } from 'lucide-react';
import React from 'react';

import { LinearProgress } from './ui/progress.tsx';

import { NSStation } from '../types/station.ts';

interface Props {
  stations: NSStation[];
  onSelect?: (station: NSStation) => void;
  showLoader?: boolean;
}

export default function SearchFavouriteStations({
  stations,
  onSelect,
  showLoader,
}: Props) {
  return (
    <div>
      <p className="px-4 py-2 text-xs text-white/40 uppercase tracking-wider">
        Favourites
      </p>
      {showLoader && <LinearProgress />}
      <div className="grid grid-cols-3 gap-2 px-4 py-2">
        {stations.map((station) => (
          <button
            key={station.UICCode}
            onClick={() => onSelect?.(station)}
            className="flex flex-col items-center gap-1 p-2 rounded-xl bg-surface border border-border hover:border-primary/40 transition-colors text-center"
          >
            <Train size={16} className="text-primary" />
            <span className="text-[10px] text-white/60 leading-tight">
              {station.namen.lang}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
