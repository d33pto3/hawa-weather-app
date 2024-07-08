import { weatherIcons } from "../types";

export const getWeatherIcon = (code: number | undefined) => {
  if (!code) return { emoji: "❓", weatherStatus: "Unknown" };
  const weather = weatherIcons.find((icon) => icon.code === code);
  return weather
    ? { emoji: weather.emoji, text: weather.text }
    : { emoji: "❓", text: "Unknown" };
};
