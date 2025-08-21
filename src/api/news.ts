import axios from 'axios';
import { Article } from '../types';

const NEWS_API_KEY = '46773817f758452b9932bdd67fd32d6b'; 


interface NewsApiResponse {
  articles: {
    title: string;
    description: string;
    url: string;
    source?: { name: string };
    publishedAt?: string;
  }[];
}

export async function getTopHeadlines(category?: string): Promise<Article[]> {
  const params = new URLSearchParams({ country: 'us' });
  if (category) params.set('category', category);

  const url = `https://newsapi.org/v2/top-headlines?${params.toString()}&apiKey=${NEWS_API_KEY}`;

  
  const { data } = await axios.get<NewsApiResponse>(url);

  return (data.articles || []).map((a) => ({
    title: a.title,
    description: a.description,
    url: a.url,
    source: a.source?.name,
    publishedAt: a.publishedAt,
  }));
}

export async function searchNews(q: string): Promise<Article[]> {
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    q
  )}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;

  const { data } = await axios.get<NewsApiResponse>(url);

  return (data.articles || []).map((a) => ({
    title: a.title,
    description: a.description,
    url: a.url,
    source: a.source?.name,
    publishedAt: a.publishedAt,
  }));
}
