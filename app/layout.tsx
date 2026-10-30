import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const title = "Kora — the last meter of the notebook";
const description =
  "Photograph a Rwandan shop or rent book. NVIDIA Nemotron on Nebius Token Factory reads it. Code leaves unproven amounts blank. Nothing sends until you tap YES.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title,
  description,
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary_large_image", title, description }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <div className="shell">
          <SiteHeader />
        </div>
        <div id="content">{children}</div>
      </body>
    </html>
  );
}
