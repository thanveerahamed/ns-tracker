import { useState } from 'react';

import DateTimePickerModal from './DateTimePickerModal.tsx';
import { TextField } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

interface CustomDateTimePickerProps {
  onChange: (currentTime: Dayjs | 'now', isArrival?: boolean) => void;
  value: Dayjs | 'now';
  isArrival?: boolean;
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
    newIsArrival?: boolean,
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
      <DateTimePickerModal
        open={openDateTimeSelectorModel}
        onChange={handleModalOnChange}
        value={value === 'now' ? dayjs() : dayjs(value)}
        isArrival={isArrival}
        onClose={handleModalClose}
      />
    </>
  );
}
