import { useScroll, useTransform, useInView, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const TimelineItem = ({ item, index }) => {
  const cardRef = useRef(null);
  const isActive = useInView(cardRef, { margin: "-45% 0px -45% 0px" });
  const isCurrent = item.date?.toLowerCase().includes("present");

  return (
    <motion.div className="relative pl-10 mb-8" initial={{ opacity: 0, y: 40, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ type: "spring", stiffness: 120, damping: 16, delay: index * 0.08 }}>
      <motion.div
        className="absolute top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
        style={{ left: "var(--timeline-x)" }}
        animate={{
          backgroundColor: isActive ? "var(--color-lavender)" : "rgba(255,255,255,0.3)",
          scale: isActive ? 1.3 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      <motion.div
        ref={cardRef}
        whileHover={{ y: -4 }}
        animate={{
          borderColor: isActive ? "var(--color-lavender)" : "rgba(255,255,255,0.1)",
          boxShadow: isActive ? "0 0 24px -4px rgba(155,95,219,0.45)" : "0 0 0px rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="rounded-2xl border-l-2 bg-gradient-to-b from-storm/60 to-indigo/60 p-5"
      >
        {isCurrent && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-royal/20 px-3 py-1 text-xs font-semibold text-mint mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            Current
          </span>
        )}
        <p className="mb-2 text-sm font-medium text-neutral-500">{item.date}</p>
        <h3 className="text-xl font-medium text-neutral-200">{item.title}</h3>
        <p className="mb-3 text-base text-neutral-500">{item.job}</p>
        <ul className="space-y-1.5">
          {item.contents.map((content, contentIndex) => (
            <li key={contentIndex} className="text-base leading-relaxed text-neutral-400 list-disc list-inside">
              {content}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export const Timeline = ({ data }) => {
  const listRef = useRef(null);
  const containerRef = useRef(null);
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
    target: containerRef,
    offset: ["start 20%", "end 70%"],
  });

  const fillHeight = useTransform(scrollYProgress, [0, 1], [0, height]);
  const fillOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="c-space section-spacing" ref={containerRef}>
      <h2 className="mb-10 text-heading">My Work Experience</h2>
      <div ref={listRef} className="relative [--timeline-x:14px]">
        <div style={{ left: "var(--timeline-x)", height: height + "px" }} className="absolute top-0 w-px bg-white/10" />
        <motion.div style={{ left: "var(--timeline-x)", height: fillHeight, opacity: fillOpacity }} className="absolute top-0 w-px bg-gradient-to-b from-lavender via-lavender/60 to-transparent" />

        {data.map((item, index) => (
          <TimelineItem key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};
