import { motion, AnimatePresence } from "framer-motion";
import { Users, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface Account {
  id: string;
  username: string;
  rank: number;
  accountAge: number;
  playTime: number;
  winRate: number;
  friendCount: number;
  isGhost: boolean;
}

interface GhostAccountSelectionProps {
  data: {
    accounts: Account[];
    maxSelections: number;
    targetCount: number;
  };
  onComplete: (correctSelections: number) => void;
}

export function GhostAccountSelection({ data, onComplete }: GhostAccountSelectionProps) {
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const playSound = (soundName: string) => {
    try {
      const audio = new Audio(`/sounds/${soundName}.mp3`);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (error) {}
  };

  const handleToggleAccount = (accountId: string) => {
    if (isComplete) return;

    const newSelected = new Set(selectedAccounts);
    if (newSelected.has(accountId)) {
      newSelected.delete(accountId);
      playSound("click");
    } else {
      if (newSelected.size < data.maxSelections) {
        newSelected.add(accountId);
        playSound("notification");
      }
    }
    setSelectedAccounts(newSelected);
  };

  const handleSubmit = () => {
    const correct = data.accounts.filter(
      acc => selectedAccounts.has(acc.id) && acc.isGhost
    ).length;

    setCorrectCount(correct);
    setShowResult(true);
    setIsComplete(true);

    if (correct === data.targetCount) {
      playSound("success");
    } else {
      playSound("warning-beep");
    }

    setTimeout(() => {
      onComplete(correct);
    }, 2000);
  };

  const isAccountSelected = (accountId: string) => selectedAccounts.has(accountId);

  const getAccountBorderColor = (account: Account) => {
    if (!showResult) {
      return isAccountSelected(account.id) ? "border-blue-500" : "border-gray-300";
    }

    if (isAccountSelected(account.id)) {
      return account.isGhost ? "border-green-500" : "border-red-500";
    }
    return "border-gray-300";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🎯 Select Suspicious Accounts
        </h2>
        <p className="text-gray-600">
          Select {data.maxSelections} accounts that appear to be bots
        </p>
        <p className="text-sm text-gray-500 mt-2">
          💡 Hint: Check account age (&lt; 7 days) and friend count (0)
        </p>
      </div>

      {/* Account Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {data.accounts.map((account, index) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onClick={() => handleToggleAccount(account.id)}
            className={`
              relative p-4 rounded-lg border-2 cursor-pointer transition-all
              ${getAccountBorderColor(account)}
              ${isAccountSelected(account.id) ? "bg-blue-50" : "bg-white"}
              hover:shadow-md
            `}
          >
            {/* Selection Indicator */}
            {isAccountSelected(account.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </motion.div>
            )}

            {/* Result Indicator */}
            {showResult && isAccountSelected(account.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -left-2"
              >
                {account.isGhost ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </motion.div>
            )}

            {/* Account Info */}
            <div className="text-center">
              <div className="font-bold text-sm mb-2 truncate">{account.username}</div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Rank: #{account.rank}</div>
                <div>Age: {account.accountAge}d</div>
                <div>Win: {account.winRate}%</div>
                <div>Friends: {account.friendCount}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selection Counter */}
      <div className="text-center mb-4">
        <span className={`text-lg font-semibold ${
          selectedAccounts.size === data.maxSelections ? "text-blue-600" : "text-gray-600"
        }`}>
          Selected: {selectedAccounts.size}/{data.maxSelections}
        </span>
      </div>

      {/* Result Message */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-lg mb-4 ${
              correctCount === data.targetCount
                ? "bg-green-50 border-2 border-green-500"
                : correctCount >= 2
                ? "bg-yellow-50 border-2 border-yellow-500"
                : "bg-red-50 border-2 border-red-500"
            }`}
          >
            <div className="text-center font-semibold">
              {correctCount === data.targetCount && (
                <span className="text-green-700">
                  🎉 Perfect! All ghost accounts identified! +30 points
                </span>
              )}
              {correctCount === 2 && (
                <span className="text-yellow-700">
                  👍 Good! 2 out of 3 correct. +20 points
                </span>
              )}
              {correctCount === 1 && (
                <span className="text-orange-700">
                  🤔 1 out of 3 correct. +10 points
                </span>
              )}
              {correctCount === 0 && (
                <span className="text-red-700">
                  ❌ None correct. Check account age and win rate! +5 points
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      {!isComplete && (
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={selectedAccounts.size !== data.maxSelections}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              selectedAccounts.size === data.maxSelections
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Confirm Selection
          </motion.button>
        </div>
      )}
    </div>
  );
}
