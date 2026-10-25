// Fallback content, shown until (or if) the Sanity "siteSettings" / "about"
// singletons are filled in. Shapes match the normalized output of src/lib/content.js.
export const defaultSettings = {
  name: "Luis Conda",
  role: "Full-stack developer",
  location: "Manila, PH",
  timeZone: "Asia/Manila",
  availableForWork: true,
  availabilityLabel: "Open to work · remote worldwide",
  email: "luisfrederickconda@gmail.com",
  resumeUrl: "",
  socials: [
    { name: "GitHub", url: "https://github.com/fr3dsz" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/luis-frederick-conda-33a836336" },
    { name: "Instagram", url: "https://www.instagram.com/fr3dsz/" },
  ],
};

const localIcon = (file) => `assets/logos/${file}.svg`;

export const defaultAbout = {
  heading: "",
  bio: [
    "I enjoy building software that solves real problems through full-stack projects and hands-on development. I've worked with different technologies in academic projects and focus more on understanding how systems work.",
  ],
  photo: null,
  currently: [],
  education: [],
  techGroups: [
    {
      label: "Languages",
      items: [
        { name: "C++", iconUrl: localIcon("cplusplus") },
        { name: "C#", iconUrl: localIcon("csharp") },
        { name: "JavaScript", iconUrl: localIcon("javascript") },
      ],
    },
    {
      label: "Frontend",
      items: [
        { name: "React", iconUrl: localIcon("react") },
        { name: "HTML", iconUrl: localIcon("html5") },
        { name: "CSS", iconUrl: localIcon("css3") },
        { name: "Tailwind CSS", iconUrl: localIcon("tailwindcss") },
      ],
    },
    {
      label: "Tooling",
      items: [
        { name: "Git", iconUrl: localIcon("git") },
        { name: "GitHub", iconUrl: localIcon("github") },
        { name: "Vite", iconUrl: localIcon("vitejs") },
        { name: "Microsoft", iconUrl: localIcon("microsoft") },
      ],
    },
  ],
};

// Page layout used when the Sanity "homePage" singleton is missing or empty.
// Also supplies per-type defaults (title, anchor, …) for blank CMS fields.
export const defaultSections = [
  {
    _key: "hero",
    _type: "heroSection",
    navLabel: "Home",
    anchor: "home",
    standfirst:
      "I'm a full-stack developer growing into an *AI engineer* — using AI to build faster and ship better, and turning every hurdle into the next thing I learn.",
    stackLine: "React · Node · C# · Tailwind",
  },
  { _key: "about", _type: "aboutSection", title: "About Me", navLabel: "About", anchor: "about" },
  { _key: "projects", _type: "projectsSection", title: "Selected Work", navLabel: "Work", anchor: "work" },
  { _key: "experience", _type: "experienceSection", title: "Experience", navLabel: "Experience", anchor: "experience" },
  {
    _key: "contact",
    _type: "contactSection",
    title: "Contact",
    navLabel: "Contact",
    anchor: "contact",
    intro: "Have a role, a project, or just a question? My inbox is open.",
  },
];

export const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://robohash.org/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://robohash.org/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://robohash.org/john",
  },
  {
    name: "Alice",
    username: "@alice",
    body: "This is hands down the best thing I've experienced. Highly recommend!",
    img: "https://robohash.org/alice",
  },
  {
    name: "Bob",
    username: "@bob",
    body: "Incredible work! The attention to detail is phenomenal.",
    img: "https://robohash.org/bob",
  },
  {
    name: "Charlie",
    username: "@charlie",
    body: "This exceeded all my expectations. Absolutely stunning!",
    img: "https://robohash.org/charlie",
  },
  {
    name: "Dave",
    username: "@dave",
    body: "Simply breathtaking. The best decision I've made in a while.",
    img: "https://robohash.org/dave",
  },
  {
    name: "Eve",
    username: "@eve",
    body: "So glad I found this. It has changed the game for me.",
    img: "https://robohash.org/eve",
  },
];
