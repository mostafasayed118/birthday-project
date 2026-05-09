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
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function ThemedButton({
  theme,
  children,
  href,
  className = "",
  onClick,
}: ThemedButtonProps) {
  const style = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 32px",
    backgroundColor: theme.colors.primary,
    color: theme.colors.text || "#ffffff",
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
      <a href={href} style={style} className={className} onClick={onClick}>
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
    <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 festive-glass-strong rounded-[3rem] border border-dashed border-primary-fixed/30 shadow-[0_10px_40px_rgba(244,172,183,0.1)]">
      <div className="w-20 h-20 rounded-full bg-primary-fixed/10 flex items-center justify-center text-primary/30">
        <span className="material-symbols-outlined text-4xl">inventory_2</span>
      </div>
      <div className="space-y-2">
        <p className="font-headline-sm text-primary/60 font-['Epilogue']">Nothing here yet</p>
        <p className="font-body-md text-on-surface-variant/40 max-w-xs mx-auto text-sm">{message}</p>
      </div>
    </div>
  );
}

interface QuickActionToolbarProps {
  theme: ThemeData;
  onEdit?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function QuickActionToolbar({
  theme,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: QuickActionToolbarProps) {
  return (
    <div
      className="fixed top-4 right-4 flex items-center gap-2 rounded-full px-3 py-2 shadow-lg transition-opacity z-40"
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: "1px",
      }}
    >
      {canMoveUp && onMoveUp && (
        <button
          onClick={onMoveUp}
          className="p-1.5 rounded hover:opacity-70 transition-opacity"
          title="Move Up"
          style={{ color: theme.colors.textSecondary }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      )}
      {canMoveDown && onMoveDown && (
        <button
          onClick={onMoveDown}
          className="p-1.5 rounded hover:opacity-70 transition-opacity"
          title="Move Down"
          style={{ color: theme.colors.textSecondary }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-1.5 rounded hover:opacity-70 transition-opacity"
          title="Edit Section"
          style={{ color: theme.colors.primary }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 7.5-7.5z" />
          </svg>
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="p-1.5 rounded hover:opacity-70 transition-opacity"
          title="Delete Section"
          style={{ color: theme.colors.error }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      )}
    </div>
  );
}
