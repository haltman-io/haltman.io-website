import type { Metadata } from "next";
import { JetBrains_Mono, Oxanium } from "next/font/google";
import { BackgroundFX } from "@/components/background-fx";
import { SiteHeader } from "@/components/site-header";
import "@/styles/globals.css";

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const display = Oxanium({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://haltman.io"),
  title: {
    default:
      "Haltman.io — Independent Brazilian Hackers | Privacy, Free Software & Infrastructure",
    template: "%s | Haltman.io",
  },
  description:
    "Haltman.io is an independent group of Brazilian hackers. Friends for over a decade, building public, privacy-first infrastructure and free software. No hype. No funding. No contracts.",
  keywords: [
    "Haltman",
    "haltman.io",
    "Brazilian hackers",
    "hacker collective",
    "hacker ethic",
    "free software",
    "privacy",
    "privacy-first",
    "mail forwarding",
    "email aliases",
    "cybersecurity",
    "offensive security",
    "infrastructure",
    "independent hackers",
  ],
  authors: [{ name: "Haltman.io" }],
  referrer: "strict-origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: {
    canonical: "https://haltman.io/",
  },
  openGraph: {
    siteName: "Haltman.io",
    type: "website",
    title: "Haltman.io — Independent Brazilian Hackers",
    description:
      "An independent Brazilian hacker group. Built by long-time friends. We publish public, privacy-first infrastructure and free software. No affiliation. No hiring. No compromise.",
    url: "https://haltman.io/",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        alt: "Haltman.io — Independent Brazilian Hackers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Haltman.io — Independent Brazilian Hackers",
    description:
      "Independent Brazilian hackers. Friends for 10+ years. Public infrastructure, privacy-first services, free software. No hype. No funding. No contracts.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  other: {
    "color-scheme": "dark light",
    "theme-color": "#0f0f10",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mono.variable} ${display.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://haltman.io/#org",
                  name: "Haltman.io",
                  url: "https://haltman.io/",
                  description:
                    "Independent Brazilian hacker collective focused on privacy, free software and public infrastructure.",
                  email: "abuse@haltman.io",
                  sameAs: [
                    "https://github.com/haltman-io",
                    "https://t.me/haltman_group",
                  ],
                  contactPoint: [
                    {
                      "@type": "ContactPoint",
                      contactType: "abuse",
                      email: "abuse@haltman.io",
                    },
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://haltman.io/#website",
                  url: "https://haltman.io/",
                  name: "Haltman.io",
                  publisher: { "@id": "https://haltman.io/#org" },
                },
                {
                  "@type": "WebApplication",
                  "@id": "https://forward.haltman.io/#app",
                  name: "Haltman Free Mail Forwarding",
                  url: "https://forward.haltman.io/",
                  applicationCategory: "SecurityApplication",
                  operatingSystem: "Any",
                  description:
                    "Free mail forwarding service. Create aliases like handle@domain and forward mail without surveillance or tracking.",
                  publisher: { "@id": "https://haltman.io/#org" },
                },
              ],
            }),
          }}
        />
        <BackgroundFX />
        <a
          href="#content"
          className="sr-only fixed left-4 top-4 z-50 rounded bg-black px-3 py-2 text-xs text-white focus:not-sr-only"
        >
          Skip to content
        </a>
        <div className="relative z-10 min-h-screen">
          <SiteHeader />
          <main
            id="content"
            className="mx-auto mt-6 w-full max-w-[1200px] px-4 pb-16 sm:px-6 lg:px-8"
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
