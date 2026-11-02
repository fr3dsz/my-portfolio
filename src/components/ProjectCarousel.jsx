import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const SWIPE_OFFSET = 50;
const SWIPE_VELOCITY = 300;

const Chevron = ({ flip }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={`size-4 ${flip ? "rotate-180" : ""}`}
    aria-hidden="true"
  >
    <path d="M9 5l7 7-7 7" />
  </svg>
);

const controlClass =
  "flex items-center justify-center border border-line bg-canvas/80 p-3 text-stone transition-colors hover:border-accent hover:text-ink";

const ProjectCarousel = ({ photos, title }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();

  const total = photos.length;
  const multiple = total > 1;
  const photo = photos[index];

  // Wrap-around navigation
  const go = (step) => {
    setDirection(step);
    setIndex((current) => (current + step + total) % total);
  };

  const goTo = (target) => {
    setDirection(target > index ? 1 : -1);
    setIndex(target);
  };

  // Arrow keys only act while focus is inside the carousel
  const handleKeyDown = (event) => {
    if (!multiple) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
  };

  // Weak or short swipes snap back
  const handleDragEnd = (_event, info) => {
    if (
      Math.abs(info.offset.x) < SWIPE_OFFSET ||
      Math.abs(info.velocity.x) < SWIPE_VELOCITY
    )
      return;
    go(info.offset.x < 0 ? 1 : -1);
  };

  const slideShift = reduceMotion ? 0 : 40 * direction;
  const duration = reduceMotion ? 0 : 0.3;

  return (
    <div
      className="mt-8"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} photos`}
      onKeyDown={handleKeyDown}
    >
      <div className="relative overflow-hidden border border-line">
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          <motion.div
            key={photo.key || index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${total}`}
            initial={{ opacity: 0, x: slideShift }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -slideShift }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
            drag={multiple ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="touch-pan-y"
          >
            <img
              src={`${photo.url}?w=1200&auto=format`}
              alt={photo.alt}
              width={1200}
              height={900}
              decoding="async"
              draggable={false}
              className="aspect-4/3 w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {multiple && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className={`${controlClass} absolute left-3 top-1/2 -translate-y-1/2`}
            >
              <Chevron flip />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className={`${controlClass} absolute right-3 top-1/2 -translate-y-1/2`}
            >
              <Chevron />
            </button>
          </>
        )}
      </div>

      {(multiple || photo.caption) && (
        <div className="mt-3 flex items-start justify-between gap-4">
          <p className="max-w-[65ch] text-sm leading-relaxed text-stone">
            {photo.caption}
          </p>
          {multiple && (
            <p
              className="shrink-0 font-mono text-xs text-stone"
              aria-live="polite"
            >
              {index + 1} / {total}
            </p>
          )}
        </div>
      )}

      {multiple && (
        <div className="mt-3 flex flex-wrap gap-2">
          {photos.map((item, dotIndex) => (
            <button
              key={item.key || dotIndex}
              type="button"
              onClick={() => goTo(dotIndex)}
              aria-label={`Show photo ${dotIndex + 1} of ${total}`}
              aria-current={dotIndex === index ? "true" : undefined}
              className={`size-2.5 border transition-colors ${dotIndex === index ? "border-accent bg-accent" : "border-line bg-transparent hover:border-stone"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectCarousel;
