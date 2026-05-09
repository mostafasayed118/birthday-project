"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { SectionProps, HeroContent } from "@/lib/types";
import { Heart } from "lucide-react";
import { Reveal, RevealScale, useParallax, MatIcon } from "../shared-primitives";

export function HeroSection({ content, theme, isPreview }: SectionProps) {
  const c = content as HeroContent;
  const parallaxRef = useParallax(0.15);

  const [showLoveAnimation, setShowLoveAnimation] = useState(false);
  const [showLovePopup, setShowLovePopup] = useState(false);
  const [randomMessage, setRandomMessage] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; emoji: string; delay: number }>>([]);

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  useEffect(() => {
    if (showLovePopup) {
      const timer = setTimeout(() => setShowLovePopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showLovePopup]);

  const isValidStorageId = (id: string): boolean => {
    if (!id || typeof id !== "string") return false;
    if (id.startsWith("http") || id.startsWith("data:")) return false;
    if (id.length < 20 || id.length > 50) return false;
    return true;
  };

  const backgroundImageUrl = useQuery(
    api.files.getFileUrl,
    c.backgroundImage && isValidStorageId(c.backgroundImage)
      ? { storageId: c.backgroundImage }
      : "skip"
  );

  const backgroundImageUrlValue = backgroundImageUrl ?? c.backgroundImage;

  const titleParts = c.title?.replace(/,\s*$/, "").split(",").length > 1
    ? c.title.split(/,\s*/)
    : [c.title?.replace(/,\s*$/, "") || "", ""];

  const getRandomMessage = () => {
    const messages = c.loveMessages || [];
    if (messages.length === 0) return "Sending love!";
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleSendLove = () => {
    setRandomMessage(getRandomMessage());
    setShowLoveAnimation(true);
    setShowLovePopup(true);
    setTimeout(() => setShowLoveAnimation(false), c.heartAnimationDuration || 1000);
    setTimeout(() => setShowLovePopup(false), 3000);
  };

  const handleCTACelebration = () => {
    const emojis = ["🎉", "🎊", "🎈", "🥳", "✨", "🎁", "🍾", "🥂"];
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 50 + 25,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      delay: Math.random() * 0.5,
    }));
    setConfetti(particles);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
    setTimeout(() => setConfetti([]), 3500);
  };

  return (
<section className="min-h-[70vh] md:min-h-[85vh] pt-24 md:pt-28 pb-16 md:pb-20 px-4 md:px-6 flex flex-col items-center text-center justify-center relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-fixed/20 blur-[60px] sm:blur-[80px] md:blur-[100px] animate-pulse-subtle" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary-fixed/20 blur-[80px] sm:blur-[100px] md:blur-[120px] animate-pulse-subtle" style={{ animationDelay: "1.5s" }} />
       </div>

      {showLoveAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="animate-ping">
            <Heart
              className="text-red-500"
              style={{ width: 120, height: 120 }}
              fill="currentColor"
            />
          </div>
        </div>
      )}

      {showLovePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="relative px-8 py-6 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300 max-w-sm mx-4 bg-surface border-2 border-primary">
            <div className="flex items-center gap-3">
              <Heart
                className="text-red-500 shrink-0"
                style={{ width: 24, height: 24 }}
                fill="currentColor"
              />
              <p className="text-lg font-medium text-text">
                {randomMessage}
              </p>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs animate-bounce bg-primary text-white">
              💖
            </div>
          </div>
        </div>
      )}

      {showCelebration && confetti.length > 0 && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {confetti.map((p) => (
            <div
              key={p.id}
              className="absolute animate-bounce text-2xl"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                animationDuration: "2s",
                animationDelay: `${p.delay}s`,
              }}
            >
              {p.emoji}
            </div>
          ))}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl animate-ping">
            🎉
          </div>
        </div>
      )}

<Reveal className="relative inline-block mb-6 md:mb-8 mt-8 md:mt-10">
         <h1 className="font-headline-lg text-4xl sm:text-5xl md:text-6xl lg:text-[80px] leading-[1.1] text-primary max-w-4xl relative z-10 tracking-tight font-['Epilogue']">
           {titleParts[0]}{titleParts.length > 1 ? "," : ""}
           {c.subtitle && (
             <>
               <br />
               <span className="italic font-light text-surface-tint">{c.subtitle}</span>
             </>
           )}
         </h1>
         <MatIcon name="auto_awesome" className="absolute -top-4 -left-2 sm:-top-6 sm:-left-4 md:-top-8 md:-left-10 text-secondary-fixed-dim text-xl sm:text-2xl md:text-3xl rotate-12 animate-shimmer" decorative />
         <MatIcon name="star" className="absolute -bottom-1 -right-2 sm:-bottom-2 sm:-right-4 md:-bottom-4 md:-right-12 text-secondary-fixed-dim text-2xl sm:text-3xl md:text-4xl -rotate-12 animate-shimmer delay-100" decorative />
       </Reveal>

{c.body && (
         <Reveal className="delay-100" delay="delay-100">
           <p className="font-body-lg text-lg sm:text-xl text-on-surface-variant max-w-2xl mb-12 md:mb-16 leading-relaxed font-light px-2 sm:px-0">
             {c.body}
           </p>
         </Reveal>
       )}

       {(c.ctaText || c.sendLoveText) && (
         <Reveal className="delay-150 mb-12 md:mb-16 z-20 relative flex gap-3 sm:gap-4 justify-center flex-wrap px-2 sm:px-0" delay="delay-100">
           {c.ctaText && (
             <a
               href={c.ctaLink || "#"}
               onClick={(e) => {
                 if (c.ctaLink?.startsWith("#")) return;
                 e.preventDefault();
                 handleCTACelebration();
                 setTimeout(() => {
                   window.location.href = c.ctaLink || "#";
                 }, 1000);
               }}
               className="festive-gradient-btn text-on-primary-container font-label-md px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:scale-105 transition-all duration-300 shadow-[0_4px_15px_rgba(244,172,183,0.3)] hover:shadow-[0_6px_20px_rgba(244,172,183,0.5)] text-sm sm:text-base"
             >
               {c.ctaText}
             </a>
           )}
           {c.sendLoveText && (
             <button
               onClick={handleSendLove}
               className="bg-white border border-primary-container text-primary font-label-md px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all duration-300 shadow-md hover:-translate-y-1 hover:shadow-xl text-sm sm:text-base"
             >
               {c.sendLoveText}
             </button>
           )}
         </Reveal>
       )}

{backgroundImageUrlValue && (
         <RevealScale className="delay-200 w-full max-w-5xl px-2 sm:px-0" delay="delay-200">
           <div className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] min-h-[250px] sm:min-h-[300px] md:min-h-[400px] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(244,172,183,0.25)]">
             <img
               ref={parallaxRef}
               alt={c.title || ""}
               className="w-full h-full object-cover"
               src={backgroundImageUrlValue}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-surface-tint/30 to-transparent" />
             <div
               className="absolute inset-0"
               style={{
                 backgroundColor: c.overlayColor || "#000000",
                 opacity: (c.backgroundOverlay || 0) / 100,
               }}
             />
           </div>
         </RevealScale>
       )}

       <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 reveal delay-500 animate-float pointer-events-none">
         <span className="text-on-surface-variant/60 font-label-md text-[10px] sm:text-xs uppercase tracking-widest">Scroll to explore</span>
         <MatIcon name="expand_more" fill={false} className="w-5 h-5 sm:w-6 sm:h-6 text-primary/60 animate-bounce" decorative />
       </div>
    </section>
  );
}