import { ICurrentWeather } from "../types";
import { getWeatherIcon } from "../utils";
import Clock from "./Clock";

interface LeftSideProps {
  currentWeather: ICurrentWeather | null;
  address: string;
}

const LeftSide: React.FC<LeftSideProps> = ({ currentWeather, address }) => {
  const weatherCode = currentWeather?.current?.weather_code;
  const weatherStatus = getWeatherIcon(weatherCode);

  return (
    <section className="w-[70%] pl-[160px]">
      <h1 className="absolute top-14 text-[5.5rem] font-caveatBold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">
        HAWA
      </h1>
      <div className="font-primaryRegular mx-auto h-full flex flex-col justify-end pb-[200px] ">
        <p className="pb-10 text-2xl">
          {!currentWeather && "Select an option (on the Right Side)"}
        </p>
        <div className="flex justify-start mb-8 font-semibold text-2xl  text-center">
          <div className="border-slate-200 rounded-l-lg border-l-[5px] border-b-[5px] border-t-[5px] py-6 px-14 w-[225px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text text-[26px]">
            {currentWeather?.current
              ? `${currentWeather?.current?.temperature_2m} ${currentWeather?.current_units?.temperature_2m}`
              : "Actual"}
          </div>
          <div className="border-slate-200 rounded-r-lg border-[5px] py-6 px-14 w-[225px] text-nowrap bg-gradient-to-r from-violet-700 to-fuchsia-700">
            {currentWeather?.current
              ? `${currentWeather?.current?.apparent_temperature} ${currentWeather?.current_units?.apparent_temperature}`
              : "Feels like"}
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex-col">
            <div className="text-[1rem] max-w-72">{address || ""}</div>
          </div>
          {/* icon based on weather */}
          <div className="text-[2rem]">{weatherStatus.emoji}</div>
        </div>
        <footer className="min-w-[150px] absolute bottom-4 text-fuchsia-400">
          <Clock currentWeather={currentWeather} />
        </footer>
      </div>
    </section>
  );
};

export default LeftSide;
