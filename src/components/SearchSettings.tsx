import { ChangeEvent } from 'react';

import { SlideUpTransition } from './transitions/SlideUp.tsx';
import CloseIcon from '@mui/icons-material/Close';
import { FormControlLabel, Switch } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useSearchFilterContext } from '../context';

interface Props {
  open: boolean;
  onClose: () => void;
}
export default function SearchSettings({ open, onClose }: Props) {
  const { onlyShowTransferEqualVia, setOnlyShowTransferEqualVia } =
    useSearchFilterContext();

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={SlideUpTransition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Search settings
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={onlyShowTransferEqualVia}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setOnlyShowTransferEqualVia(event.target.checked);
              }}
            />
          }
          label="Only show results with transfer as via"
        />
      </Box>
    </Dialog>
  );
}
