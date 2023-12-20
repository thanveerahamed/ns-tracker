import GroupIcon from '@mui/icons-material/Group';
import Groups3Icon from '@mui/icons-material/Groups3';
import PersonIcon from '@mui/icons-material/Person';

import { Trip } from '../types/trip.ts';

export default function CrowdForecast({ trip }: { trip: Trip }) {
  const { crowdForecast } = trip;
  if (crowdForecast === 'HIGH') {
    return <Groups3Icon color="error" />;
  }

  if (crowdForecast === 'MEDIUM') {
    return <GroupIcon color="warning" />;
  }

  if (crowdForecast === 'LOW') {
    return <PersonIcon color="success" />;
  }

  return <></>;
}
