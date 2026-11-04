export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  description: string;
  architectureNote: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  accentColor: string;
  previewType: 'delivery-grid' | 'ai-copilot' | 'audio-waveform' | 'spatial-console';
}

export interface AchievementItem {
  id: string;
  code: string;
  title: string;
  role: string;
  period: string;
  category: 'OPEN SOURCE' | 'COMMUNITY LEADERSHIP' | 'HONOR';
  highlight: string;
  description: string;
  badgeImage?: string;
}

export interface SkillItem {
  name: string;
  category: 'Frontend & UI' | 'Backend & Data' | 'Workflow & Design';
  deviconClass: string;
  specCode: string;
  layer: string;
}

export interface CommandItem {
  id: string;
  label: string;
  category: 'NAVIGATION' | 'PROJECTS' | 'EXTERNAL';
  shortcut?: string;
  href?: string;
  actionType: 'scroll' | 'external' | 'copy-email' | 'project-modal';
  target: string;
}

export const HERO_DATA = {
  topLabel: 'CONSOLE SHIVAM / PORTFOLIO 2026',
  headlineLines: ['BUILDING', 'BEYOND', 'THE ORDINARY.'],
  supportingText:
    "I'm Shivam — a developer exploring the intersection of technology, AI and creative digital experiences.",
  coordinates: '23.2599° N, 77.4126° E · BHOPAL, IN',
  statusLabel: 'SYS.2026 · AVAILABLE FOR SELECT COLLABORATIONS',
  domain: 'https://shivamgupta.xyz',
  repository: 'https://github.com/shivamgupta4757/Console-shivam',
};

export const ABOUT_DATA = {
  degree: 'B.Tech Computer Science Engineering',
  institution: 'IES University, Bhopal',
  duration: '2023–2027',
  identity: 'Full-stack developer, AI explorer and open-source contributor.',
  lead: 'Engineering digital products where precision interface systems meet spatial web graphics and applied AI.',
  storyParagraphs: [
    'Currently pursuing a B.Tech in Computer Science Engineering at IES University, Bhopal (2023–2027), I focus on building end-to-end web applications, developer tools, and interactive 3D interfaces that prioritize clarity, responsiveness, and tactile precision.',
    'From shipping open-source pull requests across national coding programs to architecting full-stack platforms with React, Next.js, Node.js, and TypeScript, my approach treats every viewport as an engineered instrument — balancing clean system architecture with deliberate visual craft.',
  ],
  profileImage: '/shivam-profile2 (2).png',
  pillars: [
    {
      code: '01 / ARCH',
      title: 'Full-Stack Web Systems',
      detail: 'React, Next.js, Node.js, Express.js, TypeScript, REST APIs, MongoDB & MySQL.',
    },
    {
      code: '02 / SPATIAL',
      title: 'Interactive & 3D Craft',
      detail: 'Real-time WebGL scenes with Three.js, custom motion systems, and high-contrast UI.',
    },
    {
      code: '03 / OSS',
      title: 'Open-Source & Community',
      detail: 'Hacktoberfest Super Contributor, top-ranked contributor in SWoC & SSoC, and campus technical leadership.',
    },
  ],
};

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'localgo',
    index: '01',
    title: 'LocalGo',
    subtitle: 'Local delivery platform',
    category: 'FULL-STACK COMMERCE & LOGISTICS',
    year: '2025',
    description:
      'A hyperlocal delivery platform engineered to connect neighborhood merchants with nearby customers through streamlined order routing, real-time dispatch tracking, and a responsive storefront.',
    architectureNote:
      'Designed around low-friction checkout flows, structured catalog indexing, and clear status progression from merchant acceptance to doorstep handoff.',
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JavaScript'],
    githubUrl: 'https://github.com/shivamgupta4757',
    accentColor: '#B9FFCB',
    previewType: 'delivery-grid',
  },
  {
    id: 'shoppilot-ai',
    index: '02',
    title: 'ShopPilot AI',
    subtitle: 'AI-powered business assistant MVP',
    category: 'APPLIED AI & PRODUCTIVITY MVP',
    year: '2025',
    description:
      'An AI-powered business assistant MVP built to help small merchants and operators automate catalog descriptions, customer inquiry responses, and daily operational workflows.',
    architectureNote:
      'Combines a clean command-first workspace with structured prompt templates and actionable merchant views without overwhelming non-technical store owners.',
    technologies: ['Next.js', 'TypeScript', 'React', 'Node.js', 'Tailwind CSS', 'REST API'],
    githubUrl: 'https://github.com/shivamgupta4757',
    accentColor: '#8B5CF6',
    previewType: 'ai-copilot',
  },
  {
    id: 'musicx',
    index: '03',
    title: 'MusicX',
    subtitle: 'Music streaming web application',
    category: 'MEDIA & INTERACTIVE AUDIO WEB APP',
    year: '2025',
    description:
      'A modern music streaming web application featuring responsive playback controls, curated playlist management, dynamic track queues, and an immersive dark-room listening interface.',
    architectureNote:
      'Focused on instantaneous audio state transitions, keyboard-accessible transport controls, and crisp album/waveform visual hierarchy.',
    technologies: ['React', 'JavaScript', 'CSS', 'HTML', 'Tailwind CSS', 'Figma'],
    githubUrl: 'https://github.com/shivamgupta4757',
    accentColor: '#496BFF',
    previewType: 'audio-waveform',
  },
  {
    id: 'console-shivam',
    index: '04',
    title: 'Console Shivam',
    subtitle: 'Personal portfolio',
    category: 'CREATIVE ENGINEERING & WEBGL EXPERIENCE',
    year: '2026',
    description:
      'An original futuristic developer identity and interactive 3D portfolio combining Nothing-inspired dot-matrix typography, real-time Three.js celestial geometry, and precision editorial layouts.',
    architectureNote:
      'Built as a zero-backend static React + Vite + Three.js production bundle deployed directly to shivamgupta.xyz via GitHub Pages.',
    technologies: ['React', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Figma', 'GitHub'],
    githubUrl: 'https://github.com/shivamgupta4757/Console-shivam',
    liveUrl: 'https://shivamgupta.xyz',
    accentColor: '#B9FFCB',
    previewType: 'spatial-console',
  },
];

export const ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    id: 'hacktoberfest-2025',
    code: 'ACH.01',
    title: 'Hacktoberfest 2025',
    role: 'Super Contributor',
    period: '2025',
    category: 'OPEN SOURCE',
    highlight: 'SUPER CONTRIBUTOR · HOLOPIN LEVEL 0–5',
    description:
      'Recognized as a Hacktoberfest Super Contributor for sustained, high-quality merged pull requests across open-source repositories, progressing through all contributor badge tiers and supporting the Tree-Nation sustainability initiative.',
    badgeImage: '/lvl5-astronaut.webp',
  },
  {
    id: 'swoc-2025',
    code: 'ACH.02',
    title: 'Social Winter of Code 2025',
    role: 'Rank 6 Contributor',
    period: '2025',
    category: 'OPEN SOURCE',
    highlight: 'ALL-INDIA RANK 06',
    description:
      'Achieved Rank 6 among open-source contributors during Social Winter of Code 2025 by resolving frontend architecture issues, improving UI accessibility, and shipping production documentation.',
    badgeImage: '/lvl4-astronaut.webp',
  },
  {
    id: 'ssoc-2025',
    code: 'ACH.03',
    title: 'Social Summer of Code 2025',
    role: 'Rank 6 Contributor',
    period: '2025',
    category: 'OPEN SOURCE',
    highlight: 'ALL-INDIA RANK 06',
    description:
      'Secured Rank 6 across the cohort in Social Summer of Code 2025 through consistent feature implementations, bug fixes, and collaborative code reviews with project maintainers.',
    badgeImage: '/lvl3-astronaut.webp',
  },
  {
    id: 'gssoc-2026',
    code: 'ACH.04',
    title: 'GSSoC 2026',
    role: 'Contributor',
    period: '2026',
    category: 'OPEN SOURCE',
    highlight: 'GIRLSCRIPT SUMMER OF CODE',
    description:
      'Active open-source contributor in GirlScript Summer of Code 2026, collaborating on modern web stacks, modular React components, and developer tooling.',
    badgeImage: '/lvl2-astronaut.webp',
  },
  {
    id: 'hackerrank-campus-crew',
    code: 'ACH.05',
    title: 'HackerRank Campus Crew',
    role: 'Campus Crew Ambassador',
    period: '2025–2026',
    category: 'COMMUNITY LEADERSHIP',
    highlight: 'CAMPUS TECHNICAL AMBASSADOR',
    description:
      'Representing HackerRank on campus by organizing algorithmic problem-solving sessions, mentoring peers in data structures and web development, and fostering a builder culture.',
    badgeImage: '/lvl1-astronaut.webp',
  },
  {
    id: 'ecsoc-2026',
    code: 'ACH.06',
    title: 'ECSoC 2026',
    role: 'Campus Ambassador',
    period: '2026',
    category: 'COMMUNITY LEADERSHIP',
    highlight: 'ELITE CODERS COMMUNITY',
    description:
      'Selected as Campus Ambassador for ECSoC 2026, guiding student developers into open-source sprints, collaborative Git workflows, and real-world MVP shipping.',
    badgeImage: '/lvl0-astronaut.webp',
  },
];

export const HOLOPIN_BADGES = [
  { id: 'lvl5', label: 'Level 5 Astronaut Badge', src: '/lvl5-astronaut.webp' },
  {
    id: 'holopin-1',
    label: 'Hacktoberfest Holopin Badge I',
    src: '/eyJidWNrZXQiOiJob2xvcGluLWFzc2V0cyIsImtleSI6ImFzc2V0cy9jbWcyejhoMW4wMDAwanUwNGJxOHUzdWw2IiwiZWRpdHMiOnsicm90YXRlIjpudWxsfX0=.webp',
  },
  {
    id: 'holopin-2',
    label: 'Hacktoberfest Holopin Badge II',
    src: '/eyJidWNrZXQiOiJob2xvcGluLWFzc2V0cyIsImtleSI6ImFzc2V0cy9jbWczMXR3bnAwMDAwbGEwNGQxejRuN3B3IiwiZWRpdHMiOnsicm90YXRlIjpudWxsfX0=.webp',
  },
  {
    id: 'holopin-3',
    label: 'Hacktoberfest Holopin Badge III',
    src: '/eyJidWNrZXQiOiJob2xvcGluLWFzc2V0cyIsImtleSI6ImFzc2V0cy9jbWY2NmlrajQwMDAwaWUwNG8xaGRsZGF1IiwiZWRpdHMiOnsicm90YXRlIjpudWxsfX0=.webp',
  },
  { id: 'lvl4', label: 'Level 4 Astronaut Badge', src: '/lvl4-astronaut.webp' },
  { id: 'lvl3', label: 'Level 3 Astronaut Badge', src: '/lvl3-astronaut.webp' },
  { id: 'lvl2', label: 'Level 2 Astronaut Badge', src: '/lvl2-astronaut.webp' },
  { id: 'lvl1', label: 'Level 1 Astronaut Badge', src: '/lvl1-astronaut.webp' },
  { id: 'lvl0', label: 'Level 0 Astronaut Badge', src: '/lvl0-astronaut.webp' },
];

export const SKILLS_DATA: SkillItem[] = [
  { name: 'HTML', category: 'Frontend & UI', deviconClass: 'devicon-html5-plain', specCode: 'MOD.01', layer: 'Semantic Markup' },
  { name: 'CSS', category: 'Frontend & UI', deviconClass: 'devicon-css3-plain', specCode: 'MOD.02', layer: 'Layout & Motion' },
  { name: 'JavaScript', category: 'Frontend & UI', deviconClass: 'devicon-javascript-plain', specCode: 'MOD.03', layer: 'ES2024 Runtime' },
  { name: 'TypeScript', category: 'Frontend & UI', deviconClass: 'devicon-typescript-plain', specCode: 'MOD.04', layer: 'Static Type System' },
  { name: 'React', category: 'Frontend & UI', deviconClass: 'devicon-react-original', specCode: 'MOD.05', layer: 'Component Architecture' },
  { name: 'Next.js', category: 'Frontend & UI', deviconClass: 'devicon-nextjs-plain', specCode: 'MOD.06', layer: 'Hybrid Web Framework' },
  { name: 'Tailwind CSS', category: 'Frontend & UI', deviconClass: 'devicon-tailwindcss-original', specCode: 'MOD.07', layer: 'Design Token Utility' },
  { name: 'Node.js', category: 'Backend & Data', deviconClass: 'devicon-nodejs-plain', specCode: 'MOD.08', layer: 'Server Runtime' },
  { name: 'Express.js', category: 'Backend & Data', deviconClass: 'devicon-express-original', specCode: 'MOD.09', layer: 'REST API Layer' },
  { name: 'MongoDB', category: 'Backend & Data', deviconClass: 'devicon-mongodb-plain', specCode: 'MOD.10', layer: 'Document Store' },
  { name: 'MySQL', category: 'Backend & Data', deviconClass: 'devicon-mysql-plain', specCode: 'MOD.11', layer: 'Relational Engine' },
  { name: 'Git', category: 'Workflow & Design', deviconClass: 'devicon-git-plain', specCode: 'MOD.12', layer: 'Version Control' },
  { name: 'GitHub', category: 'Workflow & Design', deviconClass: 'devicon-github-original', specCode: 'MOD.13', layer: 'OSS Collaboration' },
  { name: 'Postman', category: 'Workflow & Design', deviconClass: 'devicon-postman-plain', specCode: 'MOD.14', layer: 'API Diagnostics' },
  { name: 'Figma', category: 'Workflow & Design', deviconClass: 'devicon-figma-plain', specCode: 'MOD.15', layer: 'Interface Design' },
];

export const CONTACT_LINKS = {
  email: 'shivamgupta4757@gmail.com',
  github: 'https://github.com/shivamgupta4757',
  repository: 'https://github.com/shivamgupta4757/Console-shivam',
  linkedin: 'https://www.linkedin.com/in/shivamkumarguptaa/',
  twitter: 'https://x.com/Shivamk15928168',
  behance: 'https://www.behance.net/shivamgupta413',
  website: 'https://shivamgupta.xyz',
};

export const COMMAND_ITEMS: CommandItem[] = [
  { id: 'nav-home', label: 'Go to Hero / 3D Orbital Core', category: 'NAVIGATION', shortcut: '01', actionType: 'scroll', target: '#home' },
  { id: 'nav-about', label: 'Go to About & Academic Dossier', category: 'NAVIGATION', shortcut: '02', actionType: 'scroll', target: '#about' },
  { id: 'nav-projects', label: 'Go to Selected Works (LocalGo, ShopPilot AI, MusicX)', category: 'NAVIGATION', shortcut: '03', actionType: 'scroll', target: '#projects' },
  { id: 'nav-experience', label: 'Go to Experience & Open-Source Honors', category: 'NAVIGATION', shortcut: '04', actionType: 'scroll', target: '#experience' },
  { id: 'nav-skills', label: 'Go to Technical Stack Matrix', category: 'NAVIGATION', shortcut: '05', actionType: 'scroll', target: '#skills' },
  { id: 'nav-contact', label: 'Go to Contact & Dispatch', category: 'NAVIGATION', shortcut: '06', actionType: 'scroll', target: '#contact' },
  { id: 'proj-localgo', label: 'Inspect Project: LocalGo — Local delivery platform', category: 'PROJECTS', actionType: 'project-modal', target: 'localgo' },
  { id: 'proj-shoppilot', label: 'Inspect Project: ShopPilot AI — AI business assistant MVP', category: 'PROJECTS', actionType: 'project-modal', target: 'shoppilot-ai' },
  { id: 'proj-musicx', label: 'Inspect Project: MusicX — Music streaming web application', category: 'PROJECTS', actionType: 'project-modal', target: 'musicx' },
  { id: 'proj-console', label: 'Inspect Project: Console Shivam — Personal portfolio', category: 'PROJECTS', actionType: 'project-modal', target: 'console-shivam' },
  { id: 'act-email', label: 'Copy Email Address (shivamgupta4757@gmail.com)', category: 'EXTERNAL', shortcut: 'C', actionType: 'copy-email', target: 'shivamgupta4757@gmail.com' },
  { id: 'ext-github', label: 'Open GitHub (@shivamgupta4757)', category: 'EXTERNAL', actionType: 'external', target: 'https://github.com/shivamgupta4757' },
  { id: 'ext-linkedin', label: 'Open LinkedIn (shivamkumarguptaa)', category: 'EXTERNAL', actionType: 'external', target: 'https://www.linkedin.com/in/shivamkumarguptaa/' },
];

export function filterCommands(items: CommandItem[], query: string): CommandItem[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return items;
  return items.filter(
    (item) =>
      item.label.toLowerCase().includes(trimmed) ||
      item.category.toLowerCase().includes(trimmed) ||
      item.target.toLowerCase().includes(trimmed),
  );
}

export function filterSkillsByCategory(
  skills: SkillItem[],
  category: 'ALL' | SkillItem['category'],
): SkillItem[] {
  if (category === 'ALL') return skills;
  return skills.filter((s) => s.category === category);
}

export function computeOrbitalPosition(
  index: number,
  total: number,
  baseRadius: number,
  bandThickness: number,
): { x: number; y: number; z: number; angle: number } {
  const safeTotal = Math.max(1, total);
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const theta = (2 * Math.PI * index) / goldenRatio;
  const normalized = index / safeTotal;
  const radiusOffset = (normalized - 0.5) * bandThickness;
  const r = baseRadius + radiusOffset;
  const verticalWave = Math.sin(theta * 3 + normalized * Math.PI * 2) * (bandThickness * 0.28);

  return {
    x: Math.cos(theta) * r,
    y: verticalWave,
    z: Math.sin(theta) * r,
    angle: theta,
  };
}

export function dampValue(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * Math.max(0, dt)));
}

export interface WeightedDampingState {
  value: number;
  velocity: number;
}

/**
 * Computes a frame-rate independent, spring-damped weighted follow step.
 * Creates a smooth, heavy inertial response instead of direct linear movement.
 */
export function stepWeightedDamping(
  current: number,
  target: number,
  velocity: number,
  dampingFactor: number,
  stiffness: number,
  dt: number,
): WeightedDampingState {
  const safeDt = Math.min(Math.max(0, dt), 0.1);
  if (safeDt === 0) {
    return { value: current, velocity };
  }
  const force = (target - current) * stiffness;
  const nextVelocity = (velocity + force * safeDt) * Math.exp(-dampingFactor * safeDt);
  const nextValue = current + nextVelocity * safeDt;
  return {
    value: nextValue,
    velocity: nextVelocity,
  };
}

const GLYPH_MAP: Record<string, string[]> = {
  C: ['01110', '10001', '10000', '10001', '01110'],
  O: ['01110', '10001', '10001', '10001', '01110'],
  N: ['10001', '11001', '10101', '10011', '10001'],
  S: ['01111', '10000', '01110', '00001', '11110'],
  L: ['10000', '10000', '10000', '10000', '11111'],
  E: ['11111', '10000', '11110', '10000', '11111'],
  H: ['10001', '10001', '11111', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '11111'],
  V: ['10001', '10001', '10001', '01010', '00100'],
  A: ['01110', '10001', '11111', '10001', '10001'],
  M: ['10001', '11011', '10101', '10001', '10001'],
  '.': ['00000', '00000', '00000', '00000', '00100'],
  ' ': ['00000', '00000', '00000', '00000', '00000'],
};

export function generateDotMatrixWord(text: string): { char: string; grid: boolean[][] }[] {
  return text
    .toUpperCase()
    .split('')
    .map((char) => {
      const rows = GLYPH_MAP[char] ?? GLYPH_MAP[' '];
      return {
        char,
        grid: rows.map((row) => row.split('').map((cell) => cell === '1')),
      };
    });
}
