import * as React from 'react';

import { Stack, Typography, TypographyProps } from '@mui/material';
import { StackOwnProps } from '@mui/material/Stack/Stack';

interface Props extends TypographyProps {
  originalTime: string;
  isDelayed: boolean;
  delayedTime?: string;
  stackProps?: StackOwnProps;
}

export default function Timing({
  isDelayed,
  delayedTime,
  originalTime,
  ...rest
}: Props) {
  return (
    <>
      {isDelayed ? (
        <Stack direction="column" mb={2}>
          <Typography {...rest} sx={{ color: 'error.main' }}>
            {delayedTime}
          </Typography>
          <Typography
            variant="button"
            sx={{ lineHeight: 1, mt: 0.5, textDecoration: 'line-through' }}
          >
            {originalTime}
          </Typography>
        </Stack>
      ) : (
        <Typography {...rest}>{originalTime}</Typography>
      )}
    </>
  );
}
