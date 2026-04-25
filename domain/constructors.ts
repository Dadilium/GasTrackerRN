/**
 * Smart constructors — validated ways to build domain objects.
 */
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { GasStationArrayCodec } from './codecs';
import type { AppError, GasStation } from './types';

/**
 * Decode an unknown payload into an array of GasStation.
 * Returns a domain-level AppError on failure.
 */
export const decodeStations = (
  raw: unknown,
): E.Either<AppError, ReadonlyArray<GasStation>> =>
  pipe(
    GasStationArrayCodec.decode(raw),
    E.mapLeft(
      (errors): AppError => ({
        _tag: 'DecodeError',
        message: errors.map(e => e.message ?? 'unknown field').join(', '),
      }),
    ),
  );
