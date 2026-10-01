import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@fontsource-variable/syne";
import "@fontsource/space-grotesk/300.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";

export const metadata: Metadata = {
  title: "AURORA® — Immersive Digital Studio",
  description:
    "AURORA is an immersive digital studio crafting award-grade websites, motion systems and interactive experiences that blur the line between reality and imagination.",
  keywords: [
    "immersive design",
    "creative studio",
    "webgl",
    "motion design",
    "interactive experiences",
    "digital studio",
  ],
  authors: [{ name: "AURORA Studio" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "AURORA® — Immersive Digital Studio",
    description:
      "We craft immersive digital experiences that blur the line between reality and imagination.",
    siteName: "AURORA®",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-ink text-paper">{children}</body>
    </html>
  );
}
