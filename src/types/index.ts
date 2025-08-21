export type Units = 'metric' | 'imperial';

export interface WeatherSummary {
  temp: number;
  description: string;
  icon: string;
}

export interface ForecastItem {
  date: string;
  temp: number;
  description: string;
  icon: string;
}

export interface Article {
  title: string;
  description: string;
  url: string;
  source?: string;
  publishedAt?: string;
}
