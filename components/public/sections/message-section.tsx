"use client";

import type { SectionProps, MessageContent } from "@/lib/types";
import { SectionContainer } from "./primitives";

export function MessageSection({ content, theme }: SectionProps) {
  const c = content as MessageContent;
  const fontStyleMap = {
    default: `'${theme.typography.bodyFont}', sans-serif`,
    handwritten: "'Dancing Script', cursive",
    elegant: `'Cormorant Garamond', serif`,
  };

  return (
    <SectionContainer theme={theme}>
      <div
        style={{
          maxWidth: c.maxWidth || "680px",
          margin: "0 auto",
          textAlign: c.alignment,
        }}
      >
        {c.heading && (
          <h2
            style={{
              fontFamily: `'${theme.typography.headingFont}', serif`,
              fontWeight: theme.typography.headingWeight,
              fontSize: `${theme.typography.baseFontSize * theme.typography.headingScale * 1.2}px`,
              lineHeight: 1.2,
              color: theme.colors.text,
              marginBottom: theme.spacing.elementGap,
            }}
          >
            {c.heading}
          </h2>
        )}

        <div
          style={{
            fontFamily: fontStyleMap[c.fontStyle],
            fontWeight: theme.typography.bodyWeight,
            fontSize: `${theme.typography.baseFontSize * 1.1}px`,
            lineHeight: theme.typography.lineHeight * 1.15,
            color: theme.colors.text,
            whiteSpace: "pre-line",
          }}
        >
          {c.body || ""}
        </div>
      </div>
    </SectionContainer>
  );
}
