import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getWeatherIcon } from "../utils";
import { ICurrentWeather, Zilla } from "../types";
import MapComponent from "./MapComponent";
import Skeleton from "./Skeleton";

interface RightSideProps {
  selectedZilla: Zilla | null | undefined;
  currentWeather: ICurrentWeather | null;
  zillas: Zilla[];
  onLocationSelect: any;
  selectedOption: string;
  onOptionChange: any;
  lat: string;
  lng: string;
  onAddressChange: any;
  onZillaSelect: any;
  isWeatherLoading?: boolean;
}

const RightSide: React.FC<RightSideProps> = ({
  selectedZilla,
  currentWeather,
  onZillaSelect,
  zillas,
  onLocationSelect,
  selectedOption,
  onOptionChange,
  lat,
  lng,
  onAddressChange,
  isWeatherLoading,
}) => {
  const { t } = useTranslation();
  const [dailyWeather, setDailyWeather] = useState<any>({});
  const [hourlyWeather, setHourlyWeather] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  // TODO: these will go in utils
  const relativeHumidity = `${
    currentWeather?.current?.relative_humidity_2m || "0"
  }${currentWeather?.current_units?.relative_humidity_2m || ""}`;
  const cloudy = `${currentWeather?.current?.cloud_cover || "0"}${
    currentWeather?.current_units?.cloud_cover || ""
  }`;
  const windSpeed = `${currentWeather?.current?.wind_speed_10m || "0"}${
    currentWeather?.current_units?.wind_speed_10m || ""
  }`;
  const weatherStatus = getWeatherIcon(currentWeather?.current?.weather_code);
  const nowTime = new Date();
  const nowHour = nowTime.getHours() + 1;

  const getDailyWeatherByZilla = async (zilla: Zilla) => {
    if (!zilla || !zilla.lat || !zilla.lng) return;
    setIsLoading(true);
    onAddressChange(`${zilla?.name}, Bangladesh`);
    const urlExtension = `${import.meta.env?.VITE_API_SERVER}latitude=${
      zilla?.lat
    }&longitude=${
      zilla?.lng
    }&daily=temperature_2m_max,temperature_2m_min,&forecast_days=1`;

    try {
      const res = await fetch(urlExtension);
      const weatherData = await res.json();
      setDailyWeather(weatherData);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDailyWeather = async () => {
    if (!lat || !lng) return;
    setIsLoading(true);
    const urlExtension = `${
      import.meta.env?.VITE_API_SERVER
    }latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,&forecast_days=1`;

    try {
      const res = await fetch(urlExtension);
      const weatherData = await res.json();
      setDailyWeather(weatherData);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getHourlyWeatherByZilla = async (zilla: Zilla) => {
    if (!zilla || !zilla.lat || !zilla.lng) return;
    setIsLoading(true);
    const urlExtension = `${import.meta.env?.VITE_API_SERVER}latitude=${
      zilla?.lat
    }&longitude=${
      zilla?.lng
    }&hourly=temperature_2m,weather_code&forecast_days=2`;

    try {
      const res = await fetch(urlExtension);
      const weatherData = await res.json();
      const temperature_2m = weatherData?.hourly?.temperature_2m.slice(
        nowHour,
        nowHour + 5
      );
      const time = weatherData?.hourly?.time.slice(nowHour, nowHour + 5);
      const weather_code = weatherData?.hourly?.weather_code.slice(
        nowHour,
        nowHour + 5
      );
      setHourlyWeather({ temperature_2m, time, weather_code });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getHourlyWeather = async () => {
    if (!lat || !lng) return;
    setIsLoading(true);
    const urlExtension = `${
      import.meta.env?.VITE_API_SERVER
    }latitude=${lat}&longitude=${lng}&hourly=temperature_2m,weather_code&forecast_days=2`;

    try {
      const res = await fetch(urlExtension);
      const weatherData = await res.json();
      const temperature_2m = weatherData?.hourly?.temperature_2m.slice(
        nowHour,
        nowHour + 5
      );
      const time = weatherData?.hourly?.time.slice(nowHour, nowHour + 5);
      const weather_code = weatherData?.hourly?.weather_code.slice(
        nowHour,
        nowHour + 5
      );
      setHourlyWeather({ temperature_2m, time, weather_code });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedZilla) {
      getDailyWeatherByZilla(selectedZilla);
      getHourlyWeatherByZilla(selectedZilla);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedZilla]);

  useEffect(() => {
    getDailyWeather();
    getHourlyWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  return (
    <section className="h-full flex flex-col font-bold rightSide overflow-y-auto text-[var(--text-primary)]">
      <div className="border-b-2 border-[var(--border-color)] p-4">
        <div className="flex border-2 border-[var(--border-color)] p-1 gap-1 option-toggle rounded-[var(--btn-radius)]">
          <button
            className={`flex-grow py-2 text-xs uppercase tracking-widest transition-all ${
              selectedOption === "byZilla"
                ? "bg-[var(--text-primary)] text-[var(--text-inverse)]"
                : "text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
            }`}
            onClick={() => onOptionChange("byZilla")}
          >
            {t("zilla")}
          </button>
          <button
            className={`flex-grow py-2 text-xs uppercase tracking-widest transition-all ${
              selectedOption === "byMap"
                ? "bg-[var(--text-primary)] text-[var(--text-inverse)]"
                : "text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
            }`}
            onClick={() => onOptionChange("byMap")}
          >
            {t("map")}
          </button>
        </div>
        <div className="mt-4">
          {selectedOption === "byZilla" && (
            <div className="relative">
              <select
                className="w-full text-sm uppercase bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)]"
                onChange={onZillaSelect}
                value={selectedZilla?.name || ""}
              >
                <option value="" disabled>
                  {t("select_region")}
                </option>
                {zillas.map((z: any) => (
                  <option key={z.id} value={z.name}>
                    {z.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-primary)]">
                ▼
              </div>
            </div>
          )}
          {selectedOption === "byMap" && (
            <MapComponent onLocationSelect={onLocationSelect} />
          )}
        </div>
      </div>

      <div className="p-4 flex-grow">
        <div className="uppercase text-4xl font-black mb-6 leading-none border-b-4 border-[var(--border-color)] pb-2 text-[var(--text-primary)]">
          {isWeatherLoading ? (
            <Skeleton className="w-3/4 h-10 mb-2" />
          ) : (
            weatherStatus?.text
          )}
        </div>

        <div className="grid grid-cols-1 gap-2">
          {[
            {
              label: t("humidity"),
              value: relativeHumidity,
              color: "var(--accent-blue)",
            },
            { label: t("cloudy"), value: cloudy, color: "gray" },
            {
              label: t("wind"),
              value: windSpeed,
              color: "var(--accent-yellow)",
            },
            {
              label: t("max"),
              value: `${dailyWeather?.daily?.temperature_2m_max || "0"}°`,
              color: "var(--accent-red)",
            },
            {
              label: t("min"),
              value: `${dailyWeather?.daily?.temperature_2m_min || "0"}°`,
              color: "var(--accent-blue)",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex border-b border-[var(--border-color)] py-2 items-center justify-between opacity-90"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs uppercase tracking-tighter text-[var(--text-primary)]">
                  {item.label}
                </span>
              </div>
              <span className="text-xl font-black text-[var(--text-primary)]">
                {isWeatherLoading || isLoading ? (
                  <Skeleton className="w-16 h-6" />
                ) : (
                  item.value
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t-4 border-[var(--border-color)] pt-4">
          <div className="text-xs uppercase mb-4 tracking-widest text-[var(--text-primary)]">
            {t("hourly")}
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {isWeatherLoading || isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div className="flex justify-between py-2 items-end" key={i}>
                    <Skeleton className="w-12 h-4" />
                    <Skeleton className="w-10 h-6" />
                  </div>
                ))
              : hourlyWeather?.time?.map((time: string, index: number) => (
                  <div
                    className="flex justify-between py-2 items-end"
                    key={index}
                  >
                    <div className="text-sm text-[var(--text-primary)]">
                      {time.slice(11)}
                    </div>
                    <div className="text-2xl font-black text-[var(--text-primary)]">
                      {Math.round(hourlyWeather?.temperature_2m[index])}°
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RightSide;
