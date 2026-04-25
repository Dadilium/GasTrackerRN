/**
 * Main screen — lists nearby gas stations sorted by distance or price.
 * Uses ts-pattern to exhaustively render the StationsState union.
 */
import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { match } from 'ts-pattern';
import type { GasStation } from '@/domain/types';
import { useStationsContext } from '@/hooks/stations-context';
import { StationCard } from '@/components/StationCard';
import { SortBar } from '@/components/SortBar';
import { ErrorView } from '@/components/ErrorView';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { colors, spacing } from '@/constants/theme';

export default function StationListScreen() {
  const router = useRouter();
  const { state, sortBy, setSortBy, sortedStations, refresh } =
    useStationsContext();

  const handlePress = useCallback(
    (id: string) => router.push(`/station/${id}`),
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: GasStation }) => (
      <StationCard station={item} onPress={handlePress} />
    ),
    [handlePress],
  );

  const keyExtractor = useCallback((item: GasStation) => item.id, []);

  return match(state)
    .with({ _tag: 'Idle' }, () => <LoadingSpinner />)
    .with({ _tag: 'Loading' }, () => <LoadingSpinner />)
    .with({ _tag: 'Error' }, ({ error }) => (
      <ErrorView error={error} onRetry={refresh} />
    ))
    .with({ _tag: 'Loaded' }, () => (
      <View style={styles.root}>
        <View style={styles.header}>
          <SortBar active={sortBy} onChange={setSortBy} />
        </View>
        <FlatList
          data={sortedStations as GasStation[]}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    ))
    .exhaustive();
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
});
