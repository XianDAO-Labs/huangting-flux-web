"use client";
// ============================================================
// Huangting-Flux Web — WebSocket Live Stream Hook
// ============================================================

import { useEffect, useRef, useState, useCallback } from "react";
import type { LiveEvent } from "@/types";

const HUB_WS_URL = process.env.NEXT_PUBLIC_HUB_WS_URL || "wss://api.huangting.ai";

interface UseFluxStreamOptions {
  maxEvents?: number;
  onSignal?: (event: LiveEvent) => void;
}

export function useFluxStream({ maxEvents = 100, onSignal }: UseFluxStreamOptions = {}) {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionCount, setConnectionCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(`${HUB_WS_URL}/api/v1/ws/live`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data: LiveEvent = JSON.parse(event.data);

          if (data.event_type === "connected") {
            setConnectionCount(data.connections || 0);
            return;
          }

          if (data.event_type === "heartbeat") return;

          setEvents((prev) => {
            const next = [data, ...prev];
            return next.slice(0, maxEvents);
          });

          if (data.event_type === "signal" && onSignal) {
            onSignal(data);
          }
        } catch (e) {
          console.error("Failed to parse WS message:", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Auto-reconnect after 3 seconds
        reconnectTimerRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch (e) {
      console.error("WebSocket connection failed:", e);
      reconnectTimerRef.current = setTimeout(connect, 5000);
    }
  }, [maxEvents, onSignal]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { events, isConnected, connectionCount };
}
