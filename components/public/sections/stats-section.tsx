"use client";

import type { SectionProps, StatsContent } from "@/lib/types";
import { SectionContainer, SectionHeading, EmptySectionFallback } from "./primitives";

export function StatsSection({ content, theme }: SectionProps) {
  const c = content as StatsContent;

  if (!c.items || c.items.length === 0) {
    return (
      <SectionContainer theme={theme}>
        {c.heading && (
          <SectionHeading theme={theme}>{c.heading}</SectionHeading>
        )}
        <EmptySectionFallback message="No stats to display" />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer theme={theme}>
      {c.heading && (
        <SectionHeading theme={theme}>{c.heading}</SectionHeading>
      )}

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ gap: theme.spacing.elementGap }}>
        {c.items.map((item) => (
          <div
            key={item.id}
            className="text-center p-4 sm:p-6"
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borders.cardRadius,
              boxShadow: theme.effects.shadow,
              border: `${theme.borders.borderWidth} solid ${theme.colors.border}`,
            }}
          >
            {item.icon && (
              <span className="text-2xl block mb-2">{item.icon}</span>
            )}
            <div
              style={{
                fontFamily: `'${theme.typography.headingFont}', serif`,
                fontWeight: theme.typography.headingWeight,
                fontSize: `${theme.typography.baseFontSize * 1.8}px`,
                color: theme.colors.primary,
                lineHeight: 1.2,
              }}
            >
              {item.value}
            </div>
            <div
              className="mt-1"
              style={{
                fontSize: `${theme.typography.baseFontSize * 0.85}px`,
                color: theme.colors.textSecondary,
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
