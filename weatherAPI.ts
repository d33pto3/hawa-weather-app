import axios from "axios";

const API_KEY = "YOUR_API_KEY";

export async function fetchWeather(city: string): Promise<unknown> {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}
