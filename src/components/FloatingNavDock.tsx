import React from 'react';
import {
  HelpCircle,
  Info,
  Home,
  User,
  Layers,
  Award,
  Cpu,
  Mail,
} from 'lucide-react';

export type NavSectionId =
  | 'home'
  | 'about'
  | 'projects'
  | 'experience'
  | 'skills'
  | 'contact';

interface FloatingNavDockProps {
  activeSection: NavSectionId;
  onNavigate: (selector: string, sectionId: NavSectionId) => void;
  onOpenCommandPalette: () => void;
}

interface DockItem {
  id: NavSectionId;
  label: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const DOCK_ITEMS: DockItem[] = [
  { id: 'home', label: 'HOME', href: '#home', Icon: Home },
  { id: 'about', label: 'ABOUT', href: '#about', Icon: User },
  { id: 'projects', label: 'PROJECTS', href: '#projects', Icon: Layers },
  { id: 'experience', label: 'EXPERIENCE', href: '#experience', Icon: Award },
  { id: 'skills', label: 'SKILLS', href: '#skills', Icon: Cpu },
  { id: 'contact', label: 'CONTACT', href: '#contact', Icon: Mail },
];

export const FloatingNavDock: React.FC<FloatingNavDockProps> = ({
  activeSection,
  onNavigate,
  onOpenCommandPalette,
}) => {
  return (
    <aside
      aria-label="Floating Vertical Navigation Dock"
      style={{
        position: 'fixed',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
      }}
      className="select-none"
    >
      <nav
        aria-label="Primary Navigation"
        className="relative flex flex-col items-center w-9 sm:w-11 py-2.5 sm:py-3.5 px-1 sm:px-1.5 rounded-full bg-[#070709]/92 backdrop-blur-md border border-white/14 shadow-[0_4px_16px_rgba(0,0,0,0.55)]"
      >
        {/* Small Circular Information & Help Icons at the Top */}
        <div className="flex flex-col items-center gap-1 sm:gap-1.5 pb-2 sm:pb-2.5 border-b border-white/10 w-full">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Open Command Palette"
            title="Command Palette (Cmd + K)"
            className="group relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#929292] hover:text-[#F5F5F5] hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.6]" />
            <span className="pointer-events-none absolute right-full mr-3 px-2 py-1 rounded-md bg-[#0A0A0D]/95 border border-white/15 font-mono-tech text-[10px] tracking-wider text-[#F5F5F5] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
              CMD + K
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('#about', 'about')}
            aria-label="About Console Shivam"
            title="About Console Shivam"
            className="group relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#929292] hover:text-[#F5F5F5] hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.6]" />
            <span className="pointer-events-none absolute right-full mr-3 px-2 py-1 rounded-md bg-[#0A0A0D]/95 border border-white/15 font-mono-tech text-[10px] tracking-wider text-[#F5F5F5] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
              INFO
            </span>
          </button>
        </div>

        {/* Vertically Arranged Navigation Controls */}
        <div className="flex flex-col items-center gap-1.5 sm:gap-2 pt-2 sm:pt-2.5 w-full">
          {DOCK_ITEMS.map(({ id, label, href, Icon }) => {
            const isActive = activeSection === id;
            const isHome = id === 'home';

            return (
              <a
                key={id}
                href={href}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(href, id);
                }}
                className={`group relative flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                  isHome || isActive
                    ? 'w-7 sm:w-8 py-2 sm:py-2.5 rounded-full border'
                    : 'w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-transparent'
                } ${
                  isActive
                    ? 'border-white/40 bg-white/[0.09] text-[#F5F5F5] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                    : isHome
                    ? 'border-white/22 bg-white/[0.03] text-[#F5F5F5]/85 hover:border-white/40 hover:text-[#F5F5F5]'
                    : 'text-[#929292] hover:text-[#F5F5F5] hover:bg-white/[0.05]'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? 'stroke-[2] text-[#F5F5F5]' : 'stroke-[1.6]'
                  }`}
                />
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="mt-1 w-1 h-1 rounded-full bg-[#B9FFCB]"
                  />
                )}

                {/* Minimal Monochrome Hover Label */}
                <span className="pointer-events-none absolute right-full mr-3 px-2 py-1 rounded-md bg-[#0A0A0D]/95 border border-white/15 font-mono-tech text-[10px] tracking-wider text-[#F5F5F5] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
                  {label}
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};
