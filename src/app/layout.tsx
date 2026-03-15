import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Huangting-Flux Dashboard",
  description: "Real-time analytics for the Huangting-Flux Agent Network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
