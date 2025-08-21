import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Units } from '../types';

type AppContextType = {
  units: Units;
  setUnits: (u: Units) => void;
  categories: string[];
  setCategories: (c: string[]) => void;
  location: { lat: number; lon: number } | null;
  loadingLocation: boolean;
  error: string | null;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [units, setUnits] = useState<Units>('metric');
  const [categories, setCategories] = useState<string[]>(['general', 'science', 'sports']);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const u = await AsyncStorage.getItem('units');
      const c = await AsyncStorage.getItem('categories');
      if (u) setUnits(u as Units);
      if (c) setCategories(JSON.parse(c));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('units', units);
  }, [units]);

  useEffect(() => {
    AsyncStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Get location
  useEffect(() => {
    (async () => {
      setLoadingLocation(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          setLoadingLocation(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });
      } catch (e: any) {
        setError(e?.message || 'Failed to get location');
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  const value = useMemo(
    () => ({ units, setUnits, categories, setCategories, location, loadingLocation, error }),
    [units, categories, location, loadingLocation, error]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
