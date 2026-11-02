import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { employmentTypeLabel, formatExperienceDates, formatExperienceDuration, isCurrentRole } from "../lib/content";

const TimelineItem = ({ item }) => {
  const isCurrent = isCurrentRole(item);
  const dates = formatExperienceDates(item);
  const duration = formatExperienceDuration(item);
  const employmentType = employmentTypeLabel(item.employmentType);
  const reduceMotion = useReducedMotion();

  // Active while the entry crosses the middle band of the viewport
  const itemRef = useRef(null);
  const isActive = useInView(itemRef, { margin: "-40% 0px -40% 0px" });

  return (
    <div ref={itemRef} className="relative border-b border-line py-8 last:border-b-0 pl-7">
      {isCurrent ? (
        <span aria-hidden="true" className="absolute -left-[7px] top-10 size-3.5 rounded-full border-2 border-aubergine bg-status" />
      ) : (
        <span aria-hidden="true" className="absolute -left-[7px] top-10 size-3.5 rounded-full border-2 border-aubergine/30 bg-canvas">
          {/* Active layer: opacity and scale only */}
          <motion.span
            className="absolute -inset-0.5 rounded-full bg-aubergine"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0, scale: reduceMotion || isActive ? 1 : 0.6 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
          />
        </span>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {dates && <span className="font-mono text-xs uppercase tracking-[0.18em] text-stone">{duration ? `${dates} · ${duration}` : dates}</span>}
        {isCurrent && (
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-stone">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-status" />
            current
          </span>
        )}
      </div>

      <h3 className="mt-3 font-display text-2xl font-normal text-ink">{item.title}</h3>
      <p className="mt-1 text-sm text-stone">{[item.job, employmentType].filter(Boolean).join(" · ")}</p>

      {item.contents?.length > 0 && (
        <ul className="mt-5 space-y-2.5">
          {item.contents.map((content, contentIndex) => (
            <li key={contentIndex} className="flex gap-3 text-[15px] leading-relaxed text-stone">
              <span aria-hidden="true" className="mt-2.5 size-1 shrink-0 bg-stone/50" />
              {content}
            </li>
          ))}
        </ul>
      )}

      {item.photos?.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-4">
          {item.photos.map((photo) => (
            <li key={photo.key} className="w-40 sm:w-48">
              <figure>
                <div className="overflow-hidden border border-line bg-surface">
                  <img src={`${photo.url}?w=480&h=360&fit=crop&auto=format`} alt={photo.alt} width={480} height={360} loading="lazy" decoding="async" className="aspect-4/3 w-full object-cover" />
                </div>
                {photo.caption && <figcaption className="mt-2 text-xs leading-snug text-stone">{photo.caption}</figcaption>}
              </figure>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const Timeline = ({ data }) => {
  const listRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Rail fill grows with scroll through the list; it is full when motion is reduced
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.8", "end 0.6"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <ol ref={listRef} className="relative mt-10 border-l-[3px] border-aubergine/20">
      <motion.span aria-hidden="true" className="absolute -left-[3px] top-0 h-full w-[3px] origin-top bg-aubergine/70" style={{ scaleY: reduceMotion ? 1 : fill }} />
      {data.map((item, index) => (
        <motion.li
          key={item._id ?? index}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <TimelineItem item={item} />
        </motion.li>
      ))}
    </ol>
  );
};
