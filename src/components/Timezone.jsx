import { useState, useEffect } from "react";

const CITIES = [
  { name: "New York", tz: "America/New_York", offset: "UTC-5" },
  { name: "London", tz: "Europe/London", offset: "UTC+0" },
  { name: "Manila", tz: "Asia/Manila", offset: "UTC+8", highlight: true },
  { name: "Tokyo", tz: "Asia/Tokyo", offset: "UTC+9" },
  { name: "Sydney", tz: "Australia/Sydney", offset: "UTC+10" },
];

const Timezone = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const getTime = (tz) => new Date(time.toLocaleString("en-US", { timeZone: tz }));

  const isDay = (tz) => {
    const h = getTime(tz).getHours();
    return h >= 6 && h < 18;
  };

  const fmt = (tz) =>
    getTime(tz).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="flex items-center justify-around w-full h-full px-2">
      {CITIES.map(({ name, tz, offset, highlight }) => (
        <div key={name} className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${highlight ? "bg-[#1C1642] border border-[#6B2FCC]" : "opacity-60"}`}>
          {/* Day/Night icon */}
          <span className="text-xs">{isDay(tz) ? "☀️" : "🌙"}</span>

          {/* Time */}
          <p className={`font-mono font-bold tabular-nums ${highlight ? "text-[#C87FFF] text-base" : "text-neutral-400 text-sm"}`}>{fmt(tz)}</p>

          {/* City */}
          <p className={`text-xs font-medium ${highlight ? "text-white" : "text-neutral-500"}`}>{name}</p>

          {/* Offset */}
          <p className="text-[10px] text-neutral-600">{offset}</p>

          {/* Manila live ping dot */}
          {highlight && (
            <span className="relative flex h-1.5 w-1.5 mt-0.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#9B5FDB] opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#9B5FDB]" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Timezone;
