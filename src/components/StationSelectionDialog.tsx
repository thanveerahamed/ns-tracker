import React, { forwardRef, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress, LinearProgress, TextField } from '@mui/material';
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
import { Station } from '../types/station.ts';

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
  onClose: (station?: Station) => void;
}

export default function StationSelectionDialog({ onClose, open }: Props) {
  const [searchText, setSearchText] = useState<string>('');

  const { isLoading, isError, data } = useStationsQuery({
    query: searchText,
    enabled: open && searchText.length >= 2,
  });

  const internalHandleCLose = () => {
    onClose();
  };

  const handleItemClick = (station?: Station) => {
    onClose(station);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchText(event.target.value);

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
        <List>
          {data &&
            (data.length > 0 ? (
              data.map((station) => (
                <ListItem
                  button
                  key={station.code}
                  onClick={() => handleItemClick(station)}
                >
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
                </ListItem>
              ))
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
