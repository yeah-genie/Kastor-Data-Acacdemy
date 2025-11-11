import { useState, useEffect, useRef } from "react";
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
import { EvidencePresentationModal } from "./EvidencePresentationModal";
import { ClueAnimation } from "./ClueAnimation";
import { ResolutionScene } from "./ResolutionScene";
import { HintDialog } from "./HintDialog";
import { getHint } from "@/data/hints";
import { CharacterCardsSlider } from "./CharacterCardsSlider";
import HintSystem from "./HintSystem";
import { CharacterEvidence } from "@/lib/stores/useDetectiveGame";
import { CaseClosedModal } from "./CaseClosedModal";
import { TypingIndicator } from "./TypingIndicator";
import { TutorialOverlay } from "./TutorialOverlay";
import { StageSummaryCard } from "./StageSummaryCard";
import { getStageSummary } from "@/data/case1-summaries";
import { type StageSummary } from "@/data/case1-story-new";
import { ResumeGameModal } from "./ResumeGameModal";
import { InteractiveSequenceHandler } from "./InteractiveSequenceHandler";
import CharacterUnlockModal, { type CharacterData } from "./CharacterUnlockModal";
import SkillUnlockModal, { type SkillData } from "./SkillUnlockModal";
import { episode1Unlocks } from "@/data/episode1-unlocks";

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
    recordNodeVisited,
    visitedCharacters,
    evidenceCollected,
    hasNewEvidence,
    clearNewEvidenceFlag,
    score,
    highlightedEvidenceId,
  } = useDetectiveGame();

  const { isMuted, toggleMute, playSuccess, playHit } = useAudio();

  const [currentStoryNode, setCurrentStoryNode] = useState<StoryNode | null>(null);
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [showNotebook, setShowNotebook] = useState(false);
  const [pendingClue, setPendingClue] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState<string>("");
  const [showCharacterCardsSlider, setShowCharacterCardsSlider] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showEvidencePresentation, setShowEvidencePresentation] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ caseNumber: number; caseTitle: string } | null>(null);
  const [handledCelebrationId, setHandledCelebrationId] = useState<string | null>(null);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [typingSpeaker, setTypingSpeaker] = useState<string | undefined>(undefined);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showStageSummary, setShowStageSummary] = useState(false);
  const [currentStageSummary, setCurrentStageSummary] = useState<StageSummary | null>(null);
  const [showBackModal, setShowBackModal] = useState(false);
  const [showInteractiveSequence, setShowInteractiveSequence] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const activeTypingCount = useRef(0);
  const [isTyping, setIsTyping] = useState(false);
  const [hintRevealed, setHintRevealed] = useState(false);
  const [choicesRevealed, setChoicesRevealed] = useState(false);
  const [dataRevealed, setDataRevealed] = useState(false);
  const revealTimersRef = useRef<number[]>([]);
  const [isAwaitingAdvance, setIsAwaitingAdvance] = useState(false);
  const [typingTrigger, setTypingTrigger] = useState(0);
  const [showCharacterUnlock, setShowCharacterUnlock] = useState(false);
  const [unlockedCharacter, setUnlockedCharacter] = useState<CharacterData | null>(null);
  const [showSkillUnlock, setShowSkillUnlock] = useState(false);
  const [unlockedSkill, setUnlockedSkill] = useState<SkillData | null>(null);

  const shouldUseTypewriter = (speaker: string): boolean => {
    return ["detective", "maya", "chris", "ryan", "client"].includes(speaker);
  };

  const getStageNumberFromNode = (nodeId: string): number | null => {
    const summaryMap: Record<string, number> = {
      'stage2_start': 1,
      'stage3_start': 2,
      'stage4_start': 3,
      'confront_chris': 4,
    };
    return summaryMap[nodeId] ?? null;
  };

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("kastor_tutorial_completed");
    if (!hasSeenTutorial && currentCase === 1 && currentNode === "intro") {
      setShowTutorial(true);
    }
  }, [currentCase, currentNode]);

  const handleTutorialComplete = () => {
    localStorage.setItem("kastor_tutorial_completed", "true");
    setShowTutorial(false);
  };

  useEffect(() => {
    if (highlightedEvidenceId) {
      setShowNotebook(true);
    }
  }, [highlightedEvidenceId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages, showCharacterCardsSlider, showQuestion, showTypingIndicator, dataRevealed, hintRevealed, choicesRevealed, typingTrigger]);

  const handleCharacterTyped = () => {
    setTypingTrigger(prev => prev + 1);
  };
  

  useEffect(() => {
    if (!currentStoryNode) return;
    
    const visibleMessagesList = currentStoryNode.messages.slice(0, visibleMessages);
    
    const celebrationMessage = visibleMessagesList.find(msg => msg.celebration);
    if (celebrationMessage && celebrationMessage.celebration && celebrationMessage.id !== handledCelebrationId) {
      setCelebrationData(celebrationMessage.celebration);
      setShowCelebration(true);
      setHandledCelebrationId(celebrationMessage.id);
    }
    
    const hasQuestion = visibleMessagesList.some(msg => msg.isQuestion);
    if (hasQuestion && !showQuestion) {
      setShowQuestion(true);
    }
    
    const hasCharacterCards = visibleMessagesList.some(msg => msg.isCharacterCards);
    if (hasCharacterCards && !showCharacterCardsSlider) {
      setShowCharacterCardsSlider(true);
    }
  }, [visibleMessages, currentStoryNode, handledCelebrationId, showQuestion, showCharacterCardsSlider]);

  useEffect(() => {
    const story = getStory(currentCase);
    const node = story[currentNode];
    if (node) {
      setCurrentStoryNode(node);
      setPhase(node.phase);
      
      const stageNumber = getStageNumberFromNode(currentNode);
      if (stageNumber !== null) {
        const summary = getStageSummary(stageNumber);
        if (summary) {
          setCurrentStageSummary({
            ...summary,
            evidenceCount: evidenceCollected.length
          });
          setShowStageSummary(true);
          setVisibleMessages(0);
          setShowCharacterCardsSlider(false);
          setShowQuestion(false);
          setShowEvidencePresentation(false);
          setHandledCelebrationId(null);
          recordNodeVisited(currentNode);
          return;
        }
      }
      
      let autoVisibleCount = 0;
      for (const message of node.messages) {
        if (message.speaker === "system" || message.speaker === "narrator") {
          autoVisibleCount++;
        } else {
          break;
        }
      }
      
      if (autoVisibleCount === 0 && node.messages.length > 0) {
        autoVisibleCount = 1;
      }
      
      setVisibleMessages(autoVisibleCount);
      setShowCharacterCardsSlider(false);
      setShowQuestion(false);
      setShowEvidencePresentation(false);
      setHandledCelebrationId(null);
      setShowInteractiveSequence(!!node.interactiveSequence);

      // Check for unlocks (Episode 1 only for now)
      if (currentCase === 1) {
        const unlock = episode1Unlocks.find(u => u.nodeId === currentNode);
        if (unlock) {
          // Delay showing unlock modal to let messages appear first
          setTimeout(() => {
            if (unlock.type === "character") {
              setUnlockedCharacter(unlock.data as CharacterData);
              setShowCharacterUnlock(true);
            } else if (unlock.type === "skill") {
              setUnlockedSkill(unlock.data as SkillData);
              setShowSkillUnlock(true);
            }
          }, 2000);
        }
      }

      revealTimersRef.current.forEach(timer => clearTimeout(timer));
      revealTimersRef.current = [];
      setHintRevealed(false);
      setChoicesRevealed(false);
      setDataRevealed(false);
      setIsAwaitingAdvance(false);
      
      recordNodeVisited(currentNode);
      
      if (currentNode.includes('_interview')) {
        const character = currentNode.split('_')[0];
        const state = useDetectiveGame.getState();
        if (!state.visitedCharacters.includes(character)) {
          useDetectiveGame.setState({
            visitedCharacters: [...state.visitedCharacters, character]
          });
        }
      }
    }
  }, [currentNode, currentCase, evidenceCollected.length]);
  
  const handleTypingStateChange = (typing: boolean) => {
    if (typing) {
      activeTypingCount.current += 1;
      setIsTyping(true);
      setIsAwaitingAdvance(false);
    } else {
      activeTypingCount.current -= 1;
      if (activeTypingCount.current <= 0) {
        activeTypingCount.current = 0;
        setIsTyping(false);
      }
    }
  };
  
  const handleTypingComplete = () => {
    setIsAwaitingAdvance(true);
  };
  
  useEffect(() => {
    if (!currentStoryNode || visibleMessages === 0) return;
    
    const lastMessage = currentStoryNode.messages[visibleMessages - 1];
    if (lastMessage && !shouldUseTypewriter(lastMessage.speaker)) {
      setIsAwaitingAdvance(true);
    }
  }, [visibleMessages, currentStoryNode]);
  
  useEffect(() => {
    if (!currentStoryNode) return;
    
    const allMessagesRevealed = visibleMessages === currentStoryNode.messages.length && !isTyping;
    
    if (allMessagesRevealed) {
      revealTimersRef.current.forEach(timer => clearTimeout(timer));
      revealTimersRef.current = [];
      
      const timers: number[] = [];
      
      const hasNarratorMessage = currentStoryNode.messages.some(msg => msg.speaker === "narrator");
      const hasQuestion = currentStoryNode.question;
      const hasDataVisualization = currentStoryNode.dataVisualizations && currentStoryNode.dataVisualizations.length > 0;
      
      let delay = 0;
      
      if (hasNarratorMessage) {
        const timer = window.setTimeout(() => {
          setHintRevealed(true);
        }, delay);
        timers.push(timer);
        delay += 400;
      } else {
        setHintRevealed(true);
      }
      
      if (hasQuestion) {
        const timer = window.setTimeout(() => {
          setChoicesRevealed(true);
        }, delay);
        timers.push(timer);
        delay += 400;
      } else {
        setChoicesRevealed(true);
      }
      
      if (hasDataVisualization) {
        const timer = window.setTimeout(() => {
          setDataRevealed(true);
        }, delay);
        timers.push(timer);
      } else {
        setDataRevealed(true);
      }
      
      revealTimersRef.current = timers;
    }
  }, [visibleMessages, isTyping, currentStoryNode]);
  
  const handleChatClick = () => {
    if (!currentStoryNode) return;
    
    if (isTyping || !isAwaitingAdvance) {
      return;
    }
    
    if (visibleMessages < currentStoryNode.messages.length) {
      const nextMessage = currentStoryNode.messages[visibleMessages];
      const usesTypewriter = shouldUseTypewriter(nextMessage.speaker);
      
      setIsAwaitingAdvance(false);
      
      if (usesTypewriter) {
        setShowTypingIndicator(true);
        setTypingSpeaker(nextMessage.speaker);
        
        setTimeout(() => {
          setVisibleMessages(visibleMessages + 1);
          setShowTypingIndicator(false);
          setTypingSpeaker(undefined);
        }, 1000);
      } else {
        setVisibleMessages(visibleMessages + 1);
      }
    } else if (currentStoryNode.showCharacterCards && !showCharacterCardsSlider) {
      setShowCharacterCardsSlider(true);
    } else if (currentStoryNode.autoAdvance && !currentStoryNode.question && !currentStoryNode.evidencePresentation && !(currentStoryNode.dataVisualizations && currentStoryNode.dataVisualizations.length > 0)) {
      setTimeout(() => {
        setCurrentNode(currentStoryNode.autoAdvance!.nextNode);
      }, currentStoryNode.autoAdvance.delay || 500);
    }
  };
  
  const handleEvidencePresentCorrect = () => {
    if (!currentStoryNode || !currentStoryNode.evidencePresentation) return;
    
    const presentation = currentStoryNode.evidencePresentation;
    
    if (presentation.pointsAwarded) {
      addScore(presentation.pointsAwarded);
    }
    
    playSuccess();
    
    setTimeout(() => {
      setCurrentNode(presentation.nextNode);
      setShowEvidencePresentation(false);
    }, 500);
  };

  const handleStageSummaryContinue = () => {
    setShowStageSummary(false);
    setCurrentStageSummary(null);
    setIsAwaitingAdvance(false);
    
    if (!currentStoryNode) return;
    
    let autoVisibleCount = 0;
    for (const message of currentStoryNode.messages) {
      if (message.speaker === "system" || message.speaker === "narrator") {
        autoVisibleCount++;
      } else {
        break;
      }
    }
    
    if (autoVisibleCount === 0 && currentStoryNode.messages.length > 0) {
      autoVisibleCount = 1;
    }
    
    setVisibleMessages(autoVisibleCount);
  };
  
  const handleEvidencePresentWrong = () => {
    if (!currentStoryNode || !currentStoryNode.evidencePresentation) return;
    
    const presentation = currentStoryNode.evidencePresentation;
    
    if (presentation.penaltyPoints) {
      addScore(-presentation.penaltyPoints);
    }
    
    if (presentation.wrongNode) {
      setCurrentNode(presentation.wrongNode);
    } else {
      setTimeout(() => {
        setShowEvidencePresentation(true);
      }, 100);
    }
    setShowEvidencePresentation(false);
  };

  const handleChoiceSelected = (choice: any) => {
    const recordDecision = useDetectiveGame.getState().recordDecision;
    const currentQuestion = currentStoryNode?.question;
    
    if (currentQuestion) {
      recordDecision(currentQuestion.id, choice.id, choice.isCorrect);
    }
    
    if (choice.isCorrect) {
      playSuccess();
    } else {
      playHit();
    }
    
    if (choice.clueAwarded) {
      const clue = {
        ...choice.clueAwarded,
        timestamp: Date.now(),
      };
      addClue(clue);
      setPendingClue(clue);
    }

    if (choice.evidenceAwarded) {
      unlockEvidence(choice.evidenceAwarded, false);
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

  const handleBackToMenu = () => {
    setShowBackModal(true);
  };
  
  const handleBackModalContinue = () => {
    setShowBackModal(false);
  };
  
  const handleBackModalStartOver = () => {
    setShowBackModal(false);
    setPhase("menu");
  };

  const handleInteractiveSequenceComplete = () => {
    setShowInteractiveSequence(false);
    if (currentStoryNode?.autoAdvance) {
      setTimeout(() => {
        setCurrentNode(currentStoryNode.autoAdvance!.nextNode);
      }, currentStoryNode.autoAdvance.delay || 500);
    }
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
          <button 
            onClick={handleBackToMenu}
            className="text-gray-600 hover:text-gray-900 transition-colors text-2xl font-light"
          >
            ←
          </button>
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

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-900 text-sm font-bold">{score} XP</span>
            </div>
          </div>
          
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => {
              setShowNotebook(true);
              clearNewEvidenceFlag();
            }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 relative"
          >
            <BookOpen className="w-5 h-5" />
            {hasNewEvidence && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div 
        onClick={handleChatClick}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 cursor-pointer"
      >
        {currentStoryNode.messages.slice(0, visibleMessages)
          .filter(message => !message.celebration)
          .map((message, index) => {
            if (message.dataVisualization && dataRevealed) {
              return (
                <DataVisualization 
                  key={message.id} 
                  visualization={message.dataVisualization} 
                />
              );
            }
            
            if (message.isCharacterCards && currentStoryNode.showCharacterCards && showCharacterCardsSlider) {
              return (
                <div key={message.id} onClick={(e) => e.stopPropagation()}>
                  <CharacterCardsSlider 
                    characters={evidenceCollected
                      .filter(e => e.type === "CHARACTER")
                      .sort((a, b) => a.timestamp - b.timestamp) as CharacterEvidence[]}
                    showNotification={!showQuestion}
                  />
                </div>
              );
            }
            
            if (message.isQuestion && currentStoryNode.question && showQuestion && choicesRevealed) {
              return (
                <div key={message.id} onClick={(e) => e.stopPropagation()}>
                  <ChoiceButtons
                    question={currentStoryNode.question.text}
                    choices={currentStoryNode.question.choices}
                    onChoiceSelected={handleChoiceSelected}
                  />
                </div>
              );
            }
            
            if (message.isEvidencePresentation && currentStoryNode.evidencePresentation && !showEvidencePresentation) {
              return (
                <div key={message.id} className="my-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setShowEvidencePresentation(true)}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2"
                  >
                    <span>🔍 Present Evidence</span>
                  </button>
                </div>
              );
            }
            
            if (message.text) {
              if (message.speaker === "narrator" && !hintRevealed) {
                return null;
              }
              return <ChatMessage key={message.id} message={message} index={index} onTypingStateChange={handleTypingStateChange} onTypingComplete={handleTypingComplete} onCharacterTyped={handleCharacterTyped} />;
            }
            
            return null;
          })}
        
        {showTypingIndicator && (
          <TypingIndicator speaker={typingSpeaker} />
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Bottom Input Area */}
      <div className="bg-white border-t border-gray-200 px-3 py-2 safe-area-bottom">
        <div className="flex items-center gap-2">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
            disabled
          >
            <Plus className="w-6 h-6" />
          </button>
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 flex items-center justify-between">
            <span className="text-gray-500 text-sm">
              {visibleMessages < currentStoryNode.messages.length 
                ? "Continue the conversation..." 
                : showQuestion || showEvidencePresentation
                  ? "Make your choice above..."
                  : currentStoryNode.dataVisualizations
                    ? "📊 Review the data above, then tap Continue..."
                    : currentStoryNode.autoAdvance
                      ? "Story continues..."
                      : "Tap Continue to proceed..."
              }
            </span>
          </div>
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
            disabled
          >
            <Mic className="w-5 h-5" />
          </button>
          <button 
            onClick={handleChatClick}
            disabled={isTyping || !isAwaitingAdvance || showTypingIndicator || (visibleMessages === currentStoryNode.messages.length && (showQuestion || showEvidencePresentation))}
            className="p-2.5 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors text-white disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      <EvidenceNotebook 
        isOpen={showNotebook} 
        onClose={() => setShowNotebook(false)}
      />
      
      <EvidenceUnlockModal />
      
      {currentStoryNode?.evidencePresentation && (
        <EvidencePresentationModal 
          isOpen={showEvidencePresentation}
          prompt={currentStoryNode.evidencePresentation.prompt}
          npcStatement={currentStoryNode.evidencePresentation.npcStatement}
          npcCharacter={currentStoryNode.evidencePresentation.npcCharacter}
          correctEvidenceId={currentStoryNode.evidencePresentation.correctEvidenceId}
          correctFeedback={currentStoryNode.evidencePresentation.correctFeedback}
          wrongFeedback={currentStoryNode.evidencePresentation.wrongFeedback}
          onCorrect={handleEvidencePresentCorrect}
          onWrong={handleEvidencePresentWrong}
          onClose={() => setShowEvidencePresentation(false)}
        />
      )}
      
      {pendingClue && (
        <ClueAnimation clue={pendingClue} onComplete={handleClueAnimationComplete} />
      )}
      
      <HintDialog 
        isOpen={showHint} 
        onClose={() => setShowHint(false)} 
        hint={currentHint}
      />
      
      {celebrationData && (
        <CaseClosedModal 
          isOpen={showCelebration} 
          onClose={() => setShowCelebration(false)}
          caseNumber={celebrationData.caseNumber}
          caseTitle={celebrationData.caseTitle}
        />
      )}
      
      {showTutorial && <TutorialOverlay onComplete={handleTutorialComplete} />}

      {showStageSummary && currentStageSummary && (
        <StageSummaryCard
          summary={currentStageSummary}
          onContinue={handleStageSummaryContinue}
        />
      )}

      {showInteractiveSequence && currentStoryNode?.interactiveSequence && (
        <div className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-2 sm:p-4">
            <InteractiveSequenceHandler
              sequence={currentStoryNode.interactiveSequence}
              onComplete={handleInteractiveSequenceComplete}
            />
          </div>
        </div>
      )}

      <ResumeGameModal
        isOpen={showBackModal}
        onContinue={handleBackModalContinue}
        onStartOver={handleBackModalStartOver}
        onClose={handleBackModalContinue}
        isBackButton={true}
      />

      {currentStoryNode?.hints && currentStoryNode.hints.length > 0 && (
        <HintSystem
          hints={currentStoryNode.hints}
          onHintUsed={(level) => {
            console.log(`Hint level ${level} used`);
            // Can track hint usage for analytics or scoring
          }}
        />
      )}

      {/* Character Unlock Modal */}
      {unlockedCharacter && (
        <CharacterUnlockModal
          isOpen={showCharacterUnlock}
          onClose={() => setShowCharacterUnlock(false)}
          character={unlockedCharacter}
        />
      )}

      {/* Skill Unlock Modal */}
      {unlockedSkill && (
        <SkillUnlockModal
          isOpen={showSkillUnlock}
          onClose={() => setShowSkillUnlock(false)}
          skill={unlockedSkill}
        />
      )}
    </div>
  );
}
