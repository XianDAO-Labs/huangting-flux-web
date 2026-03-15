import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HuangtingFlux | 修炼黄庭协议 · 减少 Token · 加速进化",
  description:
    "HuangtingFlux — AI Agent 能量网络。修炼黄庭协议，减少 Token 消耗，加速 Agent 进化。The AI Agent energy network powered by Huangting Protocol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
