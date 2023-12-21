import SyncIcon from '@mui/icons-material/Sync';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function ConnectionCounts({
  connections,
}: {
  connections: number;
}) {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <SyncIcon />
      <Typography display="block" gutterBottom>
        {connections}
      </Typography>
    </Stack>
  );
}
