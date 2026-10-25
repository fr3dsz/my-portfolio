import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";

const LINKS = [
  { href: "#home", label: "Home", code: "01" },
  { href: "#about", label: "About", code: "02" },
  { href: "#work", label: "Work", code: "03" },
];

const SECTION_IDS = LINKS.map((link) => link.href.slice(1));

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <>
      <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-30 h-0.5 origin-left bg-accent" aria-hidden="true" />
      <header className="fixed inset-x-0 z-20 border-b border-line bg-canvas">
        <div className="mx-auto max-w-[1200px] c-space">
          <div className="flex items-center justify-between py-4">
            <a href="#home" className="font-display text-lg text-ink transition-colors hover:text-accent">
              fr3dsz
            </a>
            <nav className="hidden items-center gap-8 sm:flex" aria-label="Primary">
              {LINKS.map((link) => {
                const isActive = active === link.href.slice(1);
                return (
                  <a key={link.href} href={link.href} className="group font-mono text-xs uppercase tracking-[0.15em]">
                    <span className={isActive ? "text-accent" : "text-stone/70"}>{link.code} /</span>{" "}
                    <span className={isActive ? "text-ink" : "text-stone group-hover:text-ink"}>{link.label}</span>
                    <span className={`mt-1 block h-px bg-accent transition-transform duration-200 origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                  </a>
                );
              })}
            </nav>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              className="font-mono text-xs uppercase tracking-[0.15em] text-stone transition-colors hover:text-ink sm:hidden"
            >
              {isOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-10 bg-canvas pt-24 sm:hidden"
          >
            <nav className="c-space" aria-label="Mobile">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-baseline gap-4 border-b border-line py-6 font-mono text-2xl text-stone transition-colors hover:text-ink"
                >
                  <span className="text-sm text-stone/60">{link.code} /</span>
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;