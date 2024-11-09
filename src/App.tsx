import { useEffect, useState } from "react";
import { zillas } from "./utils/districtList";
import "./App.css";
import RightSide from "./components/RightSide";
import LeftSide from "./components/LeftSide";
import { ICurrentWeather, Zilla } from "./types";

enum locationOption {
  byZilla = "byZilla",
  byMap = "byMap",
}

interface locationCoordination {
  lat: string;
  lng: string;
}

function App() {
  // const [loading, setLoading] = useState<boolean>(true);

  const [selectedZilla, setSelectedZilla] = useState<Zilla | null>();
  const [currentWeather, setCurrentWeather] = useState<ICurrentWeather | null>(
    null
  );
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<locationOption>(
    locationOption.byZilla
  );
  const [address, setAddress] = useState("");

  const handleAddressChange = (addrs: string) => {
    setAddress(addrs);
  };

  const handleOptionChange = (option: locationOption) => {
    setSelectedOption(option);
  };

  // call API to get weather report based on the selected zilla
  const getCurrentWeatherByZilla = async (zilla: Zilla) => {
    if (!zilla || !zilla.lat || !zilla.lng) return;

    const urlExtension = `${import.meta.env?.VITE_API_SERVER}latitude=${
      zilla?.lat
    }&longitude=${
      zilla?.lng
    }&current=temperature_2m,wind_speed_10m,apparent_temperature,relative_humidity_2m,weather_code,cloud_cover,wind_speed_10m`;

    try {
      const res = await fetch(urlExtension);
      // Parse response body to JSON
      const weatherData = await res.json();
      console.log(weatherData);
      setCurrentWeather(weatherData);
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrentWeather = async (lat: string, lng: string) => {
    if (!lat && !lng) return;

    const urlExtension = `${
      import.meta.env?.VITE_API_SERVER
    }latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m,apparent_temperature,relative_humidity_2m,weather_code,cloud_cover,wind_speed_10m`;

    try {
      const res = await fetch(urlExtension);
      // Parse response body to JSON
      const weatherData = await res.json();
      setCurrentWeather(weatherData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (selectedZilla) getCurrentWeatherByZilla(selectedZilla);
  }, [selectedZilla]);

  // Set state to the selected zilla
  const handleZillaSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e);
    setSelectedZilla(
      zillas.find((item) => item?.name === e.target?.value && item?.name)
    );
  };

  const handleLocationSelect = ({ lat, lng }: { lat: string; lng: string }) => {
    setLng(lng);
    setLat(lat);
    getCurrentWeather(lat, lng);
  };

  useEffect(() => {
    reverseGeocodeLatLng({ lat, lng });
  }, [lat, lng]);

  const reverseGeocodeLatLng = async ({ lat, lng }: locationCoordination) => {
    if (!lng || !lat) {
      return 0;
    }

    const apiKey = `${import.meta.env.VITE_APP_OPEN_CAGE_MAPS_API_KEY}`;

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAddress(data.results[0].formatted); // or any other information you need from the response
    } catch (error) {
      console.error("Error fetching location info:", error);
    }
  };

  return (
    // pexels-andre-furtado-43594-1162251
    <div className="text-white flex h-screen bg-cover low-opacity-bg-image bg-fixed overflow-hidden">
      <LeftSide
        currentWeather={currentWeather}
        // zilla={selectedZilla}
        address={address}
      />
      {/* side content */}
      <RightSide
        selectedZilla={selectedZilla}
        currentWeather={currentWeather}
        zillas={zillas}
        onLocationSelect={handleLocationSelect}
        selectedOption={selectedOption}
        onOptionChange={handleOptionChange}
        lat={lat}
        lng={lng}
        onAddressChange={handleAddressChange}
        onZillaSelect={handleZillaSelect}
      />
    </div>
  );
}

export default App;
