import React, { useState } from 'react';
import { ProjectItem } from '../lib/portfolioData';
import { ArrowUpRight } from 'lucide-react';

interface ProjectVisualPreviewProps {
  project: ProjectItem;
  onInspect: (project: ProjectItem) => void;
}

export const ProjectVisualPreview: React.FC<ProjectVisualPreviewProps> = ({
  project,
  onInspect,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'architecture'>('preview');

  return (
    <div className="minimal-surface rounded-xl p-4 sm:p-6 flex flex-col justify-between w-full min-w-0">
      {/* Minimal Header */}
      <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-white/12 text-xs text-[#929292] min-w-0">
        <span className="font-mono-tech text-[#F5F5F5] truncate">
          {project.index} · {project.title}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1.5 min-h-[32px] rounded text-[11px] font-mono-tech transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white/10 text-[#F5F5F5]'
                : 'text-[#929292] hover:text-[#F5F5F5]'
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`px-2.5 py-1.5 min-h-[32px] rounded text-[11px] font-mono-tech transition-colors cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-white/10 text-[#F5F5F5]'
                : 'text-[#929292] hover:text-[#F5F5F5]'
            }`}
          >
            Notes
          </button>
        </div>
      </div>

      {/* Contained Visual Canvas */}
      <div className="min-h-[180px] sm:min-h-[220px] flex flex-col justify-center rounded-lg border border-white/10 bg-[#08080A] p-3.5 sm:p-6 min-w-0">
        {activeTab === 'architecture' ? (
          <div className="space-y-2.5">
            <div className="font-mono-tech text-xs text-[#B9FFCB]">
              System Architecture
            </div>
            <p className="text-xs sm:text-sm text-[#F5F5F5] leading-relaxed">
              {project.architectureNote}
            </p>
          </div>
        ) : (
          <>
            {project.previewType === 'delivery-grid' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2 text-xs text-[#929292] font-mono-tech">
                  <span className="text-[#F5F5F5] truncate">Order Routing &amp; Dispatch</span>
                  <span className="text-[#B9FFCB] shrink-0">Active</span>
                </div>
                <svg
                  viewBox="0 0 400 110"
                  className="w-full h-20 sm:h-28 stroke-white/15 fill-none"
                  aria-label="LocalGo routing diagram"
                >
                  <line x1="20" y1="25" x2="380" y2="25" strokeDasharray="3 3" />
                  <line x1="20" y1="85" x2="380" y2="85" strokeDasharray="3 3" />
                  <path
                    d="M 35 85 L 130 85 L 180 30 L 290 30 L 360 65"
                    stroke="#B9FFCB"
                    strokeWidth="2"
                  />
                  <circle cx="35" cy="85" r="4.5" className="fill-[#050505] stroke-[#B9FFCB]" strokeWidth="2" />
                  <circle cx="180" cy="30" r="4.5" className="fill-[#050505] stroke-[#B9FFCB]" strokeWidth="2" />
                  <circle cx="290" cy="30" r="4.5" className="fill-[#050505] stroke-[#8B5CF6]" strokeWidth="2" />
                  <circle cx="360" cy="65" r="5" className="fill-[#B9FFCB]" />
                </svg>
                <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs text-[#929292] pt-2 border-t border-white/10">
                  <span className="truncate">Hyperlocal Storefronts</span>
                  <span className="shrink-0">Real-Time Queue</span>
                </div>
              </div>
            )}

            {project.previewType === 'ai-copilot' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs font-mono-tech text-[#929292]">
                  <span className="text-[#F5F5F5] truncate">Merchant Assistant</span>
                  <span className="text-[#8B5CF6] shrink-0">AI Workflow</span>
                </div>
                <div className="rounded border border-white/10 bg-[#050505] p-2.5 sm:p-3 text-xs text-[#929292] leading-relaxed">
                  Draft catalog summary &amp; customer response for new inventory.
                </div>
                <div className="rounded border border-[#8B5CF6]/30 bg-[#8B5CF6]/5 p-2.5 sm:p-3 text-xs text-[#F5F5F5] leading-relaxed">
                  Structured product brief and automated customer reply ready for review.
                </div>
              </div>
            )}

            {project.previewType === 'audio-waveform' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2 text-xs font-mono-tech text-[#929292]">
                  <span className="text-[#F5F5F5] truncate">Audio Spectrum</span>
                  <span className="text-[#B9FFCB] shrink-0">Stereo</span>
                </div>
                <div className="h-20 sm:h-24 flex items-end justify-between gap-1 sm:gap-1.5 px-1 sm:px-2 py-2">
                  {[35, 60, 82, 45, 90, 68, 42, 85, 94, 52, 74, 58, 86, 48, 72, 40].map(
                    (h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className={`flex-1 rounded-t ${
                          i % 3 === 0
                            ? 'bg-[#8B5CF6]/80'
                            : i % 2 === 0
                            ? 'bg-[#B9FFCB]/80'
                            : 'bg-white/25'
                        }`}
                      />
                    ),
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs text-[#929292] pt-2 border-t border-white/10">
                  <span className="truncate">Dynamic Queue</span>
                  <span className="shrink-0">Playlist Controls</span>
                </div>
              </div>
            )}

            {project.previewType === 'spatial-console' && (
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 py-1.5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#B9FFCB]/50 flex items-center justify-center">
                    <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#B9FFCB]" />
                  </div>
                </div>
                <div className="space-y-1 text-center sm:text-left min-w-0">
                  <div className="text-sm font-medium text-[#F5F5F5]">
                    Three.js &amp; Minimal Editorial System
                  </div>
                  <p className="text-xs text-[#929292] leading-relaxed">
                    Real-time orbital WebGL sculpture paired with responsive typography and static GitHub Pages deployment.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer row */}
      <div className="mt-3.5 pt-3 flex items-center justify-between gap-2 text-xs text-[#929292]">
        <span className="font-mono-tech">{project.year}</span>
        <button
          type="button"
          onClick={() => onInspect(project)}
          className="min-h-[32px] inline-flex items-center gap-1 text-[#F5F5F5] hover:text-[#B9FFCB] transition-colors cursor-pointer"
        >
          <span>View details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
