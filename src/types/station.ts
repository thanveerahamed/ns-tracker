export interface Station {
  UICCode: string;
  stationType: string;
  EVACode: string;
  code: string;
  cdCode: number;
  sporen: Sporen[];
  synoniemen: string[];
  heeftFaciliteiten: boolean;
  heeftVertrektijden: boolean;
  heeftReisassistentie: boolean;
  namen: Namen;
  land: string;
  lat: number;
  lng: number;
  radius: number;
  naderenRadius: number;
  ingangsDatum: string;
  nearbyMeLocationId: NearbyMeLocationId;
}

export interface NearbyMeLocationId {
  value: string;
  type: string;
}

export interface Namen {
  lang: string;
  middel: string;
  kort: string;
}

export interface Sporen {
  spoorNummer: string;
}
