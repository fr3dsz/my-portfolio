import { useEffect, useState } from "react";

// Offset of `timeZone` from UTC in minutes at `date` (DST-aware, unlike a hardcoded label).
const offsetMinutes = (timeZone, date) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
      .formatToParts(date)
      .map(({ type, value }) => [type, Number(value)])
  );
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
  // compare at minute precision — the formatted parts carry no seconds
  return Math.round((asUtc - Math.floor(date.getTime() / 60000) * 60000) / 60000);
};

const formatOffset = (minutes) => {
  const sign = minutes < 0 ? "−" : "+";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, "0")}` : ""}`;
};

const formatGap = (minutes) => {
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const amount = m ? `${h}h ${m}m` : `${h}h`;
  return `${amount} ${minutes > 0 ? "ahead of" : "behind"} you`;
};

const formatTime = (date, timeZone) =>
  date.toLocaleTimeString("en-US", { timeZone, hour: "numeric", minute: "2-digit" });

const Timezone = ({ location, timeZone }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // minute precision is all we display
    const tick = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(tick);
  }, []);

  const myOffset = offsetMinutes(timeZone, now);
  const gap = myOffset - -now.getTimezoneOffset();

  return (
    <div className="font-mono text-sm">
      <p className="flex items-baseline gap-2.5 text-ink">
        <span aria-hidden="true" className="size-1.5 translate-y-[-2px] self-center rounded-full bg-status" />
        {location}
      </p>
      <p className="mt-3 text-ink">
        <span className="font-display text-3xl tabular-nums">{formatTime(now, timeZone)}</span>
        <span className="ml-3 text-xs text-stone/70">{formatOffset(myOffset)}</span>
      </p>
      <p className="mt-3 text-stone">
        {gap === 0 ? "Same time zone as you" : `${formatGap(gap)} · it's ${formatTime(now)} for you`}
      </p>
    </div>
  );
};

export default Timezone;
