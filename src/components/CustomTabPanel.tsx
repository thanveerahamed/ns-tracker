import { ReactNode } from 'react';

import Box, { BoxProps } from '@mui/material/Box';

interface TabPanelProps extends BoxProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export default function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box {...other}>{children}</Box>}
    </div>
  );
}
