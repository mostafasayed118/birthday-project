"use client";

import type { SectionProps, FooterContent } from "@/lib/types";

export function FooterSection({ content, theme }: SectionProps) {
  const c = content as FooterContent;

  return (
    <footer
      className="text-center"
      style={{
        padding: `${theme.spacing.sectionPadding} ${theme.spacing.cardPadding}`,
        borderTop: `${theme.borders.borderWidth} solid ${theme.colors.border}`,
        backgroundColor: theme.colors.surface,
      }}
    >
      <div style={{ maxWidth: theme.spacing.containerWidth, margin: "0 auto" }}>
        {c.text && (
          <p
            style={{
              fontFamily: `'${theme.typography.headingFont}', serif`,
              fontSize: `${theme.typography.baseFontSize * 1.1}px`,
              color: theme.colors.text,
              marginBottom: theme.spacing.elementGap,
            }}
          >
            {c.text}
          </p>
        )}

        {c.socialLinks && c.socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-4 mb-6">
            {c.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: `${theme.typography.baseFontSize * 0.9}px`,
                  color: theme.colors.primary,
                  textDecoration: "none",
                  transition: theme.effects.transition,
                }}
              >
                {link.label || link.platform}
              </a>
            ))}
          </div>
        )}

        {c.showAttribution && (
          <p
            style={{
              fontSize: `${theme.typography.baseFontSize * 0.75}px`,
              color: theme.colors.textSecondary,
            }}
          >
            Built with Romantic Microsite Platform
          </p>
        )}
      </div>
    </footer>
  );
}
