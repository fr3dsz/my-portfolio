import { motion } from "motion/react";
import { useRef } from "react";

const TimelineItem = ({ item }) => {
  const isCurrent = item.date?.toLowerCase().includes("present");

  return (
    <div className="relative border-b border-line py-8 last:border-b-0 pl-7">
      {isCurrent && (
        <span aria-hidden="true" className="absolute -left-[7px] top-10 size-3.5 rounded-full border-2 border-aubergine bg-status" />
      )}

      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-stone">{item.date}</span>
        {isCurrent && (
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-stone">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-status" />
            current
          </span>
        )}
      </div>

      <h3 className="mt-3 font-display text-2xl font-normal text-ink">{item.title}</h3>
      <p className="mt-1 text-sm text-stone">{item.job}</p>

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
    </div>
  );
};

export const Timeline = ({ data }) => {
  const listRef = useRef(null);

  return (
    <ol ref={listRef} className="mt-10 border-l-[3px] border-aubergine/70">
      {data.map((item, index) => (
        <motion.li
          key={item._id ?? index}
          initial={{ opacity: 0, y: 24 }}
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