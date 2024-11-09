import { useEffect, useState } from "react";
import { FaTemperatureHalf } from "react-icons/fa6";
import { IoIosCloudOutline } from "react-icons/io";
import { MdOutlineWaterDrop } from "react-icons/md";
import { RiWindyFill } from "react-icons/ri";
import { getWeatherIcon } from "../utils";
import { ICurrentWeather, Zilla } from "../types";
import MapComponent from "./MapComponent";

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
}) => {
  const [dailyWeather, setDailyWeather] = useState<any>({});
  const [hourlyWeather, setHourlyWeather] = useState<any>({});

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
    // setHourlyLoading(true);
    onAddressChange(`${zilla?.name}, Bangladesh`);
    const urlExtension = `${import.meta.env?.VITE_API_SERVER}latitude=${
      zilla?.lat
    }&longitude=${
      zilla?.lng
    }&daily=temperature_2m_max,temperature_2m_min,&forecast_days=1`;

    try {
      const res = await fetch(urlExtension);
      // Parse response body to JSON
      const weatherData = await res.json();
      setDailyWeather(weatherData);
    } catch (err) {
      console.log(err);
    }
  };

  const getDailyWeather = async () => {
    if (!lat || !lng) return;
    // setHourlyLoading(true);
    const urlExtension = `${
      import.meta.env?.VITE_API_SERVER
    }latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,&forecast_days=1`;

    try {
      const res = await fetch(urlExtension);
      // Parse response body to JSON
      const weatherData = await res.json();
      setDailyWeather(weatherData);
    } catch (err) {
      console.log(err);
    }
  };

  const getHourlyWeatherByZilla = async (zilla: Zilla) => {
    if (!zilla || !zilla.lat || !zilla.lng) return;
    // setHourlyLoading(true);
    const urlExtension = `${import.meta.env?.VITE_API_SERVER}latitude=${
      zilla?.lat
    }&longitude=${
      zilla?.lng
    }&hourly=temperature_2m,weather_code&forecast_days=2`;

    try {
      const res = await fetch(urlExtension);
      // Parse response body to JSON
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
    }
  };

  const getHourlyWeather = async () => {
    if (!lat || !lng) return;
    // setHourlyLoading(true);
    const urlExtension = `${
      import.meta.env?.VITE_API_SERVER
    }latitude=${lat}&longitude=${lng}&hourly=temperature_2m,weather_code&forecast_days=2`;

    try {
      const res = await fetch(urlExtension);
      // Parse response body to JSON
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
    <section className="w-[30%] border-l-[2px] border-black font-primaryRegular backdrop-blur-md pt-8 pl-8 pr-[50px] flex flex-col gap-4 overflow-y-auto rightSide">
      <div className="">
        <div className="flex justify-center font-semibold">
          <button
            className={`px-[18px] py-[8px] rounded-l-md ${
              selectedOption === "byZilla"
                ? "bg-fuchsia-600 text-slate-50"
                : "bg-slate-300 hover:bg-slate-400"
            }  text-black border-black border-[3px]`}
            onClick={() => onOptionChange("byZilla")}
          >
            Zilla
          </button>
          <button
            className={`px-[16px] py-[8px]  rounded-r-md ${
              selectedOption === "byMap"
                ? "bg-fuchsia-600 text-slate-50"
                : "bg-slate-300 hover:bg-slate-400"
            }  text-black border-black border-r-[3px] border-y-[3px]`}
            onClick={() => onOptionChange("byMap")}
          >
            Map
          </button>
        </div>
        <div className="my-2">
          {selectedOption === "byZilla" && (
            <select
              className=" border-fuchsia-400 py-1 w-full rounded-[8px] bg-transparent border-[1px] focus:outline-none select mt-3 text-slate-950"
              onChange={onZillaSelect}
            >
              <option>Please choose a zilla</option>
              {zillas.map((z: any) => (
                <option key={z.id}>{z.name}</option>
              ))}
            </select>
          )}
          {selectedOption === "byMap" && (
            <MapComponent onLocationSelect={onLocationSelect} />
          )}
        </div>
      </div>
      <div className="text-center pb-1 font-semibold border-b-[1px] text-xl">
        Weather Details
      </div>
      <div className="pt-4">
        <div className="uppercase font-bold text-purple-200">
          {weatherStatus?.text} {weatherStatus.emoji}
        </div>
        <div className="grid grid-cols-2 gap-3 pt-4">
          <div>Temp max</div>
          <div className="flex items-center gap-1">
            {dailyWeather?.daily?.temperature_2m_max || "N/A"}
            {dailyWeather?.daily_units?.temperature_2m_max}
            <span className="text-red-200">
              <FaTemperatureHalf />
            </span>
          </div>
          <div>Temp min</div>
          <div className="flex items-center gap-1">
            {" "}
            {dailyWeather?.daily?.temperature_2m_min || "N/A"}
            {dailyWeather?.daily_units?.temperature_2m_min}
            <span className="text-blue-200">
              <FaTemperatureHalf />
            </span>
          </div>
          <div>Humidity</div>
          <div className="flex items-center gap-1">
            {relativeHumidity}{" "}
            <span>
              <MdOutlineWaterDrop />
            </span>
          </div>
          <div>Cloudy</div>
          <div className="flex items-center gap-1">
            {cloudy}{" "}
            <span>
              <IoIosCloudOutline />
            </span>
          </div>
          <div>Wind</div>
          <div className="flex items-center gap-1">
            {windSpeed}
            <span>
              <RiWindyFill />
            </span>
          </div>
        </div>
      </div>
      <div className="pt-3 text-center font-semibold border-b-[1px] pb-1 text-xl">
        Over the Day
      </div>
      <div className="mb-6">
        {hourlyWeather?.time?.map((time: string, index: number) => (
          <div className="grid grid-cols-2 gap-3 pt-4" key={index}>
            <div>{`${time.slice(11)}`}</div>
            <div>{hourlyWeather?.temperature_2m[index]} °C</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RightSide;
