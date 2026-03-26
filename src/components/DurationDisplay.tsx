import { Trip } from '../types/trip.ts';
import { extendedDayjs } from '../utils/date.ts';

export default function DurationDisplay({ trip }: { trip: Trip }) {
  const actualDiff =
    trip.actualDurationInMinutes &&
    trip.actualDurationInMinutes !== trip.plannedDurationInMinutes;

  return (
    <div className="flex flex-col items-end">
      {actualDiff && (
        <span className="text-[13px] font-semibold text-secondary leading-tight">
          {extendedDayjs
            .duration(trip.actualDurationInMinutes!, 'minutes')
            .format('H[h] m[m]')}
        </span>
      )}
      {trip.plannedDurationInMinutes && (
        <span
          className={`text-[13px] font-semibold leading-tight ${
            actualDiff ? 'line-through text-white/25' : 'text-white/70'
          }`}
        >
          {extendedDayjs
            .duration(trip.plannedDurationInMinutes, 'minutes')
            .format('H[h] m[m]')}
        </span>
      )}
    </div>
  );
}
