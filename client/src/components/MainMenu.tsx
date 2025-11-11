import { motion } from "framer-motion";
import { Play, RotateCcw, Book, Settings } from "lucide-react";

interface MainMenuProps {
  onNewGame: () => void;
  onContinue: () => void;
  onEpisodes: () => void;
  onSettings: () => void;
  hasSaveData: boolean;
}

export default function MainMenu({
  onNewGame,
  onContinue,
  onEpisodes,
  onSettings,
  hasSaveData
}: MainMenuProps) {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#1a1a2e]">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(-45deg, #1a1a2e, #1f2a40, #1a1a2e, #2c3e50)",
            "linear-gradient(-45deg, #1f2a40, #1a1a2e, #2c3e50, #1a1a2e)",
            "linear-gradient(-45deg, #1a1a2e, #1f2a40, #1a1a2e, #2c3e50)"
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "400% 400%" }}
      />

      {/* Circuit pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300d9ff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Offline indicator (optional) */}
      <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-xs text-white/60 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        Offline Mode
      </div>

      {/* Main content */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-stretch gap-6 px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 flex flex-col items-center gap-2"
        >
          <h1
            className="text-[40px] font-bold leading-tight text-white"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            KASTOR
          </h1>
          <p className="text-sm uppercase tracking-[0.3em] text-[#00d9ff]">
            Data Academy
          </p>
        </motion.div>

        {/* Menu buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          {/* New Game - Primary button */}
          <motion.button
            onClick={onNewGame}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex h-[60px] w-full items-center justify-between overflow-hidden rounded-lg bg-gradient-to-r from-[#00d9ff] to-[#00a6c7] p-4 text-[#1a1a2e] shadow-lg shadow-[#00d9ff]/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <Play className="h-6 w-6" fill="currentColor" />
              <span className="text-lg font-bold">New Game</span>
            </div>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-[#1a1a2e]"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.button>

          {/* Continue - Secondary button */}
          <motion.button
            onClick={onContinue}
            disabled={!hasSaveData}
            whileHover={hasSaveData ? { scale: 1.02 } : {}}
            whileTap={hasSaveData ? { scale: 0.98 } : {}}
            className={`flex h-[60px] w-full items-center justify-between overflow-hidden rounded-lg border border-white/20 p-4 backdrop-blur-sm transition-all ${
              hasSaveData
                ? "bg-white/10 text-white hover:bg-white/20"
                : "cursor-not-allowed bg-white/5 text-white/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="h-6 w-6" />
              <span className="text-lg font-bold">Continue</span>
            </div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-current"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>

          {/* Episodes */}
          <motion.button
            onClick={onEpisodes}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex h-[60px] w-full items-center justify-between overflow-hidden rounded-lg border border-white/20 bg-white/10 p-4 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <div className="flex items-center gap-3">
              <Book className="h-6 w-6" />
              <span className="text-lg font-bold">Episodes</span>
            </div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>

          {/* Settings */}
          <motion.button
            onClick={onSettings}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex h-[60px] w-full items-center justify-between overflow-hidden rounded-lg border border-white/20 bg-white/10 p-4 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6" />
              <span className="text-lg font-bold">Settings</span>
            </div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </motion.div>

        {/* Footer hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
          className="mt-8 flex flex-col items-center gap-1 text-center text-white/60"
        >
          <p className="text-xs uppercase tracking-widest">
            Uncover the Truth Through Data
          </p>
        </motion.div>
      </div>

      {/* Version */}
      <div className="absolute bottom-4 text-xs text-white/30">v1.0.0 BETA</div>
    </div>
  );
}
