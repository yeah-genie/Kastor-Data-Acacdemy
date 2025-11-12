type LooseRecord = Record<string, unknown>;

const isObject = (value: unknown): value is LooseRecord =>
  typeof value === "object" && value !== null;

export type CharacterStatus = "active" | "suspect" | "cleared" | "arrested";

export interface Character {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: CharacterStatus;
  trustLevel: number;
  background: string[];
  suspiciousActivity: string[];
  relatedEvidence: string[];
}

export type EvidenceType = "document" | "log" | "email" | "image" | "video";
export type EvidenceImportance = "low" | "medium" | "high" | "critical";

export interface Evidence {
  id: string;
  type: EvidenceType;
  title: string;
  content: unknown;
  dateCollected: string;
  relatedTo: string[];
  importance: EvidenceImportance;
  isNew: boolean;
}

export type MessageType = "text" | "evidence" | "system" | "choice" | "alert";

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
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: MessageType;
  attachments?: Evidence[];
  choices?: Choice[];
}

export type SceneType =
  | "chat"
  | "data"
  | "files"
  | "team"
  | "interactive"
  | "cinematic";

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
}

export const isCharacter = (value: unknown): value is Character => {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.role === "string" &&
    (value.avatar === undefined || typeof value.avatar === "string") &&
    typeof value.status === "string" &&
    typeof value.trustLevel === "number" &&
    Array.isArray(value.background) &&
    Array.isArray(value.suspiciousActivity) &&
    Array.isArray(value.relatedEvidence)
  );
};

export const isEvidence = (value: unknown): value is Evidence => {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.type === "string" &&
    typeof value.title === "string" &&
    typeof value.dateCollected === "string" &&
    Array.isArray(value.relatedTo) &&
    typeof value.importance === "string" &&
    typeof value.isNew === "boolean"
  );
};

export const isChoice = (value: unknown): value is Choice => {
  if (!isObject(value)) return false;

  if (value.consequence !== undefined && !isObject(value.consequence)) {
    return false;
  }

  return typeof value.id === "string" && typeof value.text === "string";
};

export const isMessage = (value: unknown): value is Message => {
  if (!isObject(value)) return false;

  const hasValidAttachments =
    value.attachments === undefined ||
    (Array.isArray(value.attachments) &&
      value.attachments.every((attachment) => isEvidence(attachment)));

  const hasValidChoices =
    value.choices === undefined ||
    (Array.isArray(value.choices) &&
      value.choices.every((choice) => isChoice(choice)));

  return (
    typeof value.id === "string" &&
    typeof value.sender === "string" &&
    typeof value.content === "string" &&
    typeof value.timestamp === "string" &&
    typeof value.type === "string" &&
    hasValidAttachments &&
    hasValidChoices
  );
};

export const isScene = (value: unknown): value is Scene => {
  if (!isObject(value)) return false;

  const hasValidMessages =
    value.messages === undefined ||
    (Array.isArray(value.messages) &&
      value.messages.every((message) => isMessage(message)));

  const hasValidRequirements =
    value.requirements === undefined ||
    (isObject(value.requirements) &&
      (value.requirements.evidence === undefined ||
        Array.isArray(value.requirements.evidence)) &&
      (value.requirements.choices === undefined ||
        Array.isArray(value.requirements.choices)));

  return (
    typeof value.id === "string" &&
    typeof value.type === "string" &&
    typeof value.title === "string" &&
    hasValidMessages &&
    hasValidRequirements
  );
};

export const isEpisode = (value: unknown): value is Episode => {
  if (!isObject(value)) return false;

  const hasValidScenes =
    Array.isArray(value.scenes) &&
    value.scenes.every((scene) => isScene(scene));

  const hasValidEvidence =
    Array.isArray(value.evidence) &&
    value.evidence.every((evidence) => isEvidence(evidence));

  return (
    typeof value.id === "string" &&
    typeof value.number === "number" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.estimatedTime === "string" &&
    hasValidScenes &&
    Array.isArray(value.characters) &&
    hasValidEvidence &&
    Array.isArray(value.learningObjectives)
  );
};

export const isGameState = (value: unknown): value is GameState => {
  if (!isObject(value)) return false;

  return (
    typeof value.currentEpisode === "string" &&
    typeof value.currentScene === "string" &&
    Array.isArray(value.unlockedScenes) &&
    Array.isArray(value.collectedEvidence) &&
    Array.isArray(value.madeChoices) &&
    isObject(value.characterRelationships) &&
    typeof value.progress === "number" &&
    Array.isArray(value.completedEpisodes)
  );
};
