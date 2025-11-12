import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";
import type { Choice, Evidence, Scene } from "@/types";

export type TransitionType = "fade" | "slide-left" | "slide-right" | "zoom";

export interface GameSnapshot {
  currentEpisode: string | null;
  currentScene: string | null;
  sceneHistory: string[];
  collectedEvidence: Evidence[];
  characterRelationships: Record<string, number>;
  madeChoices: Choice[];
  unlockedScenes: string[];
  gameProgress: number;
  completedEpisodes: string[];
  lastSavedAt: string | null;
}

interface GameState extends GameSnapshot {
  autoSaveSlot: string;
  saveSlots: Record<string, GameSnapshot>;
  currentTab: string;
}

interface GameActions {
  startEpisode: (episodeId: string, initialScene?: string) => void;
  goToScene: (sceneId: string) => void;
  addEvidence: (evidence: Evidence) => void;
  makeChoice: (choice: Choice) => void;
  updateRelationship: (characterId: string, change: number) => void;
  unlockScene: (sceneId: string) => void;
  setCurrentTab: (tab: string) => void;
  saveProgress: (slotId?: string) => void;
  loadProgress: (slotId: string) => void;
  setAutoSaveSlot: (slotId: string) => void;
  resetGame: () => void;
  getAvailableScenes: () => string[];
  getCharacterTrustLevel: (characterId: string) => number;
  hasEvidence: (evidenceId: string) => boolean;
  canAccessScene: (scene: Scene) => boolean;
  markEpisodeComplete: (episodeId: string) => void;
  recordProgress: (progress: number) => void;
}

export type GameStore = GameState & GameActions;

const emptySnapshot: GameSnapshot = {
  currentEpisode: null,
  currentScene: null,
  sceneHistory: [],
  collectedEvidence: [],
  characterRelationships: {},
  madeChoices: [],
  unlockedScenes: [],
  gameProgress: 0,
  completedEpisodes: [],
  lastSavedAt: null,
};

const initialState: GameState = {
  ...emptySnapshot,
  autoSaveSlot: "slot-1",
  saveSlots: {},
  currentTab: "chat",
};

const STORAGE_KEY = "kastor-game-active-slot";

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      subscribeWithSelector<GameStore>((set, get) => ({
        ...initialState,
        startEpisode: (episodeId, initialScene) => {
          set((state) => ({
            currentEpisode: episodeId,
            currentScene: initialScene ?? null,
            sceneHistory: initialScene ? [initialScene] : [],
            collectedEvidence: [],
            characterRelationships: { ...state.characterRelationships },
            madeChoices: [],
            unlockedScenes: initialScene ? [initialScene] : [],
            gameProgress: 0,
          }));
        },
        goToScene: (sceneId) => {
          set((state) => {
            if (!sceneId) return state;
            const history = state.sceneHistory.includes(sceneId)
              ? state.sceneHistory
              : [...state.sceneHistory, sceneId];
            const unlocked = state.unlockedScenes.includes(sceneId)
              ? state.unlockedScenes
              : [...state.unlockedScenes, sceneId];
            return {
              currentScene: sceneId,
              sceneHistory: history,
              unlockedScenes: unlocked,
            };
          });
        },
        addEvidence: (evidence) => {
          set((state) => {
            if (state.collectedEvidence.some((item) => item.id === evidence.id)) {
              return state;
            }
            return {
              collectedEvidence: [...state.collectedEvidence, evidence],
              gameProgress: Math.min(100, state.gameProgress + 5),
            };
          });
        },
        makeChoice: (choice) => {
          set((state) => {
            const alreadyMade = state.madeChoices.some((item) => item.id === choice.id);
            const nextChoices = alreadyMade ? state.madeChoices : [...state.madeChoices, choice];
            const updatedRelationships = { ...state.characterRelationships };
            if (choice.consequence?.relationshipChange) {
              Object.entries(choice.consequence.relationshipChange).forEach(([characterId, delta]) => {
                const current = updatedRelationships[characterId] ?? 0;
                updatedRelationships[characterId] = Math.max(-5, Math.min(5, current + delta));
              });
            }
            return {
              madeChoices: nextChoices,
              characterRelationships: updatedRelationships,
              gameProgress: Math.min(100, state.gameProgress + 3),
            };
          });
        },
        updateRelationship: (characterId, change) => {
          set((state) => {
            const next = { ...state.characterRelationships };
            next[characterId] = Math.max(-5, Math.min(5, (next[characterId] ?? 0) + change));
            return { characterRelationships: next };
          });
        },
        unlockScene: (sceneId) => {
          set((state) => {
            if (state.unlockedScenes.includes(sceneId)) return state;
            return { unlockedScenes: [...state.unlockedScenes, sceneId] };
          });
        },
        setCurrentTab: (tab) => set({ currentTab: tab }),
        saveProgress: (slotId = get().autoSaveSlot) => {
          const snapshot: GameSnapshot = {
            currentEpisode: get().currentEpisode,
            currentScene: get().currentScene,
            sceneHistory: get().sceneHistory,
            collectedEvidence: get().collectedEvidence,
            characterRelationships: get().characterRelationships,
            madeChoices: get().madeChoices,
            unlockedScenes: get().unlockedScenes,
            gameProgress: get().gameProgress,
            completedEpisodes: get().completedEpisodes,
            lastSavedAt: new Date().toISOString(),
          };
          set((state) => ({
            lastSavedAt: snapshot.lastSavedAt,
            saveSlots: {
              ...state.saveSlots,
              [slotId]: snapshot,
            },
          }));
          if (typeof window !== "undefined") {
            try {
              window.localStorage.setItem(`${STORAGE_KEY}-${slotId}`, JSON.stringify(snapshot));
            } catch {
              // ignore storage errors
            }
          }
        },
        loadProgress: (slotId) => {
          let snapshot = get().saveSlots[slotId];
          if (!snapshot && typeof window !== "undefined") {
            const raw = window.localStorage.getItem(`${STORAGE_KEY}-${slotId}`);
            if (raw) {
              try {
                snapshot = JSON.parse(raw) as GameSnapshot;
              } catch {
                snapshot = undefined;
              }
            }
          }
          if (!snapshot) return;
          set({
            ...snapshot,
            autoSaveSlot: slotId,
          });
        },
        setAutoSaveSlot: (slotId) => set({ autoSaveSlot: slotId }),
        resetGame: () => set({ ...initialState }),
        getAvailableScenes: () => Array.from(new Set(get().unlockedScenes)),
        getCharacterTrustLevel: (characterId) => get().characterRelationships[characterId] ?? 0,
        hasEvidence: (evidenceId) => get().collectedEvidence.some((evidence) => evidence.id === evidenceId),
        canAccessScene: (scene) => {
          if (!scene.requirements) return true;
          const { evidence = [], choices = [] } = scene.requirements;
          const hasEvidenceRequirements = evidence.every((evidenceId) =>
            get().collectedEvidence.some((item) => item.id === evidenceId),
          );
          const hasChoiceRequirements = choices.every((choiceId) =>
            get().madeChoices.some((choice) => choice.id === choiceId),
          );
          return hasEvidenceRequirements && hasChoiceRequirements;
        },
        markEpisodeComplete: (episodeId) => {
          set((state) => {
            if (state.completedEpisodes.includes(episodeId)) return state;
            return {
              completedEpisodes: [...state.completedEpisodes, episodeId],
              gameProgress: Math.min(100, state.gameProgress + 10),
            };
          });
        },
        recordProgress: (progress) => {
          set((state) => ({
            gameProgress: Math.max(state.gameProgress, Math.min(progress, 100)),
          }));
        },
      })),
      {
        name: "kastor-game-store",
        storage: createJSONStorage(() => (typeof window !== "undefined" ? window.localStorage : undefined)),
        partialize: (state) => ({
          currentEpisode: state.currentEpisode,
          currentScene: state.currentScene,
          sceneHistory: state.sceneHistory,
          collectedEvidence: state.collectedEvidence,
          characterRelationships: state.characterRelationships,
          madeChoices: state.madeChoices,
          unlockedScenes: state.unlockedScenes,
          gameProgress: state.gameProgress,
          completedEpisodes: state.completedEpisodes,
          lastSavedAt: state.lastSavedAt,
          autoSaveSlot: state.autoSaveSlot,
          saveSlots: state.saveSlots,
          currentTab: state.currentTab,
        }),
      },
    ),
  ),
);

if (typeof window !== "undefined") {
  const autoSaveInterval = 30 * 1000;
  window.setInterval(() => {
    const state = useGameStore.getState();
    if (state.currentEpisode) {
      state.saveProgress();
    }
  }, autoSaveInterval);
}
