import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import dayjs, { Dayjs } from 'dayjs';

import CustomDateTimePicker from '../components/CustomDateTimePicker.tsx';
import StationSelectionDialog from '../components/StationSelectionDialog.tsx';

import { useSearchFilterContext } from '../context';
import { LocationType, NSStation } from '../types/station.ts';

export default function Dashboard() {
  const navigate = useNavigate();
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
  } = useSearchFilterContext();
  const [openStationSelection, setOpenStationSelection] =
    useState<boolean>(false);

  const [locationTypeClicked, setLocationTypeClicked] = useState<
    LocationType | undefined
  >(undefined);

  const handleTextClicked = (locationType: LocationType) => {
    setLocationTypeClicked(locationType);
    setOpenStationSelection(true);
  };

  const handleStationSelectorClosed = (station?: NSStation) => {
    setOpenStationSelection(false);
    if (station !== undefined) {
      if (locationTypeClicked === LocationType.Origin) {
        setOrigin(station);
      }

      if (locationTypeClicked === LocationType.Destination) {
        setDestination(station);
      }

      if (locationTypeClicked === LocationType.Via) {
        setVia(station);
      }
    }

    setLocationTypeClicked(undefined);
  };

  const handleSwap = () => {
    swapLocations();
  };

  const handleToggleIntermediateStop = () => {
    setHasIntermediateStop(!hasIntermediateStop);
    setVia(undefined);
  };

  const handleDateTimeChange = (value?: Dayjs | 'now') => {
    if (value) {
      setSelectedDateTime(value);
    }

    if (value === 'now') {
      setIsArrival(false);
    }
  };

  const handleIsArrivalChange = (newState: boolean) => {
    if (newState && selectedDateTime === 'now') {
      setSelectedDateTime(dayjs());
    }
    setIsArrival(newState);
  };

  const handleSearch = () => {
    navigate('/tripsInformation');
  };

  return (
    <>
      <Box>
        <Paper
          variant="elevation"
          elevation={10}
          sx={{
            paddingBottom: '1rem',
            paddingTop: '20%',
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
                    onClick={() => handleTextClicked(LocationType.Origin)}
                    onFocus={(event) => event.target.blur()}
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
                      value={via?.namen?.lang ?? ''}
                      onClick={() => handleTextClicked(LocationType.Via)}
                      onFocus={(event) => event.target.blur()}
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
                    onClick={() => handleTextClicked(LocationType.Destination)}
                    onFocus={(event) => event.target.blur()}
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
            </Box>
          </Box>
          <Box sx={{ margin: '0 16px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <CustomDateTimePicker
                onChange={handleDateTimeChange}
                value={selectedDateTime}
                isArrival={isArrival}
                setIsArrival={handleIsArrivalChange}
              />
              <IconButton
                color={hasIntermediateStop ? 'error' : 'warning'}
                onClick={handleToggleIntermediateStop}
              >
                {hasIntermediateStop ? (
                  <WrongLocationIcon />
                ) : (
                  <AddLocationAltIcon />
                )}
              </IconButton>
              <IconButton color="primary">
                <SettingsIcon />
              </IconButton>
            </Box>
            <Button
              sx={{ marginTop: '10px' }}
              variant="contained"
              fullWidth
              onClick={handleSearch}
            >
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
