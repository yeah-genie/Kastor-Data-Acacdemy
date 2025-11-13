import { nanoid } from "nanoid";
import type { Choice, Evidence } from "@/types";
import { useGameStore } from "@/store/gameStore";

export type AnalyticsEventType =
  | "scene_start"
  | "scene_complete"
  | "choice_made"
  | "evidence_collected"
  | "hint_used"
  | "answer_attempt";

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  timestamp: number;
  sceneId: string;
  data?: {
    choiceId?: string;
    evidenceId?: string;
    isCorrect?: boolean;
    timeTaken?: number;
    hintsUsed?: number;
    state?: AnalyticsStateSnapshot;
  };
}

export interface AnalyticsStateSnapshot {
  episodeId: string | null;
  sceneId: string | null;
  gameProgress: number;
  collectedEvidenceIds: string[];
  choiceIds: string[];
}

export interface UserSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  episodeId: string;
  events: AnalyticsEvent[];
  finalScore?: number;
  completionRate?: number;
}

const STORAGE_KEY = "kastor-analytics-sessions";
const ACTIVE_SESSION_KEY = "kastor-analytics-active-session";

const isBrowser = typeof window !== "undefined";

const readSessions = (): Record<string, UserSession> => {
  if (!isBrowser) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, UserSession>;
    return parsed ?? {};
  } catch {
    return {};
  }
};

const writeSessions = (sessions: Record<string, UserSession>) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // ignore storage failures (quota, privacy mode, etc.)
  }
};

const setActiveSessionId = (sessionId: string) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
  } catch {
    // ignore
  }
};

export const getActiveAnalyticsSessionId = (): string | null => {
  if (!isBrowser) return null;
  try {
    return window.localStorage.getItem(ACTIVE_SESSION_KEY);
  } catch {
    return null;
  }
};

const buildStateSnapshot = (): AnalyticsStateSnapshot => {
  const state = useGameStore.getState();
  return {
    episodeId: state.currentEpisode,
    sceneId: state.currentScene,
    gameProgress: state.gameProgress,
    collectedEvidenceIds: state.collectedEvidence.map((item: Evidence) => item.id),
    choiceIds: state.madeChoices.map((choice: Choice) => choice.id),
  };
};

export const startSession = (episodeId: string, sessionId: string = nanoid()): UserSession => {
  const sessions = readSessions();
  const now = Date.now();
  const session: UserSession = {
    sessionId,
    startTime: now,
    episodeId,
    events: [],
  };
  sessions[sessionId] = session;
  writeSessions(sessions);
  setActiveSessionId(sessionId);
  return session;
};

export const endSession = (
  sessionId: string,
  summary?: { finalScore?: number; completionRate?: number },
): UserSession | null => {
  const sessions = readSessions();
  const found = sessions[sessionId];
  if (!found) return null;
  const updated: UserSession = {
    ...found,
    endTime: Date.now(),
    finalScore: summary?.finalScore ?? found.finalScore,
    completionRate: summary?.completionRate ?? found.completionRate,
  };
  sessions[sessionId] = updated;
  writeSessions(sessions);
  return updated;
};

interface TrackEventPayload {
  sceneId: string;
  choiceId?: string;
  evidenceId?: string;
  isCorrect?: boolean;
  timeTaken?: number;
  hintsUsed?: number;
}

export const trackEvent = (type: AnalyticsEventType, payload: TrackEventPayload) => {
  const sessionId = getActiveAnalyticsSessionId();
  if (!sessionId) {
    // auto-start session if none is active; fallback to current episode
    const currentEpisode = useGameStore.getState().currentEpisode ?? "unknown-episode";
    startSession(currentEpisode);
  }
  const resolvedSessionId = getActiveAnalyticsSessionId();
  if (!resolvedSessionId) return;

  const sessions = readSessions();
  const session = sessions[resolvedSessionId];
  if (!session) return;

  const event: AnalyticsEvent = {
    type,
    timestamp: Date.now(),
    sceneId: payload.sceneId,
    data: {
      choiceId: payload.choiceId,
      evidenceId: payload.evidenceId,
      isCorrect: payload.isCorrect,
      timeTaken: payload.timeTaken,
      hintsUsed: payload.hintsUsed,
      state: buildStateSnapshot(),
    },
  };

  const updatedSession: UserSession = {
    ...session,
    events: [...session.events, event],
  };

  sessions[resolvedSessionId] = updatedSession;
  writeSessions(sessions);
};

export const exportSessionData = (sessionId: string, format: "json" | "csv" = "json"): string | null => {
  const sessions = readSessions();
  const session = sessions[sessionId];
  if (!session) return null;

  if (format === "json") {
    return JSON.stringify(session, null, 2);
  }

  const header = [
    "sessionId",
    "episodeId",
    "eventType",
    "timestamp",
    "sceneId",
    "choiceId",
    "evidenceId",
    "isCorrect",
    "timeTaken",
    "hintsUsed",
    "gameProgress",
    "collectedEvidenceIds",
    "choiceIds",
  ];

  const rows = session.events.map((event) => {
    const state = event.data?.state;
    return [
      session.sessionId,
      session.episodeId,
      event.type,
      new Date(event.timestamp).toISOString(),
      event.sceneId,
      event.data?.choiceId ?? "",
      event.data?.evidenceId ?? "",
      typeof event.data?.isCorrect === "boolean" ? String(event.data.isCorrect) : "",
      event.data?.timeTaken ?? "",
      event.data?.hintsUsed ?? "",
      state?.gameProgress ?? "",
      state?.collectedEvidenceIds.join("|") ?? "",
      state?.choiceIds.join("|") ?? "",
    ];
  });

  return [header, ...rows]
    .map((columns) =>
      columns
        .map((value) => {
          const normalized = String(value ?? "");
          if (normalized.includes(",") || normalized.includes('"') || normalized.includes("\n")) {
            return `"${normalized.replace(/"/g, '""')}"`;
          }
          return normalized;
        })
        .join(","),
    )
    .join("\n");
};

export const getAllSessions = (): UserSession[] => {
  const sessions = readSessions();
  return Object.values(sessions).sort((a, b) => b.startTime - a.startTime);
};

export const clearAnalytics = () => {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch {
    // ignore
  }
};

