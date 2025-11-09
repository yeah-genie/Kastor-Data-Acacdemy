import { case1Story } from "./case1-story";
import { case2Story } from "./case2-story";
import { case3Story } from "./case3-story";
import type { StoryNode } from "./case1-story";

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
    title: "The Secret of the Hidden Algorithm",
    subtitle: "Expose the rigged matchmaking system",
    description: "A matchmaking system favorable to certain users has been discovered. Analyze the matchmaking result distribution and algorithm settings to identify the manipulated rules!",
    difficulty: "Advanced",
    tags: ["Algorithm Analysis", "Pattern Recognition", "Fairness Verification"],
    keyLearning: "Algorithm fairness must be verified not only by code but also by execution results. Unusual patterns are evidence of hidden bias.",
  },
};

export const stories: Record<number, Record<string, StoryNode>> = {
  1: case1Story,
  2: case2Story,
  3: case3Story,
};

export function getStory(caseId: number): Record<string, StoryNode> {
  return stories[caseId] || case1Story;
}

export function getCaseMetadata(caseId: number): CaseMetadata {
  return caseMetadata[caseId] || caseMetadata[1];
}
