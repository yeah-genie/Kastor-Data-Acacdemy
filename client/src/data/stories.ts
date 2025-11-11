import { case2EpisodeFull } from "./case2-episode-full";
import episode1 from "./episode1.json";
import episode3 from "./episode3.json";
import type { StoryNode } from "./episode-types";

export interface CaseMetadata {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  keyLearning: string;
  imageUrl?: string;
}

export const caseMetadata: Record<number, CaseMetadata> = {
  1: {
    id: 1,
    title: "The Missing Balance Patch",
    subtitle: "Uncover unauthorized game modifications",
    description: "A specific character's win rate has abnormally surged in a popular online game. Analyze the win rate graphs and patch logs to uncover the insider's manipulation!",
    difficulty: "Beginner",
    tags: ["Data Analysis", "Log Tracking", "Change Detection"],
    keyLearning: "Sudden changes in data always have a cause. Check system logs and permission records to discover hidden manipulations.",
  },
  2: {
    id: 2,
    title: "The Ghost User's Ranking Manipulation",
    subtitle: "Track down the phantom bot account",
    description: "A non-existent user appeared at the top of the rankings. Analyze connection logs, ranking tables, and database query logs to track the bot account!",
    difficulty: "Intermediate",
    tags: ["Database", "Log Analysis", "Bot Detection"],
    keyLearning: "Data integrity is the foundation of all systems. Check relationships between tables to discover abnormal data insertion.",
  },
  3: {
    id: 3,
    title: "The Perfect Victory",
    subtitle: "Investigate the tournament match-fixing",
    description: "An underdog team swept the finals 3-0 against the favorites. Analyze betting patterns, server logs, and encrypted messages to uncover a sophisticated match-fixing scheme.",
    difficulty: "Advanced",
    tags: ["Match-Fixing", "Betting Analysis", "Incomplete Evidence"],
    keyLearning: "Sometimes investigators have strong suspicions but insufficient proof. Document everything, stay patient, and wait for mistakes.",
  },
};

export type LegacyStoryGraph = Record<string, StoryNode>;
export type EpisodeSceneGraph = typeof episode1 | typeof episode3;
export type StoryRepositoryEntry = EpisodeSceneGraph | LegacyStoryGraph;

export const stories: Record<number, StoryRepositoryEntry> = {
  1: episode1,
  2: case2EpisodeFull,
  3: episode3,
};

export function getStory(caseId: number): StoryRepositoryEntry {
  return stories[caseId] || episode1;
}

export function getCaseMetadata(caseId: number): CaseMetadata {
  return caseMetadata[caseId] || caseMetadata[1];
}
