export interface NSStation {
  UICCode: string;
  stationType: string;
  EVACode: string;
  code: string;
  cdCode: number;
  sporen: NSSporen[];
  synoniemen: string[];
  heeftFaciliteiten: boolean;
  heeftVertrektijden: boolean;
  heeftReisassistentie: boolean;
  namen: NSNamen;
  land: string;
  lat: number;
  lng: number;
  radius: number;
  naderenRadius: number;
  ingangsDatum: string;
  nearbyMeLocationId: NSNearbyMeLocationId;
}

export enum LocationType {
  Origin = 'origin',
  Destination = 'destination',
  Via = 'via',
}

export interface NSNearbyMeLocationId {
  value: string;
  type: string;
}

export interface NSNamen {
  lang: string;
  middel: string;
  kort: string;
}

export interface NSSporen {
  spoorNummer: string;
}

export interface Journey {
  payload: JourneyPayload;
  links: Links;
  meta: Meta;
}

export interface JourneyPayload {
  source: string;
  departures: Departure[];
}

export interface Departure {
  direction: string;
  name: string;
  plannedDateTime: string;
  plannedTimeZoneOffset: number;
  actualDateTime: string;
  actualTimeZoneOffset: number;
  plannedTrack: string;
  actualTrack: string;
  product: Product;
  trainCategory: string;
  cancelled: boolean;
  routeStations: RouteStation[];
  messages: Message[];
  departureStatus: string;
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

export interface RouteStation {
  uicCode: string;
  mediumName: string;
}

export interface Message {
  message: string;
  style: string;
}

export interface Links {
  disruptions: Disruptions;
}

export interface Disruptions {
  uri: string;
}

export interface Meta {
  numberOfDisruptions: number;
}
