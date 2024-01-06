import SyncIcon from '@mui/icons-material/Sync';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function ConnectionCounts({
  connections,
  hideIcon = false,
}: {
  connections: number;
  hideIcon?: boolean;
}) {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      {!hideIcon && <SyncIcon />}
      <Typography display="block" gutterBottom>
        {connections}
      </Typography>
    </Stack>
  );
}
