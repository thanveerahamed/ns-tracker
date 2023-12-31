import { useState } from 'react';

import { Card, CardContent, TextField } from '@mui/material';

import StationSelectionDialog from '../../components/StationSelectionDialog.tsx';

import { useDialog } from '../../hooks/useDialog.ts';
import { NSStation } from '../../types/station.ts';

export default function SplitViewForm() {
  const dialog = useDialog();
  const [origin, setOrigin] = useState<NSStation | undefined>(undefined);

  const handleTextClicked = () => {
    //setLocationTypeClicked(locationType);
    dialog.open();
  };

  const handleStationSelectorClosed = (station?: NSStation) => {
    setOrigin(station);
    dialog.close();
  };

  return (
    <>
      <Card>
        <CardContent>
          <TextField
            label="Origin"
            variant="outlined"
            fullWidth
            value={origin?.namen?.lang ?? ''}
            onClick={() => handleTextClicked()}
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
