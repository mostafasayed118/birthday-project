"use client";

import type { SectionProps, HeroContent } from "@/lib/types";
import { ThemedButton } from "./primitives";

export function HeroSection({ content, theme }: SectionProps) {
  const c = content as HeroContent;

  const heightMap = { full: "100vh", large: "75vh", medium: "50vh" };
  const height = heightMap[c.height] || "75vh";

  const alignMap = { left: "flex-start", center: "center", right: "flex-end" };
  const textAlign = c.titleAlignment || "center";

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: height,
        backgroundColor: theme.colors.surface,
      }}
    >
      {c.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${c.backgroundImage})` }}
        />
      )}

      {c.backgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: c.overlayColor || "#000000",
            opacity: (c.backgroundOverlay || 0) / 100,
          }}
        />
      )}

      <div
        className="relative z-10 px-6 md:px-8 text-center"
        style={{
          maxWidth: theme.spacing.containerWidth,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: alignMap[c.titleAlignment] || "center",
          textAlign,
        }}
      >
        <h1
          style={{
            fontFamily: `'${theme.typography.headingFont}', serif`,
            fontWeight: theme.typography.headingWeight,
            fontSize: `${theme.typography.baseFontSize * theme.typography.headingScale * theme.typography.headingScale * 1.2}px`,
            lineHeight: 1.1,
            color: c.backgroundImage ? "#ffffff" : theme.colors.text,
            marginBottom: theme.spacing.elementGap,
          }}
        >
          {c.title || "Welcome"}
        </h1>

        {c.subtitle && (
          <p
            style={{
              fontFamily: `'${theme.typography.bodyFont}', sans-serif`,
              fontWeight: theme.typography.bodyWeight,
              fontSize: `${theme.typography.baseFontSize * 1.25}px`,
              lineHeight: theme.typography.lineHeight,
              color: c.backgroundImage
                ? "rgba(255,255,255,0.85)"
                : theme.colors.textSecondary,
              maxWidth: "600px",
              marginBottom: c.ctaText ? theme.spacing.elementGap : undefined,
            }}
          >
            {c.subtitle}
          </p>
        )}

        {c.ctaText && (
          <ThemedButton
            theme={{
              ...theme,
              colors: c.backgroundImage
                ? { ...theme.colors, primary: "#ffffff", text: theme.colors.primary }
                : theme.colors,
            }}
            href={c.ctaLink}
          >
            {c.ctaText}
          </ThemedButton>
        )}
      </div>
    </section>
  );
}
