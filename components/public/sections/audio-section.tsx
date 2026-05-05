"use client";

import type { SectionProps, AudioContent } from "@/lib/types";
import { SectionContainer, EmptySectionFallback } from "./primitives";

export function AudioSection({ content, theme }: SectionProps) {
  const c = content as AudioContent;

  if (!c.url) {
    return (
      <SectionContainer theme={theme}>
        <EmptySectionFallback message="No audio URL set" />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer theme={theme}>
      <div
        className="mx-auto p-6"
        style={{
          maxWidth: "600px",
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borders.cardRadius,
          boxShadow: theme.effects.shadow,
          border: `${theme.borders.borderWidth} solid ${theme.colors.border}`,
        }}
      >
        {c.title && (
          <p
            className="mb-3"
            style={{
              fontFamily: `'${theme.typography.headingFont}', serif`,
              fontWeight: theme.typography.headingWeight,
              fontSize: `${theme.typography.baseFontSize * 1.1}px`,
              color: theme.colors.text,
              textAlign: "center",
            }}
          >
            {c.title}
          </p>
        )}

        {c.showPlayer ? (
          <audio
            controls
            className="w-full"
            style={{ height: "40px" }}
          >
            <source src={c.url} />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <p
            className="text-center"
            style={{
              fontSize: `${theme.typography.baseFontSize * 0.85}px`,
              color: theme.colors.textSecondary,
            }}
          >
            Audio player hidden
          </p>
        )}
      </div>
    </SectionContainer>
  );
}
