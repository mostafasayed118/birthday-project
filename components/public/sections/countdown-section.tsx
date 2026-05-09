"use client";

import { useState, useEffect } from "react";
import type { SectionProps, CountdownContent } from "@/lib/types";
import { Reveal } from "../shared-primitives";

export function CountdownSection({ content, theme }: SectionProps) {
  const c = content as CountdownContent;
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const target = new Date(c.targetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setIsExpired(false);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [c.targetDate]);

  return (
    <section className="py-20 md:py-24 px-4 md:px-6 bg-surface-container-low relative">
      <div className="max-w-4xl mx-auto text-center">
        <Reveal>
          <div className="inline-block p-6 sm:p-8 md:p-10 lg:p-16 bg-surface rounded-[2rem] shadow-[0_20px_50px_rgba(244,172,183,0.15)] relative overflow-hidden border border-primary-fixed/20 w-full">
            <div className="absolute -top-8 -right-8 w-24 h-24 sm:-top-10 sm:-right-10 sm:w-32 sm:h-32 bg-primary-fixed/30 rounded-full blur-xl sm:blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 sm:-bottom-10 sm:-left-10 sm:w-40 sm:h-40 bg-secondary-fixed/30 rounded-full blur-xl sm:blur-2xl" />
            
            <h2 className="font-headline-sm text-2xl sm:text-3xl md:text-4xl text-primary font-['Epilogue'] mb-3 md:mb-4 relative z-10">
              {c.title || "The Countdown"}
            </h2>
            {c.subtitle && (
              <p className="font-body-md text-on-surface-variant mb-6 md:mb-10 relative z-10 max-w-lg mx-auto text-sm sm:text-base">
                {c.subtitle}
              </p>
            )}

            {isExpired ? (
              <div className="relative z-10 py-6 md:py-8">
                <p className="text-xl sm:text-2xl font-bold text-primary animate-pulse-subtle px-2">
                  {c.expiredMessage || "The time has arrived!"}
                </p>
              </div>
            ) : (
              <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 relative z-10 flex-wrap">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="flex flex-col items-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-primary-container rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 shadow-inner">
                      <span className="font-headline-lg text-xl sm:text-2xl md:text-3xl lg:text-5xl text-on-primary-container">
                        {value.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <span className="font-label-md text-[10px] sm:text-xs md:text-sm text-on-surface-variant uppercase tracking-widest">{unit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
