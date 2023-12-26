import React, { useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import {
  Card,
  CardContent,
  Grid,
  ListSubheader,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import dayjs from 'dayjs';

import SearchFilter from '../components/SearchFilter.tsx';

import { useTripsInformationContext } from '../context';
import { auth } from '../services/firebase.ts';
import { useRecentSearch } from '../services/recent.ts';
import { RecentSearch } from '../types/recent.ts';
import { UpdateRecentSearchProps } from '../types/search.ts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [recentSearchSnapshots] = useRecentSearch(user?.uid);

  const { updateRecentSearch, reload } = useTripsInformationContext();

  const recentSearch = useMemo(() => {
    return (
      recentSearchSnapshots?.docs.map((doc) => doc.data() as RecentSearch) ?? []
    ).sort((search1, search2) =>
      dayjs(search1.lastUpdatedAt) > dayjs(search2.lastUpdatedAt) ? -1 : 1,
    );
  }, [recentSearchSnapshots]);

  const handleSearch = () => {
    setTimeout(() => {
      reload();
      navigate('/tripsInformation');
    }, 1000);
  };

  const handleRecentSearchClicked = (props: UpdateRecentSearchProps) => {
    updateRecentSearch(props);
  };

  return (
    <>
      <Box>
        <Paper
          variant="elevation"
          elevation={10}
          sx={{
            paddingBottom: '1rem',
            paddingTop: '20%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ textAlign: 'center', marginTop: '10px' }}>
            <Typography variant="h5">Welcome to</Typography>
            <Typography variant="h3">NS Tracker</Typography>
          </Box>
          <SearchFilter onSearch={handleSearch} />
        </Paper>

        {recentSearch.length > 0 && (
          <List>
            <ListSubheader>Recent search</ListSubheader>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <Grid container spacing={1}>
                {recentSearch.map((search, index) => {
                  return (
                    <Grid item xs={6} key={index}>
                      <Card
                        sx={{
                          height: '100%',
                        }}
                        variant="elevation"
                        onClick={() =>
                          handleRecentSearchClicked({
                            via: search.via,
                            origin: search.origin,
                            destination: search.destination,
                          })
                        }
                      >
                        <CardContent sx={{ textAlign: 'left' }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            mb={1}
                          >
                            <ArrowDownwardIcon color="primary" />
                            <Typography variant="caption">
                              {search.origin.namen.lang}
                            </Typography>
                          </Stack>
                          {search.via && (
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                              mb={1}
                            >
                              <ArrowDownwardIcon />
                              <Typography variant="caption">
                                {search.via.namen.lang}
                              </Typography>
                            </Stack>
                          )}
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <GpsFixedIcon color="secondary" />
                            <Typography variant="caption">
                              {search.destination.namen.lang}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </List>
        )}
      </Box>
    </>
  );
}
