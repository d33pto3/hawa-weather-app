import { useEffect, useState } from "react";
import { zillas } from "./utils/districtList";
import "./App.css";
import RightSide from "./components/RightSide";
import Clock from "./components/Clock";
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
      import.meta.env?.VITE_API_SEREVR
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

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            "User-Agent": "Hawa-Weather-App",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAddress(data.display_name); // Nominatim property for a full formatted address
    } catch (error) {
      console.error("Error fetching location info:", error);
    }
  };

  const [theme, setTheme] = useState<"swiss" | "cyber" | "glass">("swiss");

  const toggleTheme = () => {
    const themes: ("swiss" | "cyber" | "glass")[] = ["swiss", "cyber", "glass"];
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <div className="swiss-grid h-screen w-screen overflow-hidden" data-theme={theme}>
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-[1000] px-4 py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] border-2 border-[var(--border-color)] font-bold uppercase text-xs tracking-widest hover:invert"
      >
        Theme: {theme}
      </button>

      {/* SECTION 1: TITLE (Top Left) */}
      <div className="col-span-8 row-span-2 swiss-cell border-b-4 border-r-4 flex items-start justify-between">
        <h1 className="massive-text text-8xl">HAWA</h1>
        <div className="text-right">
          <div className="font-bold text-xl uppercase tracking-tighter">Weather Report</div>
          <div className="text-sm font-medium">International Typographic Style</div>
        </div>
      </div>

      {/* SECTION 2: MAP (Top Right) */}
      <div className="col-span-4 row-span-6 swiss-cell border-b-4 flex flex-col">
        <div className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-2 py-1 absolute top-0 left-0 text-xs font-bold uppercase">Location Selector</div>
        <div className="flex-grow pt-8 overflow-hidden">
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
      </div>

      {/* SECTION 3: TEMPERATURE (Middle Left) */}
      <div className="col-span-8 row-span-6 swiss-cell border-b-4 border-r-4 flex items-center justify-center relative">
        <div className="absolute top-4 left-4 bg-[var(--accent-red)] text-white px-4 py-1 text-2xl font-black uppercase">Current</div>
        <div className="flex flex-col items-center">
          <div className="massive-text text-[26rem] leading-none">
            {currentWeather?.current?.temperature_2m ? Math.round(currentWeather.current.temperature_2m) : "00"}
          </div>
          <div className="massive-text text-9xl absolute right-16 top-1/2 -translate-y-1/2">
            °C
          </div>
        </div>
      </div>

      {/* SECTION 4: FEELS LIKE (Bottom Left 1/2) */}
      <div className="col-span-4 row-span-4 swiss-cell border-r-4 flex flex-col justify-between">
        <div className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-2 py-1 self-start text-xs font-bold uppercase">Apparent</div>
        <div className="massive-text text-9xl text-[var(--accent-blue)]">
          {currentWeather?.current?.apparent_temperature ? Math.round(currentWeather.current.apparent_temperature) : "00"}°
        </div>
        <div className="font-bold uppercase tracking-widest text-sm">Feels like temperature</div>
      </div>

      {/* SECTION 5: ADDRESS & CLOCK (Bottom Left 2/2) */}
      <div className="col-span-4 row-span-4 swiss-cell border-r-4 flex flex-col justify-between bg-[var(--accent-yellow)]">
        <div className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-2 py-1 self-start text-xs font-bold uppercase">Info</div>
        <div className="font-black text-3xl uppercase leading-tight text-[var(--text-primary)]">
          {address || "Waiting for location choice..."}
        </div>
        <div className="font-bold text-5xl text-[var(--text-primary)]">
          <Clock currentWeather={currentWeather} />
        </div>
      </div>

      {/* SECTION 6: CREDITS (Bottom Right) */}
      <div className="col-span-4 row-span-2 swiss-cell flex items-end justify-between">
         <div className="font-bold text-xs uppercase">Precision Dashboard v1.0</div>
         <div className="font-black text-xl">2026.03.01</div>
      </div>
    </div>
  );
}

export default App;
