"use client";

import { useEffect, useRef, useState } from "react";
import { FESTIVE_AIR_SECTIONS, FESTIVE_AIR_THEME } from "@/lib/festive-air-data";
import { AudioSection } from "@/components/public/sections/audio-section";
import type { HeroContent, QuoteContent, TimelineContent, GalleryContent, LoveNotesContent, MemoryHighlightsContent, CountdownContent } from "@/lib/types";

function MatIcon({ name, className = "", fill = true, decorative = false }: { name: string; className?: string; fill?: boolean; decorative?: boolean }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden={decorative ? "true" : undefined}
      role={decorative ? undefined : "img"}
    >
      {name}
    </span>
  );
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("active");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("active");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function useParallax(speed = 0.1) {
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    function onScroll() {
      el!.style.transform = `translateY(${window.scrollY * speed}px)`;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return imgRef;
}

function Reveal({ children, className = "", delay = "" }: { children: React.ReactNode; className?: string; delay?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${delay} ${className}`}>
      {children}
    </div>
  );
}

function RevealScale({ children, className = "", delay = "" }: { children: React.ReactNode; className?: string; delay?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal-scale ${delay} ${className}`}>
      {children}
    </div>
  );
}

function WaveDivider({ fill = "fill-surface-container-low", height = "100px" }: { fill?: string; height?: string }) {
  return (
    <div className="w-full overflow-hidden leading-none relative -mb-1 z-10">
      <svg className="relative block w-full" style={{ height }} viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path className={fill} d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.93,197.36,108.14Z" />
      </svg>
    </div>
  );
}

function WaveDividerAlt({ fill = "fill-surface" }: { fill?: string }) {
  return (
    <div className="w-full overflow-hidden leading-none relative -mb-1 z-10 bg-surface-container-low">
      <svg className="relative block w-full h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path className={fill} d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" />
      </svg>
    </div>
  );
}

function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-primary-fixed/20 shadow-[0_4px_30px_rgba(244,172,183,0.1)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold text-primary font-['Epilogue'] tracking-tight hover:scale-105 transition-transform duration-300 cursor-pointer">
          Happy Birthday!
        </a>
        <nav className="hidden md:flex gap-10" aria-label="Page sections">
          <a className="text-on-surface-variant hover:text-primary transition-colors font-['Epilogue'] tracking-tight text-sm uppercase tracking-wider relative group" href="#our-story">
            Our Story
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-['Epilogue'] tracking-tight text-sm uppercase tracking-wider relative group" href="#photo-gallery">
            Moments
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-['Epilogue'] tracking-tight text-sm uppercase tracking-wider relative group" href="#gift-board">
            Love Notes
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="hover:scale-110 hover:bg-primary-fixed/30 transition-all duration-300 p-2.5 rounded-full text-primary" aria-label="Favorite">
            <MatIcon name="favorite" className="w-6 h-6 text-primary" />
          </button>
          <button className="hidden md:block festive-gradient-btn text-on-primary-container font-label-md text-label-md px-6 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-[0_4px_15px_rgba(244,172,183,0.3)] hover:shadow-[0_6px_20px_rgba(244,172,183,0.5)]">
            Send Love
          </button>
        </div>
      </div>
    </header>
  );
}

const HERO_DATA = FESTIVE_AIR_SECTIONS.find((s) => s.type === "hero")!;
const HERO_CONTENT = HERO_DATA.content as HeroContent;

function HeroSection() {
  const parallaxRef = useParallax(0.15);
  const titleParts = HERO_CONTENT.title.replace(/,\s*$/, "").split(",").length > 1
    ? HERO_CONTENT.title.split(/,\s*/)
    : [HERO_CONTENT.title.replace(/,\s*$/, ""), ""];
  return (
    <section className="min-h-[85vh] pt-28 pb-20 px-6 flex flex-col items-center text-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-fixed/20 blur-[100px] animate-pulse-subtle" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary-fixed/20 blur-[120px] animate-pulse-subtle" style={{ animationDelay: "1.5s" }} />
      </div>
      <Reveal className="relative inline-block mb-8 mt-10">
        <h1 className="font-headline-lg text-[48px] md:text-[80px] leading-[1.1] text-primary max-w-4xl relative z-10 tracking-tight font-['Epilogue']">
          {titleParts[0]},
          <br />
          <span className="italic font-light text-surface-tint"> {HERO_CONTENT.subtitle || "Beautiful!"}</span>
        </h1>
        <MatIcon name="auto_awesome" className="absolute -top-6 start-[-16px] md:-top-8 md:start-[-40px] text-secondary-fixed-dim text-2xl md:text-3xl rotate-12 animate-shimmer" decorative />
        <MatIcon name="star" className="absolute -bottom-2 end-[-16px] md:-bottom-4 md:end-[-48px] text-secondary-fixed-dim text-3xl md:text-4xl -rotate-12 animate-shimmer delay-100" decorative />
      </Reveal>
      <Reveal className="delay-100" delay="delay-100">
        <p className="font-body-lg text-xl text-on-surface-variant max-w-2xl mb-16 leading-relaxed font-light">
          Celebrating another incredible year of you. Here&apos;s to all the memories we&apos;ve made and the beautiful moments yet to come. You make every day brighter.
        </p>
      </Reveal>
      <RevealScale className="delay-200 w-full max-w-5xl" delay="delay-200">
        <div className="relative h-[60vh] min-h-[400px] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(244,172,183,0.25)]">
          <img
            ref={parallaxRef}
            alt="A beautiful, joyful woman laughing surrounded by soft pink balloons and warm golden hour light."
            className="w-full h-full object-cover"
            src={HERO_CONTENT.backgroundImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuCG6bUEIpQmK2f7iQ8KkxWVfli2qeXci8d7UQA743QfFzZF9WzYg_tP2EWpR7gDaxwxK3ebxI63ALFAwU_amqmW9V6-cP5SVKA3Sly3gN98ntQb66s7L4rI_nRq9XhgjwveGZx0WDMvtMWpL1Nkph5aTjcepHHGofP9687wThKfPJXTp4WVf4uFp7N5NDGfMQahUoMc0lFQOWq-76g5fQ4UWDXYX4Gu9tMEMuWyYlrLWuTE6s-xI0IXNDwUGPxTA-z_R-A2ruV8wiLN"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-tint/30 to-transparent" />
        </div>
      </RevealScale>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 reveal delay-500 animate-float">
        <span className="text-on-surface-variant/60 font-label-md text-xs uppercase tracking-widest">Scroll to explore</span>
        <MatIcon name="expand_more" fill={false} className="w-6 h-6 text-primary/60 animate-bounce" decorative />
      </div>
    </section>
  );
}

const QUOTE_DATA = FESTIVE_AIR_SECTIONS.find((s) => s.type === "quote")!;
const QUOTE_CONTENT = QUOTE_DATA.content as QuoteContent;

function QuoteSection() {
  return (
    <section className="py-32 px-6 bg-surface-container-low relative overflow-hidden flex items-center justify-center min-h-[60vh]">
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "200px 200px" }} />
      <div className="absolute top-10 right-20 w-32 h-32 bg-primary-fixed/30 rounded-full blur-2xl animate-float-slow" />
      <div className="absolute bottom-10 left-20 w-40 h-40 bg-secondary-fixed/30 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />
      <Reveal>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <MatIcon name="format_quote" className="text-4xl text-primary/40 mb-6 block" decorative />
          <h2 className="font-headline-md text-4xl md:text-5xl text-on-surface leading-tight font-['Epilogue'] mb-8">
            &ldquo;{QUOTE_CONTENT.text}&rdquo;
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary-container to-transparent mx-auto" />
        </div>
      </Reveal>
    </section>
  );
}

const TIMELINE_SECTION_DATA = FESTIVE_AIR_SECTIONS.find((s) => s.type === "timeline")!;
const TIMELINE_HEADING = (TIMELINE_SECTION_DATA.content as TimelineContent).heading || "Our Journey";

const TIMELINE_LABEL_COLORS = ["text-primary-container", "text-secondary-fixed-dim", "text-primary"];
const TIMELINE_DOT_BORDERS = ["border-primary-container", "border-secondary-container", "border-surface"];
const TIMELINE_DOT_SHADOWS = ["shadow-[0_0_20px_rgba(244,172,183,0.5)]", "shadow-[0_0_20px_rgba(255,216,124,0.5)]", "shadow-[0_0_25px_rgba(135,78,88,0.6)]"];
const TIMELINE_HOVER_COLORS = ["bg-primary/10", "bg-secondary/10", "bg-primary/10"];
const TIMELINE_IMAGE_SHADOWS = ["shadow-[0_20px_50px_rgba(244,172,183,0.2)]", "shadow-[0_20px_50px_rgba(255,216,124,0.2)]", "shadow-[0_20px_50px_rgba(244,172,183,0.3)]"];
const TIMELINE_IMAGE_HOVER_SHADOWS = ["group-hover:shadow-[0_30px_60px_rgba(244,172,183,0.3)]", "group-hover:shadow-[0_30px_60px_rgba(255,216,124,0.3)]", "group-hover:shadow-[0_30px_60px_rgba(244,172,183,0.4)]"];

function TimelineSection() {
  const events = (TIMELINE_SECTION_DATA.content as TimelineContent).events;
  return (
    <section className="py-32 px-6 bg-surface relative" id="our-story">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-24">
            <span className="text-secondary tracking-[0.2em] font-label-md text-sm uppercase mb-3 block">How It Started</span>
            <h2 className="font-headline-md text-5xl text-primary font-['Epilogue']">{TIMELINE_HEADING}</h2>
          </div>
        </Reveal>
        <div className="relative max-w-5xl mx-auto py-10">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary-fixed to-transparent transform md:-translate-x-1/2" />
          {events.map((event, index) => {
            const isLast = index === events.length - 1;
            return (
              <Reveal key={event.id}>
                <div className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? "" : "md:flex-row-reverse"} items-center justify-between mb-24 md:mb-32 group`}>
                  <div className={`w-full md:w-5/12 ps-16 md:ps-0 ${index % 2 === 0 ? "md:pe-16 md:text-right rtl:md:text-left" : "md:ps-16"} mb-8 md:mb-0`}>
                    <span className={`${TIMELINE_LABEL_COLORS[index]} font-label-md tracking-wider uppercase text-xs mb-2 block`}>
                      {index === 0 ? "The Beginning" : index === 1 ? "First Adventure" : "The Present"}
                    </span>
                    <h4 className="font-headline-sm text-2xl md:text-3xl text-on-surface mb-4 transition-colors duration-300 font-['Epilogue']">{event.title}</h4>
                    <p className="font-body-md text-base md:text-lg text-on-surface-variant leading-relaxed">{event.description}</p>
                  </div>
                  {isLast ? (
                    <div className="absolute start-6 md:start-1/2 w-8 h-8 rounded-full bg-primary border-[4px] border-surface transform -translate-x-1/2 rtl:translate-x-1/2 shadow-[0_0_25px_rgba(135,78,88,0.6)] z-10 transition-transform duration-500 group-hover:scale-125 flex items-center justify-center">
                      <MatIcon name="favorite" className="text-[14px] text-white" />
                    </div>
                  ) : (
                    <div className={`absolute start-6 md:start-1/2 w-6 h-6 rounded-full bg-surface border-[6px] ${TIMELINE_DOT_BORDERS[index]} transform -translate-x-1/2 rtl:translate-x-1/2 ${TIMELINE_DOT_SHADOWS[index]} z-10 transition-transform duration-500 group-hover:scale-150`} />
                  )}
                  <div className={`w-full md:w-5/12 ps-16 md:ps-16 ${index % 2 !== 0 ? "md:ps-0 md:pe-16 md:flex md:justify-end" : ""}`}>
                    <div className={`w-40 h-40 md:w-64 md:h-64 rounded-full overflow-hidden ${TIMELINE_IMAGE_SHADOWS[index]} border-8 border-surface transition-all duration-700 group-hover:scale-105 ${index % 2 === 0 ? "group-hover:rotate-3" : "group-hover:-rotate-3"} relative ${TIMELINE_IMAGE_HOVER_SHADOWS[index]}`}>
                      {event.image ? (
                        <img alt={event.title} className="w-full h-full object-cover" src={event.image} />
                      ) : (
                        <div className="w-full h-full bg-surface-container-low flex items-center justify-center">
                          <MatIcon name="photo" className="text-4xl text-on-surface-variant/30" decorative />
                        </div>
                      )}
                      <div className={`absolute inset-0 ${TIMELINE_HOVER_COLORS[index]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const COUNTDOWN_DATA = FESTIVE_AIR_SECTIONS.find((s) => s.type === "countdown")!;
const COUNTDOWN_CONTENT = COUNTDOWN_DATA.content as CountdownContent;

function CountdownSection() {
  const [diff, setDiff] = useState(() => {
    const target = new Date(COUNTDOWN_CONTENT.targetDate).getTime();
    return Math.max(0, target - Date.now());
  });

  useEffect(() => {
    const target = new Date(COUNTDOWN_CONTENT.targetDate).getTime();
    const interval = setInterval(() => {
      setDiff(Math.max(0, target - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const days = String(Math.floor(diff / 86400000)).padStart(2, "0");
  const hours = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");
  const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-surface to-surface-container-low" id="countdown">
      <Reveal>
        <div className="max-w-4xl mx-auto text-center bg-white/50 backdrop-blur-md rounded-[2.5rem] p-12 shadow-[0_8px_30px_rgba(244,172,183,0.1)] border border-primary-fixed/20">
          <h3 className="font-headline-md text-3xl text-primary mb-12 font-['Epilogue']">{COUNTDOWN_CONTENT.title || "We can't wait to celebrate you!"}</h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: days, label: "Days", color: "text-primary" },
              { value: hours, label: "Hours", color: "text-secondary" },
              { value: mins, label: "Mins", color: "text-primary" },
              { value: secs, label: "Secs", color: "text-secondary" },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-8 md:gap-16">
                <div className="flex flex-col items-center">
                  <div className={`text-5xl md:text-6xl font-headline-lg ${item.color} mb-2 font-['Epilogue']`}>{item.value}</div>
                  <span className="font-label-md text-xs text-on-surface-variant uppercase tracking-[0.3em]">{item.label}</span>
                </div>
                {i < 3 && <div className="w-px h-16 bg-primary-fixed/50 hidden md:block mt-2" />}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

const MEMORY_DATA = FESTIVE_AIR_SECTIONS.find((s) => s.type === "memory_highlights")!;
const MEMORY_CONTENT = MEMORY_DATA.content as MemoryHighlightsContent;

function MemorySection() {
  return (
    <section className="py-32 px-6 bg-surface-container-low relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <RevealScale className="w-full md:w-1/2">
          <div className="relative rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(244,172,183,0.2)] aspect-[4/5] group">
            {MEMORY_CONTENT.image ? (
              <img
                alt="Celebration toast highlight"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                src={MEMORY_CONTENT.image}
              />
            ) : (
              <div className="w-full h-full bg-surface-container-low flex items-center justify-center">
                <MatIcon name="photo" className="text-4xl text-on-surface-variant/30" decorative />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </RevealScale>
        <Reveal className="w-full md:w-1/2 delay-200" delay="delay-200">
          <MatIcon name="auto_awesome" className="text-secondary-fixed-dim text-4xl mb-6 animate-pulse-subtle" decorative />
          <h2 className="font-headline-lg text-5xl text-primary mb-8 font-['Epilogue'] leading-tight">
            {MEMORY_CONTENT.heading}
          </h2>
          <p className="font-body-lg text-xl text-on-surface-variant mb-8 leading-relaxed font-light">
            {MEMORY_CONTENT.body}
          </p>
          <div className="flex items-center gap-4 text-secondary italic font-body-md">
            <div className="w-12 h-px bg-secondary-fixed" />
            <span>{MEMORY_CONTENT.signoff}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const GALLERY_SECTION_DATA = FESTIVE_AIR_SECTIONS.find((s) => s.type === "gallery")!;
const GALLERY_HEADING = "Cherished Moments";
const GALLERY_SUBTITLE = "Snapshots of joy, laughter, and everything in between.";
const GALLERY_CONFIGS = [
  { className: "col-span-2 row-span-2", delay: "delay-100" },
  { className: "col-span-1 row-span-2", delay: "delay-200" },
  { className: "col-span-1 row-span-1", delay: "delay-300" },
  { className: "col-span-1 row-span-1", delay: "delay-400" },
  { className: "col-span-2 row-span-1", delay: "delay-100" },
];

function GallerySection() {
  const images = (GALLERY_SECTION_DATA.content as GalleryContent).images;

  return (
    <section className="py-32 px-6 bg-surface" id="photo-gallery">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-20">
            <h2 className="font-headline-md text-5xl text-primary font-['Epilogue'] mb-4">{GALLERY_HEADING}</h2>
            <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto">{GALLERY_SUBTITLE}</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
          {images.map((img, i) => {
            const cfg = GALLERY_CONFIGS[i] || GALLERY_CONFIGS[0];
            return (
              <Reveal key={img.id} className={`${cfg.className} overflow-hidden rounded-[2rem] shadow-sm group hover:shadow-2xl transition-all duration-500 relative`} delay={cfg.delay}>
                <img alt={img.alt || ""} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={img.src || img.storageId} />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Reveal>
            );
          })}
          <Reveal className="col-span-2 row-span-1 overflow-hidden rounded-[2rem] shadow-sm group hover:shadow-2xl transition-all duration-500 relative bg-primary-fixed/20 flex items-center justify-center p-8" delay="delay-200">
            <div className="text-center">
              <MatIcon name="favorite" className="text-4xl text-primary mb-4" decorative />
              <h3 className="font-headline-sm text-primary font-['Epilogue']">More memories <br /> to be made today</h3>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const LOVE_NOTES_SECTION_DATA = FESTIVE_AIR_SECTIONS.find((s) => s.type === "love_notes")!;
const LOVE_NOTES_HEADING = (LOVE_NOTES_SECTION_DATA.content as LoveNotesContent).heading;
const LOVE_NOTES_SUBTITLE = (LOVE_NOTES_SECTION_DATA.content as LoveNotesContent).subtitle;
const LOVE_NOTES_ITEMS = (LOVE_NOTES_SECTION_DATA.content as LoveNotesContent).notes;

function LoveNotesSection() {
  const COLOR_MAP: Record<string, { bg: string; text: string }> = {
    primary: { bg: "bg-primary-container", text: "on-primary-container" },
    secondary: { bg: "bg-secondary-container", text: "on-secondary-container" },
    surface: { bg: "bg-surface-dim", text: "on-surface-variant" },
  };

  return (
    <section className="py-24 px-6 bg-surface-container-low" id="gift-board">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-20">
            <h2 className="font-headline-md text-5xl text-primary font-['Epilogue'] mb-4">{LOVE_NOTES_HEADING}</h2>
            <p className="font-body-md text-on-surface-variant">{LOVE_NOTES_SUBTITLE}</p>
          </div>
        </Reveal>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {LOVE_NOTES_ITEMS.map((note, i) => {
            const colors = COLOR_MAP[note.colorScheme] || COLOR_MAP.primary;
            return (
              <Reveal key={note.id} className={`break-inside-avoid relative overflow-hidden group bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgba(244,172,183,0.05)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(244,172,183,0.15)] transition-all duration-500`} delay={i % 3 === 1 ? "delay-100" : i % 3 === 2 ? "delay-200" : ""}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary-fixed/30 rounded-bl-[4rem] -z-10 group-hover:scale-110 transition-transform" />
                <p className="font-body-lg text-on-surface-variant mb-8 leading-relaxed italic text-lg">&ldquo;{note.message}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center ${colors.text} font-label-md text-lg`}>{note.initial}</div>
                  <span className="font-label-md text-label-md text-primary tracking-wide uppercase">{note.name}</span>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-20 text-center">
          <button className="bg-white border border-primary-container text-primary font-label-md text-sm px-10 py-4 rounded-full hover:bg-primary-container hover:text-on-primary-container hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shadow-md tracking-widest uppercase">
            Leave a Note
          </button>
        </Reveal>
      </div>
    </section>
  );
}

const AUDIO_DATA = FESTIVE_AIR_SECTIONS.find((s) => s.type === "audio")!;

function MusicSection() {
  return (
    <div id="soundtrack">
      <AudioSection
        content={AUDIO_DATA.content}
        settings={AUDIO_DATA.settings}
        theme={FESTIVE_AIR_THEME}
      />
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-16 px-6 bg-surface text-center">
      <div className="max-w-4xl mx-auto space-y-4">
        <p className="font-headline-sm text-primary font-['Epilogue']">Made with love</p>
        <p className="font-body-md text-on-surface-variant text-sm">
          Built with Romantic Microsite Platform
        </p>
      </div>
    </footer>
  );
}

export default function DemoPage() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      <div className="festive-air-theme min-h-screen bg-background text-on-background font-body-md overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
        <Header />
        <main className="flex-grow">
          <HeroSection />
          <WaveDivider />
          <QuoteSection />
          <WaveDividerAlt />
          <TimelineSection />
          <CountdownSection />
          <MemorySection />
          <GallerySection />
          <LoveNotesSection />
          <WaveDividerAlt fill="fill-surface-container-high/30" />
          <MusicSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
