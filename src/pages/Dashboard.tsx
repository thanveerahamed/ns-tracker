import React, { useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HistoryIcon from '@mui/icons-material/History';
import {
  Card,
  CardContent,
  Grid,
  ListSubheader,
  Paper,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import dayjs from 'dayjs';

import SearchFilter from '../components/SearchFilter.tsx';

import { auth } from '../services/firebase.ts';
import { useRecentSearch } from '../services/recent.ts';
import { RecentSearch } from '../types/recent.ts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [recentSearchSnapshots] = useRecentSearch(user?.uid);

  const recentSearch = useMemo(() => {
    return (
      recentSearchSnapshots?.docs.map((doc) => doc.data() as RecentSearch) ?? []
    ).sort((search1, search2) =>
      dayjs(search1.lastUpdatedAt) > dayjs(search2.lastUpdatedAt) ? -1 : 1,
    );
  }, [recentSearchSnapshots]);

  const handleSearch = () => {
    navigate('/tripsInformation');
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
                        onClick={() => {}}
                      >
                        <CardContent sx={{ textAlign: 'left' }}>
                          <HistoryIcon />
                          <br />
                          <Typography variant="body2">
                            {search.origin.namen.lang}
                          </Typography>
                          <ArrowDropDownIcon />
                          {search.via && (
                            <>
                              <Typography variant="body2">
                                {search.via.namen.lang}
                              </Typography>
                              <ArrowDropDownIcon />
                            </>
                          )}
                          <Typography variant="body2">
                            {search.destination.namen.lang}
                          </Typography>
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
