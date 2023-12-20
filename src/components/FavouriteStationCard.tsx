import * as React from 'react';

import TrainIcon from '@mui/icons-material/Train';
import { Card, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';

import { NSStation } from '../types/station.ts';

export default function FavouriteStationCard({
  station,
}: {
  station: NSStation;
}) {
  return (
    <Card
      sx={{
        marginRight: '5px',
        marginTop: '5px',
        flex: 1,
        flexBasis: '25%',
      }}
      variant="elevation"
    >
      <CardContent sx={{ textAlign: 'center' }}>
        <TrainIcon />
        <br />
        <Typography variant="caption">{station.namen.lang}</Typography>
      </CardContent>
    </Card>
  );
}
