import { NSStation } from './station.ts';

export interface ISplitView {
  view1: {
    origin: NSStation;
    destination: NSStation;
  };
  view2: {
    origin: NSStation;
    destination: NSStation;
  };
  createdAt: string;
}
