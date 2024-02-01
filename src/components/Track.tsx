import { Typography } from '@mui/material';

interface Props {
  plannedTrack: string;
  actualTrack?: string;
}

export default function Track({ actualTrack, plannedTrack }: Props) {
  if (actualTrack && actualTrack !== plannedTrack) {
    return (
      <Typography sx={{ color: 'error.main' }}>Track: {actualTrack}</Typography>
    );
  }

  return (
    <Typography sx={{ color: 'primary.main' }}>
      Track: {plannedTrack}
    </Typography>
  );
}
