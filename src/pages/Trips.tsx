import { useNavigate } from 'react-router-dom';

import SearchFilter from '../components/SearchFilter.tsx';
import TripsList from '../components/TripsList.tsx';

import { useTripsInformationContext } from '../context';

export default function Trips() {
  const navigate = useNavigate();
  const { reload, ...rest } = useTripsInformationContext();

  return (
    <>
      {/* Sticky search bar */}
      <div
        className="sticky top-0 z-40 border-b border-border"
        style={{ background: 'rgba(13,13,13,0.96)', backdropFilter: 'blur(20px)' }}
      >
        <SearchFilter onSearch={reload} variant="refresh" />
      </div>

      {/* Trip cards */}
      <TripsList
        {...rest}
        onTripSelected={(trip) => navigate(`/trip?ctxRecon=${trip.ctxRecon}`)}
      />
    </>
  );
}


