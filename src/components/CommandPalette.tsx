import React, { useEffect, useRef, useState } from 'react';
import { COMMAND_ITEMS, CommandItem, filterCommands } from '../lib/portfolioData';
import { Search, X, CornerDownLeft, ArrowUpRight } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCommand: (cmd: CommandItem) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectCommand,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filtered = filterCommands(COMMAND_ITEMS, query);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 20);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filtered.length > 0) {
        setActiveIndex((prev) => (prev + 1) % filtered.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filtered.length > 0) {
        setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      }
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      e.preventDefault();
      onSelectCommand(filtered[activeIndex]);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-24 px-3 sm:px-4 bg-black/80"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-white/15 bg-[#08080A] text-[#F5F5F5] shadow-2xl overflow-hidden min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-3 border-b border-white/12">
          <Search className="w-4 h-4 text-[#B9FFCB] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, sections, or actions..."
            aria-label="Search commands"
            className="w-full min-w-0 bg-transparent text-base sm:text-sm text-[#F5F5F5] placeholder-[#929292] focus:outline-none font-mono-tech"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Command Palette"
            className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg text-[#929292] hover:text-[#F5F5F5] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto divide-y divide-white/10">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center font-mono-tech text-xs text-[#929292]">
              No matching commands for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => onSelectCommand(item)}
                  className={`w-full px-3.5 sm:px-4 py-3 min-h-[48px] flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#141418] text-[#B9FFCB]'
                      : 'text-[#F5F5F5] hover:bg-[#101014]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 min-w-0">
                    <span className="font-mono-tech text-[10px] text-[#929292] sm:w-20 shrink-0">
                      {item.category}
                    </span>
                    <span className="text-sm truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono-tech text-xs text-[#929292]">
                    {item.shortcut && (
                      <span className="hidden sm:inline">[{item.shortcut}]</span>
                    )}
                    {item.actionType === 'external' ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-3.5 sm:px-4 py-2.5 border-t border-white/12 bg-[#050505] flex flex-wrap items-center justify-between gap-2 font-mono-tech text-[10px] sm:text-[11px] text-[#929292]">
          <span>Select an action to navigate</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
