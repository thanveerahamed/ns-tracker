import { NSStation } from './station.ts';
import { Dayjs } from 'dayjs';

export interface UpdateRecentSearchProps {
  origin: NSStation;
  destination: NSStation;
  via?: NSStation;
}

export interface SearchFilter {
  origin?: NSStation;
  destination?: NSStation;
  via?: NSStation;
  isArrival: boolean;
  selectedDateTime: 'now' | Dayjs;
  hasIntermediateStop: boolean;
  onlyShowTransferEqualVia: boolean;
  settingsEnabled: boolean;
}
