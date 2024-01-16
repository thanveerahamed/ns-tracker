import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import SearchSettings from './SearchSettings.tsx';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PinDropIcon from '@mui/icons-material/PinDrop';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import { Timeline } from '@mui/lab';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Badge, Button, IconButton, TextField } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { Dayjs } from 'dayjs';

import StationSelectionDialog from '../components/StationSelectionDialog.tsx';
import CustomDateTimePicker from '../components/datetime/CustomDateTimePicker.tsx';

import { useSearchFilterContext, useTripsInformationContext } from '../context';
import { auth } from '../services/firebase.ts';
import { createRecentSearch } from '../services/recent.ts';
import { LocationType, NSStation } from '../types/station.ts';

interface Props {
  onSearch: () => void;
  variant?: 'refresh' | 'search';
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
  const [openStationSelection, setOpenStationSelection] =
    useState<boolean>(false);
  const [openSearchSettings, setOpenSearchSettings] = useState<boolean>(false);
  const [locationTypeClicked, setLocationTypeClicked] = useState<
    LocationType | undefined
  >(undefined);
  const [submitted, setSubmitted] = useState<boolean>(false);

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

  const handleDateTimeChange = (
    value: Dayjs | 'now',
    isArrivalValue?: boolean,
  ) => {
    setSelectedDateTime(value);

    if (isArrivalValue !== undefined) {
      setIsArrival(isArrivalValue);
    }
  };

  const areStationsSame = () =>
    origin &&
    destination &&
    (origin.UICCode === destination.UICCode ||
      origin.UICCode === via?.UICCode ||
      via?.UICCode === destination.UICCode);

  const isFormValid = () => {
    if (hasIntermediateStop && !via) {
      return false;
    }

    if (!origin || !destination) {
      return false;
    }

    return !areStationsSame();
  };

  const internalOnSearch = () => {
    setSubmitted(true);

    if (!isFormValid()) {
      return;
    }

    onSearch();
    if (user && origin && destination) {
      createRecentSearch({ userId: user.uid, via, origin, destination }).then(
        () => {
          console.log('recent search item set');
        },
      );
    }
  };

  return (
    <>
      {areStationsSame() && (
        <Alert severity="error">
          Origin and destination(s) cannot be same.
        </Alert>
      )}
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
                error={submitted && origin === undefined}
                helperText={
                  submitted && origin === undefined
                    ? 'Please select an origin!'
                    : undefined
                }
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
                  error={submitted && via === undefined}
                  helperText={
                    submitted && via === undefined
                      ? 'Please select an intermediate stop!'
                      : undefined
                  }
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
                error={submitted && destination === undefined}
                helperText={
                  submitted && destination === undefined
                    ? 'Please select a destination!'
                    : undefined
                }
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <CustomDateTimePicker
            onChange={handleDateTimeChange}
            value={selectedDateTime}
            isArrival={isArrival}
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
          <IconButton
            color="primary"
            onClick={() => setOpenSearchSettings(true)}
          >
            <Badge
              color="secondary"
              variant={settingsEnabled ? 'dot' : 'standard'}
            >
              <SettingsIcon />
            </Badge>
          </IconButton>
          {variant === 'search' ? (
            <Button
              color="primary"
              variant="contained"
              onClick={internalOnSearch}
            >
              <SearchIcon />
            </Button>
          ) : (
            <IconButton color="primary" onClick={internalOnSearch}>
              <RefreshIcon
                sx={
                  isInitialLoading
                    ? {
                        'animation': 'spin 2s linear infinite',
                        '@keyframes spin': {
                          '0%': {
                            transform: 'rotate(0)',
                          },
                          '100%': {
                            transform: 'rotate(360deg)',
                          },
                        },
                      }
                    : {}
                }
              />
            </IconButton>
          )}
        </Box>
      </Box>

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
    </>
  );
}
