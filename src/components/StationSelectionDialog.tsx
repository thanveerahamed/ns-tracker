import React, { forwardRef, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import FavouriteStations from './FavouriteStations.tsx';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
  LinearProgress,
  ListItemButton,
  ListSubheader,
  TextField,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { TransitionProps } from '@mui/material/transitions';

import { useStationsQuery } from '../apis/stations.ts';
import TrainStopImage from '../assets/train-stop.png';
import { useSnackbarContext } from '../context';
import { auth } from '../services/firebase.ts';
import {
  addFavouriteStation,
  removeFavouriteStation,
  useFavouriteStation,
} from '../services/station.ts';
import { NSStation } from '../types/station.ts';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  onClose: (station?: NSStation) => void;
}

export default function StationSelectionDialog({ onClose, open }: Props) {
  const [searchText, setSearchText] = useState<string>('');

  const { isLoading, isError, data } = useStationsQuery({
    query: searchText,
    enabled: open && searchText.length >= 2,
  });

  const [user] = useAuthState(auth);
  const { showNotification } = useSnackbarContext();

  const [favouriteStationSnapshots, isFavouriteLoading] = useFavouriteStation(
    user?.uid,
  );

  const internalHandleCLose = () => {
    onClose();
  };

  const handleItemClick = (station?: NSStation) => {
    onClose(station);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchText(event.target.value);

  const handleFavourite = async (
    action: 'add' | 'remove',
    station: NSStation,
  ) => {
    if (user) {
      if (action === 'add') {
        await addFavouriteStation(user.uid, station);
        showNotification('Favourite added!', 'success');
      } else {
        await removeFavouriteStation(user.uid, station);
        showNotification('Favourite removed!', 'success');
      }
    }
  };

  const favouriteStations: NSStation[] = useMemo(() => {
    return (
      favouriteStationSnapshots?.docs.map((doc) => doc.data() as NSStation) ??
      []
    );
  }, [favouriteStationSnapshots]);

  const filteredStations = useMemo(() => {
    if (data === undefined) {
      return undefined;
    }

    if (data) {
      return data.filter(
        (station) => station.stationType !== 'FACULTATIEF_STATION',
      );
    }
  }, [data]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={internalHandleCLose}
      TransitionComponent={Transition}
      keepMounted={false}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={internalHandleCLose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Stations
          </Typography>
        </Toolbar>
      </AppBar>
      <Box margin="10px">
        <TextField
          variant="outlined"
          placeholder="Enter station name..."
          onChange={handleTextChange}
          fullWidth
          focused
        />
        {isLoading && <LinearProgress color="secondary" />}
        {isError && <Alert severity="error">Some error occurred</Alert>}
        {!searchText && (
          <FavouriteStations
            stations={favouriteStations}
            onSelect={handleItemClick}
            showLoader={isFavouriteLoading}
          />
        )}

        <List>
          {filteredStations &&
            (filteredStations.length > 0 ? (
              <>
                <ListSubheader>Search results...</ListSubheader>
                {filteredStations.map((station) => (
                  <ListItem
                    key={station.UICCode}
                    secondaryAction={
                      favouriteStations.find(
                        (favourite) => favourite.UICCode === station.UICCode,
                      ) === undefined ? (
                        <IconButton
                          edge="end"
                          aria-label="start-border"
                          onClick={() => handleFavourite('add', station)}
                        >
                          <StarBorderIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          edge="end"
                          aria-label="start-border"
                          onClick={() => handleFavourite('remove', station)}
                          color="primary"
                        >
                          <StarIcon />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemButton onClick={() => handleItemClick(station)}>
                      <img
                        alt="tr_st"
                        src={TrainStopImage}
                        width="32px"
                        height="32px"
                        style={{ marginRight: '10px' }}
                      />
                      <ListItemText
                        primary={station.namen.lang}
                        secondary={station.stationType}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
            ) : (
              <Typography variant="caption">
                No stations to display..
              </Typography>
            ))}
        </List>
      </Box>
    </Dialog>
  );
}
