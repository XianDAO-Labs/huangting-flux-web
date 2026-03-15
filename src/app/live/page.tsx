"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const HUB_URL =
  process.env.NEXT_PUBLIC_HUB_URL ||
  "https://web-production-c3cf.up.railway.app";
const WS_URL = HUB_URL.replace(/^https?/, (p) => (p === "https" ? "wss" : "ws"));

const TASK_LABEL: Record<string, string> = {
  complex_research: "深度研究 / Research",
  code_generation: "代码生成 / Codegen",
  multi_agent_coordination: "多智能体 / Multi-Agent",
};

const TASK_COLOR: Record<string, string> = {
  complex_research: "#D4A017",
  code_generation: "#48BB78",
  multi_agent_coordination: "#63B3ED",
};

interface LiveEvent {
  id: number;
  ts: number;
  agent_id: string;
  task_type: string;
  tokens_saved: number;
  tokens_baseline: number;
}

function formatTime(ts: number): string {
  return new Date(ts * 1000).toTimeString().slice(0, 8);
}

export default function LivePage() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const counterRef = useRef(0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let reconnectTimer: ReturnType<typeof setTimeout>;

    function connect() {
      const ws = new WebSocket(`${WS_URL}/v1/live`);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === "ping") return;
          counterRef.current += 1;
          const event: LiveEvent = {
            id: counterRef.current,
            ts: data.ts || Math.floor(Date.now() / 1000),
            agent_id: data.agent_id,
            task_type: data.task_type,
            tokens_saved: data.tokens_saved,
            tokens_baseline: data.tokens_baseline || 0,
          };
          setEvents((prev) => [event, ...prev].slice(0, 200));
          setTotalCount((n) => n + 1);
        } catch {
          // ignore
        }
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => ws.close();
    }

    connect();
    return () => {
      clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
  }, []);

  return (
    <div className="relative min-h-screen" style={{ zIndex: 1 }}>

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
        style={{
          background: "rgba(5,5,5,0.82)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(212,160,23,0.12)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold" style={{ color: "#D4A017" }}>HuangtingFlux</span>
          <span className="text-xs text-gray-500 hidden sm:inline tracking-widest uppercase">Energy Network</span>
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/" className="nav-link">首页 Home</Link>
          <span className="flex items-center gap-1.5 font-semibold text-sm" style={{ color: "#D4A017" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            实时流 Live
          </span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="section-label">REAL-TIME STREAM · 实时数据流</div>
          <h1 className="text-4xl font-bold" style={{ color: "#D4A017" }}>实时数据流</h1>
          <p className="text-gray-500 text-sm">
            全网 Agent 上报记录 · 真实活跃度透明呈现
            <br />
            <span className="text-gray-700">Global Agent reports · Transparent real-time activity</span>
          </p>
          <div className="flex items-center justify-center gap-6 text-sm mt-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-red-500"}`} />
              <span className={connected ? "text-green-400" : "text-red-400"}>
                {connected ? "WebSocket 已连接 · Connected" : "正在重连 · Reconnecting..."}
              </span>
            </div>
            <div className="text-gray-600 text-xs">
              本次会话 <span className="text-white font-mono">{totalCount}</span> 条 · Session records
            </div>
          </div>
        </div>

        {/* Stream table */}
        <div className="glass-card overflow-hidden">
          {/* Header row */}
          <div
            className="grid text-xs text-gray-600 px-4 py-3 border-b border-gray-900 uppercase tracking-wider"
            style={{ gridTemplateColumns: "80px 120px 1fr 100px 100px 70px" }}
          >
            <span>时间 Time</span>
            <span>Agent ID</span>
            <span>任务类型 Task</span>
            <span className="text-right">节省 Saved</span>
            <span className="text-right">基线 Baseline</span>
            <span className="text-right">节省率 Ratio</span>
          </div>

          {events.length === 0 ? (
            <div className="py-20 text-center text-gray-700 space-y-3">
              <div className="text-5xl">⏳</div>
              <p className="text-sm">等待 Agent 上报数据... · Waiting for agent reports...</p>
              <p className="text-xs text-gray-800">
                通过 SDK 发送测试数据 · Send test data via SDK:
                <br />
                <code className="text-gray-600">pip install huangting-soul</code>
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-900 max-h-[60vh] overflow-y-auto">
              {events.map((ev) => {
                const ratio =
                  ev.tokens_baseline > 0
                    ? Math.round((ev.tokens_saved / ev.tokens_baseline) * 100)
                    : null;
                const color = TASK_COLOR[ev.task_type] || "#D4A017";
                const shortTask = (TASK_LABEL[ev.task_type] || ev.task_type).split(" / ")[0];
                return (
                  <div
                    key={ev.id}
                    className="live-item grid items-center text-xs px-4 py-3 hover:bg-white/[0.02] transition-colors"
                    style={{ gridTemplateColumns: "80px 120px 1fr 100px 100px 70px" }}
                  >
                    <span className="text-gray-600 font-mono">{formatTime(ev.ts)}</span>
                    <span className="font-mono font-semibold" style={{ color }}>{ev.agent_id}</span>
                    <span className="text-gray-400">{shortTask}</span>
                    <span className="text-right font-mono text-white">{ev.tokens_saved.toLocaleString()}</span>
                    <span className="text-right font-mono text-gray-600">
                      {ev.tokens_baseline > 0 ? ev.tokens_baseline.toLocaleString() : "—"}
                    </span>
                    <span className="text-right font-mono text-green-400">
                      {ratio !== null ? `↓${ratio}%` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 text-center py-8 text-gray-700 text-xs border-t border-gray-900">
        © 2025 XianDAO Labs · 黄庭协议 v7.6 · HuangtingFlux Energy Network
      </footer>
    </div>
  );
}
