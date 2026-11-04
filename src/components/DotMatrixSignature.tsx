import React, { useState } from 'react';
import { generateDotMatrixWord } from '../lib/portfolioData';

interface DotMatrixSignatureProps {
  text?: string;
}

export const DotMatrixSignature: React.FC<DotMatrixSignatureProps> = ({
  text = 'CONSOLE.SHIVAM',
}) => {
  const glyphs = generateDotMatrixWord(text);
  const [hoveredGlyph, setHoveredGlyph] = useState<number | null>(null);

  return (
    <div
      className="w-full max-w-[760px] py-2 select-none"
      aria-label={`Dot matrix wordmark: ${text}`}
    >
      <div
        className="grid w-full items-center"
        style={{
          gridTemplateColumns: `repeat(${glyphs.length}, minmax(0, 1fr))`,
          gap: 'clamp(3px, 1vw, 12px)',
        }}
      >
        {glyphs.map((glyph, charIdx) => {
          const isHovered = hoveredGlyph === charIdx;
          return (
            <div
              key={`${glyph.char}-${charIdx}`}
              onMouseEnter={() => setHoveredGlyph(charIdx)}
              onMouseLeave={() => setHoveredGlyph(null)}
              className="grid grid-cols-5 w-full"
              style={{ gap: 'clamp(1px, 0.25vw, 3px)' }}
            >
              {glyph.grid.map((row, rIdx) =>
                row.map((active, cIdx) => (
                  <span
                    key={`${rIdx}-${cIdx}`}
                    className={`w-full aspect-square rounded-full transition-colors duration-150 ${
                      active
                        ? isHovered
                          ? 'bg-[#B9FFCB]'
                          : 'bg-white/75 hover:bg-[#B9FFCB]'
                        : 'bg-white/10 opacity-35'
                    }`}
                  />
                )),
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
