/**
 * Deep-link to native maps app.
 * Opens Apple Maps on iOS and Google Maps on Android.
 */
import { Linking, Platform } from 'react-native';
import * as TE from 'fp-ts/TaskEither';
import type { AppError, Coordinates } from '@/domain/types';

const buildNativeUrl = (coords: Coordinates, label: string): string => {
  const encoded = encodeURIComponent(label);
  return Platform.OS === 'ios'
    ? `maps:0,0?q=${encoded}@${coords.latitude},${coords.longitude}`
    : `geo:0,0?q=${coords.latitude},${coords.longitude}(${encoded})`;
};

const googleMapsUrl = (coords: Coordinates, _label: string): string =>
  `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`;

/**
 * Attempt to open the native Maps app first; fall back to Google Maps in browser.
 */
export const openInMaps = (
  coords: Coordinates,
  label: string,
): TE.TaskEither<AppError, void> =>
  TE.tryCatch(
    async () => {
      const nativeUrl = buildNativeUrl(coords, label);
      const canOpen = await Linking.canOpenURL(nativeUrl);

      if (canOpen) {
        await Linking.openURL(nativeUrl);
      } else {
        await Linking.openURL(googleMapsUrl(coords, label));
      }
    },
    (err): AppError => ({
      _tag: 'UnknownError',
      message: err instanceof Error ? err.message : 'Failed to open maps',
    }),
  );
