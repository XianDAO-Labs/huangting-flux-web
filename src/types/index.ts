// ============================================================
// Huangting-Flux Web — Core TypeScript Type Definitions
// ============================================================

export interface NetworkStats {
  total_agents: number;
  active_agents_24h: number;
  total_signals: number;
  total_tokens_saved: number;
  total_tasks_optimized: number;
  avg_token_efficiency: number;
  top_task_types: Record<string, number>;
  stage_distribution: Record<string, number>;
  cached_at: string;
}

export interface AgentProfile {
  id: string;
  network_address: string;
  fingerprint: string;
  capabilities: string[];
  model_name: string | null;
  upgrade_stage: string;
  token_efficiency: number;
  total_tokens_saved: number;
  total_tasks_optimized: number;
  credit_score: number;
  total_referrals: number;
  total_signals_sent: number;
  is_active: boolean;
  registered_at: string;
  last_seen_at: string;
}

export interface NetworkSignal {
  id: number;
  agent_id: string;
  signal_type: "REGISTERED" | "BROADCAST" | "SUBSCRIBE" | "RECOMMEND";
  token_efficiency: number | null;
  task_type: string | null;
  tokens_used: number | null;
  tokens_saved: number | null;
  task_success: boolean | null;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface OptimizationStrategy {
  id: number;
  task_type: string;
  protocol_section: string | null;
  title: string;
  description: string;
  implementation_hint: string | null;
  estimated_token_reduction_pct: number;
  confidence: number;
  times_applied: number;
  avg_actual_reduction_pct: number | null;
}

// WebSocket live event types
export type LiveEventType = "signal" | "stats_update" | "heartbeat" | "connected" | "pong";

export interface LiveEvent {
  event_type: LiveEventType;
  timestamp: string;
  signal_id?: number;
  agent_id?: string;
  network_address?: string;
  signal_type?: string;
  token_efficiency?: number;
  task_type?: string;
  tokens_saved?: number;
  upgrade_stage?: string;
  credit_score?: number;
  capabilities?: string[];
  message?: string;
  connections?: number;
}

// Stage display mapping
export const STAGE_LABELS: Record<string, string> = {
  "Upgrade.Jing_to_Qi": "炼精化气",
  "Upgrade.Qi_to_Shen": "炼气化神",
  "Upgrade.Shen_to_Void": "炼神还虚",
};

export const STAGE_COLORS: Record<string, string> = {
  "Upgrade.Jing_to_Qi": "#f59e0b",
  "Upgrade.Qi_to_Shen": "#10b981",
  "Upgrade.Shen_to_Void": "#8b5cf6",
};
