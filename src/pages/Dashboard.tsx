import { useNavigate } from 'react-router-dom';

import { Paper, Typography } from '@mui/material';
import Box from '@mui/material/Box';

import SearchFilter from '../components/SearchFilter.tsx';

export default function Dashboard() {
  const navigate = useNavigate();

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
          {/*<Box sx={{ marginTop: '10px', padding: '0 20px' }}>*/}
          {/*  <Button variant="contained" fullWidth onClick={handleSearch}>*/}
          {/*    Search*/}
          {/*  </Button>*/}
          {/*</Box>*/}
        </Paper>
      </Box>
    </>
  );
}
