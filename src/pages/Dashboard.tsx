import { useState } from 'react';

import AddLocationIcon from '@mui/icons-material/AddLocation';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PinDropIcon from '@mui/icons-material/PinDrop';
import SettingsIcon from '@mui/icons-material/Settings';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import { Timeline } from '@mui/lab';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import {
  Button,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

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
  const [hasIntermediateStop, setHasIntermediateStop] =
    useState<boolean>(false);
  const [isDeparture, setIsDeparture] = useState<boolean>(true);

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

  const handleSwap = () => {
    setDestination((previousDestination) => {
      setOrigin(previousDestination);
      return origin;
    });
  };

  return (
    <>
      <Box>
        <Paper
          variant="elevation"
          elevation={10}
          sx={{
            paddingBottom: '1rem',
            paddingTop: '5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ textAlign: 'center', marginTop: '10px' }}>
            <Typography variant="h5">Welcome to</Typography>
            <Typography variant="h3">NS Tracker</Typography>
          </Box>
          <Box
            sx={{
              border: '1px solid grey',
              borderRadius: '10px',
              margin: '0 5px 10px',
              display: 'flex',
            }}
          >
            <Timeline
              sx={{
                paddingRight: '0',
                [`& .${timelineItemClasses.root}:before`]: {
                  flex: 0,
                  padding: 0,
                },
              }}
            >
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="secondary">
                    <LocationOnIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ paddingRight: '0' }}>
                  <TextField
                    label="Origin"
                    variant="outlined"
                    fullWidth
                    value={origin?.namen?.lang ?? ''}
                    onClick={() => handleTextFocused(LocationType.Origin)}
                  />
                </TimelineContent>
              </TimelineItem>
              {hasIntermediateStop && (
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="warning">
                      <AddLocationIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ paddingRight: '0' }}>
                    <TextField
                      label="Via"
                      variant="outlined"
                      fullWidth
                      // value={origin?.namen?.lang ?? ''}
                      // onClick={() => handleTextFocused(LocationType.Origin)}
                    />
                  </TimelineContent>
                </TimelineItem>
              )}
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    <PinDropIcon />
                  </TimelineDot>
                </TimelineSeparator>
                <TimelineContent sx={{ paddingRight: '0' }}>
                  <TextField
                    label="Destination"
                    variant="outlined"
                    fullWidth
                    value={destination?.namen?.lang ?? ''}
                    onClick={() => handleTextFocused(LocationType.Destination)}
                  />
                </TimelineContent>
              </TimelineItem>
            </Timeline>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-evenly',
              }}
            >
              <IconButton onClick={handleSwap}>
                <SwapVertIcon />
              </IconButton>
              <IconButton
                color={hasIntermediateStop ? 'error' : 'warning'}
                onClick={() =>
                  setHasIntermediateStop((prevState) => !prevState)
                }
              >
                {hasIntermediateStop ? (
                  <WrongLocationIcon />
                ) : (
                  <AddLocationAltIcon />
                )}
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ margin: '0 16px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <MobileDateTimePicker
                label={isDeparture ? 'Departure' : 'Arrival'}
                defaultValue={dayjs()}
              />
              <FormControlLabel
                control={
                  <Switch
                    value={!isDeparture}
                    onClick={() => setIsDeparture((prevState) => !prevState)}
                  />
                }
                label="Arrival"
              />
              <IconButton color="primary">
                <SettingsIcon />
              </IconButton>
            </Box>
            <Button sx={{ marginTop: '10px' }} variant="contained" fullWidth>
              Search
            </Button>
          </Box>
        </Paper>
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
