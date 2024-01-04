import { MouseEvent, useEffect, useState } from 'react';

import {
  Button,
  DialogContent,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import dayjs, { Dayjs } from 'dayjs';

interface DatePickerModalProps {
  open: boolean;
  onChange: (currentTime: Dayjs | 'now', isArrival: boolean) => void;
  value: Dayjs;
  isArrival: boolean;
  onClose: () => void;
}

function DatePickerModal({
  open,
  onChange,
  value,
  isArrival,
  onClose,
}: DatePickerModalProps) {
  const [currentDateTime, setCurrentDateTime] = useState<Dayjs>(value);
  const [internalIsArrival, setInternalIsArrival] =
    useState<boolean>(isArrival);

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

interface CustomDateTimePickerProps {
  onChange: (currentTime: Dayjs | 'now', isArrival: boolean) => void;
  value: Dayjs | 'now';
  isArrival: boolean;
}
export default function CustomDateTimePicker({
  onChange,
  value,
  isArrival,
}: CustomDateTimePickerProps) {
  const [openDateTimeSelectorModel, setOpenDateTimeSelectorModel] =
    useState<boolean>(false);

  const handleModalClose = () => {
    setOpenDateTimeSelectorModel(false);
  };

  const handleModalOnChange = (
    currentTime: Dayjs | 'now',
    newIsArrival: boolean,
  ) => {
    onChange(currentTime, newIsArrival);
    handleModalClose();
  };

  return (
    <>
      <TextField
        label={isArrival ? 'Arrival' : 'Departure'}
        variant="outlined"
        value={
          value === 'now' ? 'now' : dayjs(value).format('DD MMM YYYY hh:mm A')
        }
        onClick={() => setOpenDateTimeSelectorModel(true)}
        onFocus={(event) => event.target.blur()}
      />
      <DatePickerModal
        open={openDateTimeSelectorModel}
        onChange={handleModalOnChange}
        value={value === 'now' ? dayjs() : dayjs(value)}
        isArrival={isArrival}
        onClose={handleModalClose}
      />
    </>
  );
}
