/**
 * Segmented control to switch between sort criteria (distance / price).
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { SortCriteria } from '@/domain/types';
import { colors, spacing } from '@/constants/theme';

type Props = {
  readonly active: SortCriteria;
  readonly onChange: (criteria: SortCriteria) => void;
};

const CRITERIA: SortCriteria[] = ['distance', 'price'];

export const SortBar: React.FC<Props> = ({ active, onChange }) => {
  const { t } = useTranslation();

  const label = (c: SortCriteria) =>
    c === 'distance'
      ? t('stationList.sortByDistance')
      : t('stationList.sortByPrice');

  return (
    <View style={styles.container}>
      {CRITERIA.map(c => (
        <TouchableOpacity
          key={c}
          style={[styles.segment, active === c && styles.active]}
          onPress={() => onChange(c)}>
          <Text style={[styles.label, active === c && styles.activeLabel]}>
            {label(c)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.border,
    borderRadius: 8,
    padding: 2,
    marginBottom: spacing.md,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 6,
  },
  active: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeLabel: {
    color: colors.primary,
  },
});
