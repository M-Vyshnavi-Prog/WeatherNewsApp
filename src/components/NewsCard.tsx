import React from 'react';
import { View, Text, Linking, Pressable, StyleSheet } from 'react-native';
import { Article } from '../types';

export default function NewsCard({ article }: { article: Article }) {
  return (
    <Pressable onPress={() => Linking.openURL(article.url)} style={styles.card}>
      <Text style={styles.title}>{article.title}</Text>
      {article.description ? <Text style={styles.desc}>{article.description}</Text> : null}
      <View style={styles.meta}>
        {article.source ? <Text style={styles.source}>{article.source}</Text> : null}
        {article.publishedAt ? <Text style={styles.time}>{new Date(article.publishedAt).toLocaleString()}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee'
  },
  title: { fontWeight: '700', fontSize: 16, marginBottom: 6 },
  desc: { color: '#333' },
  meta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  source: { fontSize: 12, color: '#666' },
  time: { fontSize: 12, color: '#666' },
});
