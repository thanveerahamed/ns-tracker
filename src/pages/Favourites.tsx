import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import CustomTabPanel from '../components/CustomTabPanel.tsx';
import FavouriteStations from '../components/favourites/FavouriteStations.tsx';
import FavouriteTrips from '../components/favourites/FavouriteTrips.tsx';

function a11yProps(index: number) {
  return {
    'id': `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Favourites() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramTabIndex = searchParams.get('tabIndex');
  const tabIndex = paramTabIndex ? Number(paramTabIndex) : 0;

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    navigate(`/favourites?tabIndex=${newValue}`);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Favourites
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Trips" {...a11yProps(1)} />
          <Tab label="Stations" {...a11yProps(0)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabIndex} index={0}>
        <FavouriteTrips />
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={1} sx={{ p: 1 }}>
        <FavouriteStations />
      </CustomTabPanel>
    </Box>
  );
}
