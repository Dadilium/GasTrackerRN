/**
 * Centred loading indicator with localised label.
 */
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing } from '@/constants/theme';

export const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.label}>{t('loading')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  label: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
