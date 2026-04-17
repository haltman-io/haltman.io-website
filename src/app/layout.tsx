import type { Metadata } from "next";
import { JetBrains_Mono, Oxanium, Space_Grotesk } from "next/font/google";
import { BackgroundFX } from "@/components/background-fx";
import { SiteHeader } from "@/components/site-header";
import {
  DEFAULT_OG_IMAGE,
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
  SITE_NAME,
  SITE_TITLE_TEMPLATE,
  SITE_URL,
} from "@/lib/seo";
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

const sans = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_DEFAULT_TITLE,
    template: SITE_TITLE_TEMPLATE,
  },
  description: SITE_DEFAULT_DESCRIPTION,
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
  authors: [{ name: SITE_NAME }],
  referrer: "strict-origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    title: {
      default: SITE_DEFAULT_TITLE,
      template: SITE_TITLE_TEMPLATE,
    },
    description: SITE_DEFAULT_DESCRIPTION,
    url: `${SITE_URL}/`,
    locale: "en_US",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: `${SITE_NAME} — Independent Brazilian Hackers`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: SITE_DEFAULT_TITLE,
      template: SITE_TITLE_TEMPLATE,
    },
    description: SITE_DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
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
      <body
        className={`${mono.variable} ${display.variable} ${sans.variable}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://haltman.io/#org",
                  name: "Haltman.IO",
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
                  name: "Haltman.IO",
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
          <main id="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
