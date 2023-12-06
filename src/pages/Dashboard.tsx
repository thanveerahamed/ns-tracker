import { useState } from 'react';

import { Timeline } from '@mui/lab';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';

import StationSelectionDialog from '../components/StationSelectionDialog.tsx';

import { LocationType, Station } from '../types/station.ts';

export default function Dashboard() {
  const [openStationSelection, setOpenStationSelection] =
    useState<boolean>(false);
  const [origin, setOrigin] = useState<Station | undefined>(undefined);
  const [destination, setDestination] = useState<Station | undefined>(
    undefined,
  );
  const [locationTypeClicked, setLocationTypeClicked] = useState<
    LocationType | undefined
  >(undefined);

  const handleTextFocused = (locationType: LocationType) => {
    setLocationTypeClicked(locationType);
    setOpenStationSelection(true);
  };

  const handleStationSelectorClosed = (station?: Station) => {
    setOpenStationSelection(false);
    if (station !== undefined) {
      if (locationTypeClicked === LocationType.Origin) {
        setOrigin(station);
      }

      if (locationTypeClicked === LocationType.Destination) {
        setDestination(station);
      }
    }

    setLocationTypeClicked(undefined);
  };

  return (
    <>
      <Box>
        <Box sx={{ textAlign: 'center', marginTop: '1rem' }}>
          <Typography variant="h5">Welcome to</Typography>
          <Typography variant="h3">NS Tracker</Typography>
        </Box>
        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <TextField
                label="Origin"
                variant="outlined"
                fullWidth
                size="small"
                value={origin?.namen?.lang ?? ''}
                onClick={() => handleTextFocused(LocationType.Origin)}
              />
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
            </TimelineSeparator>
            <TimelineContent>
              <TextField
                label="Destination"
                variant="outlined"
                fullWidth
                size="small"
                value={destination?.namen?.lang ?? ''}
                onClick={() => handleTextFocused(LocationType.Destination)}
              />
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Box>

      {openStationSelection && (
        <StationSelectionDialog
          open={openStationSelection}
          onClose={handleStationSelectorClosed}
        />
      )}
    </>
  );
}
