import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const CopyEmailButton = ({ email }) => {
  // idle | copied | failed
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (status === "idle") return;
    const reset = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(reset);
  }, [status]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  const label = { idle: "Copy email", copied: "Email copied", failed: "Couldn't copy — select it instead" }[status];

  return (
    <motion.button
      type="button"
      onClick={copyToClipboard}
      whileTap={{ scale: 0.98 }}
      className="group inline-flex cursor-pointer items-center gap-3 border border-line px-5 py-3 font-mono text-sm text-ink transition-colors duration-200 hover:border-accent"
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={status} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }} className="flex items-center gap-3">
          <img src={status === "copied" ? "assets/copy-done.svg" : "assets/copy.svg"} className={`size-4 ${status === "copied" ? "" : "opacity-60"}`} alt="" />
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};

export default CopyEmailButton;
