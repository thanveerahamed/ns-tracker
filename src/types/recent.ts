import { NSStation } from './station.ts';

export interface RecentSearch {
  origin: NSStation;
  destination: NSStation;
  via?: NSStation;
  lastUpdatedAt: string;
}
