export const weatherIcons = [
  { code: 0, emoji: "☀️", text: "Clear sky" },
  { code: 1, emoji: "🌤️", text: "Mainly clear" },
  { code: 2, emoji: "🌤️", text: "Partly cloudy" },
  { code: 3, emoji: "☁️", text: "Overcast" },
  { code: 45, emoji: "🌫️", text: "Fog" },
  { code: 48, emoji: "🌫️", text: "Depositing rime fog" },
  { code: 51, emoji: "🌦️", text: "Light drizzle" },
  { code: 53, emoji: "🌦️", text: "Moderate drizzle" },
  { code: 55, emoji: "🌦️", text: "Dense drizzle" },
  { code: 56, emoji: "🌧️", text: "Light freezing drizzle" },
  { code: 57, emoji: "🌧️", text: "Dense freezing drizzle" },
  { code: 61, emoji: "🌧️", text: "Slight rain" },
  { code: 63, emoji: "🌧️", text: "Moderate rain" },
  { code: 65, emoji: "🌧️", text: "Heavy rain" },
  { code: 66, emoji: "🌧️", text: "Light freezing rain" },
  { code: 67, emoji: "🌧️", text: "Heavy freezing rain" },
  { code: 71, emoji: "❄️", text: "Slight snowfall" },
  { code: 73, emoji: "❄️", text: "Moderate snowfall" },
  { code: 75, emoji: "❄️", text: "Heavy snowfall" },
  { code: 77, emoji: "🌨️", text: "Snow grains" },
  { code: 80, emoji: "🌧️", text: "Slight rain showers" },
  { code: 81, emoji: "🌧️", text: "Moderate rain showers" },
  { code: 82, emoji: "🌧️", text: "Violent rain showers" },
  { code: 85, emoji: "🌨️", text: "Slight snow showers" },
  { code: 86, emoji: "🌨️", text: "Heavy snow showers" },
  { code: 95, emoji: "⛈️", text: "Slight or moderate thunderstorm" },
  { code: 96, emoji: "⛈️", text: "Thunderstorm with slight hail" },
  { code: 99, emoji: "⛈️", text: "Thunderstorm with heavy hail" },
];

export interface Zilla {
  name: string;
  lat: number;
  lng: number;
}

export interface ICurrentWeather {
  current: {
    apparent_temperature?: number;
    temperature_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    relative_humidity_2m?: number;
    cloud_cover?: number;
  };
  current_units: {
    apparent_temperature?: string;
    temperature_2m?: string;
    weather_code?: string;
    wind_speed_10m?: string;
    relative_humidity_2m?: string;
    cloud_cover?: string;
  };
  latitude: number;
  longitude: number;
}
