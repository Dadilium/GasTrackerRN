/**
 * API client — fetches nearby gas stations.
 *
 * Uses Google Places API (Nearby Search) to find real gas stations,
 * then enriches with mock price data (Google Places doesn't reliably
 * return fuel prices). Swap `generateMockPrices` for a real price API
 * when one is available (e.g. GasBuddy, FuelWatch).
 *
 * Set your API key below or in an .env file.
 */
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import type { AppError, Coordinates, FuelPrice, GasStation } from '@/domain/types';
import { distanceKm } from './geolocation';

// ─── Configuration ────────────────────────────────────────────────────
const GOOGLE_PLACES_API_KEY = '__YOUR_GOOGLE_PLACES_API_KEY__';
const SEARCH_RADIUS_METERS = 5000;
const USE_MOCK = GOOGLE_PLACES_API_KEY === '__YOUR_GOOGLE_PLACES_API_KEY__';

// ─── Google Places types (subset) ─────────────────────────────────────
type PlaceResult = {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: { location: { lat: number; lng: number } };
  opening_hours?: { open_now: boolean };
  business_status?: string;
};

// ─── Public API ───────────────────────────────────────────────────────

/**
 * Fetch nearby gas stations for the given coordinates.
 * Automatically falls back to mock data when no API key is configured.
 */
export const fetchNearbyStations = (
  userCoords: Coordinates,
): TE.TaskEither<AppError, ReadonlyArray<GasStation>> =>
  USE_MOCK ? mockFetch(userCoords) : googlePlacesFetch(userCoords);

// ─── Google Places implementation ─────────────────────────────────────

const googlePlacesFetch = (
  userCoords: Coordinates,
): TE.TaskEither<AppError, ReadonlyArray<GasStation>> =>
  pipe(
    TE.tryCatch(
      async () => {
        const url =
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
          `?location=${userCoords.latitude},${userCoords.longitude}` +
          `&radius=${SEARCH_RADIUS_METERS}` +
          `&type=gas_station` +
          `&key=${GOOGLE_PLACES_API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      },
      (err): AppError => ({
        _tag: 'NetworkError',
        message: err instanceof Error ? err.message : 'Network request failed',
      }),
    ),
    TE.chainEitherK(json => {
      if (!json?.results || !Array.isArray(json.results)) {
        return E.left<AppError>({
          _tag: 'DecodeError',
          message: 'Unexpected API response shape',
        });
      }
      return E.right(json.results as PlaceResult[]);
    }),
    TE.map(
      A.map(
        (place): GasStation => ({
          id: place.place_id,
          name: place.name,
          brand: extractBrand(place.name),
          address: place.vicinity,
          coordinates: {
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          },
          prices: generateMockPrices(),
          isOpen: place.opening_hours?.open_now ?? true,
          distanceKm: distanceKm(userCoords, {
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          }),
        }),
      ),
    ),
  );

// ─── Mock implementation ──────────────────────────────────────────────

const mockFetch = (
  userCoords: Coordinates,
): TE.TaskEither<AppError, ReadonlyArray<GasStation>> =>
  TE.right(
    MOCK_STATIONS.map(s => ({
      ...s,
      distanceKm: distanceKm(userCoords, s.coordinates),
    })),
  );

// ─── Helpers ──────────────────────────────────────────────────────────

const KNOWN_BRANDS = [
  'Shell',
  'Esso',
  'BP',
  'Petro-Canada',
  'Costco',
  'Ultramar',
  'Couche-Tard',
  'Circle K',
  'Total',
  'Chevron',
];

const extractBrand = (name: string): string =>
  KNOWN_BRANDS.find(b => name.toLowerCase().includes(b.toLowerCase())) ??
  'Independent';

const generateMockPrices = (): FuelPrice[] => {
  const base = 1.45 + Math.random() * 0.35;
  const now = new Date().toISOString();
  return [
    { fuelType: 'regular', pricePerLitre: round(base), updatedAt: now },
    { fuelType: 'midgrade', pricePerLitre: round(base + 0.08), updatedAt: now },
    { fuelType: 'premium', pricePerLitre: round(base + 0.18), updatedAt: now },
    { fuelType: 'diesel', pricePerLitre: round(base + 0.05), updatedAt: now },
  ];
};

const round = (n: number): number => Math.round(n * 1000) / 1000;

// ─── Mock data ────────────────────────────────────────────────────────

const MOCK_STATIONS: Omit<GasStation, 'distanceKm'>[] = [
  {
    id: 'mock-1',
    name: 'Shell Sainte-Catherine',
    brand: 'Shell',
    address: '1234 Rue Sainte-Catherine O, Montréal, QC',
    coordinates: { latitude: 45.4945, longitude: -73.5773 },
    prices: generateMockPrices(),
    isOpen: true,
  },
  {
    id: 'mock-2',
    name: 'Petro-Canada Boulevard Saint-Laurent',
    brand: 'Petro-Canada',
    address: '890 Boulevard Saint-Laurent, Montréal, QC',
    coordinates: { latitude: 45.5105, longitude: -73.5631 },
    prices: generateMockPrices(),
    isOpen: true,
  },
  {
    id: 'mock-3',
    name: 'Esso Atwater',
    brand: 'Esso',
    address: '2100 Rue Atwater, Montréal, QC',
    coordinates: { latitude: 45.4832, longitude: -73.5845 },
    prices: generateMockPrices(),
    isOpen: false,
  },
  {
    id: 'mock-4',
    name: 'Ultramar Sherbrooke',
    brand: 'Ultramar',
    address: '3500 Rue Sherbrooke E, Montréal, QC',
    coordinates: { latitude: 45.5365, longitude: -73.5615 },
    prices: generateMockPrices(),
    isOpen: true,
  },
  {
    id: 'mock-5',
    name: 'Couche-Tard Jean-Talon',
    brand: 'Couche-Tard',
    address: '456 Rue Jean-Talon E, Montréal, QC',
    coordinates: { latitude: 45.5375, longitude: -73.6035 },
    prices: generateMockPrices(),
    isOpen: true,
  },
  {
    id: 'mock-6',
    name: 'Costco Gas Marché Central',
    brand: 'Costco',
    address: "9401 Boulevard de l'Acadie, Montréal, QC",
    coordinates: { latitude: 45.5402, longitude: -73.6529 },
    prices: generateMockPrices(),
    isOpen: true,
  },
];
