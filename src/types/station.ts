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
