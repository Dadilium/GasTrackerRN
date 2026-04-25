/**
 * Hook that orchestrates the full data pipeline:
 * get location → fetch stations → decode → surface to UI.
 *
 * Returns a discriminated union state (StationsState) so the screen
 * can pattern-match with ts-pattern.
 */
import { useState, useEffect, useCallback } from 'react';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import type { GasStation, StationsState, SortCriteria } from '@/domain/types';
import { getCurrentPosition } from '@/logic/geolocation';
import { fetchNearbyStations } from '@/logic/api';
import { sortStations } from '@/logic/stations';

export const useStations = () => {
  const [state, setState] = useState<StationsState>({ _tag: 'Idle' });
  const [sortBy, setSortBy] = useState<SortCriteria>('distance');

  const load = useCallback(async () => {
    setState({ _tag: 'Loading' });

    const pipeline = pipe(getCurrentPosition, TE.chain(fetchNearbyStations));

    const result = await pipeline();

    pipe(
      result,
      E.fold(
        error => setState({ _tag: 'Error', error }),
        stations => setState({ _tag: 'Loaded', stations }),
      ),
    );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /** Sorted view — derived from state when loaded. */
  const sortedStations: ReadonlyArray<GasStation> =
    state._tag === 'Loaded' ? sortStations(sortBy)(state.stations) : [];

  return {
    state,
    sortBy,
    setSortBy,
    sortedStations,
    refresh: load,
  };
};
