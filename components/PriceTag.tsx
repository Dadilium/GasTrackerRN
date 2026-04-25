/**
 * Reusable price display with fuel type label and per-litre cost.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';
import type { FuelPrice, FuelType } from '@/domain/types';
import { colors, spacing } from '@/constants/theme';

type Props = {
  readonly price: FuelPrice;
  readonly highlighted?: boolean;
};

const fuelKey = (ft: FuelType): string =>
  match(ft)
    .with('regular', () => 'fuel.regular')
    .with('midgrade', () => 'fuel.midgrade')
    .with('premium', () => 'fuel.premium')
    .with('diesel', () => 'fuel.diesel')
    .exhaustive();

export const PriceTag: React.FC<Props> = ({ price, highlighted = false }) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.row, highlighted && styles.highlighted]}>
      <Text style={styles.fuelLabel}>{t(fuelKey(price.fuelType))}</Text>
      <Text style={styles.priceValue}>
        ${price.pricePerLitre.toFixed(3)}
        <Text style={styles.perLitre}>{t('stationDetail.perLitre')}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  highlighted: {
    backgroundColor: colors.highlight,
    borderRadius: 6,
  },
  fuelLabel: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
  },
  perLitre: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
  },
});
