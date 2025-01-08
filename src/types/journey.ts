export interface JourneyResponse {
  payload: Payload;
}

export type PartOfLeg = 'origin' | 'destination' | 'intermediate' | undefined;

export interface Payload {
  productNumbers: string[];
  stops: JourneyStop[];
  allowCrowdReporting: boolean;
  source: string;
}

export interface JourneyStop {
  id: string;
  stop: StopCoordinates;
  previousStopId: string[];
  nextStopId: string[];
  destination: string;
  status: string;
  arrivals: Location[];
  departures: Location[];
  actualStock?: Stock;
  plannedStock?: Stock;
  platformFeatures?: never[];
  coachCrowdForecast?: never[];
  partOfLeg: PartOfLeg;
}

export interface StopCoordinates {
  name: string;
  lng: number;
  lat: number;
  countryCode: string;
  uicCode: string;
}

export interface Location {
  product: Product;
  origin: Origin;
  destination: Destination;
  plannedTime: string;
  actualTime: string;
  delayInSeconds: number;
  plannedTrack: string;
  actualTrack: string;
  cancelled: boolean;
  crowdForecast: string;
  stockIdentifiers: string[];
}

export interface Product {
  number: string;
  categoryCode: string;
  shortCategoryName: string;
  longCategoryName: string;
  operatorCode: string;
  operatorName: string;
  type: string;
}

export interface Origin {
  name: string;
  lng: number;
  lat: number;
  countryCode: string;
  uicCode: string;
}

export interface Destination {
  name: string;
  lng: number;
  lat: number;
  countryCode: string;
  uicCode: string;
}

export interface Stock {
  trainType: string;
  numberOfSeats: number;
  numberOfParts: number;
  trainParts: TrainPart[];
  hasSignificantChange: boolean;
}

export interface TrainPart {
  stockIdentifier: string;
  facilities: string[];
  image: Image;
}

export interface Image {
  uri: string;
}
