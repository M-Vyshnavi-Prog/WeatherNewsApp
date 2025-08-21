import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Button, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { useApp } from '../context/AppProvider';
import { Units, Article } from '../types';
import NewsCard from '../components/NewsCard';
import { getTopHeadlines } from '../api/news';

const ALL_CATEGORIES = ['business','entertainment','general','health','science','sports','technology'];

export default function SettingsScreen() {
  const { units, setUnits, categories, setCategories } = useApp();
  const [localUnits, setLocalUnits] = useState<Units>(units);
  const [localCats, setLocalCats] = useState<string[]>(categories);

  const [news, setNews] = useState<Article[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);

  // Sync local state with context
  useEffect(() => {
    setLocalUnits(units);
    setLocalCats(categories);
  }, [units, categories]);

  const toggleUnit = () => setLocalUnits(u => (u === 'metric' ? 'imperial' : 'metric'));
  const toggleCat = (cat: string) => {
    setLocalCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };
  const save = () => {
    setUnits(localUnits);
    setCategories(localCats);
  };

  // Load top headlines for selected categories
  const loadNews = async () => {
    setLoadingNews(true);
    try {
      const results = await Promise.all(localCats.map(c => getTopHeadlines(c)));
      setNews(results.flat().slice(0, 5)); // only show top 5 news as preview
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [localCats]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Units (°C/°F)</Text>
        <View style={styles.switchRow}>
          <Text>Metric (°C)</Text>
          <Switch value={localUnits === 'imperial'} onValueChange={toggleUnit} />
          <Text>Imperial (°F)</Text>
        </View>
      </View>

      <Text style={[styles.label, { marginTop: 16 }]}>News Categories</Text>
      <View style={styles.chips}>
        {ALL_CATEGORIES.map(cat => {
          const on = localCats.includes(cat);
          return (
            <Text
              key={cat}
              onPress={() => toggleCat(cat)}
              style={[styles.chip, on && styles.chipOn]}
            >
              {cat}
            </Text>
          );
        })}
      </View>

      <Button title="Save" onPress={save} />

      <Text style={[styles.label, { marginTop: 24 }]}>News Preview</Text>
      {loadingNews && <ActivityIndicator />}
      <FlatList
        data={news}
        keyExtractor={(item, idx) => item.url + idx}
        renderItem={({ item }) => <NewsCard article={item} />}
        scrollEnabled={false} // let ScrollView handle scrolling
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 16 },
  row: { marginBottom: 16 },
  label: { fontWeight: '700', marginBottom: 8 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#eee',
    marginRight: 8,
    marginBottom: 8
  },
  chipOn: { backgroundColor: '#cce5ff' },
});
