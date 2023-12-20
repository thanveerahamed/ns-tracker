import * as React from 'react';
import { useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import TrainIcon from '@mui/icons-material/Train';
import { Card, CardContent, CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { auth } from '../services/firebase.ts';
import { useFavouriteStation } from '../services/station.ts';
import { NSStation } from '../types/station.ts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

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
              <Card
                key={station.UICCode}
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
                  <Typography variant="caption">
                    {station.namen.lang}
                  </Typography>
                </CardContent>
              </Card>
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
