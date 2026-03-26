import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import SplitViewTimeLineView from './SplitViewTimeLineView.tsx';
import dayjs, { Dayjs } from 'dayjs';

import { useDialog } from '../../hooks/useDialog.ts';
import { useTrips } from '../../hooks/useTrips.ts';
import { auth } from '../../services/firebase.ts';
import { updateSplitViewDate } from '../../services/splitView.ts';
import { IView } from '../../types/splitView.ts';
import { Trip } from '../../types/trip.ts';
import TripInfoCard from '../TripInfoCard.tsx';
import TripInformationDialog from '../TripInformationDialog.tsx';
import DateTimePickerModal from '../datetime/DateTimePickerModal.tsx';
import { LinearProgress } from '../ui/progress.tsx';

interface Props {
  splitViewId: string;
  view: IView;
  viewType: 'view1' | 'view2';
}

export default function SplitViewTripInfoViewCard({
  view,
  splitViewId,
  viewType,
}: Props) {
  const [user] = useAuthState(auth);
  const [dateTime, setDateTime] = useState<Dayjs>(dayjs(view.dateTime));
  const dateTimeDialog = useDialog();
  const journeyInfoDialog = useDialog();
  const { isInitialLoading, trips, loadLater, loadEarlier, isLoadMoreLoading } =
    useTrips({
      dateTime,
      originUicCode: view.origin.UICCode,
      destinationUicCode: view.destination.UICCode,
    });
  const [selectedTrip, setSelectedTrip] = useState<Trip>();

  const handleDateTimeChange = (newDateTime: Dayjs | 'now') => {
    if (newDateTime !== 'now') {
      setDateTime(newDateTime);
      updateSplitViewDate(
        user?.uid ?? '',
        splitViewId,
        viewType,
        newDateTime,
      ).then(() => {});
    }

    dateTimeDialog.close();
  };

  return (
    <>
      <div className="overflow-y-auto h-full">
        <div className="p-2">
          <SplitViewTimeLineView
            from={view.origin.namen.lang}
            to={view.destination.namen.lang}
          />
        </div>
        <div className="flex justify-center pb-2">
          <button
            onClick={dateTimeDialog.open}
            className="px-3 py-1 rounded-full bg-surface-2 border border-border text-xs text-white/70 hover:border-primary/50 transition-colors"
          >
            {dateTime.format('LLL')}
          </button>
        </div>
        <div className="border-t border-border" />
        {isInitialLoading && <LinearProgress />}
        <button
          onClick={loadEarlier}
          disabled={isLoadMoreLoading}
          className="w-full text-xs py-2 text-white/40 hover:text-white disabled:opacity-30 transition-colors"
        >
          Earlier
        </button>
        {trips
          ?.filter((t) => t.status !== 'CANCELLED')
          .map((trip, i) => (
            <TripInfoCard
              key={i}
              trip={trip}
              isFavourite={false}
              onSelect={() => {
                setSelectedTrip(trip);
                journeyInfoDialog.open();
              }}
              variant="small"
            />
          ))}
        <button
          onClick={loadLater}
          disabled={isLoadMoreLoading}
          className="w-full text-xs py-2 text-white/40 hover:text-white disabled:opacity-30 transition-colors"
        >
          Later
        </button>
      </div>

      {dateTimeDialog.isOpen && (
        <DateTimePickerModal
          onChange={handleDateTimeChange}
          value={dateTime}
          open={dateTimeDialog.isOpen}
          onClose={dateTimeDialog.close}
        />
      )}
      {journeyInfoDialog.isOpen && selectedTrip && (
        <TripInformationDialog
          journeyInfoDialog={journeyInfoDialog}
          onClose={() => {
            setSelectedTrip(undefined);
            journeyInfoDialog.close();
          }}
          trip={selectedTrip}
        />
      )}
    </>
  );
}
