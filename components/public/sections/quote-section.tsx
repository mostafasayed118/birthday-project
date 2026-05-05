"use client";

import type { SectionProps, QuoteContent } from "@/lib/types";

export function QuoteSection({ content, theme }: SectionProps) {
  const c = content as QuoteContent;

  const bgStyles: Record<string, React.CSSProperties> = {
    solid: { backgroundColor: theme.colors.surface },
    gradient: {
      background: `linear-gradient(135deg, ${theme.colors.primary}15, ${theme.colors.accent}15)`,
    },
    image: c.backgroundImage
      ? {
          backgroundImage: `url(${c.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : { backgroundColor: theme.colors.surface },
  };

  const wrapperStyle: React.CSSProperties = {
    padding: `${theme.spacing.sectionPadding} ${theme.spacing.cardPadding}`,
    ...bgStyles[c.backgroundStyle],
  };

  if (c.style === "banner") {
    wrapperStyle.textAlign = "center";
  }

  return (
    <div style={wrapperStyle}>
      <div
        style={{
          maxWidth: c.style === "banner" ? "800px" : "680px",
          margin: "0 auto",
          textAlign: c.style === "inline" ? "left" : "center",
        }}
      >
        <div
          style={{
            fontSize: `${theme.typography.baseFontSize * 3}px`,
            lineHeight: 1,
            color: theme.colors.primary,
            opacity: 0.3,
            fontFamily: "Georgia, serif",
          }}
        >
          &ldquo;
        </div>

        <blockquote
          style={{
            fontFamily: `'${theme.typography.headingFont}', serif`,
            fontWeight: theme.typography.headingWeight,
            fontSize: `${
              c.style === "banner"
                ? theme.typography.baseFontSize * 1.5
                : theme.typography.baseFontSize * 1.3
            }px`,
            lineHeight: 1.5,
            fontStyle: c.style === "scripture" ? "italic" : "normal",
            color: theme.colors.text,
            margin: `-${theme.typography.baseFontSize}px 0 0`,
          }}
        >
          {c.text}
        </blockquote>

        {c.author && (
          <cite
            className="block mt-4 not-italic"
            style={{
              fontSize: `${theme.typography.baseFontSize * 0.95}px`,
              color: theme.colors.textSecondary,
              fontWeight: "500",
            }}
          >
            — {c.author}
          </cite>
        )}
      </div>
    </div>
  );
}
