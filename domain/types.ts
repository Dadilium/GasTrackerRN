/**
 * Domain types — the single source of truth for the application's data model.
 * No imports from React, React Native, or any UI concern.
 */

// ──────────────────────────── Value objects ────────────────────────────

export type Coordinates = {
  readonly latitude: number;
  readonly longitude: number;
};

export type FuelType = 'regular' | 'midgrade' | 'premium' | 'diesel';

export type FuelPrice = {
  readonly fuelType: FuelType;
  readonly pricePerLitre: number;
  /** ISO-8601 timestamp of last price update */
  readonly updatedAt: string;
};

// ──────────────────────────── Aggregates ───────────────────────────────

export type GasStation = {
  readonly id: string;
  readonly name: string;
  readonly brand: string;
  readonly address: string;
  readonly coordinates: Coordinates;
  readonly prices: ReadonlyArray<FuelPrice>;
  readonly isOpen: boolean;
  /** Pre-computed by the logic layer based on user location */
  readonly distanceKm: number;
};

// ──────────────────────────── App state ────────────────────────────────

export type StationsState =
  | { readonly _tag: 'Idle' }
  | { readonly _tag: 'Loading' }
  | { readonly _tag: 'Loaded'; readonly stations: ReadonlyArray<GasStation> }
  | { readonly _tag: 'Error'; readonly error: AppError };

// ──────────────────────────── Sort ─────────────────────────────────────

export type SortCriteria = 'distance' | 'price';

// ──────────────────────────── Errors ──────────────────────────────────

export type AppError =
  | { readonly _tag: 'NetworkError'; readonly message: string }
  | { readonly _tag: 'LocationPermissionDenied'; readonly message: string }
  | { readonly _tag: 'LocationUnavailable'; readonly message: string }
  | { readonly _tag: 'DecodeError'; readonly message: string }
  | { readonly _tag: 'UnknownError'; readonly message: string };
