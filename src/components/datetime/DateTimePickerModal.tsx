import { MouseEvent, useEffect, useState } from 'react';

import {
  Button,
  DialogContent,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import dayjs, { Dayjs } from 'dayjs';

interface DatePickerModalProps {
  open: boolean;
  onChange: (currentTime: Dayjs | 'now', isArrival?: boolean) => void;
  value: Dayjs;
  isArrival?: boolean;
  onClose: () => void;
}

export default function DateTimePickerModal({
  open,
  onChange,
  value,
  isArrival,
  onClose,
}: DatePickerModalProps) {
  const [currentDateTime, setCurrentDateTime] = useState<Dayjs>(value);
  const [internalIsArrival, setInternalIsArrival] = useState<
    boolean | undefined
  >(isArrival);

  const handleDateTimeChange = (value: Dayjs | null) => {
    if (value) {
      setCurrentDateTime(value);
    }
  };

  const handleArrivalChange = (
    _event: MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setInternalIsArrival(newAlignment === 'arrival');
  };

  const handleSave = () => onChange(currentDateTime, internalIsArrival);

  const handleNow = () => {
    setCurrentDateTime(dayjs());
    setInternalIsArrival(false);

    onChange(dayjs(), false);
  };

  useEffect(() => {
    setCurrentDateTime(value);
  }, [value]);

  return (
    <Dialog open={open}>
      <DialogContent sx={{ padding: '0' }}>
        <Paper variant="outlined" sx={{ padding: '5px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ marginRight: 'auto' }}>
              {internalIsArrival !== undefined && (
                <ToggleButtonGroup
                  color="primary"
                  value={internalIsArrival ? 'arrival' : 'departure'}
                  exclusive
                  onChange={handleArrivalChange}
                  aria-label="Platform"
                >
                  <ToggleButton value="departure">Departure</ToggleButton>
                  <ToggleButton value="arrival">Arrival</ToggleButton>
                </ToggleButtonGroup>
              )}
            </Box>
            <Button onClick={handleNow} color="secondary" variant="contained">
              NOW
            </Button>
          </Box>
        </Paper>
        <StaticDateTimePicker
          onChange={handleDateTimeChange}
          value={currentDateTime}
          slotProps={{ actionBar: { actions: [] } }}
        />
        <Paper variant="outlined" sx={{ padding: '5px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} color="warning">
              CANCEL
            </Button>
            <Button onClick={handleSave}>OK</Button>
          </Box>
        </Paper>
      </DialogContent>
    </Dialog>
  );
}
