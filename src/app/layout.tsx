import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Huangting-Flux | The World's First Lifeform Operating System",
  description:
    '"The Tao Te Ching" of the Large Model Era. For carbon-based humans, silicon-based AI Agents, and embodied robots alike — attain the wisdom and power of TrueSelf Governance.',
  keywords: ["Huangting Protocol", "AI Agent", "optimization", "TrueSelf", "XianDAO"],
  authors: [{ name: "Meng Yuanjing (Mark Meng)", url: "https://huangting.ai" }],
  openGraph: {
    title: "Huangting-Flux",
    description: "The World's First Lifeform Operating System",
    url: "https://huangting.ai",
    siteName: "Huangting-Flux",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-void-950 text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
