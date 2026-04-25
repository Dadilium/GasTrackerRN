/**
 * Card showing a gas station summary — name, cheapest price, distance, status.
 * Tapping navigates to the detail screen.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { useTranslation } from 'react-i18next';
import type { GasStation } from '@/domain/types';
import { StatusBadge } from './StatusBadge';
import { colors, spacing } from '@/constants/theme';

type Props = {
  readonly station: GasStation;
  readonly onPress: (id: string) => void;
};

const cheapestRegular = (station: GasStation): O.Option<number> =>
  pipe(
    station.prices.find(p => p.fuelType === 'regular'),
    O.fromNullable,
    O.map(p => p.pricePerLitre),
  );

export const StationCard: React.FC<Props> = ({ station, onPress }) => {
  const { t } = useTranslation();

  const price = pipe(
    cheapestRegular(station),
    O.fold(
      () => '—',
      p => `$${p.toFixed(3)}`,
    ),
  );

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(station.id)}
      activeOpacity={0.7}>
      <View style={styles.topRow}>
        <View style={styles.nameBlock}>
          <Text style={styles.brand}>{station.brand}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {station.name}
          </Text>
        </View>
        <Text style={styles.price}>{price}</Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.distance}>
          {t('stationList.kmAway', { distance: station.distanceKm.toFixed(1) })}
        </Text>
        <StatusBadge isOpen={station.isOpen} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  nameBlock: { flex: 1, marginRight: spacing.sm },
  brand: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distance: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
