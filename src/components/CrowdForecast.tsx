import { User, Users, Users2 } from 'lucide-react';

export default function CrowdForecast({
  crowdForecast,
}: {
  crowdForecast: string;
}) {
  if (crowdForecast === 'HIGH') {
    return <Users2 size={16} className="text-error" />;
  }

  if (crowdForecast === 'MEDIUM') {
    return <Users size={16} className="text-warning" />;
  }

  if (crowdForecast === 'LOW') {
    return <User size={16} className="text-success" />;
  }

  return null;
}
