/**
 * Station detail screen — shows all prices and an "open in maps" CTA.
 * Delegates map-opening to the logic layer; render stays pure.
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { useTranslation } from 'react-i18next';
import { findStationById } from '@/logic/stations';
import { openInMaps } from '@/logic/maps';
import { useStationsContext } from '@/hooks/stations-context';
import { PriceTag } from '@/components/PriceTag';
import { StatusBadge } from '@/components/StatusBadge';
import { colors, spacing } from '@/constants/theme';

export default function StationDetailScreen() {
  const { t } = useTranslation();
  const { state } = useStationsContext();
  const { id } = useLocalSearchParams<{ id: string }>();

  const station = useMemo(() => {
    if (state._tag !== 'Loaded' || !id) return O.none;
    return findStationById(id)(state.stations);
  }, [state, id]);

  const handleOpenMaps = () => {
    pipe(
      station,
      O.fold(
        () => {},
        s => {
          openInMaps(s.coordinates, s.name)();
        },
      ),
    );
  };

  return pipe(
    station,
    O.fold(
      () => (
        <View style={styles.center}>
          <Text style={styles.emptyText}>{t('stationList.empty')}</Text>
        </View>
      ),
      s => (
        <ScrollView style={styles.root} contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.name}>{s.name}</Text>
            <StatusBadge isOpen={s.isOpen} />
          </View>

          <Text style={styles.address}>{s.address}</Text>
          <Text style={styles.distance}>
            {t('stationList.kmAway', { distance: s.distanceKm.toFixed(1) })}
          </Text>

          {/* Prices */}
          <Text style={styles.sectionTitle}>{t('stationDetail.pricesTitle')}</Text>
          {s.prices.map((price, idx) => (
            <PriceTag key={price.fuelType} price={price} highlighted={idx === 0} />
          ))}

          {/* Open in Maps */}
          <TouchableOpacity style={styles.mapsButton} onPress={handleOpenMaps}>
            <Text style={styles.mapsButtonText}>
              {t('stationDetail.openInMaps')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ),
    ),
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  distance: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  mapsButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  mapsButtonText: {
    color: colors.textOnPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
});
