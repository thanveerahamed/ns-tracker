import { Dayjs } from 'dayjs';

export interface TripsInformation {
  source: string;
  trips: Trip[];
  scrollRequestBackwardContext: string;
  scrollRequestForwardContext: string;
}

export interface Trip {
  idx: number;
  uid: string;
  ctxRecon: string;
  sourceCtxRecon: string;
  plannedDurationInMinutes: number;
  actualDurationInMinutes: number;
  transfers: number;
  status: string;
  messages: never[];
  legs: Leg[];
  checksum: string;
  crowdForecast: string;
  punctuality: number;
  optimal: boolean;
  fares: never[];
  fareLegs: FareLeg[];
  productFare: ProductFare;
  fareOptions: FareOptions;
  nsiLink: NsiLink;
  type: string;
  shareUrl: Link;
  realtime: boolean;
  registerJourney: RegisterJourney;
  modalityListItems: ModalityListItem[];
  labelListItems?: LabelListItem[];
  primaryMessage?: PrimaryMessage;
}

export interface PrimaryMessage {
  title: string;
  nesProperties: NesProperties;
  message: Message;
  type: string;
}

export interface LabelListItem {
  label: string;
  stickerType: string;
}

export interface ModalityListItem {
  name: string;
  nameNesProperties: NameNesProperties2;
  iconNesProperties: IconNesProperties;
  actualTrack: string;
  accessibilityName: string;
}

export interface NameNesProperties2 {
  color: string;
  styles: Styles2;
}

export interface Styles2 {
  type: string;
  strikethrough: boolean;
  bold: boolean;
}

export interface RegisterJourney {
  url: string;
  searchUrl: string;
  status: string;
  bicycleReservationRequired: boolean;
}

export interface NsiLink {
  url: string;
  showInternationalBanner: boolean;
}

export interface FareOptions {
  isInternationalBookable: boolean;
  isInternational: boolean;
  isEticketBuyable: boolean;
  isPossibleWithOvChipkaart: boolean;
  isTotalPriceUnknown: boolean;
  supplementsBasedOnSelectedFare?: SupplementsBasedOnSelectedFare[];
  reasonEticketNotBuyable: ReasonEticketNotBuyable;
}

export interface ReasonEticketNotBuyable {
  reason: string;
  description: string;
}

export interface SupplementsBasedOnSelectedFare {
  supplementPriceInCents: number;
  fromUICCode: string;
  toUICCode: string;
  link: Link;
}

export interface ProductFare {
  priceInCents: number;
  priceInCentsExcludingSupplement: number;
  supplementInCents?: number;
  buyableTicketPriceInCents: number;
  buyableTicketPriceInCentsExcludingSupplement: number;
  buyableTicketSupplementPriceInCents?: number;
  product: string;
  travelClass: string;
  discountType: string;
}

export interface FareLeg {
  origin: Origin2;
  destination: Origin2;
  operator: string;
  productTypes: string[];
  fares: Fare[];
}

export interface Fare {
  priceInCents: number;
  priceInCentsExcludingSupplement: number;
  supplementInCents: number;
  buyableTicketSupplementPriceInCents: number;
  product: string;
  travelClass: string;
  discountType: string;
}

export interface Origin2 {
  name: string;
  lng: number;
  lat: number;
  countryCode: string;
  uicCode: string;
  stationCode: string;
  type: string;
}

export interface Leg {
  idx: string;
  name: string;
  travelType: string;
  direction: string;
  cancelled: boolean;
  changePossible: boolean;
  alternativeTransport: boolean;
  journeyDetailRef: string;
  origin: Origin;
  destination: Destination;
  product: Product;
  messages: Message[][];
  stops: Stop[];
  crowdForecast: string;
  bicycleSpotCount: number;
  punctuality: number;
  crossPlatformTransfer?: boolean;
  shorterStock: boolean;
  journeyDetail: JourneyDetail[];
  reachable: boolean;
  plannedDurationInMinutes: number;
  nesProperties: NesProperties2;
  notes?: Note[];
  transferMessages?: TransferMessage[];
}

export interface TransferMessage {
  message: string;
  accessibilityMessage: string;
  type: string;
  messageNesProperties: NameNesProperties;
}

export interface Note {
  value?: string;
  key: string;
  noteType: string;
  isPresentationRequired: boolean;
  routeIdxFrom?: number;
  routeIdxTo?: number;
  link?: Link;
}

export interface NesProperties2 {
  color: string;
  scope: string;
  styles: Styles;
}

export interface Styles {
  type: string;
  dashed: boolean;
}

export interface JourneyDetail {
  type: string;
  link: Link;
}

export interface Link {
  uri: string;
}

export interface Stop {
  uicCode: string;
  name: string;
  lat: number;
  lng: number;
  countryCode: string;
  notes: never[];
  routeIdx: number;
  plannedDepartureDateTime?: string;
  plannedDepartureTimeZoneOffset?: number;
  actualDepartureDateTime?: string;
  actualDepartureTimeZoneOffset?: number;
  actualDepartureTrack: string;
  plannedDepartureTrack: string;
  plannedArrivalTrack: string;
  actualArrivalTrack: string;
  departureDelayInSeconds?: number;
  cancelled: boolean;
  borderStop: boolean;
  passing: boolean;
  plannedArrivalDateTime?: string;
  plannedArrivalTimeZoneOffset?: number;
  actualArrivalDateTime?: string;
  actualArrivalTimeZoneOffset?: number;
  arrivalDelayInSeconds?: number;
}

export interface Message {
  id: string;
  externalId: string;
  head: string;
  text: string;
  lead: string;
  type: string;
  nesProperties: NesProperties;
}

export interface NesProperties {
  color: string;
  type: string;
  icon: string;
}

export interface Product {
  number: string;
  categoryCode: string;
  shortCategoryName: string;
  longCategoryName: string;
  operatorCode: string;
  operatorName: string;
  operatorAdministrativeCode: number;
  type: string;
  displayName: string;
  nameNesProperties: NameNesProperties;
  iconNesProperties: IconNesProperties;
}

export interface IconNesProperties {
  color: string;
  icon: string;
}

export interface NameNesProperties {
  color: string;
}

export interface Destination {
  name: string;
  lng: number;
  lat: number;
  countryCode: string;
  uicCode: string;
  stationCode: string;
  type: string;
  plannedTimeZoneOffset: number;
  plannedDateTime: string;
  actualTimeZoneOffset: number;
  actualDateTime: string;
  plannedTrack: string;
  actualTrack: string;
  checkinStatus: string;
  notes: never[];
  exitSide?: string;
}

export interface Origin {
  name: string;
  lng: number;
  lat: number;
  countryCode: string;
  uicCode: string;
  stationCode: string;
  type: string;
  plannedTimeZoneOffset: number;
  plannedDateTime: string;
  actualTimeZoneOffset: number;
  actualDateTime: string;
  plannedTrack: string;
  actualTrack: string;
  checkinStatus: string;
  notes: never[];
}

export interface GetTripsInformationProps {
  originUicCode: string;
  destinationUicCode: string;
  dateTime: Dayjs;
  viaUicCode?: string;
  searchForArrival?: boolean;
}
