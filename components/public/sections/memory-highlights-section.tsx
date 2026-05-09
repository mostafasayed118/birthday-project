"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { SectionProps, MemoryHighlightsContent } from "@/lib/types";
import { Reveal, RevealScale, MatIcon } from "../shared-primitives";

export function MemoryHighlightsSection({ content, theme }: SectionProps) {
  const c = content as MemoryHighlightsContent;

  const isValidStorageId = (id: string): boolean => {
    if (!id || typeof id !== "string") return false;
    if (id.startsWith("http") || id.startsWith("data:")) return false;
    if (id.length < 20 || id.length > 50) return false;
    return true;
  };

  const imageUrl = useQuery(
    api.files.getFileUrl,
    c.image && isValidStorageId(c.image)
      ? { storageId: c.image }
      : "skip"
  );

  const imageUrlValue = imageUrl ?? c.image;

  return (
    <section className="py-24 md:py-32 px-4 md:px-6 bg-surface relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] bg-secondary-fixed/10 rounded-full blur-[80px] md:blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16 lg:gap-24">
        <div className="w-full lg:w-1/2 relative">
          <RevealScale>
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(244,172,183,0.3)] aspect-[4/5] max-w-sm sm:max-w-md mx-auto transform -rotate-2 hover:rotate-0 transition-transform duration-700">
              {imageUrlValue ? (
                <img alt={c.heading || "Memory"} className="w-full h-full object-cover" src={imageUrlValue} />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <MatIcon name="image" className="text-4xl sm:text-5xl md:text-6xl text-primary/30" decorative />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-60" />
            </div>
          </RevealScale>
          <Reveal className="absolute -bottom-6 -right-3 sm:-bottom-8 sm:-right-4 lg:-right-12 z-20 delay-300" delay="delay-300">
            <div className="bg-surface p-4 sm:p-5 md:p-6 rounded-2xl shadow-[0_10px_30px_rgba(244,172,183,0.2)] border border-primary-fixed/20 animate-float">
              <MatIcon name="favorite" className="text-2xl sm:text-3xl text-primary mb-1.5 sm:mb-2" decorative />
              <p className="font-label-md text-xs sm:text-sm text-on-surface-variant">Best Day Ever</p>
            </div>
          </Reveal>
        </div>
        <div className="w-full lg:w-1/2">
          <Reveal delay="delay-100">
            <h2 className="font-headline-md text-3xl sm:text-4xl md:text-5xl text-primary font-['Epilogue'] mb-4 md:mb-6 leading-tight">{c.heading}</h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-primary to-transparent mb-6 md:mb-8" />
            <p className="font-body-lg text-base sm:text-lg md:text-lg text-on-surface-variant leading-relaxed mb-6 md:mb-8">{c.body}</p>
            {c.signoff && (
              <p className="font-headline-sm text-xl sm:text-2xl md:text-2xl text-secondary font-['Epilogue'] italic">{c.signoff}</p>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
