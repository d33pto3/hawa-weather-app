import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaTemperatureHalf } from "react-icons/fa6";
import { IoIosCloudOutline } from "react-icons/io";
import { MdOutlineWaterDrop } from "react-icons/md";
import { RiWindyFill } from "react-icons/ri";
import { getWeatherIcon } from "../utils";

export default function RightSide({
  selectedZilla,
  handleZillaSelect,
  zillas,
  currentWeather,
}: any) {
  const [dailyWeather, setDailyWeather] = useState<any>({});
  const [hourlyWeather, setHourlyWeather] = useState<any>({});
  // const [hourlyLoading, setHourlyLoading] = useState<boolean>(false);

  const relativeHumidity = `${currentWeather?.current?.relative_humidity_2m}${currentWeather?.current_units?.relative_humidity_2m}`;
  const cloudy = `${currentWeather?.current?.cloud_cover}${currentWeather?.current_units?.cloud_cover}`;
  const windSpeed = `${currentWeather?.current?.wind_speed_10m}${currentWeather?.current_units?.wind_speed_10m}`;
  const weatherStatus = getWeatherIcon(currentWeather?.current?.weather_code);

  const nowTime = new Date();
  const nowHour = nowTime.getHours() + 1;

  useEffect(() => {
    getDailyWeatherByZilla();
    getHourlyWeatherByZilla();
  }, [selectedZilla]);

  const getDailyWeatherByZilla = async () => {
    // setHourlyLoading(true);
    const urlExtension = `${import.meta.env?.VITE_API_SERVER}latitude=${
      selectedZilla?.lat
    }&longitude=${
      selectedZilla?.lng
    }&daily=temperature_2m_max,temperature_2m_min,&forecast_days=1`;

    try {
      const res = await fetch(urlExtension);
      // Parse response body to JSON
      const weatherData = await res.json();
      setDailyWeather(weatherData);
    } catch (err) {
      console.log(err);
    }
    // console.log(selectedZilla);
  };

  const getHourlyWeatherByZilla = async () => {
    // setHourlyLoading(true);
    const urlExtension = `${import.meta.env?.VITE_API_SERVER}latitude=${
      selectedZilla?.lat
    }&longitude=${
      selectedZilla?.lng
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
    // console.log(selectedZilla);
  };

  console.log(hourlyWeather);

  useEffect(() => {
    {
      hourlyWeather?.hourly?.time?.map((it: any) => {
        for (it === nowHour; it < nowHour + 5; it++) {
          console.log(it);
        }
      });
    }
  }, []);

  return (
    <section className="w-[30%] backdrop-blur-md pt-8 pl-8 flex flex-col gap-4 overflow-auto">
      <div className="mr-[80px]">
        <div className="mb-2">
          <select
            className=" text-purple-400 py-1 w-full rounded-[8px] bg-transparent border-[1px] focus:outline-none"
            onChange={handleZillaSelect}
          >
            <option>Please choose a zilla</option>
            {zillas.map((z: any) => (
              <option key={z.id}>{z.name}</option>
            ))}
          </select>
        </div>
        {/* search bar */}
        <div className="relative">
          <button className="absolute inset-y-0 right-2 pr-0 flex items-center">
            <FaSearch />
          </button>
          <input
            className="py-1 bg-transparent border-b-[1px] focus:outline-none w-full"
            placeholder="Search Location..."
          />
        </div>
      </div>
      <div>Weather Details...</div>
      <div className="pt-4">
        <div className="uppercase font-bold text-pink-300">
          {weatherStatus?.text}
        </div>
        <div className="grid grid-cols-2 gap-3 pt-4">
          <div>Temp max</div>
          <div className="flex items-center gap-1">
            {dailyWeather?.daily?.temperature_2m_max}
            {dailyWeather?.daily_units?.temperature_2m_max}
            <span className="text-red-200">
              <FaTemperatureHalf />
            </span>
          </div>
          <div>Temp min</div>
          <div className="flex items-center gap-1">
            {" "}
            {dailyWeather?.daily?.temperature_2m_min}
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
      <hr className="w-[77%]"></hr>
      <div className="pt-3">Today's Weather Forecast</div>
      <div>
        {hourlyWeather?.time?.map((time: any, index: any) => (
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div>{`${time.slice(11)}`}</div>
            <div>{hourlyWeather?.temperature_2m[index]}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
