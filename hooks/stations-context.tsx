/**
 * Shared context for station data — avoids re-fetching on navigation.
 * Provides station state and a refresh callback to the entire app.
 */
import React, { createContext, useContext } from 'react';
import { useStations } from './use-stations';

type StationsContextValue = ReturnType<typeof useStations>;

const StationsContext = createContext<StationsContextValue | null>(null);

export const StationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = useStations();
  return (
    <StationsContext.Provider value={value}>{children}</StationsContext.Provider>
  );
};

export const useStationsContext = (): StationsContextValue => {
  const ctx = useContext(StationsContext);
  if (ctx === null) {
    throw new Error('useStationsContext must be used within a StationsProvider');
  }
  return ctx;
};
