"use client";

import type { SectionProps, VideoContent } from "@/lib/types";
import { SectionContainer, EmptySectionFallback } from "./primitives";

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
}

export function VideoSection({ content, theme }: SectionProps) {
  const c = content as VideoContent;

  if (!c.url) {
    return (
      <SectionContainer theme={theme}>
        <EmptySectionFallback message="No video URL set" />
      </SectionContainer>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(c.url) || getVimeoEmbedUrl(c.url);

  return (
    <SectionContainer theme={theme}>
      <div
        className="mx-auto overflow-hidden"
        style={{
          maxWidth: "800px",
          borderRadius: theme.borders.cardRadius,
          boxShadow: theme.effects.cardShadow,
        }}
      >
        {embedUrl ? (
          <div className="relative" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video"
              style={{ border: 0 }}
            />
          </div>
        ) : (
          <div className="relative">
            {c.thumbnail ? (
              <div
                className="w-full bg-cover bg-center"
                style={{ paddingBottom: "56.25%", borderRadius: theme.borders.cardRadius }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${c.thumbnail})` }}
                />
              </div>
            ) : (
              <div
                className="w-full flex items-center justify-center"
                style={{
                  paddingBottom: "56.25%",
                  backgroundColor: theme.colors.border,
                  position: "relative",
                }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span
                    style={{
                      fontSize: `${theme.typography.baseFontSize * 2}px`,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    &#9654;
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
