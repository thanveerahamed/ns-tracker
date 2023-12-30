import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

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
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Stations" {...a11yProps(0)} />
          <Tab label="Trips" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabIndex} index={0} sx={{ p: 1 }}>
        <FavouriteStations />
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={1}>
        <FavouriteTrips />
      </CustomTabPanel>
    </Box>
  );
}
