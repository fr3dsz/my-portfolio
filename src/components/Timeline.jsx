import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { type: "tween", duration: 0.5, ease: "easeOut" } },
};

const TimelineItem = ({ item }) => {
  const cardRef = useRef(null);
  const isActive = useInView(cardRef, { margin: "-45% 0px -45% 0px" });
  const isCurrent = item.date?.toLowerCase().includes("present");

  return (
    <motion.li className="relative pl-12 pb-8 last:pb-0" variants={itemVariants}>
      <motion.span
        className="absolute top-6 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
        style={{ left: "var(--timeline-x)" }}
        animate={{
          backgroundColor: isActive ? "var(--color-lavender)" : "rgba(255,255,255,0.25)",
          boxShadow: isActive
            ? "0 0 0 4px rgba(155,95,219,0.18), 0 0 18px rgba(155,95,219,0.55)"
            : "0 0 0 0px rgba(0,0,0,0)",
          scale: isActive ? 1.25 : 1,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
      />

      <motion.div
        ref={cardRef}
        whileHover={{ y: -4 }}
        animate={{
          borderColor: isActive ? "rgba(155,95,219,0.5)" : "rgba(255,255,255,0.08)",
          boxShadow: isActive ? "0 10px 40px -10px rgba(155,95,219,0.35)" : "0 0 0px rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="rounded-2xl border bg-gradient-to-b from-storm/50 to-indigo/50 p-6"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-400">
            {item.date}
          </span>
          {isCurrent && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-royal/20 px-3 py-1 text-xs font-semibold text-mint">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
              Current
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-neutral-100 md:text-xl">{item.title}</h3>
        <p className="mt-0.5 mb-4 text-sm font-medium text-lavender/90">{item.job}</p>
        <ul className="space-y-2.5">
          {(item.contents || []).map((content, contentIndex) => (
            <li key={contentIndex} className="flex gap-2.5 text-[15px] leading-relaxed text-neutral-300">
              <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-lavender/60" />
              {content}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.li>
  );
};

export const Timeline = ({ data }) => {
  const listRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!listRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setHeight(entry.contentRect.height);
    });
    observer.observe(listRef.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 25%", "end 60%"],
  });

  const fillHeight = useTransform(scrollYProgress, [0, 1], [0, height]);
  const fillOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <motion.ul
      ref={listRef}
      variants={listVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="relative mt-10 [--timeline-x:14px]"
    >
      <div style={{ left: "var(--timeline-x)", height: height + "px" }} className="absolute top-0 w-px bg-white/10" />
      <motion.div
        style={{ left: "var(--timeline-x)", height: fillHeight, opacity: fillOpacity }}
        className="absolute top-0 w-px bg-gradient-to-b from-lavender via-lavender/60 to-transparent"
      />

      {data.map((item, index) => (
        <TimelineItem key={item._id ?? index} item={item} />
      ))}
    </motion.ul>
  );
};
