import type { InteractiveSequence as BaseInteractiveSequence } from "./case1-episode-final";

export type InteractiveSequence = BaseInteractiveSequence;

export interface StageSummary {
  stage: number;
  title: string;
  keyFindings: string[];
  evidenceCount: number;
  nextStageHint?: string;
}

export const stageSummaries: Record<number, StageSummary> = {
  1: {
    stage: 1,
    title: "Initial Investigation",
    keyFindings: [
      "Shadow Reaper win rate anomaly identified",
      "Suspected internal manipulation of balance patch",
      "Investigation launched with Legend Arena team",
    ],
    evidenceCount: 2,
    nextStageHint: "Interview the team members for eyewitness accounts",
  },
  2: {
    stage: 2,
    title: "Witness Interviews",
    keyFindings: [
      "CCTV timeline established for office departures",
      "Unauthorized account access confirmed",
      "Key suspects identified from testimony contradictions",
    ],
    evidenceCount: 4,
    nextStageHint: "Cross-verify statements with server logs",
  },
};

export function getStageSummaryByStage(stage: number): StageSummary | undefined {
  return stageSummaries[stage];
}
