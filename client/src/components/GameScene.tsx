import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Volume2, VolumeX, Plus, Mic, Send } from "lucide-react";
import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";
import { useAudio } from "@/lib/stores/useAudio";
import { type StoryNode } from "@/data/case1-story";
import { getStory, getCaseMetadata, caseMetadata } from "@/data/stories";
import { ChatMessage } from "./ChatMessage";
import { DataVisualization } from "./DataVisualization";
import { ChoiceButtons } from "./ChoiceButtons";
import { DetectiveNotebook } from "./DetectiveNotebook";
import { EvidenceNotebook } from "./EvidenceNotebook";
import { EvidenceUnlockModal } from "./EvidenceUnlockModal";
import { ClueAnimation } from "./ClueAnimation";
import { ResolutionScene } from "./ResolutionScene";
import { HintDialog } from "./HintDialog";
import { getHint } from "@/data/hints";

export function GameScene() {
  const {
    phase,
    currentNode,
    currentCase,
    setCurrentNode,
    setPhase,
    addClue,
    unlockEvidence,
    addScore,
    setStarsEarned,
  } = useDetectiveGame();

  const { isMuted, toggleMute, playSuccess } = useAudio();

  const [currentStoryNode, setCurrentStoryNode] = useState<StoryNode | null>(null);
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [showNotebook, setShowNotebook] = useState(false);
  const [pendingClue, setPendingClue] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState<string>("");

  useEffect(() => {
    const story = getStory(currentCase);
    const node = story[currentNode];
    if (node) {
      setCurrentStoryNode(node);
      setPhase(node.phase);
      setVisibleMessages(0);
    }
  }, [currentNode, currentCase]);
  
  const handleChatClick = () => {
    if (!currentStoryNode) return;
    
    if (visibleMessages < currentStoryNode.messages.length) {
      setVisibleMessages((prev) => prev + 1);
    } else if (currentStoryNode.autoAdvance && !currentStoryNode.question) {
      setCurrentNode(currentStoryNode.autoAdvance.nextNode);
    }
  };

  const handleChoiceSelected = (choice: any) => {
    if (choice.clueAwarded) {
      const clue = {
        ...choice.clueAwarded,
        timestamp: Date.now(),
      };
      addClue(clue);
      setPendingClue(clue);
      playSuccess();
    }

    if (choice.evidenceAwarded) {
      unlockEvidence(choice.evidenceAwarded);
      playSuccess();
    }

    if (choice.pointsAwarded) {
      addScore(choice.pointsAwarded);
    }

    setTimeout(() => {
      setCurrentNode(choice.nextNode);
    }, 500);
  };

  const handleClueAnimationComplete = () => {
    setPendingClue(null);
  };

  const handleResolutionContinue = () => {
    setPhase("menu");
  };
  
  const handleShowHint = () => {
    const hint = getHint(currentCase, currentNode);
    if (hint) {
      setCurrentHint(hint);
      setShowHint(true);
    }
  };
  
  const isHintAvailable = () => {
    return getHint(currentCase, currentNode) !== null;
  };

  if (phase === "resolution" && currentNode === "end") {
    return <ResolutionScene onContinue={handleResolutionContinue} />;
  }

  if (!currentStoryNode) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="text-gray-600">←</button>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            🔍
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">
              {caseMetadata[currentCase]?.title || "Case Investigation"}
            </h1>
            <p className="text-xs text-gray-500">
              {phase === "stage1" && "Stage 1: Testimony & Hypothesis"}
              {phase === "stage2" && "Stage 2: Data Collection"}
              {phase === "stage3" && "Stage 3: Data Preprocessing"}
              {phase === "stage4" && "Stage 4: Evidence Analysis"}
              {phase === "stage5" && "Stage 5: Insight & Resolution"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setShowNotebook(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            <BookOpen className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 cursor-pointer"
        onClick={handleChatClick}
      >
        {currentStoryNode.messages.slice(0, visibleMessages).map((message, index) => (
          <ChatMessage key={message.id} message={message} index={index} />
        ))}
        
        {visibleMessages < currentStoryNode.messages.length && (
          <div className="text-center py-2">
            <span className="text-gray-400 text-sm">Tap to continue...</span>
          </div>
        )}

        {visibleMessages === currentStoryNode.messages.length && (
          <>
            {currentStoryNode.dataVisualizations?.map((viz, index) => (
              <DataVisualization key={index} visualization={viz} />
            ))}

            {currentStoryNode.question && (
              <div onClick={(e) => e.stopPropagation()}>
                <ChoiceButtons
                  question={currentStoryNode.question.text}
                  choices={currentStoryNode.question.choices}
                  onChoiceSelected={handleChoiceSelected}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Input Area */}
      <div className="bg-white border-t border-gray-200 px-3 py-2 safe-area-bottom">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-blue-500">
            <Plus className="w-6 h-6" />
          </button>
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5">
            <span className="text-gray-500 text-sm">Tap anywhere to continue...</span>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
            <Mic className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-blue-500">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      <EvidenceNotebook 
        isOpen={showNotebook} 
        onClose={() => setShowNotebook(false)}
      />
      
      <EvidenceUnlockModal />
      
      {pendingClue && (
        <ClueAnimation clue={pendingClue} onComplete={handleClueAnimationComplete} />
      )}
      
      <HintDialog 
        isOpen={showHint} 
        onClose={() => setShowHint(false)} 
        hint={currentHint}
      />
    </div>
  );
}
