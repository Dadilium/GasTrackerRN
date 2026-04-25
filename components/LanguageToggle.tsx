/**
 * Toggle button to switch between EN and FR.
 * Rendered in the header as a navigation button.
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing } from '@/constants/theme';

export const LanguageToggle: React.FC = () => {
  const { t, i18n } = useTranslation();

  const toggle = () => {
    const next = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(next);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={toggle}>
      <Text style={styles.text}>{t('language.toggle')}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: 6,
    backgroundColor: colors.primaryLight,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
