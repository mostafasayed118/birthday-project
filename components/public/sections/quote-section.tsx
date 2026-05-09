"use client";

import type { SectionProps, QuoteContent } from "@/lib/types";
import { Reveal, MatIcon } from "../shared-primitives";

export function QuoteSection({ content, theme }: SectionProps) {
  const c = content as QuoteContent;
  const quote = c.text;
  const author = c.author;

  return (
    <section className="py-24 md:py-32 px-4 md:px-6 bg-surface relative">
      <div className="absolute top-1/2 left-0 w-full h-1/2 bg-surface-container-low -z-10" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <Reveal>
          <div className="relative inline-block w-full festive-glass-strong p-6 sm:p-8 md:p-12 lg:p-16 rounded-[3rem] shadow-[0_20px_60px_rgba(244,172,183,0.15)] border border-primary-fixed/30 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <MatIcon name="format_quote" className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary-fixed-dim/20 absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 -rotate-12" decorative />
            <MatIcon name="format_quote" className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary-fixed-dim/20 absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 rotate-180" decorative />
            <p className="font-headline-lg text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-primary font-['Epilogue'] leading-tight relative z-10 px-2 sm:px-0">
              &ldquo;{quote}&rdquo;
            </p>
            {author && (
              <p className="mt-6 md:mt-12 font-label-md text-secondary tracking-[0.2em] uppercase text-xs sm:text-sm">
                — {author}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
