import { motion } from "framer-motion";
import { ArrowLeft, Lock, Play } from "lucide-react";

interface Episode {
  id: number;
  title: string;
  difficulty: number; // 1-5 stars
  duration: string; // e.g., "30-40 min"
  thumbnail: string;
  isLocked: boolean;
  isDemo?: boolean;
}

interface EpisodeSelectionScreenProps {
  onBack: () => void;
  onSelectEpisode: (episodeId: number) => void;
  episodes: Episode[];
}

export default function EpisodeSelectionScreen({
  onBack,
  onSelectEpisode,
  episodes
}: EpisodeSelectionScreenProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#1a1a2e] text-white overflow-auto">
      {/* Circuit background pattern */}
      <div
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `url('https://www.transparenttextures.com/patterns/circuit-board.png')`
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-[#1a1a2e]/80 p-4 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-white/10"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold">Case Files</h1>
        <div className="h-12 w-12" /> {/* Spacer */}
      </header>

      {/* Episode cards */}
      <main className="relative z-10 flex flex-col gap-6 p-4 pt-6">
        {episodes.map((episode, index) => (
          <motion.div
            key={episode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#00d9ff]/20"
          >
            {/* Background image with gradient overlay */}
            <div
              className="relative flex h-[200px] flex-col justify-between bg-cover bg-center p-4"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(26, 26, 46, 0.95) 0%, rgba(26, 26, 46, 0.3) 50%), url(${episode.thumbnail})`
              }}
            >
              {/* Lock overlay */}
              {episode.isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm backdrop-saturate-50">
                  <Lock className="h-16 w-16 text-white/50" />
                </div>
              )}

              {/* Demo badge */}
              {episode.isDemo && (
                <div className="absolute right-0 top-0 rounded-bl-lg bg-orange-500/90 px-3 py-1 text-xs font-bold text-white">
                  DEMO
                </div>
              )}

              {/* Episode number */}
              <div
                className={`text-sm font-medium ${
                  episode.isLocked ? "text-white/60" : "text-white/80"
                }`}
              >
                EP {episode.id.toString().padStart(2, "0")}
              </div>

              {/* Bottom section */}
              <div className="flex w-full items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2
                    className={`text-lg font-bold leading-tight ${
                      episode.isLocked ? "text-white/80" : "text-white"
                    }`}
                  >
                    {episode.title}
                  </h2>
                  <p
                    className={`text-xs ${
                      episode.isLocked ? "text-white/50" : "text-white/70"
                    }`}
                  >
                    Difficulty:{" "}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>
                        {i < episode.difficulty ? "⭐" : "☆"}
                      </span>
                    ))}{" "}
                    | {episode.duration}
                  </p>
                </div>

                {/* Action button */}
                {episode.isLocked ? (
                  <button
                    disabled
                    className="flex h-10 items-center justify-center rounded-lg bg-white/30 px-4 text-sm font-bold text-white/70"
                  >
                    LOCKED
                  </button>
                ) : (
                  <motion.button
                    onClick={() => onSelectEpisode(episode.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#00d9ff] px-4 text-sm font-bold text-[#1a1a2e] shadow-lg shadow-[#00d9ff]/30"
                  >
                    <Play className="h-4 w-4" fill="currentColor" />
                    START
                  </motion.button>
                )}
              </div>
            </div>

            {/* Progress bar (if unlocked and started) */}
            {!episode.isLocked && episode.id === 1 && (
              <div className="h-1 w-full bg-black/30">
                <div className="h-full w-[35%] bg-[#00d9ff]" />
              </div>
            )}
          </motion.div>
        ))}
      </main>

      {/* Coming soon hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.5 }}
        className="mt-8 pb-8 text-center text-xs text-white/40"
      >
        More episodes coming soon...
      </motion.div>
    </div>
  );
}
