import { FlipWords } from "./FlipWords";

const HeroText = () => {
  return (
    <div className="z-10 mt-20 text-center md:mt-40 md:text-left rounded-3xl bg-clip-text">
      {/* Desktop View */}
      <div className="flex-col hidden md:flex c-space">
        <h1 className="text-4xl font-medium">Hi I'm Luis</h1>
        <div className="flex flex-col items-start">
          <p className="text-5xl font-medium text-neutral-300">
            A Developer <br /> Dedicated to Crafting
          </p>
          <div>
            <FlipWords words={["Secure", "Modern", "Scalable"]} className="font-black text-white text-8xl" />
          </div>
          <p className="text-4xl font-medium text-neutral-300">Web Solutions</p>
        </div>
      </div>
      {/* Mobile View */}
    </div>
  );
};

export default HeroText;
