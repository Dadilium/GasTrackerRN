/**
 * Pure functions for sorting, filtering, and querying gas stations.
 * No side effects — everything in, everything out.
 */
import type { GasStation, SortCriteria } from '@/domain/types';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as A from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as N from 'fp-ts/number';

// ─── Orderings ────────────────────────────────────────────────────────

const byDistance: Ord.Ord<GasStation> = pipe(
  N.Ord,
  Ord.contramap((s: GasStation) => s.distanceKm),
);

/** Cheapest "regular" price first; stations without regular go to the end. */
const byCheapestRegular: Ord.Ord<GasStation> = pipe(
  N.Ord,
  Ord.contramap((s: GasStation) => {
    const regular = s.prices.find(p => p.fuelType === 'regular');
    return regular?.pricePerLitre ?? Infinity;
  }),
);

const ordByCriteria = (criteria: SortCriteria): Ord.Ord<GasStation> =>
  criteria === 'distance' ? byDistance : byCheapestRegular;

// ─── Public API ───────────────────────────────────────────────────────

/** Sort stations by the given criteria. */
export const sortStations =
  (criteria: SortCriteria) =>
  (stations: ReadonlyArray<GasStation>): ReadonlyArray<GasStation> =>
    pipe([...stations], A.sort(ordByCriteria(criteria)));

/** Filter to only stations that are currently open. */
export const filterOpen = (
  stations: ReadonlyArray<GasStation>,
): ReadonlyArray<GasStation> =>
  pipe(
    stations,
    A.filter(s => s.isOpen),
  );

/** Find a station by id. */
export const findStationById =
  (id: string) =>
  (stations: ReadonlyArray<GasStation>): O.Option<GasStation> =>
    pipe(
      stations,
      A.findFirst(s => s.id === id),
    );

/** Get the cheapest regular-fuel price across all stations. */
export const cheapestRegularPrice = (
  stations: ReadonlyArray<GasStation>,
): O.Option<number> =>
  pipe(
    stations,
    A.filterMap(s =>
      pipe(
        s.prices.find(p => p.fuelType === 'regular'),
        O.fromNullable,
        O.map(p => p.pricePerLitre),
      ),
    ),
    A.sort(N.Ord),
    A.head,
  );
