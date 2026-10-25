import { mySocials } from "../constants";

const Footer = () => {
  return (
    <footer className="c-space pb-10 pt-16 md:pt-24">
      <div className="h-px w-full bg-line" />

      <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone/70">Social</p>
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          {mySocials.map((social, index) =>
            social.href ? (
              <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-stone transition-colors hover:text-ink">
                {social.name}
              </a>
            ) : (
              <span key={index} className="font-mono text-sm text-stone/60">
                {social.name}
              </span>
            )
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs text-stone/70">© 2026 fr3dsz — all rights reserved.</p>
        <p className="font-mono text-xs text-stone/70">Built with React · Tailwind · Sanity</p>
      </div>
    </footer>
  );
};

export default Footer;