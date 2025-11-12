import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Choice, Evidence, GameState as GameStateShape, Message } from "@/types";
import { episode4, scenesById } from "@/data/episodes/episode4";

export type TabKey = "chat" | "data" | "files" | "team";

export interface TypingIndicatorState {
  actor: string;
  message?: string;
}

interface NotificationMap extends Record<TabKey, number> {}

interface SaveSlot {
  id: string;
  label: string;
  savedAt: number;
  state: PersistedState;
}

interface PersistedState extends GameStateShape {
  notifications: NotificationMap;
  tabHistory: TabKey[];
  messages: Message[];
  availableChoices: Choice[];
  currentTab: TabKey;
}

interface GameStoreState extends PersistedState {
  isAwaitingResponse: boolean;
  typingIndicator: TypingIndicatorState | null;
  saveSlots: Record<string, SaveSlot>;
  lastAutosave: number;

  // Scene & episode actions
  startEpisode: (episodeId: string) => void;
  goToScene: (sceneId: string, options?: { appendOnly?: boolean }) => void;
  unlockScene: (sceneId: string) => void;
  resetGame: () => void;
  completeEpisode: (episodeId: string) => void;

  // Chat & choice actions
  appendMessage: (message: Message, options?: { silent?: boolean }) => void;
  sendPlayerMessage: (content: string) => void;
  setAvailableChoices: (choices: Choice[]) => void;
  makeChoice: (choiceId: string) => void;
  setTypingIndicator: (indicator: TypingIndicatorState | null) => void;
  setAwaitingResponse: (value: boolean) => void;

  // Evidence & progression
  addEvidence: (evidence: Evidence | Evidence[]) => void;
  hasEvidence: (evidenceId: string) => boolean;
  canAccessScene: (sceneId: string) => boolean;
  getAvailableScenes: () => string[];
  getCharacterTrustLevel: (characterId: string) => number;
  updateRelationship: (characterId: string, delta: number) => void;

  // Tab + notification management
  setCurrentTab: (tab: TabKey) => void;
  incrementNotification: (tab: TabKey, amount?: number) => void;
  clearNotifications: (tab: TabKey) => void;
  goBackTab: () => void;
  setNotificationValue: (tab: TabKey, value: number) => void;

  // Persistence
  saveProgress: (slotId?: string, label?: string) => void;
  loadProgress: (slotId?: string) => void;
  loadProgressSnapshot: (snapshot: PersistedState) => void;
}

const AUTOSAVE_INTERVAL = 30_000;
const SAVE_SLOT_STORAGE_KEY = "kastor-data-academy-save-slots";

const createEmptyNotifications = (): NotificationMap => ({
  chat: 0,
  data: 0,
  files: 0,
  team: 0,
});

const calculateProgress = (unlockedScenes: string[]): number => {
  const totalScenes = episode4.scenes.length;
  if (totalScenes === 0) return 0;
  const clamped = Math.min(unlockedScenes.length / totalScenes, 1);
  return Math.round(clamped * 100);
};

const serialiseState = (state: GameStoreState): PersistedState => ({
  currentEpisode: state.currentEpisode,
  currentScene: state.currentScene,
  unlockedScenes: state.unlockedScenes,
  collectedEvidence: state.collectedEvidence,
  madeChoices: state.madeChoices,
  characterRelationships: state.characterRelationships,
  progress: state.progress,
  completedEpisodes: state.completedEpisodes,
  notifications: state.notifications,
  tabHistory: state.tabHistory,
  messages: state.messages,
  availableChoices: state.availableChoices,
  currentTab: state.currentTab,
});

const readSaveSlots = (): Record<string, SaveSlot> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(SAVE_SLOT_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, SaveSlot>;
  } catch (error) {
    console.warn("Failed to read save slots", error);
    return {};
  }
};

const writeSaveSlots = (slots: Record<string, SaveSlot>) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVE_SLOT_STORAGE_KEY, JSON.stringify(slots));
  } catch (error) {
    console.warn("Failed to persist save slots", error);
  }
};

const initialScene = episode4.scenes[0] ?? null;

const initialState: PersistedState = {
  currentEpisode: episode4.id,
  currentScene: initialScene?.id ?? "",
  unlockedScenes: initialScene ? [initialScene.id] : [],
  collectedEvidence: [],
  madeChoices: [],
  characterRelationships: {},
  progress: calculateProgress(initialScene ? [initialScene.id] : []),
  completedEpisodes: [],
  notifications: createEmptyNotifications(),
  tabHistory: ["chat"],
  messages: initialScene?.messages ? [...initialScene.messages] : [],
  availableChoices: initialScene?.choices ? [...initialScene.choices] : [],
  currentTab: "chat",
};

const createGameStore = () =>
  create<GameStoreState>()(
    devtools(
      persist(
        (set, get) => ({
          ...initialState,
          isAwaitingResponse: false,
          typingIndicator: null,
          saveSlots: readSaveSlots(),
          lastAutosave: Date.now(),

          startEpisode: (episodeId) => {
            const startingScene = episodeId === episode4.id ? episode4.scenes[0] : null;
            if (!startingScene) return;

            set(() => ({
              currentEpisode: episodeId,
              currentScene: startingScene.id,
              unlockedScenes: [startingScene.id],
              collectedEvidence: [],
              madeChoices: [],
              characterRelationships: {},
              progress: calculateProgress([startingScene.id]),
              messages: [...(startingScene.messages ?? [])],
              availableChoices: [...(startingScene.choices ?? [])],
              notifications: createEmptyNotifications(),
              tabHistory: ["chat"],
              currentTab: "chat",
              isAwaitingResponse: false,
              typingIndicator: null,
            }));
          },

          goToScene: (sceneId, options) => {
            const scene = scenesById[sceneId];
            if (!scene) return;

            const { unlockedScenes } = get();
            const nextUnlocked = unlockedScenes.includes(sceneId)
              ? unlockedScenes
              : [...unlockedScenes, sceneId];

            set((state) => ({
              currentScene: sceneId,
              unlockedScenes: nextUnlocked,
              progress: calculateProgress(nextUnlocked),
              availableChoices: scene.choices ? [...scene.choices] : [],
              isAwaitingResponse: false,
              typingIndicator: null,
              messages: options?.appendOnly ? state.messages : [...state.messages],
            }));

            scene.messages?.forEach((msg) => {
              get().appendMessage(msg, { silent: true });
            });

            set(() => ({
              availableChoices: scene.choices ? [...scene.choices] : [],
            }));
          },

          unlockScene: (sceneId) => {
            set((state) => {
              if (state.unlockedScenes.includes(sceneId)) {
                return {};
              }
              const unlockedScenes = [...state.unlockedScenes, sceneId];
              return {
                unlockedScenes,
                progress: calculateProgress(unlockedScenes),
              };
            });
          },

          resetGame: () => {
            set(() => ({
              ...initialState,
              isAwaitingResponse: false,
              typingIndicator: null,
              saveSlots: readSaveSlots(),
              lastAutosave: Date.now(),
            }));
          },

          completeEpisode: (episodeId) => {
            set((state) => {
              if (state.completedEpisodes.includes(episodeId)) {
                return {};
              }
              return {
                completedEpisodes: [...state.completedEpisodes, episodeId],
                progress: 100,
              };
            });
          },

          appendMessage: (message, options) => {
            const normalised: Message = {
              ...message,
              id: message.id ?? nanoid(),
            };

            set((state) => ({
              messages: [...state.messages, normalised],
            }));

            const activeTab = get().currentTab;
            if (!options?.silent && activeTab !== "chat") {
              get().incrementNotification("chat");
            }

            if (normalised.attachments && normalised.attachments.length > 0) {
              get().addEvidence(normalised.attachments);
            }

            if (normalised.type === "system" && !options?.silent) {
              get().incrementNotification("chat");
            }
          },

          sendPlayerMessage: (content) => {
            const trimmed = content.trim();
            if (!trimmed) {
              return;
            }

            const message: Message = {
              id: nanoid(),
              sender: "player",
              content: trimmed,
              timestamp: new Date().toISOString(),
              type: "text",
            };

            get().appendMessage(message);
            get().setAwaitingResponse(true);
          },

          setAvailableChoices: (choices) => {
            set(() => ({
              availableChoices: [...choices],
            }));
          },

          makeChoice: (choiceId) => {
            const state = get();
            const choice = state.availableChoices.find((item) => item.id === choiceId);
            if (!choice) return;

            set((prev) => ({
              madeChoices: [...prev.madeChoices, choice.id],
              availableChoices: [],
            }));

            if (choice.consequence?.relationshipChange) {
              Object.entries(choice.consequence.relationshipChange).forEach(([characterId, delta]) => {
                get().updateRelationship(characterId, delta);
              });
            }

            if (choice.consequence?.evidenceUnlock) {
              const evidenceList = episode4.evidence.filter((item) =>
                choice.consequence?.evidenceUnlock?.includes(item.id),
              );
              if (evidenceList.length > 0) {
                get().addEvidence(evidenceList);
              }
            }

            if (choice.consequence?.sceneUnlock) {
              choice.consequence.sceneUnlock.forEach((sceneId) => get().unlockScene(sceneId));
            }

            if (choice.nextScene) {
              get().goToScene(choice.nextScene);
            } else {
              get().setAwaitingResponse(true);
            }
          },

          setTypingIndicator: (indicator) => {
            set(() => ({
              typingIndicator: indicator,
            }));
          },

          setAwaitingResponse: (value) => {
            set(() => ({
              isAwaitingResponse: value,
            }));
          },

          addEvidence: (evidence) => {
            const evidenceArray = Array.isArray(evidence) ? evidence : [evidence];

            set((state) => {
              const nextEvidence = new Set(state.collectedEvidence);
              evidenceArray.forEach((item) => nextEvidence.add(item.id));
              return {
                collectedEvidence: Array.from(nextEvidence),
              };
            });

            if (get().currentTab !== "files") {
              get().incrementNotification("files", evidenceArray.length);
            }
          },

          hasEvidence: (evidenceId) => {
            return get().collectedEvidence.includes(evidenceId);
          },

          canAccessScene: (sceneId) => {
            const scene = scenesById[sceneId];
            if (!scene || !scene.requirements) return true;
            const { evidence = [], choices = [] } = scene.requirements;
            const state = get();
            const hasEvidenceReq = evidence.every((id) => state.collectedEvidence.includes(id));
            const hasChoiceReq = choices.every((id) => state.madeChoices.includes(id));
            return hasEvidenceReq && hasChoiceReq;
          },

          getAvailableScenes: () => {
            return get().unlockedScenes;
          },

          getCharacterTrustLevel: (characterId) => {
            return get().characterRelationships[characterId] ?? 0;
          },

          updateRelationship: (characterId, delta) => {
            set((state) => ({
              characterRelationships: {
                ...state.characterRelationships,
                [characterId]: (state.characterRelationships[characterId] ?? 0) + delta,
              },
            }));
          },

          setCurrentTab: (tab) => {
            set((state) => ({
              currentTab: tab,
              tabHistory: [...state.tabHistory, tab],
              notifications: {
                ...state.notifications,
                [tab]: 0,
              },
            }));
          },

          incrementNotification: (tab, amount = 1) => {
            set((state) => ({
              notifications: {
                ...state.notifications,
                [tab]: state.notifications[tab] + amount,
              },
            }));
          },

          clearNotifications: (tab) => {
            set((state) => ({
              notifications: {
                ...state.notifications,
                [tab]: 0,
              },
            }));
          },

          setNotificationValue: (tab, value) => {
            set((state) => ({
              notifications: {
                ...state.notifications,
                [tab]: Math.max(0, value),
              },
            }));
          },

          goBackTab: () => {
            set((state) => {
              if (state.tabHistory.length <= 1) return {};
              const updated = [...state.tabHistory];
              updated.pop();
              const previous = updated[updated.length - 1] ?? "chat";
              return {
                tabHistory: updated,
                currentTab: previous,
                notifications: {
                  ...state.notifications,
                  [previous]: 0,
                },
              };
            });
          },

          saveProgress: (slotId = "auto", label = "Auto Save") => {
            const snapshot = serialiseState(get());
            const saveSlots = readSaveSlots();
            const entry: SaveSlot = {
              id: slotId,
              label,
              savedAt: Date.now(),
              state: snapshot,
            };
            saveSlots[slotId] = entry;
            writeSaveSlots(saveSlots);
            set(() => ({
              saveSlots,
              lastAutosave: Date.now(),
            }));
          },

          loadProgress: (slotId = "auto") => {
            const slots = readSaveSlots();
            const entry = slots[slotId];
            if (!entry) return;
            get().loadProgressSnapshot(entry.state);
          },

          loadProgressSnapshot: (snapshot) => {
            set(() => ({
              ...snapshot,
              isAwaitingResponse: false,
              typingIndicator: null,
            }));
          },
        }),
        {
          name: "kastor-data-academy-game",
          partialize: (state) => serialiseState(state as GameStoreState),
        },
      ),
      { name: "gameStore" },
    ),
  );

export const useGameStore = createGameStore();

const setupAutosave = () => {
  if (typeof window === "undefined") return;
  let timer: number | null = null;

  const startTimer = () => {
    if (timer !== null) {
      window.clearInterval(timer);
    }
    timer = window.setInterval(() => {
      useGameStore.getState().saveProgress("auto", "Auto Save");
    }, AUTOSAVE_INTERVAL);
  };

  startTimer();
};

setupAutosave();

export const selectMessages = (state: GameStoreState) => state.messages;
export const selectChoices = (state: GameStoreState) => state.availableChoices;
export const selectTypingIndicator = (state: GameStoreState) => state.typingIndicator;
export const selectIsAwaitingResponse = (state: GameStoreState) => state.isAwaitingResponse;
export const selectNotifications = (state: GameStoreState) => state.notifications;
export const selectCurrentTab = (state: GameStoreState) => state.currentTab;
export const selectProgress = (state: GameStoreState) => state.progress;
export const selectCollectedEvidence = (state: GameStoreState) => state.collectedEvidence;
export const selectCurrentScene = (state: GameStoreState) => state.currentScene;
