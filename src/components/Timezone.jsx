import { useEffect, useState } from "react";

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
    <div>
      {CITIES.map(({ name, tz, offset, highlight }) => (
        <div key={name} className={`flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-0 ${highlight ? "text-ink" : "text-stone"}`}>
          <span className="flex items-baseline gap-2.5 font-mono text-sm">
            {highlight && <span aria-hidden="true" className="size-1.5 translate-y-[-2px] self-center rounded-full bg-status" />}
            {name}
            <span className="text-[11px] normal-case tracking-normal text-stone/60">{offset}</span>
          </span>
          <span className="whitespace-nowrap font-mono text-sm tabular-nums">
            {fmt(tz)}
            <span className="ml-2 text-[11px] uppercase tracking-wider text-stone/60">{isDay(tz) ? "day" : "night"}</span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default Timezone;