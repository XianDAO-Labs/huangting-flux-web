"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || "https://web-production-c3cf.up.railway.app";
const WS_URL = HUB_URL.replace(/^https?/, (p) => (p === "https" ? "wss" : "ws"));

const TASK_LABEL: Record<string, string> = {
  complex_research: "深度研究",
  code_generation: "代码生成",
  multi_agent_coordination: "多智能体协调",
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
  const d = new Date(ts * 1000);
  return d.toTimeString().slice(0, 8);
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
          // ignore parse errors
        }
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
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
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(212,160,23,0.15)" }}>
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold" style={{ color: "#D4A017" }}>黄庭熔流</span>
          <span className="text-sm text-gray-400 hidden sm:inline">Huangting-Flux</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">首页</Link>
          <span className="flex items-center gap-1 font-semibold" style={{ color: "#D4A017" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            实时数据流
          </span>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold" style={{ color: "#D4A017" }}>实时数据流</h1>
          <p className="text-gray-400">全网 Agent 上报记录 · 真实活跃度透明呈现</p>
          <div className="flex items-center justify-center gap-6 text-sm mt-4">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-red-500"}`} />
              <span className={connected ? "text-green-400" : "text-red-400"}>
                {connected ? "WebSocket 已连接" : "正在重连..."}
              </span>
            </div>
            <div className="text-gray-500">
              本次会话收到 <span className="text-white font-mono">{totalCount}</span> 条记录
            </div>
          </div>
        </div>

        {/* Stream */}
        <div className="glass-card p-4 space-y-0">
          {/* Header row */}
          <div className="grid text-xs text-gray-500 pb-3 border-b border-gray-800 mb-3"
            style={{ gridTemplateColumns: "80px 110px 1fr 100px 100px 70px" }}>
            <span>时间</span>
            <span>Agent ID</span>
            <span>任务类型</span>
            <span className="text-right">节省 Token</span>
            <span className="text-right">基线 Token</span>
            <span className="text-right">节省率</span>
          </div>

          {events.length === 0 ? (
            <div className="py-16 text-center text-gray-600">
              <div className="text-4xl mb-3">⏳</div>
              <p>等待 Agent 上报数据...</p>
              <p className="text-xs mt-2">
                通过 SDK 发送一条测试数据：<br />
                <code className="text-gray-400">pip install huangting-soul</code>
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {events.map((ev) => {
                const ratio = ev.tokens_baseline > 0
                  ? Math.round((ev.tokens_saved / ev.tokens_baseline) * 100)
                  : null;
                const color = TASK_COLOR[ev.task_type] || "#D4A017";
                return (
                  <div key={ev.id}
                    className="live-item grid items-center text-sm py-2 border-b border-gray-900"
                    style={{ gridTemplateColumns: "80px 110px 1fr 100px 100px 70px" }}>
                    <span className="text-gray-500 font-mono text-xs">{formatTime(ev.ts)}</span>
                    <span className="font-mono text-xs" style={{ color }}>{ev.agent_id}</span>
                    <span className="text-gray-300 text-xs">
                      {TASK_LABEL[ev.task_type] || ev.task_type}
                    </span>
                    <span className="text-right font-mono text-xs text-white">
                      {ev.tokens_saved.toLocaleString()}
                    </span>
                    <span className="text-right font-mono text-xs text-gray-500">
                      {ev.tokens_baseline > 0 ? ev.tokens_baseline.toLocaleString() : "—"}
                    </span>
                    <span className="text-right font-mono text-xs text-green-400">
                      {ratio !== null ? `↓${ratio}%` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      <footer className="relative z-10 text-center py-8 text-gray-600 text-sm border-t border-gray-900">
        © 2025 XianDAO Labs · 黄庭协议 v7.6
      </footer>
    </div>
  );
}
