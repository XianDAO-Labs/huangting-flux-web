"use client";

import { useState, useEffect } from "react";
import { useFluxStream } from "@/hooks/useFluxStream";
import { api } from "@/lib/api";
import type { NetworkStats, LiveEvent } from "@/types";
import { STAGE_LABELS, STAGE_COLORS } from "@/types";
import Link from "next/link";
import { ArrowLeft, Wifi, WifiOff, Activity, Zap, Users, TrendingUp, Globe } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { formatDistanceToNow } from "date-fns";

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, sub, color = "gold"
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: "gold" | "jade" | "purple" | "slate";
}) {
  const colorMap = {
    gold: "text-gold-400",
    jade: "text-jade-400",
    purple: "text-purple-400",
    slate: "text-slate-400",
  };
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className={colorMap[color]} />
        <span className="text-slate-400 text-sm">{label}</span>
      </div>
      <div className={`text-3xl font-bold ${colorMap[color]} count-animate`}>{value}</div>
      {sub && <div className="text-slate-500 text-xs mt-1">{sub}</div>}
    </div>
  );
}

// ── Signal Feed Item ───────────────────────────────────────────────────────
function SignalItem({ event }: { event: LiveEvent }) {
  const isRegister = event.signal_type === "REGISTERED";
  const isBroadcast = event.signal_type === "BROADCAST";

  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-800/50 animate-fade-in">
      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
        isRegister ? "bg-jade-400" : isBroadcast ? "bg-gold-400" : "bg-slate-500"
      }`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white text-sm font-mono truncate max-w-[140px]">
            {event.network_address || event.agent_id}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isRegister
              ? "bg-jade-500/20 text-jade-400"
              : "bg-gold-500/20 text-gold-400"
          }`}>
            {event.signal_type}
          </span>
          {event.task_type && (
            <span className="text-xs text-slate-500">{event.task_type}</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
          {event.token_efficiency != null && (
            <span className="text-jade-400">
              {(event.token_efficiency * 100).toFixed(1)}% efficiency
            </span>
          )}
          {event.tokens_saved != null && event.tokens_saved > 0 && (
            <span>−{event.tokens_saved.toLocaleString()} tokens</span>
          )}
          {event.upgrade_stage && (
            <span style={{ color: STAGE_COLORS[event.upgrade_stage] }}>
              {STAGE_LABELS[event.upgrade_stage] || event.upgrade_stage}
            </span>
          )}
          <span>{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function LiveDashboard() {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [efficiencyHistory, setEfficiencyHistory] = useState<
    { time: string; efficiency: number; tokens_saved: number }[]
  >([]);

  // WebSocket live stream
  const { events, isConnected, connectionCount } = useFluxStream({
    maxEvents: 80,
    onSignal: (event) => {
      if (event.token_efficiency != null) {
        setEfficiencyHistory((prev) => {
          const next = [
            ...prev,
            {
              time: new Date(event.timestamp).toLocaleTimeString(),
              efficiency: Math.round(event.token_efficiency! * 100),
              tokens_saved: event.tokens_saved || 0,
            },
          ].slice(-30);
          return next;
        });
      }
    },
  });

  // Poll network stats every 10s
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getNetworkStats();
        setStats(data);
      } catch (e) {
        console.error("Failed to fetch stats:", e);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  // Stage distribution for pie chart
  const stageData = stats
    ? Object.entries(stats.stage_distribution).map(([stage, count]) => ({
        name: STAGE_LABELS[stage] || stage,
        value: count,
        color: STAGE_COLORS[stage] || "#64748b",
      }))
    : [];

  return (
    <div className="min-h-screen bg-void-950 text-slate-200">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-800/50 bg-void-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-gold-400" />
              <span className="font-semibold text-white">Huangting-Flux Live</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className={`flex items-center gap-1.5 ${isConnected ? "text-jade-400" : "text-slate-500"}`}>
              {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
              {isConnected ? `Live · ${connectionCount} viewers` : "Reconnecting..."}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Users}
            label="Total Agents"
            value={stats?.total_agents.toLocaleString() || "—"}
            sub={`${stats?.active_agents_24h || 0} active (24h)`}
            color="jade"
          />
          <StatCard
            icon={Zap}
            label="Tokens Saved"
            value={stats ? formatLargeNumber(stats.total_tokens_saved) : "—"}
            sub="cumulative"
            color="gold"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Efficiency"
            value={stats ? `${(stats.avg_token_efficiency * 100).toFixed(1)}%` : "—"}
            sub="token reduction"
            color="purple"
          />
          <StatCard
            icon={Globe}
            label="Total Signals"
            value={stats?.total_signals.toLocaleString() || "—"}
            sub={`${stats?.total_tasks_optimized.toLocaleString() || 0} tasks`}
            color="slate"
          />
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Efficiency History */}
          <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-400 live-dot"></span>
              Live Token Efficiency
            </h3>
            {efficiencyHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={efficiencyHistory}>
                  <defs>
                    <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} unit="%" />
                  <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                    labelStyle={{ color: "#94a3b8" }}
                    itemStyle={{ color: "#f59e0b" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fill="url(#effGrad)"
                    name="Efficiency %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-600 text-sm">
                Waiting for live signals...
              </div>
            )}
          </div>

          {/* Stage Distribution */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <h3 className="text-white font-medium mb-4">Stage Distribution</h3>
            {stageData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {stageData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                    itemStyle={{ color: "#e2e8f0" }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ color: "#94a3b8", fontSize: "12px" }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-600 text-sm">
                No data yet
              </div>
            )}
          </div>
        </div>

        {/* Live Signal Feed */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-jade-400 live-dot"></span>
              Live Signal Feed
            </h3>
            <span className="text-slate-500 text-xs">{events.length} events</span>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {events.length > 0 ? (
              events.map((event, i) => (
                <SignalItem key={`${event.signal_id}-${i}`} event={event} />
              ))
            ) : (
              <div className="py-12 text-center text-slate-600 text-sm">
                {isConnected
                  ? "Waiting for signals... Agents will appear here as they broadcast."
                  : "Connecting to live stream..."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatLargeNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
