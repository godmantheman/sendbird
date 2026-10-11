export type KioskStep = 'compose' | 'folding' | 'flight' | 'delivered';

export type DeliveryChannel = 'email' | 'phone' | 'both';

export type PaperThemeId = 'kraft' | 'parchment' | 'cherry' | 'midnight' | 'celadon';

export type StampId = 'pigeon_classic' | 'royal_vintage' | 'night_sky' | 'rose_garden' | 'korea_heritage';

export type WaxSealColor = 'crimson' | 'gold' | 'navy' | 'emerald';

export type FontStyle = 'nanum-pen' | 'nanum-myeongjo' | 'jakarta';

export interface LocationPoint {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  // Normalized 0-100 coordinates for Korea map projection
  mapX: number;
  mapY: number;
  landmarks?: string[];
}

export interface LetterData {
  senderName: string;
  senderLocation: LocationPoint;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  deliveryChannel: DeliveryChannel;
  destinationLocation: LocationPoint;
  paperTheme: PaperThemeId;
  stamp: StampId;
  waxColor: WaxSealColor;
  fontStyle: FontStyle;
  subject: string;
  content: string;
  dateStr: string;
  estimatedFlightHours: number;
  distanceKm: number;
}

export interface FlightTelemetry {
  progress: number; // 0 to 1
  currentLat: number;
  currentLng: number;
  currentX: number;
  currentY: number;
  altitudeM: number;
  speedKmh: number;
  windSpeedKmh: number;
  windDirection: string;
  currentLandmark: string;
  remainingDistanceKm: number;
  elapsedSeconds: number;
  etaSeconds: number;
}
