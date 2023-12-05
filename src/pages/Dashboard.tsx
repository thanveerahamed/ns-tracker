import { useQuery } from '@tanstack/react-query';

import { getStations } from '../services/station.ts';

export default function Dashboard() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['stations', 'alm'],
    queryFn: async () => {
      const { payload: stations } = await getStations('alm');
      return stations;
    },
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  // We can assume by this point that `isSuccess === true`
  return (
    <ul>{data?.map((todo) => <li key={todo.code}>{todo.namen.lang}</li>)}</ul>
  );
}
