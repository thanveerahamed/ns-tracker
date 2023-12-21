import GroupIcon from '@mui/icons-material/Group';
import Groups3Icon from '@mui/icons-material/Groups3';
import PersonIcon from '@mui/icons-material/Person';

export default function CrowdForecast({
  crowdForecast,
}: {
  crowdForecast: string;
}) {
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
