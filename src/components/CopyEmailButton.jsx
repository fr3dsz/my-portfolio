import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const CopyEmailButton = () => {
  const [copied, setCopied] = useState(false);
  const email = "luisfrederickconda@gmail.com";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <motion.button
      onClick={copyToClipboard}
      whileTap={{ scale: 0.98 }}
      className="group inline-flex cursor-pointer items-center gap-3 border border-line px-5 py-3 font-mono text-sm text-ink transition-colors duration-200 hover:border-accent"
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="copied" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }} className="flex items-center gap-3">
            <img src="assets/copy-done.svg" className="size-4" alt="" />
            Email has Copied
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="flex items-center gap-3">
            <img src="assets/copy.svg" className="size-4 opacity-60" alt="" />
            Copy Email Address
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CopyEmailButton;