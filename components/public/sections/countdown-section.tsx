"use client";

import { useState, useEffect } from "react";
import type { SectionProps, CountdownContent, ThemeData } from "@/lib/types";
import { SectionContainer } from "./primitives";

function useCountdown(targetDate: string) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const target = new Date(targetDate).getTime();
  const diff = Math.max(0, target - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: diff === 0,
  };
}

function CountdownBox({
  value,
  label,
  theme,
}: {
  value: number;
  label: string;
  theme: ThemeData;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="flex items-center justify-center"
        style={{
          width: "80px",
          height: "80px",
          borderRadius: theme.borders.cardRadius,
          backgroundColor: theme.colors.surface,
          boxShadow: theme.effects.shadow,
          border: `${theme.borders.borderWidth} solid ${theme.colors.border}`,
        }}
      >
        <span
          style={{
            fontFamily: `'${theme.typography.headingFont}', serif`,
            fontWeight: theme.typography.headingWeight,
            fontSize: `${theme.typography.baseFontSize * 1.8}px`,
            color: theme.colors.primary,
          }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span
        className="mt-2"
        style={{
          fontSize: `${theme.typography.baseFontSize * 0.8}px`,
          color: theme.colors.textSecondary,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function CountdownSection({ content, theme }: SectionProps) {
  const c = content as CountdownContent;
  const { days, hours, minutes, seconds, expired } = useCountdown(
    c.targetDate || new Date().toISOString()
  );

  if (expired) {
    return (
      <SectionContainer theme={theme}>
        <div className="text-center py-8">
          <p
            style={{
              fontFamily: `'${theme.typography.headingFont}', serif`,
              fontWeight: theme.typography.headingWeight,
              fontSize: `${theme.typography.baseFontSize * 1.5}px`,
              color: theme.colors.primary,
            }}
          >
            {c.expiredMessage || "The moment has arrived!"}
          </p>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer theme={theme}>
      <div className="text-center">
        {c.title && (
          <h2
            style={{
              fontFamily: `'${theme.typography.headingFont}', serif`,
              fontWeight: theme.typography.headingWeight,
              fontSize: `${theme.typography.baseFontSize * theme.typography.headingScale * 1.2}px`,
              color: theme.colors.text,
              marginBottom: "8px",
            }}
          >
            {c.title}
          </h2>
        )}

        {c.subtitle && (
          <p
            style={{
              fontSize: `${theme.typography.baseFontSize}px`,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.elementGap,
            }}
          >
            {c.subtitle}
          </p>
        )}

        <div
          className="flex items-center justify-center gap-4 md:gap-6"
          style={{ marginTop: theme.spacing.elementGap }}
        >
          <CountdownBox value={days} label="Days" theme={theme} />
          <CountdownBox value={hours} label="Hours" theme={theme} />
          <CountdownBox value={minutes} label="Min" theme={theme} />
          <CountdownBox value={seconds} label="Sec" theme={theme} />
        </div>
      </div>
    </SectionContainer>
  );
}
