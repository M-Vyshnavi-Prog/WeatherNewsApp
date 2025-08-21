import axios from 'axios';
import { Units, ForecastItem, WeatherSummary } from '../types';

const OPENWEATHER_API_KEY = '7ed6cadccd603640ad02101014b5f41c'; 

type ForecastResponse = {
  list: Array<{
    dt_txt: string;
    main: { temp: number };
    weather: Array<{ description: string; icon: string }>;
  }>;
};

export async function getForecast(lat: number, lon: number, units: Units) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_API_KEY}`;
  const { data } = await axios.get<ForecastResponse>(url);
  const today = data.list[0];
  const summary: WeatherSummary = {
    temp: today.main.temp,
    description: today.weather[0].description,
    icon: today.weather[0].icon,
  };
  // Reduce to one item per day (every ~24h: pick every 8th entry)
  const forecast: ForecastItem[] = data.list
    .filter((_, idx) => idx % 8 === 0)
    .slice(0, 5)
    .map((item) => ({
      date: item.dt_txt.split(' ')[0],
      temp: item.main.temp,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));
  return { summary, forecast };
}
