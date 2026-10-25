import SectionHeading from "../components/SectionHeading";

const TextSection = ({ section }) => {
  const body = section.body || [];

  return (
    <section id={section.anchor} className="c-space pb-16 pt-24 md:pb-24 md:pt-32">
      <SectionHeading code={section.code}>{section.title}</SectionHeading>

      {body.length > 0 && (
        <div className="mt-12 max-w-[65ch] space-y-4 text-base leading-relaxed text-stone md:mt-16">
          {body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}
    </section>
  );
};

export default TextSection;
