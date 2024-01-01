import { NSStation } from './station.ts';

export interface IView {
  origin: NSStation;
  destination: NSStation;
}

export interface ISplitView {
  view1: IView;
  view2: IView;
  createdAt: string;
}
