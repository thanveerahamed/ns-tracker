import { Star, StarOff, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import SearchFavouriteStations from './SearchFavouriteStations.tsx';
import { Alert } from './ui/alert.tsx';
import { LinearProgress } from './ui/progress.tsx';
import { AnimatePresence, motion } from 'framer-motion';

import { useStationsQuery } from '../apis/stations.ts';
import TrainStopImage from '../assets/train-stop.png';
import { useSnackbarContext } from '../context';
import { auth } from '../services/firebase.ts';
import {
  addFavouriteStation,
  removeFavouriteStation,
  useFavouriteStation,
} from '../services/station.ts';
import { NSStation } from '../types/station.ts';

interface Props {
  open: boolean;
  onClose: (station?: NSStation) => void;
}

export default function StationSelectionDialog({ onClose, open }: Props) {
  const [searchText, setSearchText] = useState('');
  const { isLoading, isError, data } = useStationsQuery({
    query: searchText,
    enabled: open && searchText.length >= 2,
  });
  const [user] = useAuthState(auth);
  const { showNotification } = useSnackbarContext();
  const [favouriteStationSnapshots, isFavouriteLoading] = useFavouriteStation(
    user?.uid,
  );

  const favouriteStations: NSStation[] = useMemo(
    () =>
      favouriteStationSnapshots?.docs.map((doc) => doc.data() as NSStation) ??
      [],
    [favouriteStationSnapshots],
  );

  const filteredStations = useMemo(
    () =>
      data
        ? data.filter((s) => s.stationType !== 'FACULTATIEF_STATION')
        : undefined,
    [data],
  );

  const handleFavourite = async (
    action: 'add' | 'remove',
    station: NSStation,
  ) => {
    if (user) {
      if (action === 'add') {
        await addFavouriteStation(user.uid, station);
        showNotification('Favourite added!', 'success');
      } else {
        await removeFavouriteStation(user.uid, station);
        showNotification('Favourite removed!', 'success');
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
            onClick={() => onClose()}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed inset-0 z-[201] bg-bg flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface">
              <button
                onClick={() => onClose()}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-2 text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <span className="font-semibold text-sm flex-1">
                Select station
              </span>
            </div>

            {/* Search input */}
            <div className="px-4 py-3 border-b border-border">
              <input
                autoFocus
                type="text"
                placeholder="Type station name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-2 border border-border text-white placeholder:text-white/30 text-sm outline-none focus:border-primary transition-colors"
              />
              {isLoading && <LinearProgress />}
              {isError && (
                <Alert severity="error" className="mt-2">
                  Some error occurred
                </Alert>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {!searchText && (
                <SearchFavouriteStations
                  stations={favouriteStations}
                  onSelect={onClose}
                  showLoader={isFavouriteLoading}
                />
              )}

              {filteredStations &&
                (filteredStations.length > 0 ? (
                  <div>
                    <p className="px-4 py-2 text-xs text-white/40 uppercase tracking-wider">
                      Results
                    </p>
                    {filteredStations.map((station) => {
                      const isFav = favouriteStations.some(
                        (f) => f.UICCode === station.UICCode,
                      );
                      return (
                        <div
                          key={station.UICCode}
                          className="flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-surface-2 transition-colors"
                        >
                          <button
                            className="flex items-center gap-3 flex-1 text-left"
                            onClick={() => onClose(station)}
                          >
                            <img
                              alt=""
                              src={TrainStopImage}
                              width={28}
                              height={28}
                            />
                            <div>
                              <p className="text-sm font-medium">
                                {station.namen.lang}
                              </p>
                              <p className="text-xs text-white/40">
                                {station.stationType}
                              </p>
                            </div>
                          </button>
                          <button
                            onClick={() =>
                              handleFavourite(isFav ? 'remove' : 'add', station)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface text-white/50 hover:text-primary transition-colors"
                          >
                            {isFav ? (
                              <Star
                                size={16}
                                className="fill-primary text-primary"
                              />
                            ) : (
                              <StarOff size={16} />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="px-4 py-6 text-sm text-white/40 text-center">
                    No stations found
                  </p>
                ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
