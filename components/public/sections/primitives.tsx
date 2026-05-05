"use client";

import type { ReactNode } from "react";
import type { ThemeData } from "@/lib/types";

interface ContainerProps {
  theme: ThemeData;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SectionContainer({
  theme,
  children,
  className = "",
  id,
}: ContainerProps) {
  return (
    <section
      id={id}
      className={`px-6 md:px-8 ${className}`}
      style={{ paddingBlock: theme.spacing.sectionPadding }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: theme.spacing.containerWidth }}
      >
        {children}
      </div>
    </section>
  );
}

interface HeadingProps {
  theme: ThemeData;
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
  align?: "left" | "center" | "right";
}

export function SectionHeading({
  theme,
  children,
  className = "",
  as: Tag = "h2",
  align = "center",
}: HeadingProps) {
  const scale = theme.typography.headingScale;
  const base = theme.typography.baseFontSize;
  const sizeMap: Record<string, number> = {
    h1: base * scale * scale,
    h2: base * scale,
    h3: base * (scale * 0.9),
    h4: base * (scale * 0.8),
  };
  return (
    <Tag
      className={`leading-tight ${className}`}
      style={{
        fontFamily: `'${theme.typography.headingFont}', serif`,
        fontWeight: theme.typography.headingWeight,
        fontSize: `${sizeMap[Tag]}px`,
        textAlign: align,
        color: theme.colors.text,
      }}
    >
      {children}
    </Tag>
  );
}

interface ThemedButtonProps {
  theme: ThemeData;
  children: ReactNode;
  href?: string;
  className?: string;
}

export function ThemedButton({
  theme,
  children,
  href,
  className = "",
}: ThemedButtonProps) {
  const style = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 32px",
    backgroundColor: theme.colors.primary,
    color: "#ffffff",
    borderRadius: theme.borders.buttonRadius,
    fontWeight: "500",
    fontSize: `${theme.typography.baseFontSize}px`,
    textDecoration: "none",
    transition: theme.effects.transition,
    cursor: "pointer",
    border: "none",
  };

  if (href) {
    return (
      <a href={href} style={style} className={className}>
        {children}
      </a>
    );
  }
  return (
    <span style={style} className={className}>
      {children}
    </span>
  );
}

export function EmptySectionFallback({ message }: { message: string }) {
  return (
    <div className="py-12 text-center">
      <p className="text-sm opacity-50">{message}</p>
    </div>
  );
}
