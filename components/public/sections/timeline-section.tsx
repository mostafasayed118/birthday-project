"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { SectionProps, TimelineContent } from "@/lib/types";
import { Reveal, MatIcon } from "../shared-primitives";

const TIMELINE_LABEL_COLORS = ["text-primary-container", "text-secondary-fixed-dim", "text-primary"];
const TIMELINE_DOT_BORDERS = ["border-primary-container", "border-secondary-container", "border-surface"];
const TIMELINE_DOT_SHADOWS = ["shadow-[0_0_20px_rgba(244,172,183,0.5)]", "shadow-[0_0_20px_rgba(255,216,124,0.5)]", "shadow-[0_0_25px_rgba(135,78,88,0.6)]"];
const TIMELINE_HOVER_COLORS = ["bg-primary/10", "bg-secondary/10", "bg-primary/10"];
const TIMELINE_IMAGE_SHADOWS = ["shadow-[0_20px_50px_rgba(244,172,183,0.2)]", "shadow-[0_20px_50px_rgba(255,216,124,0.2)]", "shadow-[0_20px_50px_rgba(244,172,183,0.3)]"];
const TIMELINE_IMAGE_HOVER_SHADOWS = ["group-hover:shadow-[0_30px_60px_rgba(244,172,183,0.3)]", "group-hover:shadow-[0_30px_60px_rgba(255,216,124,0.3)]", "group-hover:shadow-[0_30px_60px_rgba(244,172,183,0.4)]"];

function TimelineEventCard({ event, index, isLast }: { event: import("@/lib/types").TimelineEvent, index: number, isLast: boolean }) {
  const i = index % 3;
  const isValidStorageId = (id: string): boolean => {
    if (!id || typeof id !== "string") return false;
    if (id.startsWith("http") || id.startsWith("data:")) return false;
    if (id.length < 20 || id.length > 50) return false;
    return true;
  };

  const imageUrl = useQuery(
    api.files.getFileUrl,
    event.image && isValidStorageId(event.image)
      ? { storageId: event.image }
      : "skip"
  );
  const src = imageUrl ?? event.image;

  return (
    <Reveal>
      <div className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? "" : "md:flex-row-reverse"} items-center justify-between mb-16 md:mb-24 lg:mb-32 group`}>
        <div className={`w-full md:w-5/12 ps-14 md:ps-0 ${index % 2 === 0 ? "md:pe-12 lg:pe-16 md:text-right rtl:md:text-left" : "md:ps-12 lg:ps-16"} mb-6 md:mb-0`}>
          <span className={`${TIMELINE_LABEL_COLORS[i]} font-label-md tracking-wider uppercase text-[10px] sm:text-xs mb-1.5 block`}>
            {event.date || (index === 0 ? "The Beginning" : "Moment")}
          </span>
          <h4 className="font-headline-sm text-xl sm:text-2xl md:text-3xl text-on-surface mb-3 md:mb-4 transition-colors duration-300 font-['Epilogue']">{event.title}</h4>
          <p className="font-body-md text-sm sm:text-base md:text-lg text-on-surface-variant leading-relaxed">{event.description}</p>
        </div>
        {isLast ? (
          <div className="absolute start-5 md:start-1/2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary border-[3px] md:border-[4px] border-surface transform -translate-x-1/2 rtl:translate-x-1/2 shadow-[0_0_15px_rgba(135,78,88,0.5)] md:shadow-[0_0_25px_rgba(135,78,88,0.6)] z-10 transition-transform duration-500 group-hover:scale-125 flex items-center justify-center">
            <MatIcon name="favorite" className="text-[12px] md:text-[14px] text-white" />
          </div>
        ) : (
          <div className={`absolute start-5 md:start-1/2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-surface border-[4px] md:border-[6px] ${TIMELINE_DOT_BORDERS[i]} transform -translate-x-1/2 rtl:translate-x-1/2 ${TIMELINE_DOT_SHADOWS[i]} z-10 transition-transform duration-500 group-hover:scale-150`} />
        )}
        <div className={`w-full md:w-5/12 ps-14 md:ps-14 lg:ps-16 ${index % 2 !== 0 ? "md:ps-0 md:pe-16 md:flex md:justify-end" : ""}`}>
          <div className={`w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden ${TIMELINE_IMAGE_SHADOWS[i]} border-4 sm:border-6 md:border-8 border-surface transition-all duration-700 group-hover:scale-105 ${index % 2 === 0 ? "group-hover:rotate-3" : "group-hover:-rotate-3"} relative ${TIMELINE_IMAGE_HOVER_SHADOWS[i]}`}>
            {src ? (
              <img alt={event.title || "Memory"} className="w-full h-full object-cover" src={src} />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <MatIcon name="photo" className="text-3xl sm:text-4xl text-primary/30" decorative />
              </div>
            )}
            <div className={`absolute inset-0 ${TIMELINE_HOVER_COLORS[i]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function TimelineSection({ content, theme }: SectionProps) {
  const c = content as TimelineContent;
  const events = c.events || [];

  return (
    <section className="py-24 md:py-32 px-4 md:px-6 bg-surface relative">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-16 md:mb-24">
            <span className="text-secondary tracking-[0.2em] font-label-md text-xs sm:text-sm uppercase mb-2 md:mb-3 block">
              {c.heading ? "Our Story" : "How It Started"}
            </span>
            <h2 className="font-headline-md text-3xl sm:text-4xl md:text-5xl text-primary font-['Epilogue']">
              {c.heading || "Our Journey"}
            </h2>
          </div>
        </Reveal>
        <div className="relative max-w-5xl mx-auto py-6 md:py-10">
          <div className="absolute start-5 md:start-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary-fixed to-transparent transform md:-translate-x-1/2 rtl:translate-x-1/2" />
          {events.map((event, index) => (
            <TimelineEventCard key={event.id || index} event={event} index={index} isLast={index === events.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
