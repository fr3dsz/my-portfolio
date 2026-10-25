const GROUPS = [
  { label: "Languages", items: ["cplusplus", "csharp", "javascript"] },
  { label: "Frontend", items: ["react", "html5", "css3", "tailwindcss"] },
  { label: "Tooling", items: ["git", "github", "vitejs", "microsoft"] },
];

export function Frameworks() {
  return (
    <div className="border-y border-line">
      {GROUPS.map((group) => (
        <div key={group.label} className="border-b border-line py-4 last:border-b-0">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-stone/70">{group.label}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
            {group.items.map((name) => (
              <li key={name} className="group flex items-center gap-2">
                <img src={`assets/logos/${name}.svg`} alt="" className="size-4 opacity-50 saturate-0 transition duration-200 group-hover:opacity-100 group-hover:saturate-100" />
                <span className="font-mono text-sm text-stone transition-colors group-hover:text-ink">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}