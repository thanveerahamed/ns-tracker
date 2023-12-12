import { useEffect, useState } from 'react';

import { Button, DialogActions, DialogContent, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import dayjs, { Dayjs } from 'dayjs';

interface DatePickerModalProps {
  open: boolean;
  onChange: (currentTime?: Dayjs | 'now') => void;
  value: Dayjs;
}

function DatePickerModal({ open, onChange, value }: DatePickerModalProps) {
  const [currentDateTime, setCurrentDateTime] = useState<Dayjs>(value);
  const handleDateTimeChange = (value: Dayjs | null) => {
    if (value) {
      setCurrentDateTime(value);
    }
  };

  const handleClose = (dateTime?: Dayjs | 'now') => {
    onChange(dateTime);
  };

  useEffect(() => {
    setCurrentDateTime(value);
  }, [value]);

  return (
    <Dialog open={open}>
      <DialogContent sx={{ padding: '0' }}>
        <StaticDateTimePicker
          onChange={handleDateTimeChange}
          value={currentDateTime}
          slotProps={{ actionBar: { actions: [] } }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ marginRight: 'auto' }}
          color="secondary"
          variant="outlined"
          onClick={() => handleClose('now')}
        >
          NOW
        </Button>
        <Button onClick={() => handleClose()}>CANCEL</Button>
        <Button onClick={() => handleClose(currentDateTime)}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}

interface CustomDateTimePickerProps {
  label: string;
  onChange: (currentTime?: Dayjs | 'now') => void;
  value: Dayjs | 'now';
}
export default function CustomDateTimePicker({
  label,
  onChange,
  value,
}: CustomDateTimePickerProps) {
  const [openDateTimeSelectorModel, setOpenDateTimeSelectorModel] =
    useState<boolean>(false);

  const handleModalOnChange = (currentTime?: Dayjs | 'now') => {
    if (currentTime) {
      onChange(currentTime);
    }

    setOpenDateTimeSelectorModel(false);
  };

  return (
    <>
      <TextField
        label={label}
        variant="outlined"
        value={
          value === 'now' ? 'now' : dayjs(value).format('DD MMM YYYY hh:mm A')
        }
        onClick={() => setOpenDateTimeSelectorModel(true)}
      />
      <DatePickerModal
        open={openDateTimeSelectorModel}
        onChange={handleModalOnChange}
        value={value === 'now' ? dayjs() : dayjs(value)}
      />
    </>
  );
}
