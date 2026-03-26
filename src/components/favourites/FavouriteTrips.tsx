import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import { useSnackbarContext } from '../../context';
import { auth } from '../../services/firebase.ts';
import { removeFavouriteTrip, useFavouriteTrip } from '../../services/trip.ts';
import { FavouriteTrip } from '../../types/trip.ts';
import { extendedDayjs as dayjs } from '../../utils/date.ts';
import TripInfoCard from '../TripInfoCard.tsx';

interface MemoizedTrips {
  old: FavouriteTrip[];
  upcoming: FavouriteTrip[];
  current: FavouriteTrip[];
}

const sortDesc = (a: FavouriteTrip, b: FavouriteTrip) =>
  dayjs(b.legs[0].origin.actualDateTime).diff(
    dayjs(a.legs[0].origin.actualDateTime),
  );
const sortAsc = (a: FavouriteTrip, b: FavouriteTrip) =>
  dayjs(a.legs[0].origin.actualDateTime).diff(
    dayjs(b.legs[0].origin.actualDateTime),
  );

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
        {label}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function FavouriteTripItem({
  trip,
  onRemove,
}: {
  trip: FavouriteTrip;
  onRemove: (t: FavouriteTrip) => void;
}) {
  const navigate = useNavigate();
  return (
    <div>
      <TripInfoCard
        trip={trip}
        onSelect={() => navigate(`/trip?ctxRecon=${trip.ctxRecon}`)}
        isFavourite
        actions={[
          {
            color: 'secondary',
            onClick: (e) => {
              e?.stopPropagation();
              onRemove(trip);
            },
            name: 'Remove',
          },
        ]}
      />
    </div>
  );
}

export default function FavouriteTrips() {
  const [user] = useAuthState(auth);
  const { showNotification } = useSnackbarContext();
  const [snapshots, isLoading] = useFavouriteTrip(user?.uid);

  const trips = useMemo(() => {
    const result = snapshots?.docs.reduce(
      (acc: MemoizedTrips, doc) => {
        const data = doc.data() as { trip: string };
        const trip = {
          ...JSON.parse(data.trip),
          docId: doc.id,
        } as FavouriteTrip;
        const isCurrent = dayjs().isBetween(
          trip.legs[0].origin.actualDateTime,
          trip.legs[trip.legs.length - 1].destination.actualDateTime,
          'seconds',
          '[)',
        );
        if (isCurrent) return { ...acc, current: [...acc.current, trip] };
        if (dayjs(trip.legs[0].origin.actualDateTime).isBefore(dayjs())) {
          return { ...acc, old: [...acc.old, trip] };
        }
        return { ...acc, upcoming: [...acc.upcoming, trip] };
      },
      { old: [], upcoming: [], current: [] },
    ) ?? { old: [], upcoming: [], current: [] };
    return {
      old: result.old.sort(sortDesc),
      upcoming: result.upcoming.sort(sortAsc),
      current: result.current.sort(sortAsc),
    };
  }, [snapshots]);

  const handleRemove = (trip: FavouriteTrip) => {
    if (user?.uid) {
      removeFavouriteTrip(user.uid, trip.docId)
        .then(() => showNotification('Removed from favourite!', 'success'))
        .catch(() => showNotification('Some error occurred!', 'error'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!snapshots?.size) {
    return <p className="p-4 text-sm text-white/40">No favourites.</p>;
  }

  return (
    <div>
      {trips.current.length > 0 && (
        <>
          <SectionHeader label="Current" />
          {trips.current.map((t, i) => (
            <FavouriteTripItem key={`c${i}`} trip={t} onRemove={handleRemove} />
          ))}
        </>
      )}
      {trips.upcoming.length > 0 && (
        <>
          <SectionHeader label="Upcoming" />
          {trips.upcoming.map((t, i) => (
            <FavouriteTripItem key={`u${i}`} trip={t} onRemove={handleRemove} />
          ))}
        </>
      )}
      {trips.old.length > 0 && (
        <>
          <SectionHeader label="Past" />
          {trips.old.map((t, i) => (
            <FavouriteTripItem key={`o${i}`} trip={t} onRemove={handleRemove} />
          ))}
        </>
      )}
    </div>
  );
}
