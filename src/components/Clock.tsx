import { FC, useEffect, useState } from "react";

interface ClockProps {
  currentWeather: any;
}

const Clock: FC<ClockProps> = ({ currentWeather }) => {
  const [ctime, setTime] = useState(new Date().toLocaleTimeString());

  const getCurrentTime = () => {
    return (
      currentWeather?.current?.time &&
      new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(currentWeather?.current?.time))
    );
  };
  // Set up the interval once on component mount
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000); // Update every second

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="font-black uppercase tracking-tighter">
      <div>{ctime}</div>
      <div className="text-xs md:text-sm mt-1">{getCurrentTime()}</div>
    </div>
  );
};

export default Clock;
