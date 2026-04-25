/**
 * Root layout — initialises i18n, wraps in StationsProvider,
 * and configures the expo-router stack.
 */
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

// Side-effect: initialise i18n before any component renders.
import '@/i18n';

import { StationsProvider } from '@/hooks/stations-context';
import { LanguageToggle } from '@/components/LanguageToggle';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  const { t } = useTranslation();

  return (
    <StationsProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.primary,
          headerTitleStyle: { fontWeight: '700' },
        }}>
        <Stack.Screen
          name="index"
          options={{
            title: t('stationList.title'),
            headerRight: () => <LanguageToggle />,
          }}
        />
        <Stack.Screen
          name="station/[id]"
          options={{
            title: t('stationDetail.title'),
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </StationsProvider>
  );
}
