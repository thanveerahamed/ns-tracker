import * as React from 'react';
import { useState } from 'react';

import SplitViewTimeLineView from './SplitViewTimeLineView.tsx';
import { Chip, Divider, LinearProgress, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import dayjs, { Dayjs } from 'dayjs';

import { useTripsInformation } from '../../apis/trips.ts';
import { useDialog } from '../../hooks/useDialog.ts';
import { IView } from '../../types/splitView.ts';
import DateTimePickerModal from '../datetime/DateTimePickerModal.tsx';

interface Props {
  view: IView;
}
export default function SplitViewTripInfoViewCard({ view }: Props) {
  const [dateTime, setDateTime] = useState<Dayjs>(dayjs());
  const dateTimeDialog = useDialog();
  const { isLoading, data } = useTripsInformation({
    dateTime,
    originUicCode: view.origin.UICCode,
    destinationUicCode: view.destination.UICCode,
  });

  const handleDateTimeChange = (newDateTime: Dayjs | 'now') => {
    if (newDateTime !== 'now') {
      setDateTime(newDateTime);
    }

    dateTimeDialog.close();
  };

  return (
    <>
      <Box sx={{ p: 1 }}>
        <Box sx={{ minHeight: '130px' }}>
          <SplitViewTimeLineView
            from={view.origin.namen.lang}
            to={view.destination.namen.lang}
          />
        </Box>
        <Stack justifyContent="center">
          <Chip
            label={dateTime.format('LLL')}
            onClick={() => dateTimeDialog.open()}
          />
        </Stack>
        <Divider>
          <Typography variant="caption">Departures</Typography>
        </Divider>
        {isLoading && <LinearProgress />}

        {data &&
          data.trips.map((trip) => {
            return <p>{trip.status}</p>;
          })}
      </Box>

      {dateTimeDialog.isOpen && (
        <DateTimePickerModal
          onChange={handleDateTimeChange}
          value={dateTime}
          open={dateTimeDialog.isOpen}
          onClose={() => dateTimeDialog.close()}
        />
      )}
    </>
  );
}
