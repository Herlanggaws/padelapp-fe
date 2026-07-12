"use client";

import { useEffect, useState } from "react";
import { getLiveScoreboardUrl } from "@/services/scoreboardService";
import type {
  LiveScoreboardConnectionStatus,
  LiveScoreboardData,
} from "@/types/scoreboard";

export interface UseLiveScoreboardResult {
  data: LiveScoreboardData | null;
  status: LiveScoreboardConnectionStatus;
  error: string | null;
}

export function useLiveScoreboard(eventGuid: string): UseLiveScoreboardResult {
  const [data, setData] = useState<LiveScoreboardData | null>(null);
  const [status, setStatus] =
    useState<LiveScoreboardConnectionStatus>("connecting");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventGuid) {
      setStatus("error");
      setError("Missing event id.");
      return;
    }

    setStatus("connecting");
    setError(null);

    const eventSource = new EventSource(getLiveScoreboardUrl(eventGuid));
    let receivedMessage = false;

    eventSource.onopen = () => {
      setStatus("live");
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as LiveScoreboardData;
        receivedMessage = true;
        setData(payload);
        setStatus("live");
        setError(null);
      } catch {
        setError("Could not parse scoreboard update.");
      }
    };

    eventSource.onerror = () => {
      // EventSource reconnects automatically while readyState is CONNECTING.
      // Only surface reconnecting/error; do not close here.
      if (eventSource.readyState === EventSource.CLOSED) {
        setStatus("error");
        setError("Live connection closed.");
        return;
      }

      setStatus(receivedMessage ? "reconnecting" : "connecting");
    };

    return () => {
      eventSource.close();
    };
  }, [eventGuid]);

  return { data, status, error };
}
