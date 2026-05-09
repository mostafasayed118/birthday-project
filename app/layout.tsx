import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://romantic-microsite.vercel.app"),
  title: {
    default: "Romantic Microsite Platform — Create Beautiful Love Pages",
    template: "%s | Romantic Microsite Platform",
  },
  description:
    "Build stunning, customizable romantic microsites for anniversaries, proposals, Valentine's Day, and more. Full content and design control with live preview.",
  openGraph: {
    title: "Romantic Microsite Platform",
    description:
      "Create beautiful, configurable romantic microsites with full control over content, design, and layout.",
    type: "website",
    siteName: "Romantic Microsite Platform",
    images: [
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCG6bUEIpQmK2f7iQ8KkxWVfli2qeXci8d7UQA743QfFzZF9WzYg_tP2EWpR7gDaxwxK3ebxI63ALFAwU_amqmW9V6-cP5SVKA3Sly3gN98ntQb66s7L4rI_nRq9XhgjwveGZx0WDMvtMWpL1Nkph5aTjcepHHGofP9687wThKfPJXTp4WVf4uFp7N5NDGfMQahUoMc0lFQOWq-76g5fQ4UWDXYX4Gu9tMEMuWyYlrLWuTE6s-xI0IXNDwUGPxTA-z_R-A2ruV8wiLN",
        width: 1200,
        height: 630,
        alt: "Romantic Microsite Platform — Create beautiful love pages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Romantic Microsite Platform",
    description:
      "Create beautiful, configurable romantic microsites with full control over content, design, and layout.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
