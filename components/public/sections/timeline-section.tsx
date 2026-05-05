"use client";

import type { SectionProps, TimelineContent } from "@/lib/types";
import { SectionContainer, SectionHeading, EmptySectionFallback } from "./primitives";

export function TimelineSection({ content, theme }: SectionProps) {
  const c = content as TimelineContent;

  if (!c.events || c.events.length === 0) {
    return (
      <SectionContainer theme={theme}>
        {c.heading && (
          <SectionHeading theme={theme}>{c.heading}</SectionHeading>
        )}
        <EmptySectionFallback message="No events in timeline yet" />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer theme={theme}>
      {c.heading && (
        <SectionHeading theme={theme}>{c.heading}</SectionHeading>
      )}

      <div className="relative mt-12">
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
          style={{ backgroundColor: theme.colors.border, transform: "translateX(-50%)" }}
        />
        <div
          className="absolute left-4 top-0 bottom-0 w-px md:hidden"
          style={{ backgroundColor: theme.colors.border }}
        />

        <div className="space-y-12">
          {c.events.map((event, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={event.id}
                className={`relative flex flex-col md:flex-row ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                } items-start gap-4 md:gap-8`}
              >
                <div
                  className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full border-2 hidden md:block"
                  style={{
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.primary,
                    top: "8px",
                    transform: "translateX(-50%)",
                  }}
                />
                <div
                  className="absolute left-2.5 md:hidden w-3 h-3 rounded-full border-2"
                  style={{
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.primary,
                    top: "8px",
                  }}
                />

                <div
                  className={`flex-1 pl-10 md:pl-0 ${
                    isLeft ? "md:text-right md:pr-12" : "md:text-left md:pl-12"
                  }`}
                >
                  {c.showDates && event.date && (
                    <time
                      className="block mb-1"
                      style={{
                        fontSize: `${theme.typography.baseFontSize * 0.85}px`,
                        color: theme.colors.primary,
                        fontWeight: "500",
                      }}
                    >
                      {new Date(event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  )}

                  <h3
                    style={{
                      fontFamily: `'${theme.typography.headingFont}', serif`,
                      fontWeight: theme.typography.headingWeight,
                      fontSize: `${theme.typography.baseFontSize * 1.15}px`,
                      color: theme.colors.text,
                      marginBottom: "4px",
                    }}
                  >
                    {event.title}
                  </h3>

                  {event.description && (
                    <p
                      style={{
                        fontSize: `${theme.typography.baseFontSize * 0.95}px`,
                        lineHeight: theme.typography.lineHeight,
                        color: theme.colors.textSecondary,
                      }}
                    >
                      {event.description}
                    </p>
                  )}
                </div>

                <div className="flex-1 hidden md:block" />
              </div>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
}
