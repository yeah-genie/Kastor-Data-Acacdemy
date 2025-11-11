import { CharacterData } from "@/components/CharacterUnlockModal";
import { SkillData } from "@/components/SkillUnlockModal";

// Define when unlocks should trigger based on story node IDs
export interface UnlockTrigger {
  nodeId: string;
  type: "character" | "skill";
  data: CharacterData | SkillData;
}

// Character unlocks for Episode 1
export const mayaCharacter: CharacterData = {
  id: "maya",
  name: "Maya Zhang",
  role: "Game Director",
  avatarUrl: "/characters/maya.jpg",
  icon: "🎮",
  accentColor: "#ff6b35",
  tags: [
    { label: "PROFESSIONAL", variant: "default" },
    { label: "STRESSED", variant: "accent" }
  ],
  firstAppearance: "Episode 1: The Glitch",
  description: "A dedicated game director fighting to keep her team's reputation intact. She came to you because she trusts data over emotions."
};

export const ryanCharacter: CharacterData = {
  id: "ryan",
  name: "Ryan Nakamura",
  role: "Lead Data Analyst",
  avatarUrl: "/characters/ryan.jpg",
  icon: "🔐",
  accentColor: "#00f6ff",
  tags: [
    { label: "ANALYTICAL", variant: "default" },
    { label: "MENTOR", variant: "accent" }
  ],
  firstAppearance: "Episode 1: The Glitch",
  description: "A brilliant data analyst with years of experience. He's helping train you in the art of data detective work."
};

// Skills for Episode 1
export const dataVisualizationSkill: SkillData = {
  id: "data-visualization",
  name: "Data Visualization Analysis",
  description: "Identify anomalies and patterns in charts and graphs. Essential for spotting suspicious trends in large datasets.",
  icon: "analytics",
  xpReward: 100,
  realWorldApplication: "Used by data scientists to detect fraud, track performance metrics, and identify market trends. Charts reveal the story hidden in numbers."
};

export const timelineReconstructionSkill: SkillData = {
  id: "timeline-reconstruction",
  name: "Timeline Reconstruction",
  description: "Piece together events from scattered logs to understand what really happened. Critical for building evidence chains.",
  icon: "schedule",
  xpReward: 150,
  realWorldApplication: "Digital forensics investigators use this to reconstruct cyber attacks. Timestamps don't lie - they reveal the truth behind the sequence of events."
};

export const testimonyCrossExaminationSkill: SkillData = {
  id: "testimony-cross-examination",
  name: "Cross-Examination",
  description: "Compare testimony against hard evidence to find contradictions. People lie, but data doesn't.",
  icon: "gavel",
  xpReward: 200,
  realWorldApplication: "Used in legal investigations, fraud detection, and security audits. Cross-referencing statements with evidence uncovers deception."
};

export const caseAnalysisSkill: SkillData = {
  id: "case-analysis",
  name: "Case Analysis & Reporting",
  description: "Synthesize all evidence into a coherent narrative. Turn raw data into actionable insights.",
  icon: "description",
  xpReward: 250,
  realWorldApplication: "Essential for business analysts, consultants, and investigators. The ability to tell a compelling story with data drives decision-making."
};

// Map of which node triggers which unlock
export const episode1Unlocks: UnlockTrigger[] = [
  // Maya unlocks after the first meeting
  {
    nodeId: "client_concern",
    type: "character",
    data: mayaCharacter
  },
  // Ryan unlocks after he joins the investigation
  {
    nodeId: "chris_introduces_ryan",
    type: "character",
    data: ryanCharacter
  },
  // Data Visualization skill after completing graph analysis
  {
    nodeId: "graph_analysis_result",
    type: "skill",
    data: dataVisualizationSkill
  },
  // Timeline Reconstruction skill after completing timeline
  {
    nodeId: "timeline_result",
    type: "skill",
    data: timelineReconstructionSkill
  },
  // Cross-Examination skill after pressing testimony
  {
    nodeId: "testimony_result",
    type: "skill",
    data: testimonyCrossExaminationSkill
  },
  // Case Analysis skill after completing the final report
  {
    nodeId: "case_complete",
    type: "skill",
    data: caseAnalysisSkill
  }
];
