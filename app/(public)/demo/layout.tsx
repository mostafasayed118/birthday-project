import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Happy Birthday, Beautiful!",
  description:
    "A beautifully crafted birthday celebration page with love notes, photo gallery, timeline, and soundtrack — built with the Romantic Microsite Platform.",
  openGraph: {
    title: "Happy Birthday, Beautiful!",
    description:
      "A beautifully crafted birthday celebration page with love notes, photo gallery, timeline, and soundtrack.",
    type: "website",
    siteName: "Romantic Microsite Platform",
    images: [
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCG6bUEIpQmK2f7iQ8KkxWVfli2qeXci8d7UQA743QfFzZF9WzYg_tP2EWpR7gDaxwxK3ebxI63ALFAwU_amqmW9V6-cP5SVKA3Sly3gN98ntQb66s7L4rI_nRq9XhgjwveGZx0WDMvtMWpL1Nkph5aTjcepHHGofP9687wThKfPJXTp4WVf4uFp7N5NDGfMQahUoMc0lFQOWq-76g5fQ4UWDXYX4Gu9tMEMuWyYlrLWuTE6s-xI0IXNDwUGPxTA-z_R-A2ruV8wiLN",
        width: 1200,
        height: 630,
        alt: "Happy Birthday celebration page preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Birthday, Beautiful!",
    description:
      "A beautifully crafted birthday celebration page with love notes, photo gallery, timeline, and soundtrack.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCG6bUEIpQmK2f7iQ8KkxWVfli2qeXci8d7UQA743QfFzZF9WzYg_tP2EWpR7gDaxwxK3ebxI63ALFAwU_amqmW9V6-cP5SVKA3Sly3gN98ntQb66s7L4rI_nRq9XhgjwveGZx0WDMvtMWpL1Nkph5aTjcepHHGofP9687wThKfPJXTp4WVf4uFp7N5NDGfMQahUoMc0lFQOWq-76g5fQ4UWDXYX4Gu9tMEMuWyYlrLWuTE6s-xI0IXNDwUGPxTA-z_R-A2ruV8wiLN",
    ],
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
