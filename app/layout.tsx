import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kora — the last meter of the notebook",
  description:
    "Photograph a Rwandan shop or rent book. NVIDIA Nemotron on Nebius Token Factory reads it. Code leaves unproven amounts blank. Nothing sends until you tap YES."
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
      <body>{children}</body>
    </html>
  );
}
