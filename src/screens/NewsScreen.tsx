import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../context/AppProvider';
import { getTopHeadlines } from '../api/news';
import NewsCard from '../components/NewsCard';
import { Article } from '../types';

const ALL_CATEGORIES = ['business','entertainment','general','health','science','sports','technology'];

export default function NewsScreen() {
  const { categories, setCategories } = useApp();
  const [localCats, setLocalCats] = useState<string[]>(categories);
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleCat = (cat: string) => {
    setLocalCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const saveCategories = () => {
    setCategories(localCats);
    loadNews();
  };

  const loadNews = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(localCats.map(c => getTopHeadlines(c)));
      setNews(results.flat().slice(0, 30));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>News Categories</Text>
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
      <Button title="Save & Load News" onPress={saveCategories} />

      <Text style={[styles.title, { marginTop: 20 }]}>News Preview</Text>
      {loading && <ActivityIndicator />}
      <FlatList
        data={news}
        keyExtractor={(item, idx) => item.url + idx}
        renderItem={({ item }) => <NewsCard article={item} />}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
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
