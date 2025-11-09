import { motion } from "framer-motion";
import { FileText, User } from "lucide-react";
import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";
import { caseMetadata } from "@/data/stories";
import { useState } from "react";
import { ResumeGameModal } from "./ResumeGameModal";

const case1Image = "/cases/case1.jpg";
const case2Image = "/cases/case2.jpg";
const case3Image = "/cases/case3.jpg";

export function StartMenu() {
  const { startCase, unlockedCases, achievements, getProgress, getCurrentXP, getCurrentLevel, getCaseProgressDetails, resetCaseFor } = useDetectiveGame();
  const [activeTab, setActiveTab] = useState<"missions" | "profile">("missions");
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<number | null>(null);

  const currentXP = getCurrentXP();
  const currentLevel = getCurrentLevel();

  const getCaseProgress = (caseId: number) => {
    const details = getCaseProgressDetails(caseId);
    return details.percentComplete;
  };

  const handleCaseClick = (caseId: number) => {
    const details = getCaseProgressDetails(caseId);
    
    if (details.isInProgress) {
      setSelectedCase(caseId);
      setShowResumeModal(true);
    } else {
      startCase(caseId, false);
    }
  };

  const handleResumeContinue = () => {
    if (selectedCase !== null) {
      startCase(selectedCase, true);
      setShowResumeModal(false);
      setSelectedCase(null);
    }
  };

  const handleResumeStartOver = () => {
    if (selectedCase !== null) {
      resetCaseFor(selectedCase);
      startCase(selectedCase, false);
      setShowResumeModal(false);
      setSelectedCase(null);
    }
  };

  const handleResumeClose = () => {
    setShowResumeModal(false);
    setSelectedCase(null);
  };

  const isCaseUnlocked = (caseId: number) => {
    return unlockedCases.includes(caseId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <h1 className="text-xl font-semibold text-gray-900">More actions</h1>
        </div>
        <div className="w-10 h-10 bg-gray-800 rounded-full" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeTab === "missions" && (
          <div className="max-w-md mx-auto space-y-6">
            {/* Your Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Current XP</p>
                  <p className="text-2xl font-bold text-gray-900">{currentXP.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Current Level</p>
                  <p className="text-2xl font-bold text-gray-900">{currentLevel}</p>
                </div>
              </div>
            </div>

            {/* Available Missions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Missions</h2>
              <div className="space-y-4">
                {Object.keys(caseMetadata).map((key) => {
                  const caseId = parseInt(key);
                  const metadata = caseMetadata[caseId];
                  const isUnlocked = isCaseUnlocked(caseId);
                  const progress = getCaseProgress(caseId);

                  return (
                    <motion.div
                      key={caseId}
                      whileTap={isUnlocked ? { scale: 0.98 } : {}}
                      onClick={() => isUnlocked && handleCaseClick(caseId)}
                      className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 ${
                        isUnlocked ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {/* Mission Image */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-600 overflow-hidden">
                        <img 
                          src={caseId === 1 ? case1Image : caseId === 2 ? case2Image : case3Image} 
                          alt={metadata.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Blur gradient overlay at bottom */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-[2px]" />
                        
                        {!isUnlocked && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="text-white text-sm font-semibold bg-black/70 px-4 py-2 rounded-lg">
                              🔒 Locked
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mission Info */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {metadata.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {isUnlocked ? metadata.subtitle : "Complete previous missions to unlock"}
                        </p>

                        {/* Progress Bar */}
                        {isUnlocked && (
                          <div>
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span className="font-semibold text-blue-600">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total XP</span>
                  <span className="font-bold text-gray-900">{currentXP.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Level</span>
                  <span className="font-bold text-gray-900">{currentLevel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Achievements</span>
                  <span className="font-bold text-gray-900">{achievements.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Missions Completed</span>
                  <span className="font-bold text-gray-900">
                    {unlockedCases.filter(id => getCaseProgress(id) === 100).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-around">
        <button
          onClick={() => setActiveTab("missions")}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
            activeTab === "missions" ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-xs font-medium">Missions</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
            activeTab === "profile" ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>

      <ResumeGameModal
        isOpen={showResumeModal}
        onContinue={handleResumeContinue}
        onStartOver={handleResumeStartOver}
        onClose={handleResumeClose}
      />
    </div>
  );
}
