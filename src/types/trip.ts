import { Dayjs } from 'dayjs';

export interface TripsInformation {
  source: string;
  trips: Trip[];
  scrollRequestBackwardContext: string;
  scrollRequestForwardContext: string;
  message: string;
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
  primaryMessage: PrimaryMessage;
  messages: Message[];
  legs: Leg[];
  overviewPolyLine: OverviewPolyLine[];
  crowdForecast: string;
  punctuality: number;
  optimal: boolean;
  fareRoute: FareRoute;
  fares: TripFare[];
  fareLegs: FareLeg[];
  productFare: ProductFare;
  fareOptions: FareOptions;
  bookingUrl: BookingUrl;
  nsiLink: NsiLink;
  type: string;
  shareUrl: ShareUrl;
  realtime: boolean;
  travelAssistanceInfo: TravelAssistanceInfo;
  routeId: string;
  registerJourney: RegisterJourney;
  eco: Eco;
  modalityListItems: ModalityListItem[];
  labelListItems: LabelListItem[];
}

export interface PrimaryMessage {
  title: string;
  nesProperties: NesProperties;
  message: Message;
  type: string;
}

export interface NesProperties {
  color: string;
  type: string;
  icon: string;
  scope: string;
  styles: Styles;
}

export interface Styles {
  type: string;
}

export interface Message {
  id: string;
  externalId: string;
  head: string;
  text: string;
  lead: string;
  routeIdxFrom: number;
  routeIdxTo: number;
  type: string;
  nesProperties: NesProperties;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  phase: string;
}

export interface Leg {
  idx: number;
  name: string;
  travelType: string;
  direction: string;
  partCancelled: boolean;
  cancelled: boolean;
  changePossible: boolean;
  alternativeTransport: boolean;
  journeyDetailRef: string;
  origin: TripLocation;
  destination: TripLocation;
  product: Product;
  sharedModality: SharedModality;
  notes: Note[];
  messages: Message[];
  transferMessages: TransferMessage[];
  stops: Stop[];
  steps: Step[];
  coordinates: number[][];
  crowdForecast: string;
  bicycleSpotCount: number;
  punctuality: number;
  crossPlatformTransfer: boolean;
  shorterStock: boolean;
  changeCouldBePossible: boolean;
  shorterStockWarning: string;
  shorterStockClassification: string;
  journeyDetail: JourneyDetail[];
  reachable: boolean;
  plannedDurationInMinutes: number;
  travelAssistanceDeparture: TravelAssistanceDeparture;
  travelAssistanceArrival: TravelAssistanceArrival;
  overviewPolyLine: OverviewPolyLine[];
  nesProperties: NesProperties;
}

export interface TripLocation {
  name: string;
  lng: number;
  lat: number;
  city: string;
  countryCode: string;
  uicCode: string;
  stationCode: string;
  type: string;
  prognosisType: string;
  plannedTimeZoneOffset: number;
  plannedDateTime: string;
  actualTimeZoneOffset: number;
  actualDateTime: string;
  plannedTrack: string;
  actualTrack: string;
  exitSide: string;
  checkinStatus: string;
  travelAssistanceBookingInfo: TravelAssistanceBookingInfo;
  travelAssistanceMeetingPoints: string[];
  travelAssistanceMeetingPointDetails: TravelAssistanceMeetingPointDetail[];
  notes: Note[];
  quayCode: string;
}

export interface TravelAssistanceBookingInfo {
  name: string;
  tripLegIndex: string;
  stationUic: string;
  serviceTypeIds: string[];
  defaultAssistanceValue: boolean;
  canChangeAssistance: boolean;
  message: string;
}

export interface TravelAssistanceMeetingPointDetail {
  name: string;
  minutesBefore: number;
}

export interface Note {
  value: string;
  accessibilityValue: string;
  key: string;
  noteType: string;
  priority: number;
  routeIdxFrom: number;
  routeIdxTo: number;
  link: Link;
  isPresentationRequired: boolean;
  category: string;
}

export interface Link {
  title: string;
  url: string;
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
  nesProperties: NesProperties;
}

export interface NameNesProperties {
  color: string;
  type: string;
  icon: string;
  scope: string;
  styles: Styles;
}

export interface IconNesProperties {
  color: string;
  type: string;
  icon: string;
  scope: string;
  styles: Styles;
}

export interface SharedModality {
  provider: string;
  name: string;
  availability: boolean;
  nearByMeMapping: string;
  planIcon: string;
}

export interface TransferMessage {
  message: string;
  accessibilityMessage: string;
  type: string;
  messageNesProperties: NesProperties;
  iconNesProperties: NesProperties;
}

export interface Stop {
  uicCode: string;
  name: string;
  lat: number;
  lng: number;
  countryCode: string;
  notes: StopNote[];
  routeIdx: number;
  departurePrognosisType: string;
  plannedDepartureDateTime: string;
  plannedDepartureTimeZoneOffset: number;
  actualDepartureDateTime: string;
  actualDepartureTimeZoneOffset: number;
  plannedArrivalDateTime: string;
  plannedArrivalTimeZoneOffset: number;
  actualArrivalDateTime: string;
  actualArrivalTimeZoneOffset: number;
  plannedPassingDateTime: string;
  actualPassingDateTime: string;
  arrivalPrognosisType: string;
  actualDepartureTrack: string;
  plannedDepartureTrack: string;
  plannedArrivalTrack: string;
  actualArrivalTrack: string;
  departureDelayInSeconds: number;
  arrivalDelayInSeconds: number;
  cancelled: boolean;
  borderStop: boolean;
  passing: boolean;
  quayCode: string;
}

export interface StopNote {
  value: string;
  key: string;
  type: string;
  priority: number;
}

export interface Step {
  distanceInMeters: number;
  durationInSeconds: number;
  startLocation: StartLocation;
  endLocation: EndLocation;
  instructions: string;
}

export interface StartLocation {
  station: Station;
  description: string;
}

export interface Station {
  uicCode: string;
  stationCode: string;
  name: string;
  coordinate: Coordinate;
  countryCode: string;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface EndLocation {
  station: Station;
  description: string;
}

export interface JourneyDetail {
  type: string;
  link: Link;
}

export interface TravelAssistanceDeparture {
  name: string;
  tripLegIndex: string;
  stationUic: string;
  serviceTypeIds: string[];
  defaultAssistanceValue: boolean;
  canChangeAssistance: boolean;
  message: string;
}

export interface TravelAssistanceArrival {
  name: string;
  tripLegIndex: string;
  stationUic: string;
  serviceTypeIds: string[];
  defaultAssistanceValue: boolean;
  canChangeAssistance: boolean;
  message: string;
}

export interface OverviewPolyLine {
  lat: number;
  lng: number;
}

export interface FareRoute {
  routeId: string;
  origin: FareRouteLocation;
  destination: FareRouteLocation;
}

export interface FareRouteLocation {
  varCode: number;
  name: string;
}
export interface TripFare {
  priceInCents: number;
  product: string;
  travelClass: string;
  priceInCentsExcludingSupplement: number;
  discountType: string;
  supplementInCents: number;
  link: string;
}

export interface FareLeg {
  origin: TripLocation;
  destination: TripLocation;
  operator: string;
  productTypes: string[];
  fares: FareLegFare[];
}

export interface FareLegFare {
  priceInCents: number;
  priceInCentsExcludingSupplement: number;
  supplementInCents: number;
  buyableTicketPriceInCents: number;
  buyableTicketPriceInCentsExcludingSupplement: number;
  buyableTicketSupplementPriceInCents: number;
  product: string;
  travelClass: string;
  discountType: string;
  link: string;
}

export interface ProductFare {
  priceInCents: number;
  priceInCentsExcludingSupplement: number;
  supplementInCents: number;
  buyableTicketPriceInCents: number;
  buyableTicketPriceInCentsExcludingSupplement: number;
  buyableTicketSupplementPriceInCents: number;
  product: string;
  travelClass: string;
  discountType: string;
  link: string;
}

export interface FareOptions {
  isInternationalBookable: boolean;
  isInternational: boolean;
  isEticketBuyable: boolean;
  isPossibleWithOvChipkaart: boolean;
  isTotalPriceUnknown: boolean;
  supplementsBasedOnSelectedFare: SupplementsBasedOnSelectedFare[];
  reasonEticketNotBuyable: ReasonEticketNotBuyable;
  salesOptions: SalesOption[];
}

export interface SupplementsBasedOnSelectedFare {
  supplementPriceInCents: number;
  fromUICCode: string;
  toUICCode: string;
  link: Link;
}

export interface ReasonEticketNotBuyable {
  reason: string;
  description: string;
}

export interface SalesOption {
  type: string;
  permilleFullTariff: number;
  priceInCents: number;
  originalPrice: number;
  betterOption: boolean;
  recommendationText: string;
}

export interface BookingUrl {
  title: string;
  url: string;
}

export interface NsiLink {
  url: string;
  showInternationalBanner: boolean;
}

export interface ShareUrl {
  title: string;
  url: string;
}

export interface TravelAssistanceInfo {
  termsAndConditionsLink: string;
  tripRequestId: number;
  isAssistanceRequired: boolean;
}

export interface RegisterJourney {
  url: string;
  searchUrl: string;
  status: string;
  bicycleReservationRequired: boolean;
  availability: Availability;
}

export interface Availability {
  seats: boolean;
  numberOfSeats: number;
  bicycle: boolean;
  numberOfBicyclePlaces: number;
}

export interface Eco {
  co2kg: number;
}

export interface ModalityListItem {
  name: string;
  nameNesProperties: NesProperties;
  iconNesProperties: NesProperties;
  actualTrack: string;
  accessibilityName: string;
}

export interface LabelListItem {
  label: string;
  stickerType: string;
  salesOptionType: string;
}

export interface GetTripsInformationProps {
  originUicCode: string;
  destinationUicCode: string;
  dateTime: Dayjs;
  viaUicCode?: string;
  searchForArrival?: boolean;
  context?: string;
}

export interface FavouriteTrip extends Trip {
  docId: string;
}

export enum LoadMoreAction {
  Earlier,
  Later,
}
