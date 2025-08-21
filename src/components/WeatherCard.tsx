import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ForecastItem, WeatherSummary } from '../types';

export default function WeatherCard({ summary, forecast }: { summary: WeatherSummary; forecast: ForecastItem[] }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          source={{ uri: `https://openweathermap.org/img/wn/${summary.icon}@2x.png` }}
          style={styles.icon}
        />
        <View>
          <Text style={styles.temp}>{Math.round(summary.temp)}°</Text>
          <Text style={styles.desc}>{summary.description}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.forecastRow}>
        {forecast.map((f) => (
          <View key={f.date} style={styles.forecastItem}>
            <Text style={styles.date}>{f.date.slice(5)}</Text>
            <Image
              source={{ uri: `https://openweathermap.org/img/wn/${f.icon}.png` }}
              style={styles.smallIcon}
            />
            <Text style={styles.smallTemp}>{Math.round(f.temp)}°</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#eef6ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 80, height: 80, marginRight: 12 },
  temp: { fontSize: 36, fontWeight: '700' },
  desc: { color: '#444' },
  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 12 },
  forecastRow: { flexDirection: 'row', justifyContent: 'space-between' },
  forecastItem: { alignItems: 'center', width: '19%' },
  date: { fontSize: 12, color: '#555' },
  smallIcon: { width: 36, height: 36 },
  smallTemp: { fontSize: 14, marginTop: 2, fontWeight: '600' },
});
