"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { NetworkSignal, OptimizationStrategy } from "@/types";
import { STAGE_LABELS, STAGE_COLORS } from "@/types";
import Link from "next/link";
import { ArrowLeft, Search, BookOpen, Zap, ChevronRight } from "lucide-react";

const TASK_TYPES = [
  "complex_research",
  "code_generation",
  "multi_agent_coordination",
  "creative_writing",
  "data_analysis",
];

export default function NetworkPage() {
  const [signals, setSignals] = useState<NetworkSignal[]>([]);
  const [strategies, setStrategies] = useState<OptimizationStrategy[]>([]);
  const [selectedTask, setSelectedTask] = useState("complex_research");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getRecentSignals(30).then(setSignals).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getStrategies(selectedTask, 5)
      .then((res) => setStrategies(res.strategies))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedTask]);

  return (
    <div className="min-h-screen bg-void-950 text-slate-200">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-800/50 bg-void-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <Search size={18} className="text-gold-400" />
          <span className="font-semibold text-white">Network Explorer</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Optimization Strategies */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <BookOpen size={18} className="text-gold-400" />
              <h2 className="text-xl font-bold text-white">Optimization Strategies</h2>
            </div>

            {/* Task Type Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              {TASK_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTask(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedTask === t
                      ? "bg-gold-500 text-void-950 font-medium"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {t.replace(/_/g, " ")}
                </button>
              ))}
            </div>

            {/* Strategy Cards */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-slate-500 text-sm py-8 text-center">Loading strategies...</div>
              ) : strategies.length > 0 ? (
                strategies.map((s) => (
                  <div
                    key={s.id}
                    className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-gold-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-white font-medium text-sm leading-snug">{s.title}</h3>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-jade-400 font-bold text-lg">
                          -{Math.round(s.estimated_token_reduction_pct * 100)}%
                        </div>
                        <div className="text-slate-500 text-xs">tokens</div>
                      </div>
                    </div>
                    {s.protocol_section && (
                      <div className="text-gold-400/70 text-xs mb-2 font-mono">{s.protocol_section}</div>
                    )}
                    <p className="text-slate-400 text-sm leading-relaxed mb-3">{s.description}</p>
                    {s.implementation_hint && (
                      <div className="code-block text-xs text-jade-300 mt-2">
                        {s.implementation_hint}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span>Confidence: {Math.round(s.confidence * 100)}%</span>
                      <span>Applied: {s.times_applied.toLocaleString()} times</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-sm py-8 text-center">
                  No strategies found for this task type.
                </div>
              )}
            </div>
          </div>

          {/* Right: Recent Signals */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Zap size={18} className="text-jade-400" />
              <h2 className="text-xl font-bold text-white">Recent Signals</h2>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
              {signals.length > 0 ? (
                <div className="divide-y divide-slate-800/50">
                  {signals.map((signal) => (
                    <div key={signal.id} className="px-5 py-4 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-sm font-mono truncate max-w-[160px]">
                          {signal.agent_id}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          signal.signal_type === "REGISTERED"
                            ? "bg-jade-500/20 text-jade-400"
                            : "bg-gold-500/20 text-gold-400"
                        }`}>
                          {signal.signal_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        {signal.task_type && <span>{signal.task_type.replace(/_/g, " ")}</span>}
                        {signal.token_efficiency != null && (
                          <span className="text-jade-400">
                            {(signal.token_efficiency * 100).toFixed(1)}% eff
                          </span>
                        )}
                        {signal.tokens_saved != null && signal.tokens_saved > 0 && (
                          <span>−{signal.tokens_saved.toLocaleString()} tokens</span>
                        )}
                        {signal.payload?.upgrade_stage && (
                          <span style={{ color: STAGE_COLORS[signal.payload.upgrade_stage as string] }}>
                            {STAGE_LABELS[signal.payload.upgrade_stage as string] || signal.payload.upgrade_stage as string}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-600 text-sm">
                  No signals yet. Be the first to connect your agent.
                </div>
              )}
            </div>

            {/* Quick Start */}
            <div className="mt-6 bg-slate-900/60 border border-jade-500/20 rounded-xl p-5">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <ChevronRight size={16} className="text-jade-400" />
                Connect Your Agent
              </h3>
              <div className="code-block text-xs space-y-1">
                <div className="text-slate-500"># Install</div>
                <div className="text-jade-300">pip install &quot;huangting-soul[flux]&quot;</div>
                <div className="text-slate-500 mt-2"># Connect</div>
                <div className="text-gold-300">from huangting_soul.flux import HuangtingFlux</div>
                <div className="text-slate-300">flux = HuangtingFlux(agent_id=<span className="text-jade-300">&quot;my-agent&quot;</span>)</div>
                <div className="text-slate-300">flux.register(capabilities=[<span className="text-jade-300">&quot;research&quot;</span>])</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
