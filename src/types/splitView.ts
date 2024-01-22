import { NSStation } from './station.ts';

export interface IView {
  origin: NSStation;
  destination: NSStation;
  dateTime: string;
}

export interface ISplitView {
  view1: IView;
  view2: IView;
  createdAt: string;
  opened?: boolean;
}

export interface ISplitViewWithId extends ISplitView {
  id: string;
}
