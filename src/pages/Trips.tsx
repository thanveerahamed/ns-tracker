import { useNavigate } from 'react-router-dom';

import { Paper } from '@mui/material';

import SearchFilter from '../components/SearchFilter.tsx';
import TripsList from '../components/TripsList.tsx';

import { useTripsInformationContext } from '../context';

export default function Trips() {
  const navigate = useNavigate();
  const { reload, ...rest } = useTripsInformationContext();

  return (
    <>
      <Paper
        variant="elevation"
        elevation={10}
        sx={{
          paddingBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <SearchFilter onSearch={reload} variant="refresh" />
      </Paper>
      <TripsList
        {...rest}
        onTripSelected={(trip) => navigate(`/trip?ctxRecon=${trip.ctxRecon}`)}
      />
    </>
  );
}
