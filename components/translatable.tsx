"use client";

import { useContentKey } from "@/hooks/use-content";

interface TranslatableProps {
  id: string;
  locale?: string;
  className?: string;
  fallback?: string;
  children?: (text: string) => React.ReactNode;
}

export function Translatable({
  id,
  locale,
  className,
  fallback,
  children,
}: TranslatableProps) {
  const text = useContentKey(id, locale);
  const displayText = text || fallback || id;

  if (children) {
    return <>{children(displayText)}</>;
  }

  return (
    <span className={className}>{displayText}</span>
  );
}