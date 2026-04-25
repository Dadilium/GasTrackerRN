/**
 * Geolocation service — wraps expo-location in a TaskEither
 * for composability with the rest of the fp-ts pipeline.
 */
import type { AppError, Coordinates } from '@/domain/types';
import * as Location from 'expo-location';
import * as TE from 'fp-ts/TaskEither';

/**
 * Get the user's current position as a TaskEither.
 * Handles permission requests automatically.
 */
export const getCurrentPosition: TE.TaskEither<AppError, Coordinates> =
  TE.tryCatch(
    async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        throw { _tag: 'LocationPermissionDenied' as const };
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    },
    (err): AppError => {
      if (
        typeof err === 'object' &&
        err !== null &&
        '_tag' in err &&
        (err as { _tag: string })._tag === 'LocationPermissionDenied'
      ) {
        return {
          _tag: 'LocationPermissionDenied',
          message: 'Location permission was denied',
        };
      }
      return {
        _tag: 'LocationUnavailable',
        message:
          err instanceof Error ? err.message : 'Could not determine location',
      };
    },
  );

/**
 * Haversine distance in km between two coordinates.
 */
export const distanceKm = (a: Coordinates, b: Coordinates): number => {
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinLon * sinLon;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const toRad = (deg: number): number => (deg * Math.PI) / 180;
