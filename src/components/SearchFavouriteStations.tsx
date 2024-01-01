import React from 'react';

import TrainIcon from '@mui/icons-material/Train';
import {
  Card,
  CardContent,
  LinearProgress,
  ListSubheader,
} from '@mui/material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import { NSStation } from '../types/station.ts';

interface Props {
  stations: NSStation[];
  onSelect?: (station: NSStation) => void;
  showLoader?: boolean;
}

export default function SearchFavouriteStations({
  stations,
  onSelect,
  showLoader,
}: Props) {
  return (
    <List>
      <ListSubheader>Favourites</ListSubheader>
      {showLoader && <LinearProgress />}
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {stations.map((station) => {
          return (
            <Card
              key={station.UICCode}
              sx={{
                marginRight: '5px',
                marginTop: '5px',
                flex: 1,
                flexBasis: '25%',
              }}
              variant="elevation"
              onClick={() => {
                if (onSelect) {
                  onSelect(station);
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <TrainIcon />
                <br />
                <Typography variant="caption">{station.namen.lang}</Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </List>
  );
}
