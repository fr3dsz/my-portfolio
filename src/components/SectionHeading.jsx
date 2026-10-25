const SectionHeading = ({ code, children }) => {
  return (
    <header>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{code} /</p>
      <h2 className="mt-3 font-display text-3xl font-normal text-ink md:text-4xl">{children}</h2>
      <div className="mt-8 h-px w-full bg-line" />
    </header>
  );
};

export default SectionHeading;