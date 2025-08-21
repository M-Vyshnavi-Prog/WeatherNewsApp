import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppProvider';
import { getForecast } from '../api/weather';
import { getTopHeadlines, searchNews } from '../api/news';
import { ForecastItem, WeatherSummary, Article } from '../types';
import WeatherCard from '../components/WeatherCard';
import NewsCard from '../components/NewsCard';
import { keywordsForMood, moodFromTemp } from '../utils/weatherFilter';

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const { units, categories, location, loadingLocation, error } = useApp();
  const [summary, setSummary] = useState<WeatherSummary | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [newsInfo, setNewsInfo] = useState<string>('');

  const tempInCelsius = useMemo(() => {
    if (!summary) return null;
    return units === 'metric' ? summary.temp : (summary.temp - 32) * 5/9;
  }, [summary, units]);

  async function loadAll() {
    if (!location) return;
    setLoading(true);
    try {
      const { summary, forecast } = await getForecast(location.lat, location.lon, units);
      setSummary(summary);
      setForecast(forecast);

      // Weather-based filtering
      const mood = moodFromTemp(units === 'metric' ? summary.temp : (summary.temp - 32) * 5/9);
      const keywords = keywordsForMood(mood);
      setNewsInfo(`Mood: ${mood} → keywords: ${keywords.join(' | ')}`);

      // Try keyword-based searches first; if empty fallback to category headlines
      let collected: Article[] = [];
      for (const q of keywords) {
        const results = await searchNews(q);
        collected = collected.concat(results);
      }
      if (collected.length === 0) {
        // fallback to preferred categories
        const results = await Promise.all(categories.map((c) => getTopHeadlines(c)));
        collected = results.flat();
      }

      // de-dup by title
      const seen = new Set<string>();
      const deduped = collected.filter(a => {
        if (!a.title || seen.has(a.title)) return false;
        seen.add(a.title);
        return true;
      });

      setNews(deduped.slice(0, 30));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // re-run when units or location changes
  }, [units, JSON.stringify(location)]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

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
        <Button title="Open Settings" onPress={() => nav.navigate('Settings')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weather & News</Text>
        <Button title="Settings" onPress={() => nav.navigate('Settings')} />
      </View>
      {loading && <ActivityIndicator style={{ marginVertical: 8 }} />}
      {summary && <WeatherCard summary={summary} forecast={forecast} />}
      {tempInCelsius != null && <Text style={styles.note}>{newsInfo}</Text>}
      <FlatList
        data={news}
        keyExtractor={(item, idx) => item.url + String(idx)}
        renderItem={({ item }) => <NewsCard article={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={!loading ? <Text>No news found.</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  note: { fontSize: 12, color: '#555', marginBottom: 8 },
});

