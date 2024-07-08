import { weatherIcons } from "../types";
import { getWeatherIcon } from "../utils";

const LeftSide = ({ currentWeather }: any) => {
  const weatherCode = currentWeather?.current?.weather_code;

  const weatherStatus = getWeatherIcon(weatherCode);

  return (
    <section className="w-[70%] mx-20">
      <h1 className="absolute top-14 text-[4.5rem] font-medium bg-gradient-to-r from-indigo-500 via purple-500 to-pink-500 inline-block text-transparent bg-clip-text">
        Aboho
      </h1>
      <div className="mx-auto h-full flex flex-col justify-end pb-[200px] ">
        <div className="">
          <div className="flex flex-wrap gap-2 items-center border-2 border-slate-300 rounded-[8px] w-fit">
            <div>
              <span className="ml-2 absolute">temperature</span>
              <div className="text-[4rem] font-medium px-2">
                {" "}
                {currentWeather?.current?.temperature_2m}{" "}
                {currentWeather?.current_units?.temperature_2m}
              </div>
            </div>
            <div className="bg-slate-300 rounded-r-[8px] text-black px-2">
              <span className="absolute ml-2">feels like</span>
              <div className="text-[4rem] font-medium">
                {" "}
                {currentWeather?.current?.apparent_temperature}{" "}
                {currentWeather?.current_units?.apparent_temperature}
              </div>
            </div>
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-col">
              <div className="text-[2.5em]">London</div>
              {currentWeather?.current?.time
                ? new Intl.DateTimeFormat("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }).format(new Date(currentWeather?.current?.time))
                : 0}
              -{" "}
              {currentWeather?.current?.time
                ? new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(currentWeather?.current?.time))
                : 0}
            </div>
            {/* icon based on weather */}
            <div className="text-[2.5rem]">{weatherStatus.emoji}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeftSide;
