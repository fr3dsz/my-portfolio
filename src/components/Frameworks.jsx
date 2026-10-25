const GROUPS = [
  {
    label: "Languages",
    items: [
      { icon: "cplusplus", name: "C++" },
      { icon: "csharp", name: "C#" },
      { icon: "javascript", name: "JavaScript" },
    ],
  },
  {
    label: "Frontend",
    items: [
      { icon: "react", name: "React" },
      { icon: "html5", name: "HTML" },
      { icon: "css3", name: "CSS" },
      { icon: "tailwindcss", name: "Tailwind CSS" },
    ],
  },
  {
    label: "Tooling",
    items: [
      { icon: "git", name: "Git" },
      { icon: "github", name: "GitHub" },
      { icon: "vitejs", name: "Vite" },
      { icon: "microsoft", name: "Microsoft" },
    ],
  },
];

export function Frameworks() {
  return (
    <div className="border-y border-line">
      {GROUPS.map((group) => (
        <div key={group.label} className="border-b border-line py-4 last:border-b-0">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-stone/70">{group.label}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
            {group.items.map(({ icon, name }) => (
              <li key={icon} className="group flex items-center gap-2">
                <img src={`assets/logos/${icon}.svg`} alt="" className="size-4 opacity-50 saturate-0 transition duration-200 group-hover:opacity-100 group-hover:saturate-100" />
                <span className="font-mono text-sm text-stone transition-colors group-hover:text-ink">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}