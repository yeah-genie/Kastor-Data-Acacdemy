// @ts-nocheck
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { loadProgress, saveProgress, getInitialProgress, type GameProgress } from "../persistence";

export type GamePhase = "menu" | "stage1" | "stage2" | "stage3" | "stage4" | "stage5" | "resolution";
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
  connections?: Array<{ to: string; label?: string }>;
}

export interface CharacterEvidence extends EvidenceBase {
  type: "CHARACTER";
  name: string;
  role: string;
  photo?: string;
  description: string;
  personality?: string;
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

export interface EvidenceNodePosition {
  evidenceId: string;
  x: number;
  y: number;
  zIndex?: number;
}

export interface EvidenceConnection {
  id: string;
  from: string;
  to: string;
  label?: string;
  confidence?: number;
}

export interface EvidenceBoardState {
  nodePositions: Map<string, EvidenceNodePosition>;
  connections: EvidenceConnection[];
}

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  nextNode: string;
  feedback: string;
  hintEvidenceId?: string;
  hintText?: string;
}

export interface Question {
  id: string;
  text: string;
  choices: Choice[];
}

export interface SessionMetrics {
  startTime: number;
  endTime: number | null;
  decisions: Array<{
    questionId: string;
    choiceId: string;
    isCorrect: boolean;
    timestamp: number;
  }>;
  totalEvidenceInCase: number;
  logicConnectionsMade: number;
  totalLogicConnections: number;
  contradictionsFound: number;
  totalContradictions: number;
  interactiveSequencesCompleted: number;
  totalInteractiveSequences: number;
}

export type Grade = 'S' | 'A' | 'B' | 'C';

export type TypewriterSpeed = 'off' | 'normal' | 'fast';

interface DetectiveGameState {
  phase: GamePhase;
  currentNode: StoryNode;
  cluesCollected: Clue[];
  evidenceCollected: Evidence[];
  recentEvidenceId: string | null;
  isEvidenceModalOpen: boolean;
  hasNewEvidence: boolean;
  score: number;
  starsEarned: number;
  currentCase: number;
  hintsUsed: number;
  maxHints: number;
  unlockedCases: number[];
  achievements: string[];
  totalScore: number;
  visitedNodeIds: string[];
  visitedCharacters: string[];
  sessionMetrics: SessionMetrics;
  evidenceBoardPositions: Record<string, EvidenceNodePosition>;
  evidenceBoardConnections: EvidenceConnection[];
  selectedNodeId: string | null;
  collapsedNodes: Set<string>;
  highlightedEvidenceId: string | null;
  typewriterSpeed: TypewriterSpeed;

  setPhase: (phase: GamePhase) => void;
  setCurrentNode: (node: StoryNode) => void;
  addClue: (clue: Clue) => void;
  unlockEvidence: (evidence: Evidence, showModal?: boolean) => void;
  setEvidenceModalOpen: (isOpen: boolean) => void;
  clearNewEvidenceFlag: () => void;
  getEvidenceByType: (type: EvidenceType) => Evidence[];
  addScore: (points: number) => void;
  setStarsEarned: (stars: number) => void;
  useHint: () => void;
  resetCase: () => void;
  startCase: (caseNumber: number, resumeMode?: boolean) => void;
  completeCase: (stars: number) => void;
  addAchievement: (achievementId: string) => void;
  loadSavedProgress: () => void;
  saveCurrentProgress: () => void;
  getProgress: (caseId: number) => { completed: boolean; starsEarned: number } | null;
  getCaseProgressDetails: (caseId: number) => { percentComplete: number; isInProgress: boolean; isCompleted: boolean; lastNodeId: string | null };
  recordNodeVisited: (nodeId: string) => void;
  resetCaseFor: (caseId: number) => void;
  getCurrentXP: () => number;
  getCurrentLevel: () => number;
  recordDecision: (questionId: string, choiceId: string, isCorrect: boolean) => void;
  calculateGrade: () => Grade;
  initSessionMetrics: (totalEvidenceCount: number) => void;
  recordLogicConnection: () => void;
  recordContradiction: () => void;
  recordInteractiveSequence: () => void;
  getCaseStats: () => {
    evidenceCollected: number;
    totalEvidence: number;
    logicConnectionsMade: number;
    totalLogicConnections: number;
    contradictionsFound: number;
    totalContradictions: number;
    interviewAccuracy: number;
    timeTaken: string;
  };
  setNodePosition: (evidenceId: string, x: number, y: number, zIndex?: number) => void;
  addEvidenceConnection: (from: string, to: string, label?: string) => void;
  removeEvidenceConnection: (connectionId: string) => void;
  getNodePosition: (evidenceId: string) => EvidenceNodePosition | null;
  selectNode: (evidenceId: string | null) => void;
  toggleNodeCollapse: (evidenceId: string) => void;
  isNodeCollapsed: (evidenceId: string) => boolean;
  openHintNotebook: (evidenceId: string) => void;
  clearHintHighlight: () => void;
  setTypewriterSpeed: (speed: TypewriterSpeed) => void;
}

const initialProgress = loadProgress() || getInitialProgress();

let debounceSaveTimeout: ReturnType<typeof setTimeout> | null = null;

const debouncedSaveBoardState = (delay = 500) => {
  if (debounceSaveTimeout) {
    clearTimeout(debounceSaveTimeout);
  }
  debounceSaveTimeout = setTimeout(() => {
    const state = useDetectiveGame.getState();
    state.saveCurrentProgress();
  }, delay);
};

const calculateDefaultNodePosition = (index: number): { x: number; y: number } => {
  const cols = 4;
  const padding = 0.1;
  const cellWidth = (1 - padding * 2) / cols;
  const cellHeight = 0.2;
  
  const col = index % cols;
  const row = Math.floor(index / cols);
  
  const x = padding + col * cellWidth + cellWidth / 2;
  const y = padding + row * cellHeight + cellHeight / 2;
  
  return { x: Math.min(x, 0.9), y: Math.min(y, 0.9) };
};

export const useDetectiveGame = create<DetectiveGameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    currentNode: "start",
    cluesCollected: [],
    evidenceCollected: [],
    recentEvidenceId: null,
    isEvidenceModalOpen: false,
    hasNewEvidence: false,
    score: 0,
    starsEarned: 0,
    currentCase: initialProgress.currentCase,
    hintsUsed: 0,
    maxHints: 3,
    unlockedCases: initialProgress.unlockedCases,
    achievements: initialProgress.achievements,
    totalScore: initialProgress.totalScore,
    visitedNodeIds: [],
    visitedCharacters: [],
    sessionMetrics: {
      startTime: Date.now(),
      endTime: null,
      decisions: [],
      totalEvidenceInCase: 0,
      logicConnectionsMade: 0,
      totalLogicConnections: 0,
      contradictionsFound: 0,
      totalContradictions: 0,
      interactiveSequencesCompleted: 0,
      totalInteractiveSequences: 0,
    },
    evidenceBoardPositions: {},
    evidenceBoardConnections: [],
    selectedNodeId: null,
    collapsedNodes: new Set(),
    highlightedEvidenceId: null,
    typewriterSpeed: (localStorage.getItem('typewriterSpeed') as TypewriterSpeed) || 'normal',

    initSessionMetrics: (totalEvidenceCount) => {
      set({
        sessionMetrics: {
          startTime: Date.now(),
          endTime: null,
          decisions: [],
          totalEvidenceInCase: totalEvidenceCount,
          logicConnectionsMade: 0,
          totalLogicConnections: 5,
          contradictionsFound: 0,
          totalContradictions: 3,
          interactiveSequencesCompleted: 0,
          totalInteractiveSequences: 6,
        },
      });
    },

    recordLogicConnection: () => {
      set((state) => ({
        sessionMetrics: {
          ...state.sessionMetrics,
          logicConnectionsMade: state.sessionMetrics.logicConnectionsMade + 1,
        },
      }));
    },

    recordContradiction: () => {
      set((state) => ({
        sessionMetrics: {
          ...state.sessionMetrics,
          contradictionsFound: state.sessionMetrics.contradictionsFound + 1,
        },
      }));
    },

    recordInteractiveSequence: () => {
      set((state) => ({
        sessionMetrics: {
          ...state.sessionMetrics,
          interactiveSequencesCompleted: state.sessionMetrics.interactiveSequencesCompleted + 1,
        },
      }));
    },

    getCaseStats: () => {
      const state = get();
      const metrics = state.sessionMetrics;

      const correctDecisions = metrics.decisions.filter(d => d.isCorrect).length;
      const totalDecisions = metrics.decisions.length;
      const interviewAccuracy = totalDecisions > 0 ? Math.round((correctDecisions / totalDecisions) * 100) : 100;

      const duration = metrics.endTime
        ? metrics.endTime - metrics.startTime
        : Date.now() - metrics.startTime;

      const minutes = Math.floor(duration / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);
      const timeTaken = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

      return {
        evidenceCollected: state.evidenceCollected.length,
        totalEvidence: metrics.totalEvidenceInCase,
        logicConnectionsMade: metrics.logicConnectionsMade,
        totalLogicConnections: metrics.totalLogicConnections,
        contradictionsFound: metrics.contradictionsFound,
        totalContradictions: metrics.totalContradictions,
        interviewAccuracy,
        timeTaken,
      };
    },

    recordDecision: (questionId, choiceId, isCorrect) => {
      set((state) => ({
        sessionMetrics: {
          ...state.sessionMetrics,
          decisions: [
            ...state.sessionMetrics.decisions,
            {
              questionId,
              choiceId,
              isCorrect,
              timestamp: Date.now(),
            },
          ],
        },
      }));
    },

    calculateGrade: (): Grade => {
      const state = get();
      const metrics = state.sessionMetrics;
      
      const correctDecisions = metrics.decisions.filter(d => d.isCorrect).length;
      const totalDecisions = metrics.decisions.length;
      const decisionRate = totalDecisions > 0 ? correctDecisions / totalDecisions : 1;
      
      const evidenceRate = metrics.totalEvidenceInCase > 0 
        ? state.evidenceCollected.length / metrics.totalEvidenceInCase 
        : 1;
      
      const hintPenalty = state.hintsUsed * 0.1;
      
      const durationMinutes = metrics.endTime 
        ? (metrics.endTime - metrics.startTime) / 60000 
        : 0;
      
      const timeScore = durationMinutes < 15 ? 1.0 : durationMinutes < 25 ? 0.5 : 0;
      
      const finalScore = (
        decisionRate * 0.4 +
        evidenceRate * 0.4 +
        timeScore * 0.2
      ) - hintPenalty;
      
      if (finalScore >= 0.9) return 'S';
      if (finalScore >= 0.75) return 'A';
      if (finalScore >= 0.6) return 'B';
      return 'C';
    },

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
    
    unlockEvidence: (evidence, showModal = true) => {
      const evidenceArray = Array.isArray(evidence) ? evidence : [evidence];
      evidenceArray.forEach((ev) => {
        set((state) => {
          const existingIndex = state.evidenceCollected.findIndex(e => e.id === ev.id);
          let newEvidenceCollected;
          let newBoardPositions = { ...state.evidenceBoardPositions };
          const newCollapsedNodes = new Set(state.collapsedNodes);
          
          if (existingIndex !== -1) {
            newEvidenceCollected = [...state.evidenceCollected];
            newEvidenceCollected[existingIndex] = ev;
          } else {
            newEvidenceCollected = [...state.evidenceCollected, ev];
            newCollapsedNodes.add(ev.id);
            
            if (!state.evidenceBoardPositions[ev.id]) {
              const position = calculateDefaultNodePosition(newEvidenceCollected.length - 1);
              newBoardPositions[ev.id] = {
                evidenceId: ev.id,
                ...position,
              };
            }
          }
          
          return {
            evidenceCollected: newEvidenceCollected,
            evidenceBoardPositions: newBoardPositions,
            collapsedNodes: newCollapsedNodes,
            recentEvidenceId: ev.id,
            isEvidenceModalOpen: showModal,
            hasNewEvidence: true,
          };
        });
        
        if (ev.connections && ev.connections.length > 0) {
          ev.connections.forEach(conn => {
            const connectionExists = get().evidenceBoardConnections.some(
              c => (c.from === ev.id && c.to === conn.to) || (c.from === conn.to && c.to === ev.id)
            );
            
            if (!connectionExists) {
              get().addEvidenceConnection(ev.id, conn.to, conn.label);
            }
          });
        }
      });
      get().saveCurrentProgress();
    },
    
    setEvidenceModalOpen: (isOpen) => {
      set({ isEvidenceModalOpen: isOpen });
    },

    clearNewEvidenceFlag: () => {
      set({ hasNewEvidence: false });
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
        hasNewEvidence: false,
        score: 0,
        starsEarned: 0,
        hintsUsed: 0,
        visitedNodeIds: [],
        visitedCharacters: [],
        sessionMetrics: {
          startTime: Date.now(),
          endTime: null,
          decisions: [],
          totalEvidenceInCase: 0,
          logicConnectionsMade: 0,
          totalLogicConnections: 0,
          contradictionsFound: 0,
          totalContradictions: 0,
          interactiveSequencesCompleted: 0,
          totalInteractiveSequences: 0,
        },
        evidenceBoardPositions: {},
        evidenceBoardConnections: [],
      });
      get().saveCurrentProgress();
    },
    
    startCase: (caseNumber, resumeMode = false) => {
      const state = get();
      const savedCaseProgress = loadProgress()?.caseProgress[caseNumber];
      
      const totalEvidenceCount = 15;
      
      if (resumeMode && savedCaseProgress && !savedCaseProgress.completed) {
        const savedCollapsedNodes = savedCaseProgress.collapsedNodes 
          ? new Set(savedCaseProgress.collapsedNodes)
          : new Set((savedCaseProgress.evidenceCollected || []).map((e: any) => e.id));
        
        set({
          currentCase: caseNumber,
          phase: "stage1",
          currentNode: savedCaseProgress.currentNode,
          cluesCollected: savedCaseProgress.cluesCollected,
          evidenceCollected: savedCaseProgress.evidenceCollected || [],
          hasNewEvidence: false,
          score: savedCaseProgress.score,
          starsEarned: savedCaseProgress.starsEarned,
          hintsUsed: savedCaseProgress.hintsUsed,
          visitedNodeIds: savedCaseProgress.visitedNodeIds || [],
          visitedCharacters: [],
          evidenceBoardPositions: savedCaseProgress.evidenceBoardState?.nodePositions || {},
          evidenceBoardConnections: savedCaseProgress.evidenceBoardState?.connections || [],
          collapsedNodes: savedCollapsedNodes,
        });
      } else {
        set({
          currentCase: caseNumber,
          phase: "stage1",
          currentNode: "start",
          cluesCollected: [],
          evidenceCollected: [],
          hasNewEvidence: false,
          score: 0,
          starsEarned: 0,
          hintsUsed: 0,
          visitedNodeIds: [],
          visitedCharacters: [],
          evidenceBoardPositions: {},
          evidenceBoardConnections: [],
          collapsedNodes: new Set(),
        });
        get().initSessionMetrics(totalEvidenceCount);
      }
      
      get().saveCurrentProgress();
    },
    
    completeCase: (stars) => {
      const state = get();
      
      set({ 
        starsEarned: stars,
        sessionMetrics: {
          ...state.sessionMetrics,
          endTime: Date.now(),
        },
      });
      
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
      const uniqueVisitedNodes = Array.from(new Set(state.visitedNodeIds));
      
      const progress: GameProgress = {
        currentCase: state.currentCase,
        caseProgress: {
          [state.currentCase]: {
            currentNode: state.currentNode,
            cluesCollected: state.cluesCollected,
            evidenceCollected: state.evidenceCollected,
            score: state.score,
            starsEarned: state.starsEarned,
            completed: state.currentNode === "end",
            hintsUsed: state.hintsUsed,
            visitedNodeIds: uniqueVisitedNodes,
            lastUpdated: Date.now(),
            evidenceBoardState: {
              nodePositions: state.evidenceBoardPositions,
              connections: state.evidenceBoardConnections,
            },
            collapsedNodes: Array.from(state.collapsedNodes),
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
    
    recordNodeVisited: (nodeId) => {
      set((state) => {
        if (!state.visitedNodeIds.includes(nodeId)) {
          return { visitedNodeIds: [...state.visitedNodeIds, nodeId] };
        }
        return {};
      });
      get().saveCurrentProgress();
    },
    
    getCaseProgressDetails: (caseId) => {
      const progress = loadProgress();
      const caseProgress = progress?.caseProgress[caseId];
      
      if (!caseProgress) {
        return {
          percentComplete: 0,
          isInProgress: false,
          isCompleted: false,
          lastNodeId: null,
        };
      }
      
      if (caseProgress.completed) {
        return {
          percentComplete: 100,
          isInProgress: false,
          isCompleted: true,
          lastNodeId: caseProgress.currentNode,
        };
      }
      
      const visitedCount = caseProgress.visitedNodeIds?.length || 0;
      const totalNodes = 20;
      const percentComplete = Math.min(Math.round((visitedCount / totalNodes) * 100), 99);
      
      return {
        percentComplete,
        isInProgress: visitedCount > 0,
        isCompleted: false,
        lastNodeId: caseProgress.currentNode,
      };
    },
    
    resetCaseFor: (caseId) => {
      const existingProgress = loadProgress();
      if (existingProgress && existingProgress.caseProgress[caseId]) {
        delete existingProgress.caseProgress[caseId];
        saveProgress(existingProgress);
      }
      
      if (get().currentCase === caseId) {
        get().resetCase();
      }
    },
    
    getCurrentXP: () => {
      return get().totalScore;
    },
    
    getCurrentLevel: () => {
      return Math.floor(get().totalScore / 100) + 1;
    },

    setNodePosition: (evidenceId, x, y, zIndex) => {
      set((state) => ({
        evidenceBoardPositions: {
          ...state.evidenceBoardPositions,
          [evidenceId]: { evidenceId, x, y, zIndex },
        },
      }));
      debouncedSaveBoardState();
    },

    addEvidenceConnection: (from, to, label) => {
      set((state) => {
        const connectionId = `${from}-${to}-${Date.now()}`;
        const alreadyExists = state.evidenceBoardConnections.some(
          (conn) =>
            (conn.from === from && conn.to === to) ||
            (conn.from === to && conn.to === from)
        );
        
        if (alreadyExists) return {};
        
        return {
          evidenceBoardConnections: [
            ...state.evidenceBoardConnections,
            { id: connectionId, from, to, label },
          ],
        };
      });
      debouncedSaveBoardState();
    },

    removeEvidenceConnection: (connectionId) => {
      set((state) => ({
        evidenceBoardConnections: state.evidenceBoardConnections.filter(
          (conn) => conn.id !== connectionId
        ),
      }));
      debouncedSaveBoardState();
    },

    getNodePosition: (evidenceId) => {
      const position = get().evidenceBoardPositions[evidenceId];
      return position || null;
    },

    selectNode: (evidenceId) => {
      set({ selectedNodeId: evidenceId });
    },

    toggleNodeCollapse: (evidenceId) => {
      set((state) => {
        const newCollapsedNodes = new Set(state.collapsedNodes);
        if (newCollapsedNodes.has(evidenceId)) {
          newCollapsedNodes.delete(evidenceId);
        } else {
          newCollapsedNodes.add(evidenceId);
        }
        return { collapsedNodes: newCollapsedNodes };
      });
    },

    isNodeCollapsed: (evidenceId) => {
      return get().collapsedNodes.has(evidenceId);
    },

    openHintNotebook: (evidenceId) => {
      set({ highlightedEvidenceId: evidenceId });
      get().useHint();
    },

    clearHintHighlight: () => {
      set({ highlightedEvidenceId: null });
    },

    setTypewriterSpeed: (speed) => {
      set({ typewriterSpeed: speed });
      localStorage.setItem('typewriterSpeed', speed);
    },
  }))
);
