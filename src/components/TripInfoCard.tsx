import { ChevronDown } from 'lucide-react';
import { useCallback } from 'react';

import { TripInfoDetail } from './TripInfoDetail.tsx';
import { TripInfoDetailSmall } from './TripInfoDetailSmall.tsx';
import TripStartAndEndTime from './TripStartAndEndTime.tsx';
import { Alert } from './ui/alert.tsx';
import { motion } from 'framer-motion';

import { NSStation } from '../types/station.ts';
import { Trip } from '../types/trip.ts';

interface TripInfoCardActions {
  name: string;
  onClick: (event?: React.MouseEvent<HTMLElement>) => void;
  color?: string;
}

interface Props {
  trip: Trip;
  via?: NSStation;
  isFavourite: boolean;
  onSelect: (trip: Trip) => void;
  variant?: 'small' | 'regular';
  actions?: TripInfoCardActions[];
}

export default function TripInfoCard({
  trip,
  via,
  onSelect,
  isFavourite,
  actions,
  variant = 'regular',
}: Props) {
  const isChangeInIntermediateStop = useCallback(
    (trip: Trip) => {
      if (trip.legs.length > 1) {
        return Boolean(
          trip.legs.find((leg) => leg.destination.uicCode === via?.UICCode),
        );
      }
      return false;
    },
    [via],
  );

  if (trip.status === 'CANCELLED') {
    return (
      <details className="group mx-3 my-1.5 rounded-2xl overflow-hidden border border-error/25 bg-error/5">
        <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer list-none select-none">
          <div className="flex-1">
            <span className="text-xs text-error font-semibold uppercase tracking-wide">
              Cancelled
            </span>
            <TripStartAndEndTime trip={trip} />
          </div>
          <ChevronDown
            size={16}
            className="text-white/30 group-open:rotate-180 transition-transform shrink-0"
          />
        </summary>
        <div
          onClick={() => onSelect(trip)}
          className="px-4 pb-4 cursor-pointer"
        >
          {variant === 'small' ? (
            <TripInfoDetailSmall trip={trip} hideStartAndEndTime />
          ) : (
            <TripInfoDetail
              trip={trip}
              isChangeInIntermediateStop={isChangeInIntermediateStop(trip)}
              hideStartAndEndTime
              isFavourite={isFavourite}
            />
          )}
          {actions && actions.length > 0 && (
            <div className="flex justify-end gap-2 mt-3">
              {actions.map((action) => (
                <button
                  key={action.name}
                  onClick={action.onClick}
                  className="text-xs px-3 py-1 rounded-full border border-border text-white/60 hover:text-white transition-colors"
                >
                  {action.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </details>
    );
  }

  return (
    <motion.div
      className="mx-3 my-1.5"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
    >
      <button
        onClick={() => onSelect(trip)}
        className="w-full text-left rounded-2xl border overflow-hidden"
        style={{
          background:
            'linear-gradient(145deg, rgba(30,30,30,0.9) 0%, rgba(20,20,20,0.9) 100%)',
          borderColor:
            trip.status !== 'NORMAL'
              ? 'rgba(245,158,11,0.3)'
              : 'rgba(255,255,255,0.1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}
      >
        {trip.status !== 'NORMAL' && (
          <Alert
            severity="warning"
            className="rounded-none border-x-0 border-t-0 py-2 text-xs"
          >
            {trip.status}
          </Alert>
        )}
        {/* Green left accent strip for normal trips */}
        <div className="flex">
          {trip.status === 'NORMAL' && (
            <div className="w-0.75 bg-primary/60 shrink-0 rounded-l-2xl" />
          )}
          <div className="flex-1 p-4">
            {variant === 'small' ? (
              <TripInfoDetailSmall trip={trip} />
            ) : (
              <TripInfoDetail
                trip={trip}
                isChangeInIntermediateStop={isChangeInIntermediateStop(trip)}
                isFavourite={isFavourite}
              />
            )}
          </div>
        </div>
        {actions && actions.length > 0 && (
          <div className="flex justify-end gap-2 px-4 pb-3 -mt-1">
            {actions.map((action) => (
              <button
                key={action.name}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(e);
                }}
                className="text-xs px-3 py-1 rounded-full border border-border text-white/60 hover:text-white transition-colors"
              >
                {action.name}
              </button>
            ))}
          </div>
        )}
      </button>
    </motion.div>
  );
}
