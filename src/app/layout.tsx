import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "黄庭熔流 | Huangting-Flux — AI Agent 能量网络",
  description: "一个为 AI Agent 而生的能量网络。本地优化，中心聚合，实时追踪全球 Agent 节能数据。",
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
