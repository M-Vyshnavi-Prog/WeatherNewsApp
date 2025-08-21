import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button, StyleSheet, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppProvider';
import { getForecast } from '../api/weather';
import WeatherCard from '../components/WeatherCard';
import { ForecastItem, WeatherSummary, Units } from '../types';

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const { units, setUnits, location, loadingLocation, error } = useApp();

  const [summary, setSummary] = useState<WeatherSummary | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Load weather data
  async function loadWeather() {
    if (!location) return;
    setLoading(true);
    try {
      const { summary, forecast } = await getForecast(location.lat, location.lon, units);
      setSummary(summary);
      setForecast(forecast);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWeather();
  }, [units, JSON.stringify(location)]);

  // Toggle units between metric and imperial
  const toggleUnit = () => setUnits(units === 'metric' ? 'imperial' : 'metric');

  if (loadingLocation) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Getting your location…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weather</Text>
      </View>

      {/* Unit toggle */}
      <View style={styles.unitRow}>
        <Text>Metric (°C)</Text>
        <Switch value={units === 'imperial'} onValueChange={toggleUnit} />
        <Text>Imperial (°F)</Text>
      </View>

      {loading && <ActivityIndicator style={{ marginVertical: 8 }} />}
      {summary && <WeatherCard summary={summary} forecast={forecast} />}

      {/* Navigate to News */}
      <Button title="Go to News" onPress={() => nav.navigate('News')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  unitRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
});
