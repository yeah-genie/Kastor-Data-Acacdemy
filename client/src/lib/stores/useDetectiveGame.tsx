import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { loadProgress, saveProgress, getInitialProgress, type GameProgress } from "../persistence";

export type GamePhase = "menu" | "stage1" | "stage2" | "stage3" | "stage4" | "stage5";
export type StoryNode = string;

export interface Clue {
  id: string;
  title: string;
  description: string;
  timestamp: number;
}

export type EvidenceType = "CHARACTER" | "DATA" | "DIALOGUE" | "PHOTO" | "DOCUMENT";

export interface EvidenceBase {
  id: string;
  type: EvidenceType;
  title: string;
  timestamp: number;
  unlockedByNode: string;
}

export interface CharacterEvidence extends EvidenceBase {
  type: "CHARACTER";
  name: string;
  role: string;
  photo?: string;
  description: string;
  suspicionLevel?: number;
}

export interface DataEvidence extends EvidenceBase {
  type: "DATA";
  dataType: "chart" | "table" | "log";
  data: any;
}

export interface DialogueEvidence extends EvidenceBase {
  type: "DIALOGUE";
  character: string;
  summary: string;
  keyPoints: string[];
}

export interface PhotoEvidence extends EvidenceBase {
  type: "PHOTO";
  imageUrl: string;
  caption: string;
}

export interface DocumentEvidence extends EvidenceBase {
  type: "DOCUMENT";
  content: string;
}

export type Evidence = CharacterEvidence | DataEvidence | DialogueEvidence | PhotoEvidence | DocumentEvidence;

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  nextNode: string;
  feedback: string;
}

export interface Question {
  id: string;
  text: string;
  choices: Choice[];
}

interface DetectiveGameState {
  phase: GamePhase;
  currentNode: StoryNode;
  cluesCollected: Clue[];
  evidenceCollected: Evidence[];
  recentEvidenceId: string | null;
  isEvidenceModalOpen: boolean;
  score: number;
  starsEarned: number;
  currentCase: number;
  hintsUsed: number;
  maxHints: number;
  unlockedCases: number[];
  achievements: string[];
  totalScore: number;

  setPhase: (phase: GamePhase) => void;
  setCurrentNode: (node: StoryNode) => void;
  addClue: (clue: Clue) => void;
  unlockEvidence: (evidence: Evidence) => void;
  setEvidenceModalOpen: (isOpen: boolean) => void;
  getEvidenceByType: (type: EvidenceType) => Evidence[];
  addScore: (points: number) => void;
  setStarsEarned: (stars: number) => void;
  useHint: () => void;
  resetCase: () => void;
  startCase: (caseNumber: number) => void;
  completeCase: (stars: number) => void;
  addAchievement: (achievementId: string) => void;
  loadSavedProgress: () => void;
  saveCurrentProgress: () => void;
  getProgress: (caseId: number) => { completed: boolean; starsEarned: number } | null;
  getCurrentXP: () => number;
  getCurrentLevel: () => number;
}

const initialProgress = loadProgress() || getInitialProgress();

export const useDetectiveGame = create<DetectiveGameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    currentNode: "start",
    cluesCollected: [],
    evidenceCollected: [],
    recentEvidenceId: null,
    isEvidenceModalOpen: false,
    score: 0,
    starsEarned: 0,
    currentCase: initialProgress.currentCase,
    hintsUsed: 0,
    maxHints: 3,
    unlockedCases: initialProgress.unlockedCases,
    achievements: initialProgress.achievements,
    totalScore: initialProgress.totalScore,

    setPhase: (phase) => {
      set({ phase });
      get().saveCurrentProgress();
    },
    
    setCurrentNode: (node) => {
      set({ currentNode: node });
      get().saveCurrentProgress();
    },
    
    addClue: (clue) => {
      set((state) => ({
        cluesCollected: [...state.cluesCollected, clue],
      }));
      get().saveCurrentProgress();
    },
    
    unlockEvidence: (evidence) => {
      set((state) => ({
        evidenceCollected: [...state.evidenceCollected, evidence],
        recentEvidenceId: evidence.id,
        isEvidenceModalOpen: true,
      }));
      get().saveCurrentProgress();
    },
    
    setEvidenceModalOpen: (isOpen) => {
      set({ isEvidenceModalOpen: isOpen });
    },
    
    getEvidenceByType: (type) => {
      return get().evidenceCollected.filter(e => e.type === type);
    },
    
    addScore: (points) => {
      set((state) => ({ 
        score: state.score + points,
        totalScore: state.totalScore + points,
      }));
      get().saveCurrentProgress();
    },
    
    setStarsEarned: (stars) => {
      set({ starsEarned: stars });
      get().saveCurrentProgress();
    },
    
    useHint: () => {
      set((state) => ({
        hintsUsed: Math.min(state.hintsUsed + 1, state.maxHints),
      }));
      get().saveCurrentProgress();
    },
    
    resetCase: () => {
      set({
        currentNode: "start",
        cluesCollected: [],
        evidenceCollected: [],
        recentEvidenceId: null,
        isEvidenceModalOpen: false,
        score: 0,
        starsEarned: 0,
        hintsUsed: 0,
      });
      get().saveCurrentProgress();
    },
    
    startCase: (caseNumber) => {
      const state = get();
      const savedCaseProgress = loadProgress()?.caseProgress[caseNumber];
      
      if (savedCaseProgress && !savedCaseProgress.completed) {
        set({
          currentCase: caseNumber,
          phase: "stage1",
          currentNode: savedCaseProgress.currentNode,
          cluesCollected: savedCaseProgress.cluesCollected,
          evidenceCollected: savedCaseProgress.evidenceCollected || [],
          score: savedCaseProgress.score,
          starsEarned: savedCaseProgress.starsEarned,
          hintsUsed: savedCaseProgress.hintsUsed,
        });
      } else {
        set({
          currentCase: caseNumber,
          phase: "stage1",
          currentNode: "start",
          cluesCollected: [],
          evidenceCollected: [],
          score: 0,
          starsEarned: 0,
          hintsUsed: 0,
        });
      }
      
      get().saveCurrentProgress();
    },
    
    completeCase: (stars) => {
      const state = get();
      set({ starsEarned: stars });
      
      const nextCase = state.currentCase + 1;
      const newUnlockedCases = [...state.unlockedCases];
      if (nextCase <= 3 && !newUnlockedCases.includes(nextCase)) {
        newUnlockedCases.push(nextCase);
      }
      
      const newAchievements = [...state.achievements];
      if (stars === 3 && !newAchievements.includes(`case${state.currentCase}_perfect`)) {
        newAchievements.push(`case${state.currentCase}_perfect`);
      }
      if (state.cluesCollected.length >= 3 && !newAchievements.includes(`case${state.currentCase}_all_clues`)) {
        newAchievements.push(`case${state.currentCase}_all_clues`);
      }
      
      set({
        unlockedCases: newUnlockedCases,
        achievements: newAchievements,
      });
      
      get().saveCurrentProgress();
    },
    
    addAchievement: (achievementId) => {
      set((state) => {
        if (!state.achievements.includes(achievementId)) {
          return { achievements: [...state.achievements, achievementId] };
        }
        return {};
      });
      get().saveCurrentProgress();
    },
    
    loadSavedProgress: () => {
      const progress = loadProgress();
      if (progress) {
        set({
          currentCase: progress.currentCase,
          unlockedCases: progress.unlockedCases,
          achievements: progress.achievements,
          totalScore: progress.totalScore,
        });
      }
    },
    
    saveCurrentProgress: () => {
      const state = get();
      const progress: GameProgress = {
        currentCase: state.currentCase,
        caseProgress: {
          [state.currentCase]: {
            currentNode: state.currentNode,
            cluesCollected: state.cluesCollected,
            evidenceCollected: state.evidenceCollected,
            score: state.score,
            starsEarned: state.starsEarned,
            completed: state.phase === "stage5" && state.currentNode.includes("resolution"),
            hintsUsed: state.hintsUsed,
          },
        },
        unlockedCases: state.unlockedCases,
        achievements: state.achievements,
        totalScore: state.totalScore,
      };
      
      const existingProgress = loadProgress();
      if (existingProgress) {
        progress.caseProgress = { ...existingProgress.caseProgress, ...progress.caseProgress };
      }
      
      saveProgress(progress);
    },
    
    getProgress: (caseId) => {
      const progress = loadProgress();
      const caseProgress = progress?.caseProgress[caseId];
      if (caseProgress) {
        return {
          completed: caseProgress.completed,
          starsEarned: caseProgress.starsEarned,
        };
      }
      return null;
    },
    
    getCurrentXP: () => {
      return get().totalScore;
    },
    
    getCurrentLevel: () => {
      return Math.floor(get().totalScore / 100) + 1;
    },
  }))
);
