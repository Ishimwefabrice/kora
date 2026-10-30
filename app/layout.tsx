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
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,550;1,6..72,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
