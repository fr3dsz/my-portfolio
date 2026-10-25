const HeroText = () => {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        01 / Index — Manila, PH · full-stack · open to remote
      </p>
      <h1 className="mt-6 font-display font-normal text-ink" style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
        Luis Conda
      </h1>
      <p className="mt-8 max-w-3xl font-display font-normal text-stone" style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)", lineHeight: 1.4 }}>
        I&apos;m a full-stack developer growing into an <em className="text-ink">AI engineer</em> — using AI to build faster and ship
        better, and turning every hurdle into the next thing I learn.
      </p>
    </div>
  );
};

export default HeroText;