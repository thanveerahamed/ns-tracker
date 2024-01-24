import { MouseEvent } from 'react';

import { Stack } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

interface Props {
  label: string;
  value?: string;
  options: { label: string; value: string }[];
  onChange: (newValue: string) => void;
}

export default function ToggleWithLabel({
  label,
  value,
  onChange,
  options,
}: Props) {
  const handleChange = (_event: MouseEvent<HTMLElement>, newValue: string) => {
    onChange(newValue);
  };

  return (
    <Stack
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      m={1}
    >
      <Typography>{label}</Typography>
      <ToggleButtonGroup
        color="primary"
        value={value}
        exclusive
        onChange={handleChange}
        aria-label={label}
      >
        {options.map((option) => (
          <ToggleButton key={option.value} value={option.value}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
}
