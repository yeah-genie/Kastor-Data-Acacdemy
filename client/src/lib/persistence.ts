export interface GameProgress {
  currentCase: number;
  caseProgress: {
    [caseId: number]: {
      currentNode: string;
      cluesCollected: any[];
      evidenceCollected?: any[];
      score: number;
      starsEarned: number;
      completed: boolean;
      hintsUsed: number;
    };
  };
  unlockedCases: number[];
  achievements: string[];
  totalScore: number;
}

const STORAGE_KEY = "kastor_game_progress";

export function loadProgress(): GameProgress | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (error) {
    console.error("Failed to load progress:", error);
    return null;
  }
}

export function saveProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
}

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getInitialProgress(): GameProgress {
  return {
    currentCase: 1,
    caseProgress: {},
    unlockedCases: [1],
    achievements: [],
    totalScore: 0,
  };
}
