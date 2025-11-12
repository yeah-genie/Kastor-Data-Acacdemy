export interface Character {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: "active" | "suspect" | "cleared" | "arrested";
  trustLevel: number;
  background: string[];
  suspiciousActivity: string[];
  relatedEvidence: string[];
}

export type EvidenceType = "document" | "log" | "email" | "image" | "video";

export interface Evidence {
  id: string;
  type: EvidenceType;
  title: string;
  content: unknown;
  dateCollected: string;
  relatedTo: string[];
  importance: "low" | "medium" | "high" | "critical";
  isNew: boolean;
}

export type MessageType = "text" | "evidence" | "system" | "choice";

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: MessageType;
  attachments?: Evidence[];
  choices?: Choice[];
  dataVisualization?: unknown;
  isQuestion?: boolean;
  isCharacterCards?: boolean;
  isEvidencePresentation?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ChoiceConsequence {
  relationshipChange?: Record<string, number>;
  evidenceUnlock?: string[];
  sceneUnlock?: string[];
}

export interface Choice {
  id: string;
  text: string;
  nextScene?: string;
  consequence?: ChoiceConsequence;
  clueAwarded?: string;
}

export type SceneType = "chat" | "data" | "files" | "team" | "interactive";

export interface SceneRequirements {
  evidence?: string[];
  choices?: string[];
}

export interface Scene {
  id: string;
  type: SceneType;
  title: string;
  messages?: Message[];
  dataContent?: unknown;
  interactiveContent?: unknown;
  nextScene?: string;
  requirements?: SceneRequirements;
  choices?: Choice[];
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: string;
  scenes: Scene[];
  characters: string[];
  evidence: Evidence[];
  learningObjectives: string[];
}

export interface GameState {
  currentEpisode: string;
  currentScene: string;
  unlockedScenes: string[];
  collectedEvidence: string[];
  madeChoices: string[];
  characterRelationships: Record<string, number>;
  progress: number;
  completedEpisodes: string[];
  currentTab: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isCharacter = (value: unknown): value is Character => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.role === "string" &&
    (value.avatar === undefined || typeof value.avatar === "string") &&
    ["active", "suspect", "cleared", "arrested"].includes(String(value.status)) &&
    typeof value.trustLevel === "number" &&
    Array.isArray(value.background) &&
    value.background.every((item) => typeof item === "string") &&
    Array.isArray(value.suspiciousActivity) &&
    value.suspiciousActivity.every((item) => typeof item === "string") &&
    Array.isArray(value.relatedEvidence) &&
    value.relatedEvidence.every((item) => typeof item === "string")
  );
};

export const isEvidence = (value: unknown): value is Evidence => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    ["document", "log", "email", "image", "video"].includes(String(value.type)) &&
    typeof value.title === "string" &&
    typeof value.dateCollected === "string" &&
    Array.isArray(value.relatedTo) &&
    value.relatedTo.every((item) => typeof item === "string") &&
    ["low", "medium", "high", "critical"].includes(String(value.importance)) &&
    typeof value.isNew === "boolean"
  );
};

export const isChoice = (value: unknown): value is Choice => {
  if (!isRecord(value)) return false;
  const hasValidConsequence =
    value.consequence === undefined ||
    (isRecord(value.consequence) &&
      (value.consequence.relationshipChange === undefined ||
        (isRecord(value.consequence.relationshipChange) &&
          Object.values(value.consequence.relationshipChange).every(
            (change) => typeof change === "number",
          ))) &&
      (value.consequence.evidenceUnlock === undefined ||
        (Array.isArray(value.consequence.evidenceUnlock) &&
          value.consequence.evidenceUnlock.every((item) => typeof item === "string"))) &&
      (value.consequence.sceneUnlock === undefined ||
        (Array.isArray(value.consequence.sceneUnlock) &&
          value.consequence.sceneUnlock.every((item) => typeof item === "string"))));

  return (
    typeof value.id === "string" &&
    typeof value.text === "string" &&
    (value.nextScene === undefined || typeof value.nextScene === "string") &&
    hasValidConsequence
  );
};

export const isMessage = (value: unknown): value is Message => {
  if (!isRecord(value)) return false;
  const hasValidAttachments =
    value.attachments === undefined ||
    (Array.isArray(value.attachments) && value.attachments.every(isEvidence));
  const hasValidChoices =
    value.choices === undefined ||
    (Array.isArray(value.choices) && value.choices.every(isChoice));

  return (
    typeof value.id === "string" &&
    typeof value.sender === "string" &&
    typeof value.content === "string" &&
    typeof value.timestamp === "string" &&
    ["text", "evidence", "system", "choice"].includes(String(value.type)) &&
    hasValidAttachments &&
    hasValidChoices
  );
};

export const isScene = (value: unknown): value is Scene => {
  if (!isRecord(value)) return false;

  const hasValidMessages =
    value.messages === undefined ||
    (Array.isArray(value.messages) && value.messages.every(isMessage));

  const hasValidRequirements =
    value.requirements === undefined ||
    (isRecord(value.requirements) &&
      (value.requirements.evidence === undefined ||
        (Array.isArray(value.requirements.evidence) &&
          value.requirements.evidence.every((item) => typeof item === "string"))) &&
      (value.requirements.choices === undefined ||
        (Array.isArray(value.requirements.choices) &&
          value.requirements.choices.every((item) => typeof item === "string"))));

  return (
    typeof value.id === "string" &&
    ["chat", "data", "files", "team", "interactive"].includes(String(value.type)) &&
    typeof value.title === "string" &&
    (value.dataContent === undefined || typeof value.dataContent !== "undefined") &&
    (value.interactiveContent === undefined || typeof value.interactiveContent !== "undefined") &&
    (value.nextScene === undefined || typeof value.nextScene === "string") &&
    hasValidMessages &&
    hasValidRequirements
  );
};

export const isEpisode = (value: unknown): value is Episode => {
  if (!isRecord(value)) return false;

  const hasValidScenes =
    Array.isArray(value.scenes) && value.scenes.every(isScene);

  return (
    typeof value.id === "string" &&
    typeof value.number === "number" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    [1, 2, 3, 4, 5].includes(Number(value.difficulty)) &&
    typeof value.estimatedTime === "string" &&
    hasValidScenes &&
    Array.isArray(value.characters) &&
    value.characters.every((item) => typeof item === "string") &&
    Array.isArray(value.evidence) &&
    value.evidence.every(isEvidence) &&
    Array.isArray(value.learningObjectives) &&
    value.learningObjectives.every((item) => typeof item === "string")
  );
};

export const isGameState = (value: unknown): value is GameState => {
  if (!isRecord(value)) return false;

  const isStringArray = (maybe: unknown) =>
    Array.isArray(maybe) && maybe.every((item) => typeof item === "string");

  return (
    typeof value.currentEpisode === "string" &&
    typeof value.currentScene === "string" &&
    isStringArray(value.unlockedScenes) &&
    isStringArray(value.collectedEvidence) &&
    isStringArray(value.madeChoices) &&
    isRecord(value.characterRelationships) &&
    Object.values(value.characterRelationships).every((score) => typeof score === "number") &&
    typeof value.progress === "number" &&
    isStringArray(value.completedEpisodes) &&
    typeof value.currentTab === "string"
  );
};
