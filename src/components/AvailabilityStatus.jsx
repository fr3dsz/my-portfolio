import { getAvailabilityLabel, useSiteSettings } from "../lib/siteSettings";

const AvailabilityStatus = ({ className = "" }) => {
  const settings = useSiteSettings();
  const label = getAvailabilityLabel(settings);
  if (!label) return null;

  const available = settings.availableForWork;

  return (
    <span className={`flex items-baseline gap-2.5 font-mono text-sm ${available ? "font-medium text-ink" : "text-stone"} ${className}`}>
      {/* The marks are absolutely positioned so the ring's bottom edge sets the row baseline; the shift centres it on the text. */}
      <span aria-hidden="true" className={`relative size-3.5 shrink-0 translate-y-0.5 rounded-full border ${available ? "border-status" : "border-stone/60"}`}>
        {available ? <span className="absolute inset-[3px] rounded-full bg-status" /> : <span className="absolute inset-x-[3px] top-1/2 h-px -translate-y-1/2 bg-stone" />}
      </span>
      {label}
    </span>
  );
};

export default AvailabilityStatus;
