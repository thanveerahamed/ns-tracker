import { useEffect, useState } from 'react';

import { useDialog } from '../../hooks/useDialog.ts';
import { IView } from '../../types/splitView.ts';
import { LocationType, NSStation } from '../../types/station.ts';
import StationSelectionDialog from '../StationSelectionDialog.tsx';

export default function SingleViewCard({
  title,
  onSelect,
  view,
}: {
  title: string;
  onSelect: (station: NSStation, type: LocationType) => void;
  view?: IView;
}) {
  const dialog = useDialog();
  const [origin, setOrigin] = useState<NSStation | undefined>(undefined);
  const [destination, setDestination] = useState<NSStation | undefined>(
    undefined,
  );
  const [locationTypeClicked, setLocationTypeClicked] = useState<LocationType>(
    LocationType.Origin,
  );

  const handleTextClicked = (locationType: LocationType) => {
    setLocationTypeClicked(locationType);
    dialog.open();
  };

  const handleStationSelectorClosed = (station?: NSStation) => {
    if (station) {
      if (locationTypeClicked === LocationType.Origin) {
        setOrigin(station);
      } else {
        setDestination(station);
      }

      onSelect(station, locationTypeClicked);
    }

    dialog.close();
  };

  useEffect(() => {
    if (view) {
      setOrigin(view.origin);
      setDestination(view.destination);
    }
  }, [view]);

  return (
    <>
      <div className="m-2 rounded-2xl border border-border bg-surface p-3">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
          {title}
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleTextClicked(LocationType.Origin)}
            className="w-full px-3 py-2 text-left rounded-xl bg-surface-2 border border-border text-sm hover:border-primary/50 transition-colors"
          >
            <span className={origin ? 'text-white' : 'text-white/30'}>
              {origin?.namen?.lang || 'Origin'}
            </span>
          </button>
          <button
            onClick={() => handleTextClicked(LocationType.Destination)}
            className="w-full px-3 py-2 text-left rounded-xl bg-surface-2 border border-border text-sm hover:border-primary/50 transition-colors"
          >
            <span className={destination ? 'text-white' : 'text-white/30'}>
              {destination?.namen?.lang || 'Destination'}
            </span>
          </button>
        </div>
      </div>

      {dialog.isOpen && (
        <StationSelectionDialog
          open={dialog.isOpen}
          onClose={handleStationSelectorClosed}
        />
      )}
    </>
  );
}
