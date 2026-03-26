import {
  ArrowUpDown,
  MapPinPlus,
  MapPinX,
  RefreshCw,
  Search,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import SearchSettings from './SearchSettings.tsx';
import { Alert } from './ui/alert.tsx';
import { Dayjs } from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';

import StationSelectionDialog from '../components/StationSelectionDialog.tsx';
import CustomDateTimePicker from '../components/datetime/CustomDateTimePicker.tsx';

import { useSearchFilterContext, useTripsInformationContext } from '../context';
import { auth } from '../services/firebase.ts';
import { createRecentSearch } from '../services/recent.ts';
import { LocationType, NSStation } from '../types/station.ts';
import { cn } from '../utils/cn.ts';

interface Props {
  onSearch: () => void;
  variant?: 'refresh' | 'search';
}

function StationInput({
  label,
  value,
  error,
  color,
  onClick,
}: {
  label: string;
  value: string;
  error?: string;
  color: 'primary' | 'secondary' | 'warning';
  onClick: () => void;
}) {
  const dotColor = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    warning: 'bg-warning',
  }[color];
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ WebkitTapHighlightColor: 'transparent', minHeight: 44 }}
      className={cn(
        'flex items-center gap-2.5 w-full px-3 py-2.5 text-left rounded-xl border text-[13px] transition-colors',
        error ? 'border-error/60 bg-error/5' : 'border-border bg-surface-2 active:bg-surface',
      )}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
      <span className={cn('flex-1 truncate', value ? 'text-white' : 'text-white/30')}>
        {value || label}
      </span>
      {error && <span className="text-xs text-error shrink-0">{error}</span>}
    </button>
  );
}

export default function SearchFilter({ onSearch, variant = 'search' }: Props) {
  const {
    setHasIntermediateStop,
    hasIntermediateStop,
    via,
    setVia,
    setSelectedDateTime,
    selectedDateTime,
    origin,
    setOrigin,
    setDestination,
    destination,
    setIsArrival,
    swapLocations,
    isArrival,
    settingsEnabled,
  } = useSearchFilterContext();
  const { isInitialLoading } = useTripsInformationContext();
  const [user] = useAuthState(auth);
  const [openStationSelection, setOpenStationSelection] = useState(false);
  const [openSearchSettings, setOpenSearchSettings] = useState(false);
  const [locationTypeClicked, setLocationTypeClicked] = useState<
    LocationType | undefined
  >();
  const [submitted, setSubmitted] = useState(false);

  const handleTextClicked = (locationType: LocationType) => {
    setLocationTypeClicked(locationType);
    setOpenStationSelection(true);
  };

  const handleStationSelectorClosed = (station?: NSStation) => {
    setOpenStationSelection(false);
    if (station) {
      if (locationTypeClicked === LocationType.Origin) setOrigin(station);
      if (locationTypeClicked === LocationType.Destination)
        setDestination(station);
      if (locationTypeClicked === LocationType.Via) setVia(station);
    }
    setLocationTypeClicked(undefined);
  };

  const handleDateTimeChange = (
    value: Dayjs | 'now',
    isArrivalValue?: boolean,
  ) => {
    setSelectedDateTime(value);
    if (isArrivalValue !== undefined) setIsArrival(isArrivalValue);
  };

  const areStationsSame = () =>
    origin &&
    destination &&
    (origin.UICCode === destination.UICCode ||
      origin.UICCode === via?.UICCode ||
      via?.UICCode === destination.UICCode);

  const isFormValid = () => {
    if (hasIntermediateStop && !via) return false;
    if (!origin || !destination) return false;
    return !areStationsSame();
  };

  const internalOnSearch = () => {
    setSubmitted(true);
    if (!isFormValid()) return;
    onSearch();
    if (user && origin && destination) {
      createRecentSearch({ userId: user.uid, via, origin, destination }).then(
        () => console.log('recent search item set'),
      );
    }
  };

  return (
    <div className="px-3 pt-3">
      <AnimatePresence>
        {areStationsSame() && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2"
          >
            <Alert severity="error">
              Origin and destination cannot be the same.
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Station inputs with timeline */}
      <div className="flex gap-3 mb-3">
        {/* Vertical timeline */}
        <div className="flex flex-col items-center pt-[14px] pb-[14px] gap-0">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0" />
          <span className="w-px flex-1 bg-border" style={{ minHeight: 22 }} />
          {hasIntermediateStop && (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-warning shrink-0" />
              <span className="w-px flex-1 bg-border" style={{ minHeight: 22 }} />
            </>
          )}
          <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
        </div>

        {/* Input fields */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <StationInput
            label="From"
            value={origin?.namen?.lang ?? ''}
            color="secondary"
            error={submitted && !origin ? 'Required' : undefined}
            onClick={() => handleTextClicked(LocationType.Origin)}
          />
          <AnimatePresence>
            {hasIntermediateStop && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              >
                <StationInput
                  label="Via"
                  value={via?.namen?.lang ?? ''}
                  color="warning"
                  error={submitted && !via ? 'Required' : undefined}
                  onClick={() => handleTextClicked(LocationType.Via)}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <StationInput
            label="To"
            value={destination?.namen?.lang ?? ''}
            color="primary"
            error={submitted && !destination ? 'Required' : undefined}
            onClick={() => handleTextClicked(LocationType.Destination)}
          />
        </div>

        {/* Swap button */}
        <div className="flex flex-col items-center justify-center">
          <motion.button
            type="button"
            onClick={swapLocations}
            whileTap={{ scale: 0.82 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ minWidth: 36, minHeight: 36, WebkitTapHighlightColor: 'transparent' }}
            className="flex items-center justify-center rounded-full bg-surface-2 border border-border text-white/40"
          >
            <ArrowUpDown size={15} />
          </motion.button>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-2 pb-3">
        {/* Date-time picker takes available space */}
        <div className="flex-1 min-w-0">
          <CustomDateTimePicker
            onChange={handleDateTimeChange}
            value={selectedDateTime}
            isArrival={isArrival}
          />
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Via toggle */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.82 }}
            onClick={() => { setHasIntermediateStop(!hasIntermediateStop); setVia(undefined); }}
            style={{ minWidth: 40, minHeight: 40, WebkitTapHighlightColor: 'transparent' }}
            className="flex items-center justify-center rounded-full text-warning"
          >
            {hasIntermediateStop ? <MapPinX size={19} /> : <MapPinPlus size={19} />}
          </motion.button>

          {/* Settings */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.82 }}
            onClick={() => setOpenSearchSettings(true)}
            style={{ minWidth: 40, minHeight: 40, WebkitTapHighlightColor: 'transparent' }}
            className="relative flex items-center justify-center rounded-full text-white/50"
          >
            <Settings size={19} />
            {settingsEnabled && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-secondary" />
            )}
          </motion.button>

          {/* Search / Refresh */}
          {variant === 'search' ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={internalOnSearch}
              style={{ minWidth: 44, minHeight: 44, WebkitTapHighlightColor: 'transparent' }}
              className="flex items-center justify-center rounded-full bg-primary text-white"
            >
              <Search size={18} />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              whileTap={{ scale: 0.82 }}
              onClick={internalOnSearch}
              style={{ minWidth: 40, minHeight: 40, WebkitTapHighlightColor: 'transparent' }}
              className="flex items-center justify-center rounded-full text-primary"
            >
              <motion.span
                animate={isInitialLoading ? { rotate: 360 } : { rotate: 0 }}
                transition={isInitialLoading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
                style={{ display: 'flex' }}
              >
                <RefreshCw size={18} />
              </motion.span>
            </motion.button>
          )}
        </div>
      </div>

      {openStationSelection && (
        <StationSelectionDialog
          open={openStationSelection}
          onClose={handleStationSelectorClosed}
        />
      )}
      {openSearchSettings && (
        <SearchSettings
          open={openSearchSettings}
          onClose={() => setOpenSearchSettings(false)}
        />
      )}
    </div>
  );
}
