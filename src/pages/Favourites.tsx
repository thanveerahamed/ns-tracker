import * as React from 'react';
import { useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import CustomTabPanel from '../components/CustomTabPanel.tsx';
import FavouriteStationCard from '../components/FavouriteStationCard.tsx';

import { auth } from '../services/firebase.ts';
import { useFavouriteStation } from '../services/station.ts';
import { NSStation } from '../types/station.ts';

function a11yProps(index: number) {
  return {
    'id': `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Favourites() {
  const [value, setValue] = React.useState(0);
  const [user] = useAuthState(auth);
  const [favouriteStationSnapshots, isFavouriteLoading] = useFavouriteStation(
    user?.uid,
  );

  const favouriteStations: NSStation[] = useMemo(() => {
    return (
      favouriteStationSnapshots?.docs.map((doc) => doc.data() as NSStation) ??
      []
    );
  }, [favouriteStationSnapshots]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Stations" {...a11yProps(0)} />
          <Tab label="Routes" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {isFavouriteLoading && <CircularProgress />}
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {favouriteStations.map((station) => {
            return (
              <FavouriteStationCard key={station.UICCode} station={station} />
            );
          })}
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
    </Box>
  );
}
