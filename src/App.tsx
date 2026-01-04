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

import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();
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

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="swiss-grid min-h-screen w-full md:h-screen md:overflow-hidden" data-theme={theme}>
      {/* Theme & Language Toggle Buttons */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[1000] flex flex-row md:flex-col gap-2">
        <button 
          onClick={toggleLanguage}
          className="px-2 md:px-4 py-1 md:py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] border-2 border-[var(--border-color)] font-bold uppercase text-[10px] md:text-xs tracking-widest hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
        >
          {i18n.language === 'en' ? "বাংলা" : "ENGLISH"}
        </button>
        <button 
          onClick={toggleTheme}
          className="px-2 md:px-4 py-1 md:py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] border-2 border-[var(--border-color)] font-bold uppercase text-[10px] md:text-xs tracking-widest hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
        >
          {theme === 'swiss' ? '🎨' : theme === 'cyber' ? '⚡' : '✨'}
          <span className="hidden md:inline ml-1">{t('theme')}: {theme}</span>
        </button>
      </div>

      {/* SECTION 1: LOGO & TITLE (Top Left) */}
      <div className="col-span-12 md:col-span-8 row-span-4 md:row-span-2 swiss-cell border-b-4 md:border-r-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="border-4 border-[var(--border-color)] p-0 md:p-1 bg-[var(--bg-primary)] shrink-0">
            <img 
              src="/logo.svg"
              className="w-16 h-16 md:w-20 md:h-20 theme-logo"
              alt="Hawa Logo"
            />
          </div>
          <div>
            <h1 className="massive-text text-[clamp(3.5rem,10vw,7rem)] leading-none select-none">
              {t('title')}
            </h1>
          </div>
        </div>
        <div className="text-left md:text-right shrink-0">
          <div className="font-bold text-xl md:text-3xl uppercase tracking-tighter leading-none mb-1">{t('subtitle')}</div>
          <div className="text-[10px] md:text-xs font-black opacity-60 tracking-widest uppercase">{t('style_label')}</div>
        </div>
      </div>

      {/* SECTION 2: MAP (Top Right) */}
      <div className="col-span-12 md:col-span-4 row-span-8 md:row-span-6 swiss-cell border-b-4 flex flex-col min-h-[400px] md:min-h-0">
        <div className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-2 py-1 absolute top-0 left-0 text-xs font-bold uppercase z-10">
          {selectedOption === 'byZilla' ? t('zilla') : t('map')}
        </div>
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
      <div style={{
        borderRight: '2px solid var(--border-color)'
      }} className="col-span-12 md:col-span-8 row-span-6 swiss-cell border-b-4 md:border-r-4 flex items-center justify-center relative py-12 md:py-0 overflow-hidden">
        <div className="absolute top-4 left-4 bg-[var(--accent-red)] text-white px-2 md:px-3 py-1 text-xs md:text-xl font-black uppercase z-10">{t('current')}</div>
        <div className="flex flex-row items-center justify-center w-full px-4 pl-24 sm:pl-0">
          <div className="massive-text text-[clamp(6rem,35vw,26rem)] leading-[0.8] select-none">
            {currentWeather?.current?.temperature_2m ? Math.round(currentWeather.current.temperature_2m) : "00"}
          </div>
          <div className="massive-text text-[clamp(2rem,10vw,9rem)] ml-2 md:ml-4 self-center mt-[-2rem] md:mt-[-4rem]">
            °C
          </div>
        </div>
      </div>

      {/* SECTION 4: FEELS LIKE (Bottom Left 1/2) */}
      <div className="col-span-6 md:col-span-4 row-span-4 swiss-cell border-b-4 border-r-4 flex flex-col justify-between py-6 overflow-hidden">
        <div className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-2 py-1 self-start text-xs font-bold uppercase">{t('apparent')}</div>
        <div className="massive-text text-[clamp(4rem,12vw,8rem)] text-[var(--accent-blue)] leading-none">
          {currentWeather?.current?.apparent_temperature ? Math.round(currentWeather.current.apparent_temperature) : "00"}°
        </div>
        <div className="font-bold uppercase tracking-widest text-xs md:text-sm">{t('feels_like')}</div>
      </div>

      {/* SECTION 5: ADDRESS & CLOCK (Bottom Left 2/2) */}
      <div className="col-span-6 md:col-span-4 row-span-4 swiss-cell border-b-4 md:border-b-0 md:border-r-4 flex flex-col justify-between bg-[var(--accent-yellow)] py-6">
        <div className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-2 py-1 self-start text-xs font-bold uppercase">{t('info')}</div>
        <div className="font-black text-xl sm:text-2xl md:text-3xl uppercase leading-tight text-[var(--text-primary)] line-clamp-3">
          {address || t('loading')}
        </div>
        <div className="font-bold text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)]">
          <Clock currentWeather={currentWeather} />
        </div>
      </div>

      {/* SECTION 6: CREDITS (Bottom Right) */}
      <div style={{
        borderLeft: 'none',
      }} className="col-span-12 md:col-span-4 row-span-2 swiss-cell flex items-start md:items-end justify-between py-4">
         <div className="font-bold text-[10px] md:text-xs uppercase">{t('precision')} v1.0</div>
         <div className="font-black text-lg md:text-xl">2026.03.01</div>
      </div>
    </div>
  );
}

export default App;
