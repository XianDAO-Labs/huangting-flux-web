// ============================================================
// Huangting-Flux Web — API Client
// ============================================================

import type { NetworkStats, NetworkSignal, OptimizationStrategy } from "@/types";

const HUB_API_URL = process.env.NEXT_PUBLIC_HUB_API_URL || "https://api.huangting.ai";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${HUB_API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API Error ${res.status}: ${error}`);
  }
  return res.json();
}

export const api = {
  // Network stats
  getNetworkStats: () => fetchAPI<NetworkStats>("/api/v1/network/stats"),

  // Recent signals
  getRecentSignals: (limit = 50, signal_type?: string, task_type?: string) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (signal_type) params.set("signal_type", signal_type);
    if (task_type) params.set("task_type", task_type);
    return fetchAPI<NetworkSignal[]>(`/api/v1/signals/recent?${params}`);
  },

  // Subscribe to strategies
  getStrategies: (task_type: string, limit = 3) =>
    fetchAPI<{ task_type: string; strategies: OptimizationStrategy[]; count: number }>(
      `/api/v1/subscribe?task_type=${task_type}&limit=${limit}`
    ),

  // Register agent
  registerAgent: (agent_id: string, capabilities: string[], model_name?: string) =>
    fetchAPI("/api/v1/register", {
      method: "POST",
      body: JSON.stringify({ agent_id, capabilities, model_name }),
    }),
};
