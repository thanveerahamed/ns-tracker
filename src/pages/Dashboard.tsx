import { useEffect, useState } from 'react';

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
import dayjs, { Dayjs } from 'dayjs';

import CustomDateTimePicker from '../components/CustomDateTimePicker.tsx';
import StationSelectionDialog from '../components/StationSelectionDialog.tsx';

import { useTripsInformation } from '../apis/stations.ts';
import {
  getArrivalToggleFromCache,
  getSearchDateTimeFromCache,
  getStationFromCache,
  saveArrivalToggleToCache,
  saveSearchDateTimeToCache,
  saveStationToCache,
} from '../services/cache.ts';
import { LocationType, NSStation } from '../types/station.ts';

export default function Dashboard() {
  const [openStationSelection, setOpenStationSelection] =
    useState<boolean>(false);
  const [origin, setOrigin] = useState<NSStation | undefined>(
    getStationFromCache(LocationType.Origin),
  );
  const [destination, setDestination] = useState<NSStation | undefined>(
    getStationFromCache(LocationType.Destination),
  );
  const [via, setVia] = useState<NSStation | undefined>(
    getStationFromCache(LocationType.Via),
  );
  const [isArrival, setIsArrival] = useState<boolean>(
    getArrivalToggleFromCache(),
  );
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | 'now'>(
    isArrival && getSearchDateTimeFromCache() === 'now'
      ? dayjs()
      : dayjs(getSearchDateTimeFromCache()),
  );
  const [locationTypeClicked, setLocationTypeClicked] = useState<
    LocationType | undefined
  >(undefined);
  const [hasIntermediateStop, setHasIntermediateStop] =
    useState<boolean>(false);

  const { data } = useTripsInformation({
    viaUicCode: via?.UICCode,
    searchForArrival: isArrival,
    dateTime:
      selectedDateTime === undefined && selectedDateTime === 'now'
        ? dayjs()
        : dayjs(selectedDateTime),
    destinationUicCode: destination?.UICCode,
    originUicCode: origin?.UICCode,
  });

  console.log('tripsInformation', data);

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
    setDestination((previousDestination) => {
      setOrigin(previousDestination);
      return origin;
    });
  };

  const handleToggleIntermediateStop = () => {
    setHasIntermediateStop((prevState) => !prevState);
    setVia(undefined);
  };

  const handleDateTimeChange = (value?: Dayjs | 'now') => {
    if (value) {
      setSelectedDateTime(value);
      console.log('formatting', dayjs(value).format('YYYY-MM-DDTHH:mm:ssZ[Z]'));
    }

    if (value === 'now') {
      setIsArrival(false);
    }

    saveSearchDateTimeToCache(value ?? undefined);
  };

  const handleSwitchChange = () => {
    setIsArrival((prevState) => {
      const newState = !prevState;

      if (newState && selectedDateTime === 'now') {
        setSelectedDateTime(dayjs());
      }

      return newState;
    });
  };

  useEffect(() => {
    saveStationToCache(LocationType.Via, via);
    saveStationToCache(LocationType.Origin, origin);
    saveStationToCache(LocationType.Destination, destination);
    saveArrivalToggleToCache(isArrival);
  }, [via, origin, destination, isArrival]);

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
                    onClick={() => handleTextClicked(LocationType.Origin)}
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
                onClick={handleToggleIntermediateStop}
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
              <CustomDateTimePicker
                label={isArrival ? 'Arrival' : 'Departure'}
                onChange={handleDateTimeChange}
                value={selectedDateTime}
              />
              <FormControlLabel
                control={
                  <Switch checked={isArrival} onClick={handleSwitchChange} />
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
