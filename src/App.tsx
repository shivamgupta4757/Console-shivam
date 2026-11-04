import React, { useEffect, useState } from 'react';
import {
  ABOUT_DATA,
  PROJECTS_DATA,
  ACHIEVEMENTS_DATA,
  HOLOPIN_BADGES,
  SKILLS_DATA,
  CONTACT_LINKS,
  ProjectItem,
  SkillItem,
  CommandItem,
  filterSkillsByCategory,
} from './lib/portfolioData';
import { HeroScene3D } from './components/HeroScene3D';
import { ProjectVisualPreview } from './components/ProjectVisualPreview';
import { DotMatrixSignature } from './components/DotMatrixSignature';
import { CommandPalette } from './components/CommandPalette';
import { FadeInUp } from './components/FadeInUp';
import { FloatingNavDock, NavSectionId } from './components/FloatingNavDock';
import {
  ArrowUpRight,
  Copy,
  Check,
  X,
  Send,
} from 'lucide-react';

const SECTION_IDS: NavSectionId[] = [
  'home',
  'about',
  'projects',
  'experience',
  'skills',
  'contact',
];

export function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const [skillFilter, setSkillFilter] = useState<'ALL' | SkillItem['category']>('ALL');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [commandOpen, setCommandOpen] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [dispatchSubject, setDispatchSubject] = useState('');
  const [dispatchMessage, setDispatchMessage] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (selectedProject) setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  // Track active section while scrolling for the vertical floating dock
  useEffect(() => {
    const handleScroll = () => {
      const triggerY = window.innerHeight * 0.38;
      let current: NavSectionId = 'home';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (selector: string, sectionId?: NavSectionId) => {
    if (sectionId) {
      setActiveSection(sectionId);
    }
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(CONTACT_LINKS.email);
      }
    } catch {
      // Visual confirmation handled below
    }
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 3000);
  };

  const handleSelectCommand = (cmd: CommandItem) => {
    setCommandOpen(false);
    if (cmd.actionType === 'scroll') {
      const targetId = cmd.target.replace('#', '') as NavSectionId;
      scrollToSection(cmd.target, SECTION_IDS.includes(targetId) ? targetId : undefined);
    } else if (cmd.actionType === 'copy-email') {
      handleCopyEmail();
    } else if (cmd.actionType === 'project-modal') {
      const found = PROJECTS_DATA.find((p) => p.id === cmd.target);
      if (found) setSelectedProject(found);
    } else if (cmd.actionType === 'external') {
      window.location.href = cmd.target;
    }
  };

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSubject = dispatchSubject.trim();
    const cleanMessage = dispatchMessage.trim();
    if (!cleanSubject || !cleanMessage) {
      setDispatchStatus('Please enter both a subject and a message.');
      return;
    }
    setDispatchStatus(`Opening mail client for ${CONTACT_LINKS.email}...`);
    const mailtoUrl = `mailto:${CONTACT_LINKS.email}?subject=${encodeURIComponent(
      cleanSubject,
    )}&body=${encodeURIComponent(cleanMessage)}`;
    window.location.href = mailtoUrl;
  };

  const filteredSkills = filterSkillsByCategory(SKILLS_DATA, skillFilter);

  return (
    <div className="min-h-screen w-full max-w-full bg-[#050505] text-[#F5F5F5] relative selection:bg-[#B9FFCB] selection:text-[#050505] overflow-x-hidden">
      {/* =====================================================================
          RIGHT-SIDE VERTICAL FLOATING NAVIGATION DOCK (NO HORIZONTAL NAVBAR)
         ===================================================================== */}
      <FloatingNavDock
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenCommandPalette={() => setCommandOpen(true)}
      />

      <main className="w-full max-w-full overflow-x-hidden">
        {/* ===================================================================
            HERO — FULL-BLEED COSMIC HORIZON & CENTERED EDITORIAL STAGE
           =================================================================== */}
        <section
          id="home"
          className="relative min-h-[760px] lg:h-screen lg:min-h-[820px] lg:max-h-[960px] w-full flex flex-col justify-between overflow-hidden border-b border-white/12 bg-[#050505]"
        >
          {/* Subtle distant starfield in upper sky */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                'radial-gradient(1.5px 1.5px at 14% 18%, rgba(255,255,255,0.65), transparent), radial-gradient(1px 1px at 28% 32%, rgba(185,255,203,0.55), transparent), radial-gradient(1.5px 1.5px at 72% 16%, rgba(255,255,255,0.6), transparent), radial-gradient(1.5px 1.5px at 84% 28%, rgba(168,85,247,0.65), transparent), radial-gradient(1px 1px at 62% 38%, rgba(255,255,255,0.45), transparent), radial-gradient(1px 1px at 38% 12%, rgba(255,255,255,0.5), transparent)',
            }}
          />

          {/* Top Brand Bar (Left Logo + Quick Section Links, keeping Right Floating Dock) */}
          <div className="relative z-20 max-w-[1280px] w-full mx-auto pt-5 sm:pt-6 pl-4 pr-16 sm:pl-8 sm:pr-20 xl:px-8 flex items-center justify-between">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#home', 'home');
              }}
              className="inline-flex items-center gap-2.5 text-[#F5F5F5] font-semibold tracking-tight text-sm sm:text-base hover:text-[#B9FFCB] transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#B9FFCB] shadow-[0_0_10px_#B9FFCB]" />
              <span>Console Shivam</span>
            </a>

            <button
              type="button"
              onClick={() => scrollToSection('#contact', 'contact')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F5F5F5] text-[#050505] hover:bg-[#B9FFCB] text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Connect</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Centered Editorial Hero Copy (Top / Middle Sky) */}
          <div className="relative z-20 max-w-[960px] w-full mx-auto pt-3 sm:pt-4 pb-2 pl-4 pr-16 sm:px-16 text-center flex flex-col items-center">
            <FadeInUp
              reducedMotion={reducedMotion}
              className="flex flex-col items-center space-y-4 sm:space-y-5 w-full"
            >
              {/* Status Capsule matching reference "Open Registrations are live..." */}
              <button
                type="button"
                onClick={() => scrollToSection('#contact', 'contact')}
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/15 hover:border-[#B9FFCB]/50 transition-colors cursor-pointer"
              >
                <span className="px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#050505] text-[10px] sm:text-[11px] font-bold tracking-tight">
                  Open
                </span>
                <span className="text-[11px] sm:text-xs text-[#E5E5E5] font-medium">
                  Available for select collaborations &amp; open-source sprints
                </span>
              </button>

              {/* Monumental Centered Headline */}
              <h1
                style={{ textWrap: 'balance' }}
                className="hero-headline font-bold text-[#FFFFFF] tracking-tight max-w-3xl mx-auto"
              >
                Build Beyond
                <br />
                The Ordinary
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-xs sm:text-base text-[#929292] max-w-xl mx-auto leading-relaxed">
                I&apos;m Shivam — a full-stack developer exploring the intersection of technology, AI and creative digital experiences.
              </p>

              {/* Dual CTA Buttons + Cosmic Gold Pill */}
              <div className="flex flex-col items-center gap-3 pt-0.5 w-full sm:w-auto">
                <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => scrollToSection('#projects', 'projects')}
                    className="min-h-[42px] px-6 py-2 rounded-xl bg-[#0B0F0D]/90 border border-[#B9FFCB]/45 text-[#F5F5F5] hover:border-[#B9FFCB] hover:shadow-[0_0_24px_rgba(185,255,203,0.28)] text-xs sm:text-sm font-medium transition-all inline-flex items-center justify-center cursor-pointer whitespace-nowrap"
                  >
                    Explore My Work
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('#contact', 'contact')}
                    className="min-h-[42px] px-6 py-2 rounded-xl bg-[#FFFFFF] text-[#050505] hover:bg-[#B9FFCB] text-xs sm:text-sm font-semibold transition-colors inline-flex items-center justify-center cursor-pointer whitespace-nowrap shadow-[0_0_24px_rgba(255,255,255,0.2)]"
                  >
                    Let&apos;s Connect
                  </button>
                </div>

                {/* Iridescent Gold / Violet Highlight Pill matching the reference screenshot */}
                <button
                  type="button"
                  onClick={() => scrollToSection('#about', 'about')}
                  className="px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold text-[#050505] transition-transform hover:scale-[1.02] cursor-pointer shadow-[0_0_28px_rgba(250,204,21,0.35)]"
                  style={{
                    background:
                      'linear-gradient(90deg, #FDE047 0%, #C4B5FD 48%, #FDE047 100%)',
                  }}
                >
                  Engineered by Shivam Kumar Gupta
                </button>
              </div>
            </FadeInUp>
          </div>

          {/* Full-Bleed 3D Cosmic Horizon Canvas (Planet, Rings, Moons, Satellites & Green/Purple Nebula Flames) */}
          <div className="relative w-full h-[310px] sm:h-[370px] md:h-[410px] lg:h-[440px] -mt-4 sm:-mt-8 z-10">
            <HeroScene3D reducedMotion={reducedMotion} />
          </div>
        </section>

        {/* ===================================================================
            ABOUT SECTION — SINGLE-COLUMN MOBILE, EDITORIAL SPLIT DESKTOP
           =================================================================== */}
        <section id="about" className="py-16 sm:py-24 lg:py-28 border-b border-white/12">
          <div className="max-w-[1280px] mx-auto pl-4 pr-16 sm:pl-8 sm:pr-20 xl:px-8 min-w-0">
            <FadeInUp
              reducedMotion={reducedMotion}
              className="font-mono-tech text-xs text-[#929292] mb-3 sm:mb-4"
            >
              01 · About
            </FadeInUp>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start min-w-0">
              {/* Editorial Narrative */}
              <FadeInUp
                reducedMotion={reducedMotion}
                delay={0.05}
                className="lg:col-span-7 space-y-5 sm:space-y-6 min-w-0"
              >
                <h2
                  style={{ textWrap: 'balance' }}
                  className="section-headline font-semibold text-[#F5F5F5]"
                >
                  {ABOUT_DATA.lead}
                </h2>

                <div className="space-y-4 text-[#929292] text-sm sm:text-base leading-relaxed">
                  {ABOUT_DATA.storyParagraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <div className="pt-5 border-t border-white/12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                  <div className="min-w-0">
                    <div className="font-mono-tech text-xs text-[#929292] mb-1">
                      Degree
                    </div>
                    <div className="text-sm font-medium text-[#F5F5F5]">
                      {ABOUT_DATA.degree}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono-tech text-xs text-[#929292] mb-1">
                      Institution
                    </div>
                    <div className="text-sm font-medium text-[#F5F5F5]">
                      {ABOUT_DATA.institution}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono-tech text-xs text-[#929292] mb-1">
                      Timeline
                    </div>
                    <div className="font-mono-tech text-sm text-[#B9FFCB]">
                      {ABOUT_DATA.duration}
                    </div>
                  </div>
                </div>
              </FadeInUp>

              {/* Profile & Core Focus Areas */}
              <FadeInUp
                reducedMotion={reducedMotion}
                delay={0.14}
                className="lg:col-span-5 space-y-4 sm:space-y-5 w-full min-w-0"
              >
                <div className="minimal-surface rounded-xl p-4 sm:p-6 flex flex-col min-[420px]:flex-row items-start min-[420px]:items-center gap-4">
                  <img
                    src={ABOUT_DATA.profileImage}
                    alt="Shivam Kumar Gupta"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-white/12 grayscale hover:grayscale-0 transition-all duration-300 shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-display text-base sm:text-lg font-semibold text-[#F5F5F5]">
                      Shivam Kumar Gupta
                    </h3>
                    <p className="text-xs text-[#929292] leading-relaxed">
                      {ABOUT_DATA.identity}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {ABOUT_DATA.pillars.map((pillar) => (
                    <div key={pillar.code} className="minimal-surface rounded-xl p-4 sm:p-5">
                      <div className="font-display text-sm font-medium text-[#F5F5F5] mb-1">
                        {pillar.title}
                      </div>
                      <p className="text-xs text-[#929292] leading-relaxed">
                        {pillar.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </FadeInUp>
            </div>
          </div>
        </section>

        {/* ===================================================================
            PROJECTS SECTION — SINGLE-COLUMN MOBILE, ALTERNATING DESKTOP
           =================================================================== */}
        <section id="projects" className="py-16 sm:py-24 lg:py-28 border-b border-white/12">
          <div className="max-w-[1280px] mx-auto pl-4 pr-16 sm:pl-8 sm:pr-20 xl:px-8 min-w-0">
            <FadeInUp reducedMotion={reducedMotion}>
              <div className="font-mono-tech text-xs text-[#929292] mb-3">
                02 · Selected Works
              </div>
              <div className="max-w-xl mb-10 sm:mb-14">
                <h2
                  style={{ textWrap: 'balance' }}
                  className="section-headline font-semibold text-[#F5F5F5] mb-3"
                >
                  Selected Projects
                </h2>
                <p className="text-[#929292] text-sm sm:text-base leading-relaxed">
                  Full-stack web applications, AI-powered workflows, and interactive digital experiences.
                </p>
              </div>
            </FadeInUp>

            <div className="space-y-14 sm:space-y-20 lg:space-y-24">
              {PROJECTS_DATA.map((project, idx) => {
                const isEven = idx % 2 === 1;
                return (
                  <FadeInUp
                    key={project.id}
                    as="article"
                    reducedMotion={reducedMotion}
                    delay={0.05}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center min-w-0"
                  >
                    <div
                      className={`lg:col-span-7 min-w-0 ${
                        isEven ? 'lg:order-2' : 'lg:order-1'
                      }`}
                    >
                      <ProjectVisualPreview
                        project={project}
                        onInspect={(p) => setSelectedProject(p)}
                      />
                    </div>

                    <div
                      className={`lg:col-span-5 space-y-3.5 sm:space-y-4 min-w-0 ${
                        isEven ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      <div className="font-mono-tech text-xs text-[#929292]">
                        {project.index} · {project.subtitle}
                      </div>

                      <h3 className="font-display text-xl sm:text-3xl font-semibold text-[#F5F5F5] tracking-tight">
                        {project.title}
                      </h3>

                      <p className="text-[#929292] text-sm sm:text-base leading-relaxed">
                        {project.description}
                      </p>

                      <div className="pt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono-tech text-xs text-[#929292]">
                        {project.technologies.map((tech, tIdx) => (
                          <React.Fragment key={tech}>
                            <span className="text-[#F5F5F5]">{tech}</span>
                            {tIdx < project.technologies.length - 1 && (
                              <span aria-hidden="true">·</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedProject(project)}
                          className="min-h-[40px] px-4 py-2 rounded-full bg-[#F5F5F5] text-[#050505] hover:bg-[#B9FFCB] text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          Architecture Brief
                        </button>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="min-h-[40px] px-4 py-2 rounded-full border border-white/15 hover:border-white/40 text-xs text-[#F5F5F5] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>GitHub</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="min-h-[40px] px-4 py-2 rounded-full border border-[#B9FFCB]/40 text-xs text-[#B9FFCB] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                          >
                            <span>Live Site</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </FadeInUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================================================================
            EXPERIENCE & ACHIEVEMENTS — VERTICAL TIMELINE & COMPACT BADGES
           =================================================================== */}
        <section id="experience" className="py-16 sm:py-24 lg:py-28 border-b border-white/12">
          <div className="max-w-[1280px] mx-auto pl-4 pr-16 sm:pl-8 sm:pr-20 xl:px-8 min-w-0">
            <FadeInUp
              reducedMotion={reducedMotion}
              className="font-mono-tech text-xs text-[#929292] mb-3"
            >
              03 · Experience &amp; Achievements
            </FadeInUp>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16 min-w-0">
              <FadeInUp
                reducedMotion={reducedMotion}
                delay={0.05}
                className="lg:col-span-4 min-w-0"
              >
                <h2
                  style={{ textWrap: 'balance' }}
                  className="section-headline font-semibold text-[#F5F5F5] mb-3"
                >
                  Open Source &amp; Leadership
                </h2>
                <p className="text-[#929292] text-sm sm:text-base leading-relaxed">
                  Verified contributions, program rankings, and campus technical leadership roles.
                </p>
              </FadeInUp>

              {/* Vertical Timeline without Horizontal Overflow */}
              <div className="lg:col-span-8 min-w-0">
                <div className="relative border-l border-white/15 ml-1.5 sm:ml-2 pl-5 sm:pl-7 space-y-8">
                  {ACHIEVEMENTS_DATA.map((item, idx) => (
                    <FadeInUp
                      key={item.id}
                      reducedMotion={reducedMotion}
                      delay={idx * 0.05}
                      className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-3.5 sm:gap-4 min-w-0"
                    >
                      {/* Timeline Node Marker */}
                      <span
                        aria-hidden="true"
                        className="absolute -left-[25px] sm:-left-[33px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#050505] border-2 border-[#B9FFCB]"
                      />

                      <div className="space-y-1.5 max-w-xl min-w-0">
                        <div className="font-mono-tech text-[11px] sm:text-xs text-[#929292] break-words">
                          {item.period} · {item.highlight}
                        </div>
                        <h3 className="font-display text-base sm:text-xl font-semibold text-[#F5F5F5] leading-snug">
                          {item.title}{' '}
                          <span className="text-[#B9FFCB] font-normal block sm:inline">
                            — {item.role}
                          </span>
                        </h3>
                        <p className="text-xs sm:text-sm text-[#929292] leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {item.badgeImage && (
                        <img
                          src={item.badgeImage}
                          alt={`${item.title} badge`}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg object-cover border border-white/12 grayscale hover:grayscale-0 transition-all duration-300 shrink-0"
                        />
                      )}
                    </FadeInUp>
                  ))}
                </div>
              </div>
            </div>

            {/* Responsive Holopin & Hacktoberfest Badge Strip */}
            <FadeInUp
              reducedMotion={reducedMotion}
              delay={0.1}
              className="minimal-surface rounded-xl p-4 sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="text-xs sm:text-sm font-medium text-[#F5F5F5]">
                  Hacktoberfest &amp; Holopin Contributor Badges
                </span>
                <span className="font-mono-tech text-[11px] sm:text-xs text-[#929292]">
                  Levels 0–5
                </span>
              </div>
              <div className="badges-responsive-grid">
                {HOLOPIN_BADGES.map((badge) => (
                  <div
                    key={badge.id}
                    className="rounded-lg border border-white/10 bg-[#050505] p-1.5 flex flex-col items-center gap-1.5 group min-w-0"
                  >
                    <div className="w-full aspect-square overflow-hidden rounded bg-[#0A0A0C]">
                      <img
                        src={badge.src}
                        alt={badge.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    <span className="font-mono-tech text-[10px] text-[#929292] truncate max-w-full">
                      {badge.id}
                    </span>
                  </div>
                ))}
              </div>
            </FadeInUp>
          </div>
        </section>

        {/* ===================================================================
            SKILLS SECTION — 1 COL (320px), 2 COLS (360px+), 3 COLS (768px+), 5 COLS (1024px+)
           =================================================================== */}
        <section id="skills" className="py-16 sm:py-24 lg:py-28 border-b border-white/12">
          <div className="max-w-[1280px] mx-auto pl-4 pr-16 sm:pl-8 sm:pr-20 xl:px-8 min-w-0">
            <FadeInUp reducedMotion={reducedMotion}>
              <div className="font-mono-tech text-xs text-[#929292] mb-3">
                04 · Technologies
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 sm:mb-10">
                <div className="min-w-0">
                  <h2
                    style={{ textWrap: 'balance' }}
                    className="section-headline font-semibold text-[#F5F5F5] mb-2"
                  >
                    Technical Stack
                  </h2>
                  <p className="text-[#929292] text-sm sm:text-base max-w-xl">
                    Core languages, frameworks, and tools used across full-stack development and interface design.
                  </p>
                </div>

                <div
                  role="group"
                  aria-label="Filter skills by category"
                  className="flex flex-wrap items-center gap-2"
                >
                  {(
                    ['ALL', 'Frontend & UI', 'Backend & Data', 'Workflow & Design'] as const
                  ).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSkillFilter(cat)}
                      className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        skillFilter === cat
                          ? 'bg-[#F5F5F5] text-[#050505] font-medium'
                          : 'border border-white/12 text-[#929292] hover:text-[#F5F5F5]'
                      }`}
                    >
                      {cat === 'ALL' ? 'All' : cat}
                    </button>
                  ))}
                </div>
              </div>
            </FadeInUp>

            <div className="skills-responsive-grid">
              {filteredSkills.map((skill, idx) => (
                <FadeInUp
                  key={skill.name}
                  reducedMotion={reducedMotion}
                  delay={Math.min(idx * 0.03, 0.22)}
                  className="minimal-surface rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-3 min-w-0"
                >
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <i
                      className={`${skill.deviconClass} text-xl text-[#F5F5F5] shrink-0`}
                      aria-hidden="true"
                    />
                    <span className="font-mono-tech text-[10px] text-[#929292] truncate">
                      {skill.category.split(' ')[0]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-sm sm:text-base font-medium text-[#F5F5F5] truncate">
                      {skill.name}
                    </div>
                    <div className="text-[11px] sm:text-xs text-[#929292] truncate">
                      {skill.layer}
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            CONTACT SECTION & FLUID DOT-MATRIX FOOTER
           =================================================================== */}
        <section id="contact" className="py-16 sm:py-24 lg:py-28">
          <div className="max-w-[1280px] mx-auto pl-4 pr-16 sm:pl-8 sm:pr-20 xl:px-8 min-w-0">
            <FadeInUp
              reducedMotion={reducedMotion}
              className="font-mono-tech text-xs text-[#929292] mb-3 sm:mb-4"
            >
              05 · Contact
            </FadeInUp>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start mb-16 sm:mb-20 min-w-0">
              <FadeInUp
                reducedMotion={reducedMotion}
                delay={0.05}
                className="lg:col-span-7 space-y-5 sm:space-y-6 min-w-0"
              >
                <h2
                  style={{ textWrap: 'balance' }}
                  className="contact-headline font-bold text-[#F5F5F5]"
                >
                  Have an idea?{' '}
                  <span className="block text-[#B9FFCB]">Let&apos;s make it real.</span>
                </h2>

                <p className="text-[#929292] text-sm sm:text-base max-w-lg leading-relaxed">
                  Available for full-stack engineering, interactive 3D web experiences, and open-source collaborations.
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="min-h-[46px] px-5 py-3 rounded-full bg-[#F5F5F5] text-[#050505] hover:bg-[#B9FFCB] text-xs font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>Copied Email</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 shrink-0" />
                        <span>Copy Email Address</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${CONTACT_LINKS.email}`}
                    className="min-h-[46px] px-5 py-3 rounded-full border border-white/15 hover:border-white/40 text-xs text-[#F5F5F5] inline-flex items-center justify-center gap-1.5 transition-colors break-all text-center"
                  >
                    <span>{CONTACT_LINKS.email}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>

                <div className="contact-links-grid pt-3">
                  {[
                    { label: 'GitHub', href: CONTACT_LINKS.github, sub: '@shivamgupta4757' },
                    { label: 'LinkedIn', href: CONTACT_LINKS.linkedin, sub: 'shivamkumarguptaa' },
                    { label: 'X / Twitter', href: CONTACT_LINKS.twitter, sub: '@Shivamk15928168' },
                    { label: 'Behance', href: CONTACT_LINKS.behance, sub: 'shivamgupta413' },
                    { label: 'Repository', href: CONTACT_LINKS.repository, sub: 'Console-shivam' },
                    { label: 'Website', href: CONTACT_LINKS.website, sub: 'shivamgupta.xyz' },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="minimal-surface rounded-xl p-3.5 sm:p-4 group min-w-0"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#F5F5F5] group-hover:text-[#B9FFCB] mb-1">
                        <span className="truncate">{link.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                      </div>
                      <div className="font-mono-tech text-[11px] text-[#929292] truncate">
                        {link.sub}
                      </div>
                    </a>
                  ))}
                </div>
              </FadeInUp>

              {/* Right Column: Full-Width Mobile Message Form */}
              <FadeInUp
                reducedMotion={reducedMotion}
                delay={0.14}
                className="lg:col-span-5 minimal-surface rounded-2xl p-4 sm:p-7 w-full min-w-0"
              >
                <h3 className="font-display text-base sm:text-lg font-semibold text-[#F5F5F5] mb-4 sm:mb-5">
                  Send a Message
                </h3>

                <form onSubmit={handleDispatchSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="dispatch-subject"
                      className="block text-xs text-[#929292] mb-1.5"
                    >
                      Subject
                    </label>
                    <input
                      id="dispatch-subject"
                      type="text"
                      value={dispatchSubject}
                      onChange={(e) => setDispatchSubject(e.target.value)}
                      placeholder="Project inquiry or collaboration"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#050505] border border-white/12 focus:border-[#B9FFCB] text-base sm:text-sm text-[#F5F5F5] placeholder-[#929292]/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="dispatch-message"
                      className="block text-xs text-[#929292] mb-1.5"
                    >
                      Message
                    </label>
                    <textarea
                      id="dispatch-message"
                      rows={4}
                      value={dispatchMessage}
                      onChange={(e) => setDispatchMessage(e.target.value)}
                      placeholder="Tell me about your project or idea..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#050505] border border-white/12 focus:border-[#B9FFCB] text-base sm:text-sm text-[#F5F5F5] placeholder-[#929292]/60 focus:outline-none"
                    />
                  </div>

                  {dispatchStatus && (
                    <div className="text-xs text-[#B9FFCB] py-1">{dispatchStatus}</div>
                  )}

                  <button
                    type="submit"
                    className="w-full min-h-[46px] py-3 rounded-full bg-[#F5F5F5] hover:bg-[#B9FFCB] text-[#050505] text-xs sm:text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              </FadeInUp>
            </div>

            <FadeInUp
              as="footer"
              reducedMotion={reducedMotion}
              delay={0.08}
              className="pt-8 sm:pt-10 border-t border-white/12 space-y-5 min-w-0"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#929292]">
                <div>© 2026 Shivam Kumar Gupta · Console Shivam</div>
                <div className="flex items-center gap-5">
                  <a
                    href="#home"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('#home', 'home');
                    }}
                    className="hover:text-[#F5F5F5] transition-colors"
                  >
                    Back to top ↑
                  </a>
                  <span className="font-mono-tech">shivamgupta.xyz</span>
                </div>
              </div>

              <DotMatrixSignature text="CONSOLE.SHIVAM" />
            </FadeInUp>
          </div>
        </section>
      </main>

      {/* Project Architecture Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProject.title} Architecture Details`}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0A0A0C] p-5 sm:p-8 space-y-4 sm:space-y-5 min-w-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2 border-b border-white/12 pb-3.5">
              <div className="font-mono-tech text-xs text-[#929292] truncate">
                {selectedProject.index} · {selectedProject.subtitle}
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
                className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg text-[#929292] hover:text-[#F5F5F5] cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#F5F5F5] mb-2">
                {selectedProject.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#929292] leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="font-mono-tech text-xs text-[#B9FFCB] mb-1">
                Architecture Note
              </div>
              <p className="text-xs sm:text-sm text-[#F5F5F5] leading-relaxed">
                {selectedProject.architectureNote}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs text-[#929292]">
              {selectedProject.technologies.map((t, i) => (
                <React.Fragment key={t}>
                  <span className="text-[#F5F5F5]">{t}</span>
                  {i < selectedProject.technologies.length - 1 && <span>·</span>}
                </React.Fragment>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/12">
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[38px] px-4 py-2 rounded-full bg-[#F5F5F5] text-[#050505] hover:bg-[#B9FFCB] text-xs font-medium inline-flex items-center gap-1.5"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[38px] px-4 py-2 rounded-full border border-[#B9FFCB]/50 text-[#B9FFCB] text-xs inline-flex items-center gap-1.5"
                  >
                    <span>Live Site</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="min-h-[38px] px-4 py-2 rounded-full border border-white/12 text-xs text-[#929292] hover:text-[#F5F5F5] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <CommandPalette
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        onSelectCommand={handleSelectCommand}
      />
    </div>
  );
}

export default App;
