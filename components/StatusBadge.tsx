/**
 * Small pill showing open/closed status.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing } from '@/constants/theme';

type Props = {
  readonly isOpen: boolean;
};

export const StatusBadge: React.FC<Props> = ({ isOpen }) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.badge, isOpen ? styles.open : styles.closed]}>
      <Text style={[styles.text, isOpen ? styles.openText : styles.closedText]}>
        {isOpen ? t('stationList.openNow') : t('stationList.closed')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  open: { backgroundColor: colors.successBg },
  closed: { backgroundColor: colors.dangerBg },
  text: { fontSize: 12, fontWeight: '600' },
  openText: { color: colors.success },
  closedText: { color: colors.danger },
});
