"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import type { AnimationSettings } from "@/lib/types";

interface SectionAnimationWrapperProps {
  settings: Record<string, unknown>;
  children: React.ReactNode;
}

const DEFAULT_ANIMATION: AnimationSettings = {
  enabled: true,
  type: "fade",
  duration: 800,
  delay: 0,
  easing: "ease-out",
};

export function SectionAnimationWrapper({
  settings,
  children,
}: SectionAnimationWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const animationSettings = useMemo((): AnimationSettings => {
    const anim = settings.animation as Partial<AnimationSettings> | undefined;
    return { ...DEFAULT_ANIMATION, ...anim };
  }, [settings.animation]);

  const [isVisible, setIsVisible] = useState(animationSettings.enabled === false);

  const handleIntersection = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          setIsVisible(true);
        }, animationSettings.delay);
      }
    },
    [animationSettings.delay]
  );

  useEffect(() => {
    if (!animationSettings.enabled) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, [animationSettings.enabled, handleIntersection]);

  const getAnimationStyles = (): React.CSSProperties => {
    if (!animationSettings.enabled || isVisible) {
      return {
        opacity: 1,
        transform: "none",
        transition: `all ${animationSettings.duration}ms ${animationSettings.easing}`,
      };
    }

    const baseStyles: React.CSSProperties = {
      opacity: 0,
      transition: `all ${animationSettings.duration}ms ${animationSettings.easing}`,
    };

    switch (animationSettings.type) {
      case "fade":
        return { ...baseStyles, opacity: 0, transform: "translateY(20px)" };
      case "slide":
        return { ...baseStyles, opacity: 0, transform: "translateX(-30px)" };
      case "scale":
        return { ...baseStyles, opacity: 0, transform: "scale(0.95)" };
      case "bounce":
        return { ...baseStyles, opacity: 0, transform: "translateY(30px)" };
      default:
        return baseStyles;
    }
  };

  return (
    <div ref={wrapperRef} style={getAnimationStyles()}>
      {children}
    </div>
  );
}