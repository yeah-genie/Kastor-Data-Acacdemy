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

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isNumberRecord = (value: unknown): value is Record<string, number> =>
  typeof value === "object" &&
  value !== null &&
  Object.values(value).every((entry) => typeof entry === "number");

export const isCharacter = (value: unknown): value is Character => {
  if (typeof value !== "object" || value === null) return false;
  const character = value as Character;

  return (
    typeof character.id === "string" &&
    typeof character.name === "string" &&
    typeof character.role === "string" &&
    (character.avatar === undefined || typeof character.avatar === "string") &&
    ["active", "suspect", "cleared", "arrested"].includes(character.status) &&
    typeof character.trustLevel === "number" &&
    character.trustLevel >= 1 &&
    character.trustLevel <= 5 &&
    isStringArray(character.background) &&
    isStringArray(character.suspiciousActivity) &&
    isStringArray(character.relatedEvidence)
  );
};

export const isEvidence = (value: unknown): value is Evidence => {
  if (typeof value !== "object" || value === null) return false;
  const evidence = value as Evidence;

  return (
    typeof evidence.id === "string" &&
    ["document", "log", "email", "image", "video"].includes(evidence.type) &&
    typeof evidence.title === "string" &&
    typeof evidence.dateCollected === "string" &&
    isStringArray(evidence.relatedTo) &&
    ["low", "medium", "high", "critical"].includes(evidence.importance) &&
    typeof evidence.isNew === "boolean"
  );
};

export const isChoice = (value: unknown): value is Choice => {
  if (typeof value !== "object" || value === null) return false;
  const choice = value as Choice;

  const { consequence } = choice;
  const isValidConsequence =
    consequence === undefined ||
    (typeof consequence === "object" &&
      consequence !== null &&
      (consequence.relationshipChange === undefined ||
        isNumberRecord(consequence.relationshipChange)) &&
      (consequence.evidenceUnlock === undefined ||
        isStringArray(consequence.evidenceUnlock)) &&
      (consequence.sceneUnlock === undefined ||
        isStringArray(consequence.sceneUnlock)));

  return (
    typeof choice.id === "string" &&
    typeof choice.text === "string" &&
    (choice.nextScene === undefined || typeof choice.nextScene === "string") &&
    isValidConsequence
  );
};

export const isMessage = (value: unknown): value is Message => {
  if (typeof value !== "object" || value === null) return false;
  const message = value as Message;

  return (
    typeof message.id === "string" &&
    typeof message.sender === "string" &&
    typeof message.content === "string" &&
    typeof message.timestamp === "string" &&
    ["text", "evidence", "system", "choice"].includes(message.type) &&
    (message.attachments === undefined ||
      (Array.isArray(message.attachments) &&
        message.attachments.every(isEvidence))) &&
    (message.choices === undefined ||
      (Array.isArray(message.choices) &&
        message.choices.every(isChoice)))
  );
};

export const isScene = (value: unknown): value is Scene => {
  if (typeof value !== "object" || value === null) return false;
  const scene = value as Scene;
  const { requirements } = scene;

  const isValidRequirements =
    requirements === undefined ||
    (typeof requirements === "object" &&
      requirements !== null &&
      (requirements.evidence === undefined ||
        isStringArray(requirements.evidence)) &&
      (requirements.choices === undefined ||
        isStringArray(requirements.choices)));

  return (
    typeof scene.id === "string" &&
    ["chat", "data", "files", "team", "interactive"].includes(scene.type) &&
    typeof scene.title === "string" &&
    (scene.messages === undefined ||
      (Array.isArray(scene.messages) && scene.messages.every(isMessage))) &&
    (scene.nextScene === undefined || typeof scene.nextScene === "string") &&
    isValidRequirements
  );
};

export const isEpisode = (value: unknown): value is Episode => {
  if (typeof value !== "object" || value === null) return false;
  const episode = value as Episode;

  return (
    typeof episode.id === "string" &&
    typeof episode.number === "number" &&
    typeof episode.title === "string" &&
    typeof episode.description === "string" &&
    [1, 2, 3, 4, 5].includes(episode.difficulty) &&
    typeof episode.estimatedTime === "string" &&
    Array.isArray(episode.scenes) &&
    episode.scenes.every(isScene) &&
    isStringArray(episode.characters) &&
    Array.isArray(episode.evidence) &&
    episode.evidence.every(isEvidence) &&
    isStringArray(episode.learningObjectives)
  );
};

export const isGameState = (value: unknown): value is GameState => {
  if (typeof value !== "object" || value === null) return false;
  const gameState = value as GameState;

  return (
    typeof gameState.currentEpisode === "string" &&
    typeof gameState.currentScene === "string" &&
    isStringArray(gameState.unlockedScenes) &&
    isStringArray(gameState.collectedEvidence) &&
    isStringArray(gameState.madeChoices) &&
    isNumberRecord(gameState.characterRelationships) &&
    typeof gameState.progress === "number" &&
    gameState.progress >= 0 &&
    gameState.progress <= 100 &&
    isStringArray(gameState.completedEpisodes)
  );
};
