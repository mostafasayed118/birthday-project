"use client";

import type { SectionProps, LoveNotesContent } from "@/lib/types";
import { Reveal, MatIcon } from "../shared-primitives";

const LOVE_NOTES_ROTATIONS = ["-rotate-3", "rotate-2", "-rotate-2", "rotate-3", "-rotate-4", "rotate-1"];
const LOVE_NOTES_COLORS = [
  "bg-primary-container text-on-primary-container",
  "bg-secondary-container text-on-secondary-container",
  "bg-surface text-on-surface border border-primary-fixed/20",
];

export function LoveNotesSection({ content, theme }: SectionProps) {
  const c = content as LoveNotesContent;
  const notes = c.notes || [];

  return (
    <section className="py-24 md:py-32 px-4 md:px-6 bg-surface-container-low relative overflow-hidden" id="gift-board">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-12 md:mb-20 px-2 sm:px-0">
            <h2 className="font-headline-md text-3xl sm:text-4xl md:text-5xl text-primary font-['Epilogue'] mb-3 md:mb-4">{c.heading || "Love Notes"}</h2>
            {c.subtitle && (
              <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto text-sm sm:text-base">{c.subtitle}</p>
            )}
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {notes.map((note, i) => (
            <Reveal key={note.id || i} className="delay-100" delay={`delay-${(i % 3 + 1) * 100}`}>
              <div className={`${LOVE_NOTES_COLORS[i % 3]} p-5 sm:p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-[0_20px_50px_rgba(244,172,183,0.2)] transition-all duration-500 transform hover:-translate-y-2 ${LOVE_NOTES_ROTATIONS[i % 6]} hover:rotate-0 relative group`}>
                <MatIcon name="format_quote" className="text-4xl sm:text-5xl opacity-20 absolute top-3 right-3 sm:top-4 sm:right-4" decorative />
                <p className="font-body-lg text-base sm:text-lg leading-relaxed mb-5 sm:mb-6 md:mb-8 relative z-10">{note.message}</p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface/50 flex items-center justify-center font-headline-sm font-bold shadow-inner text-sm sm:text-base">
                    {note.initial}
                  </div>
                  <div>
                    <p className="font-label-lg font-bold text-sm sm:text-base">{note.name}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
