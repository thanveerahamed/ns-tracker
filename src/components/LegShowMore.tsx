import { Map } from 'lucide-react';

import { JourneyInformation } from './JourneyInformation.tsx';

import { useShow } from '../hooks/useShow.ts';
import { Leg } from '../types/trip.ts';

export default function LegShowMore({ leg }: { leg: Leg }) {
  const journeyInfo = useShow();
  return (
    <>
      <div className="flex">
        <button
          onClick={journeyInfo.show}
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors py-1"
        >
          <Map size={14} />
          Show route
        </button>
      </div>
      {journeyInfo.visible && (
        <JourneyInformation
          id={leg.journeyDetailRef}
          onClose={journeyInfo.hide}
          legOriginUicCode={leg.origin.uicCode}
          destinationUicCode={leg.destination.uicCode}
          intermediateStopsUicCodes={leg.stops.map((s) => s.uicCode)}
        />
      )}
    </>
  );
}
