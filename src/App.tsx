import { useEffect, useState } from "react";
import { zillas } from "./utils/districtList";
import "./App.css";
import RightSide from "./components/RightSide";
import LeftSide from "./components/LeftSide";

function App() {
  const [selectedZilla, setSelectedZilla] = useState<any>({});
  const [currentWeather, setCurrentWeather] = useState<any>({});
  // console.log(selectedZilla);

  useEffect(() => {
    getCurrentWeatherByZilla();
  }, [selectedZilla]);

  // Set state to the selected zilla
  const handleZillaSelect = (e: any) => {
    setSelectedZilla(
      zillas.find((item) => item?.name === e.target?.value && item?.name)
    );
  };

  // call API to get weather report based on the selected zilla
  const getCurrentWeatherByZilla = async () => {
    const urlExtension = `${import.meta.env?.VITE_API_SERVER}latitude=${
      selectedZilla?.lat
    }&longitude=${
      selectedZilla?.lng
    }&current=temperature_2m,wind_speed_10m,apparent_temperature,relative_humidity_2m,weather_code,cloud_cover,wind_speed_10m`;

    try {
      const res = await fetch(urlExtension);
      // Parse response body to JSON
      const weatherData = await res.json();
      setCurrentWeather(weatherData);
    } catch (err) {
      console.log(err);
    }
    // console.log(selectedZilla);
  };

  return (
    // pexels-andre-furtado-43594-1162251
    <div className="text-white h-screen bg-cover flex low-opacity-bg-image bg-fixed overflow-hidden">
      <LeftSide currentWeather={currentWeather} />
      {/* side content */}
      <RightSide
        selectedZilla={selectedZilla}
        currentWeather={currentWeather}
        handleZillaSelect={handleZillaSelect}
        zillas={zillas}
      />
    </div>
  );
}

export default App;
