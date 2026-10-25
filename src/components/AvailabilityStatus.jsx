import { useSiteSettings } from "../lib/siteSettings";

const AvailabilityStatus = ({ className = "" }) => {
  const { availableForWork, availabilityLabel } = useSiteSettings();

  return (
    <span className={`flex items-center gap-3 font-mono text-sm ${availableForWork ? "text-ink" : "text-stone"} ${className}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${availableForWork ? "bg-status" : "border border-stone/60"}`} />
      {availabilityLabel}
    </span>
  );
};

export default AvailabilityStatus;
