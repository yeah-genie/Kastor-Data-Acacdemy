import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Button } from "../ui/button";

interface RankDialogueLine {
  speaker: string;
  text: string;
}

interface RankEntry {
  id: string;
  requirements?: Record<string, number | string>;
  dialogue: RankDialogueLine[];
}

interface RankDisplayProps {
  ranks: RankEntry[];
  activeRankId?: string;
  onContinue: () => void;
}

export function RankDisplay({
  ranks,
  activeRankId,
  onContinue
}: RankDisplayProps) {
  const activeRank =
    ranks.find((rank) => rank.id === activeRankId) ?? ranks[0] ?? null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#111827] shadow-2xl overflow-hidden"
      >
        <div className="border-b border-white/10 bg-[#0c1220] px-6 py-5 text-center text-white">
          <div className="flex justify-center">
            <Trophy className="h-12 w-12 text-[#00d9ff]" />
          </div>
          <h2 className="mt-2 text-xl font-bold uppercase tracking-widest">
            최종 평가
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Investigation Performance Summary
          </p>
        </div>

        {activeRank ? (
          <div className="px-6 py-5 text-white">
            <div className="rounded-xl border border-[#00d9ff]/30 bg-[#00d9ff]/10 p-4 text-center">
              <h3 className="text-sm font-semibold uppercase tracking-[0.4em] text-[#00d9ff]">
                {activeRank.id.replace("-rank", "").toUpperCase()} RANK
              </h3>
            </div>

            <div className="mt-5 space-y-3 text-sm leading-relaxed text-white/80">
              {activeRank.dialogue.map((line, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="font-semibold text-white">
                    {line.speaker}:
                  </span>{" "}
                  {line.text}
                </motion.p>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-6 py-10 text-center text-white/70">
            평가 데이터를 불러올 수 없습니다.
          </div>
        )}

        <div className="flex justify-end border-t border-white/10 bg-[#0c1220] px-6 py-4">
          <Button onClick={onContinue} className="bg-[#00d9ff] text-black">
            다음으로
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
