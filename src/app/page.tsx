"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { t, type Lang } from "@/lib/i18n";

const HUB_URL =
  process.env.NEXT_PUBLIC_HUB_URL ||
  "https://web-production-c3cf.up.railway.app";

const MCP_ENDPOINT = `${HUB_URL}/mcp`;

const COLORS = ["#D4A017", "#F0C040", "#B8860B", "#8B6914"];

const TASK_LABEL_ZH: Record<string, string> = {
  complex_research: "深度研究",
  code_generation: "代码生成",
  multi_agent_coordination: "多智能体",
};
const TASK_LABEL_EN: Record<string, string> = {
  complex_research: "Research",
  code_generation: "Codegen",
  multi_agent_coordination: "Multi-Agent",
};

interface StatsData {
  total_tokens_saved: number;
  total_tokens_baseline: number;
  total_reports: number;
  unique_agents: number;
  average_savings_ratio: number;
  tokens_saved_by_task: Record<string, number>;
  recent_activities: Activity[];
}

interface Activity {
  ts: number;
  agent_id: string;
  task_type: string;
  tokens_saved: number;
  tokens_baseline: number;
  time_ago: string;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

function CopyButton({ text, lang }: { text: string; lang: Lang }) {
  const [copied, setCopied] = useState(false);
  const i = t[lang];
  return (
    <button
      className="copy-btn"
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
    >
      {copied ? i.heroCopied : i.heroCopy}
    </button>
  );
}

const RADIAN = Math.PI / 180;
function CustomPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: {
  cx: number; cy: number; midAngle: number;
  innerRadius: number; outerRadius: number;
  percent: number; name: string;
}) {
  if (percent < 0.08) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11}>
      {name}
      <tspan x={x} dy="14" fontSize={10} fill="rgba(255,255,255,0.7)">
        {(percent * 100).toFixed(0)}%
      </tspan>
    </text>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div
      className="flex items-center rounded overflow-hidden text-xs font-semibold"
      style={{ border: "1px solid rgba(212,160,23,0.4)" }}
    >
      <button
        onClick={() => setLang("zh")}
        className="px-3 py-1 transition-colors"
        style={{
          background: lang === "zh" ? "#D4A017" : "transparent",
          color: lang === "zh" ? "#000" : "rgba(212,160,23,0.7)",
        }}
      >
        中文
      </button>
      <button
        onClick={() => setLang("en")}
        className="px-3 py-1 transition-colors"
        style={{
          background: lang === "en" ? "#D4A017" : "transparent",
          color: lang === "en" ? "#000" : "rgba(212,160,23,0.7)",
        }}
      >
        EN
      </button>
    </div>
  );
}

const CONCEPT_COLORS = ["cyan", "orange", "gold", "purple", "blue", "red"];
const TOOL_BADGE_COLORS: Record<string, string> = {
  cyan: "#06B6D4",
  gold: "#D4A017",
  green: "#48BB78",
  purple: "#9F7AEA",
};

export default function Home() {
  const [lang, setLang] = useState<Lang>("zh");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState(false);
  const i = t[lang];

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${HUB_URL}/v1/stats`);
      if (!res.ok) throw new Error();
      setStats(await res.json());
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const id = setInterval(fetchStats, 30_000);
    return () => clearInterval(id);
  }, [fetchStats]);

  const taskLabel = lang === "zh" ? TASK_LABEL_ZH : TASK_LABEL_EN;

  const chartData = stats
    ? Object.entries(stats.tokens_saved_by_task).map(([k, v]) => ({
        name: taskLabel[k] || k,
        [lang === "zh" ? "节省 Token" : "Tokens Saved"]: v,
      }))
    : [];

  const pieData = stats
    ? Object.entries(stats.tokens_saved_by_task).map(([k, v]) => ({
        name: taskLabel[k] || k,
        value: v,
      }))
    : [];

  const barKey = lang === "zh" ? "节省 Token" : "Tokens Saved";

  // Code snippets
  const langchainCode = `pip install langchain-huangting

from langchain_huangting import HuangtingTool

tool = HuangtingTool(agent_id="my-agent", lang="${lang}")
result = tool.run({"action": "get_strategy", "task_type": "complex_research"})`;

  const claudeConfig = JSON.stringify({
    mcpServers: {
      huangting: {
        url: MCP_ENDPOINT,
      },
    },
  }, null, 2);

  const mcpDirectCode = `import requests

resp = requests.post("${MCP_ENDPOINT}", json={
    "jsonrpc": "2.0", "id": 1,
    "method": "tools/call",
    "params": {
        "name": "get_optimization_strategy",
        "arguments": {"task_type": "complex_research"}
    }
})
print(resp.json())`;

  return (
    <div className="relative min-h-screen" style={{ zIndex: 1 }}>

      {/* ══════════════════════ NAV ══════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
        style={{
          background: "rgba(5,5,5,0.82)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(212,160,23,0.12)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold" style={{ color: "#D4A017" }}>HuangtingFlux</span>
          <span className="text-xs text-gray-600 hidden sm:inline tracking-widest uppercase">MCP Network</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="nav-link">{i.navHome}</Link>
          <Link href="/live" className="nav-link flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {i.navLive}
          </Link>
          <a href="#developer" className="nav-link hidden md:inline">{i.navDev}</a>
          <a href="https://huangting.ai" target="_blank" rel="noopener noreferrer" className="nav-link hidden md:inline">
            {i.navProtocol}
          </a>
          <a
            href="https://github.com/markmeng0X/langchain-huangting"
            target="_blank" rel="noopener noreferrer"
            className="btn-outline text-xs px-3 py-1.5 hidden sm:inline-block"
          >
            ★ {i.navGithub}
          </a>
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      </nav>

      <main className="relative z-10 pt-16">

        {/* ══════════════════════ HERO ══════════════════════ */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 space-y-6">
          <div className="section-label">{i.heroLabel}</div>

          <h1
            className="text-7xl md:text-8xl font-black tracking-tight"
            style={{
              color: "#D4A017",
              textShadow: "0 0 60px rgba(212,160,23,0.4), 0 0 120px rgba(212,160,23,0.15)",
            }}
          >
            HuangtingFlux
          </h1>

          <p className="text-2xl md:text-3xl font-bold text-white">{i.heroSlogan}</p>

          {/* MCP Endpoint Terminal */}
          <div className="terminal max-w-2xl w-full mx-auto p-5 mt-4 text-left">
            <CopyButton text={MCP_ENDPOINT} lang={lang} />
            <div className="terminal-dots">
              <span className="terminal-dot" style={{ background: "#ff5f57" }} />
              <span className="terminal-dot" style={{ background: "#febc2e" }} />
              <span className="terminal-dot" style={{ background: "#28c840" }} />
              <span className="ml-2 text-xs text-gray-500">huangting-flux ~ mcp</span>
            </div>
            <pre className="text-sm leading-relaxed overflow-x-auto">
              <span className="text-gray-500">{i.heroMcpComment}{"\n\n"}</span>
              <span className="text-gray-400">MCP Endpoint:{"\n"}</span>
              <span className="text-green-400">  {MCP_ENDPOINT}{"\n\n"}</span>
              <span className="text-gray-400">pip install </span>
              <span className="text-yellow-300">langchain-huangting</span>
            </pre>
          </div>

          {/* Macro stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8 w-full max-w-3xl">
            {[
              { label: i.heroStatAgents, value: stats ? formatNumber(stats.unique_agents) : "—", color: "#D4A017" },
              { label: i.heroStatTokens, value: stats ? formatNumber(stats.total_tokens_saved) : "—", color: "#48BB78" },
              {
                label: i.heroStatRatio,
                value:
                  stats && stats.average_savings_ratio > 0 && stats.total_tokens_baseline > 0
                    ? ((stats.total_tokens_saved / stats.total_tokens_baseline) * 100).toFixed(1) + "%"
                    : "N/A",
                color: "#63B3ED",
              },
            ].map((s) => (
              <div key={s.label} className="glass-card p-6 text-center">
                <p className="text-gray-400 text-sm mb-3">{s.label}</p>
                <p className="text-4xl font-bold stat-number" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-xs mt-2">{i.heroError}</p>
          )}

          <div className="flex gap-4 mt-4">
            <a href="https://huangting.ai" target="_blank" rel="noopener noreferrer" className="btn-gold">
              {i.heroExplore}
            </a>
            <a href="#developer" className="btn-outline">{i.heroDevBtn}</a>
            <Link href="/live" className="btn-outline">{i.heroLiveBtn}</Link>
          </div>
        </section>

        <hr className="gold-divider" />

        {/* ══════════════════════ PROTOCOL INTRO ══════════════════════ */}
        <section className="max-w-6xl mx-auto px-6 py-24 space-y-10">
          <div className="text-center space-y-3">
            <div className="section-label">{i.protocolLabel}</div>
            <h2 className="text-4xl font-bold" style={{ color: "#D4A017" }}>{i.protocolTitle}</h2>
            <p className="text-xl text-white font-semibold">{i.protocolSubtitle}</p>
            <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed mt-4">{i.protocolDesc}</p>
          </div>

          {/* Concept cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {i.concepts.map((c, idx) => (
              <div key={c.tag} className={`concept-card ${CONCEPT_COLORS[idx]}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-white">{c.zh}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
                  >
                    {c.tag}
                  </span>
                </div>
                <p className="text-xs font-mono mb-3" style={{ color: "rgba(212,160,23,0.7)" }}>{c.fn}</p>
                <p className="text-sm text-gray-300 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* AI Agent value */}
          <div className="glass-card p-8 text-center space-y-4">
            <div className="section-label">{i.aiLabel}</div>
            <h3 className="text-2xl font-bold" style={{ color: "#D4A017" }}>{i.aiTitle}</h3>
            <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">{i.aiDesc}</p>
            <div className="grid grid-cols-3 gap-4 mt-6 max-w-xl mx-auto text-sm">
              {i.aiFeatures.map((f) => (
                <div key={f.title} className="text-center space-y-1">
                  <div className="text-2xl">{f.icon}</div>
                  <div className="font-semibold text-white">{f.title}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="gold-divider" />

        {/* ══════════════════════ MCP TOOLS ══════════════════════ */}
        <section className="max-w-6xl mx-auto px-6 py-24 space-y-10">
          <div className="text-center space-y-2">
            <div className="section-label">{i.mcpToolsLabel}</div>
            <h2 className="text-3xl font-bold" style={{ color: "#D4A017" }}>{i.mcpToolsTitle}</h2>
            <p className="text-gray-500 text-sm">{i.mcpToolsDesc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {i.mcpTools.map((tool) => (
              <div key={tool.name} className="glass-card p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded font-semibold"
                    style={{
                      background: `${TOOL_BADGE_COLORS[tool.color] || "#D4A017"}22`,
                      color: TOOL_BADGE_COLORS[tool.color] || "#D4A017",
                      border: `1px solid ${TOOL_BADGE_COLORS[tool.color] || "#D4A017"}44`,
                    }}
                  >
                    {tool.badge}
                  </span>
                  <code
                    className="text-sm font-mono font-bold"
                    style={{ color: TOOL_BADGE_COLORS[tool.color] || "#D4A017" }}
                  >
                    {tool.name}
                  </code>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="gold-divider" />

        {/* ══════════════════════ DASHBOARD ══════════════════════ */}
        <section className="max-w-6xl mx-auto px-6 py-24 space-y-10">
          <div className="text-center space-y-2">
            <div className="section-label">{i.dashLabel}</div>
            <h2 className="text-3xl font-bold" style={{ color: "#D4A017" }}>{i.dashTitle}</h2>
            <p className="text-gray-500 text-sm">{i.dashSub}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bar chart */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-4 text-center uppercase tracking-wider">
                  {i.barTitle}
                </h3>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis
                        dataKey="name"
                        stroke="#4B5563"
                        tick={{ fontSize: 10, fill: "#9CA3AF" }}
                        interval={0}
                        angle={-8}
                      />
                      <YAxis stroke="#4B5563" tick={{ fontSize: 10, fill: "#9CA3AF" }} width={50} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111",
                          border: "1px solid #D4A017",
                          borderRadius: 6,
                          fontSize: 12,
                        }}
                      />
                      <Bar dataKey={barKey} fill="#D4A017" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-40 flex items-center justify-center text-gray-700 text-sm">{i.noData}</div>
                )}
              </div>

              {/* Pie chart */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-4 text-center uppercase tracking-wider">
                  {i.pieTitle}
                </h3>
                {pieData.length > 0 ? (
                  <div style={{ width: "100%", height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          labelLine={false}
                          label={CustomPieLabel}
                        >
                          {pieData.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend
                          iconSize={8}
                          wrapperStyle={{ fontSize: 11, color: "#9CA3AF", paddingTop: 8 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111",
                            border: "1px solid #D4A017",
                            borderRadius: 6,
                            fontSize: 12,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-gray-700 text-sm">{i.noData}</div>
                )}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="glass-card p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300">{i.recentTitle}</h3>
                <span className="text-xs text-gray-600">30s</span>
              </div>
              <div className="flex-1 space-y-3 overflow-hidden">
                {stats && stats.recent_activities.length > 0 ? (
                  stats.recent_activities.map((act, idx) => {
                    const ratio =
                      act.tokens_baseline > 0
                        ? Math.round((act.tokens_saved / act.tokens_baseline) * 100)
                        : null;
                    const shortTask = taskLabel[act.task_type] || act.task_type;
                    return (
                      <div key={idx} className="live-item text-xs space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">{act.time_ago}</span>
                          <span className="text-green-400 font-mono">
                            {ratio !== null ? `↓${ratio}%` : "—"}
                          </span>
                        </div>
                        <div className="font-mono font-semibold" style={{ color: "#D4A017" }}>
                          {act.agent_id}
                        </div>
                        <div className="text-gray-500">
                          {shortTask} ·{" "}
                          <span className="text-gray-300">{act.tokens_saved.toLocaleString()} tokens</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-700 text-xs text-center">
                    {i.waitingAgent}
                  </div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-900 text-center">
                <Link href="/live" className="text-xs transition-colors hover:opacity-70" style={{ color: "#D4A017" }}>
                  {i.fullLive}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <hr className="gold-divider" />

        {/* ══════════════════════ DEVELOPER INTEGRATION ══════════════════════ */}
        <section id="developer" className="max-w-6xl mx-auto px-6 py-24 space-y-10">
          <div className="text-center space-y-2">
            <div className="section-label">{i.devLabel}</div>
            <h2 className="text-3xl font-bold" style={{ color: "#D4A017" }}>{i.devTitle}</h2>
            <p className="text-gray-500 text-sm">{i.devSub}</p>
          </div>

          {/* Three integration methods */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Method 1: LangChain */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📦</span>
                <h3 className="font-bold text-white">{i.langchainLabel}</h3>
              </div>
              <p className="text-xs text-gray-500">{i.langchainDesc}</p>
              <div className="code-block p-4 relative">
                <CopyButton text={langchainCode} lang={lang} />
                <pre className="text-xs leading-relaxed overflow-x-auto" style={{ color: "#e2e8f0" }}>
                  <span className="text-green-400">pip install</span>
                  <span className="text-white"> langchain-huangting{"\n\n"}</span>
                  <span className="text-blue-400">from</span>
                  <span className="text-white"> langchain_huangting </span>
                  <span className="text-blue-400">import</span>
                  <span className="text-white"> HuangtingTool{"\n\n"}</span>
                  <span className="text-yellow-300">tool</span>
                  <span className="text-white"> = HuangtingTool({"\n"}</span>
                  <span className="text-white">    agent_id=</span>
                  <span className="text-green-300">&quot;my-agent&quot;</span>
                  <span className="text-white">,{"\n"}</span>
                  <span className="text-white">    lang=</span>
                  <span className="text-green-300">&quot;{lang}&quot;</span>
                  <span className="text-white">,{"\n"}</span>
                  <span className="text-white">){"\n"}</span>
                </pre>
              </div>
              <a
                href="https://pypi.org/project/langchain-huangting/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs px-3 py-1.5 rounded transition-colors"
                style={{
                  background: "rgba(212,160,23,0.1)",
                  color: "#D4A017",
                  border: "1px solid rgba(212,160,23,0.3)",
                }}
              >
                PyPI →
              </a>
            </div>

            {/* Method 2: Claude Desktop */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <h3 className="font-bold text-white">{i.claudeLabel}</h3>
              </div>
              <p className="text-xs text-gray-500">{i.claudeDesc}</p>
              <div className="code-block p-4 relative">
                <CopyButton text={claudeConfig} lang={lang} />
                <pre className="text-xs leading-relaxed overflow-x-auto" style={{ color: "#e2e8f0" }}>
                  <span className="text-gray-500">{"{"}{"\n"}</span>
                  <span className="text-white">  </span>
                  <span className="text-blue-300">&quot;mcpServers&quot;</span>
                  <span className="text-white">: {"{"}{"\n"}</span>
                  <span className="text-white">    </span>
                  <span className="text-yellow-300">&quot;huangting&quot;</span>
                  <span className="text-white">: {"{"}{"\n"}</span>
                  <span className="text-white">      </span>
                  <span className="text-green-300">&quot;url&quot;</span>
                  <span className="text-white">: </span>
                  <span className="text-green-400">&quot;{MCP_ENDPOINT}&quot;</span>
                  <span className="text-white">{"\n"}</span>
                  <span className="text-white">    {"}"}{"\n"}</span>
                  <span className="text-white">  {"}"}{"\n"}</span>
                  <span className="text-gray-500">{"}"}</span>
                </pre>
              </div>
            </div>

            {/* Method 3: Direct MCP */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔌</span>
                <h3 className="font-bold text-white">{i.mcpEndpointLabel}</h3>
              </div>
              <p className="text-xs text-gray-500">{i.mcpEndpointDesc}</p>
              <div className="code-block p-4 relative">
                <CopyButton text={mcpDirectCode} lang={lang} />
                <pre className="text-xs leading-relaxed overflow-x-auto" style={{ color: "#e2e8f0" }}>
                  <span className="text-blue-400">import</span>
                  <span className="text-white"> requests{"\n\n"}</span>
                  <span className="text-yellow-300">resp</span>
                  <span className="text-white"> = requests.post({"\n"}</span>
                  <span className="text-green-300">  &quot;{MCP_ENDPOINT}&quot;</span>
                  <span className="text-white">,{"\n"}</span>
                  <span className="text-white">  json={"{"}</span>
                  <span className="text-green-300">&quot;method&quot;</span>
                  <span className="text-white">: </span>
                  <span className="text-green-300">&quot;tools/call&quot;</span>
                  <span className="text-white">, ...{"}"}{"\n"}</span>
                  <span className="text-white">){"\n"}</span>
                </pre>
              </div>
              <a
                href="https://huangting.ai/mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs px-3 py-1.5 rounded transition-colors"
                style={{
                  background: "rgba(212,160,23,0.1)",
                  color: "#D4A017",
                  border: "1px solid rgba(212,160,23,0.3)",
                }}
              >
                {i.footerMcp} →
              </a>
            </div>
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            {i.devFeatures.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <div className="font-semibold text-white mb-1">{item.title}</div>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="gold-divider" />

        {/* ══════════════════════ FOOTER ══════════════════════ */}
        <footer className="text-center py-10 px-6 space-y-2">
          <p className="text-gray-600 text-sm">© 2025 XianDAO Labs · 黄庭协议 v7.6 · 孟元景著</p>
          <p className="text-gray-700 text-xs">{i.footerDesc}</p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-700">
            <a href="https://huangting.ai" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">huangting.ai</a>
            <span>·</span>
            <a href="https://pypi.org/project/langchain-huangting/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">{i.footerPypi}</a>
            <span>·</span>
            <a href="https://huangting.ai/mcp" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">{i.footerMcp}</a>
            <span>·</span>
            <a href="https://github.com/markmeng0X/langchain-huangting" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">GitHub</a>
            <span>·</span>
            <Link href="/live" className="hover:text-gray-400 transition-colors">Live</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
