/**
 * Full-screen error display with retry button.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { AppError } from '@/domain/types';
import { useAppError } from '@/hooks/use-app-error';
import { colors, spacing } from '@/constants/theme';

type Props = {
  readonly error: AppError;
  readonly onRetry: () => void;
};

export const ErrorView: React.FC<Props> = ({ error, onRetry }) => {
  const { t } = useTranslation();
  const { errorMessage } = useAppError();

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{errorMessage(error)}</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>{t('error.retry')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 4,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontWeight: '600',
    fontSize: 15,
  },
});
