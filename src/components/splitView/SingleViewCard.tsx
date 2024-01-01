import * as React from 'react';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, TextField } from '@mui/material';
import Box from '@mui/material/Box';

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
    if (locationTypeClicked === LocationType.Origin) {
      setOrigin(station);
    } else {
      setDestination(station);
    }

    if (station) {
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
      <Card sx={{ m: 1 }}>
        <CardHeader title={title} />
        <CardContent>
          <TextField
            label="Origin"
            variant="outlined"
            fullWidth
            value={origin?.namen?.lang ?? ''}
            onClick={() => handleTextClicked(LocationType.Origin)}
            onFocus={(event) => event.target.blur()}
          />
          <Box sx={{ m: 2 }} />
          <TextField
            label="Destination"
            variant="outlined"
            fullWidth
            value={destination?.namen?.lang ?? ''}
            onClick={() => handleTextClicked(LocationType.Destination)}
            onFocus={(event) => event.target.blur()}
          />
        </CardContent>
      </Card>

      {dialog.isOpen && (
        <StationSelectionDialog
          open={dialog.isOpen}
          onClose={handleStationSelectorClosed}
        />
      )}
    </>
  );
}
