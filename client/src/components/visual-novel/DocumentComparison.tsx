import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface DocumentEntry {
  label: string;
  content: string;
  flag?: "suspicious" | "critical" | "expected" | "neutral";
}

interface Document {
  title: string;
  entries: DocumentEntry[];
}

interface Task {
  description: string;
}

interface DocumentComparisonProps {
  documents: Document[];
  tasks?: Task[];
  onComplete: () => void;
}

export function DocumentComparison({
  documents,
  tasks,
  onComplete
}: DocumentComparisonProps) {
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);

  const requiredIds = useMemo(() => {
    const ids: string[] = [];
    documents.forEach((doc, docIndex) => {
      doc.entries.forEach((entry, entryIndex) => {
        if (entry.flag === "suspicious" || entry.flag === "critical") {
          ids.push(`${docIndex}-${entryIndex}`);
        }
      });
    });
    return ids;
  }, [documents]);

  const allMarked = requiredIds.every((id) => marked.has(id));

  const toggleEntry = (id: string) => {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl rounded-2xl border border-white/10 bg-[#101827] shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col gap-4 border-b border-white/10 bg-[#0b1322] px-6 py-5 text-white">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            문서 대조 분석
          </h2>
          {tasks && tasks.length > 0 && (
            <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm text-amber-100">
              <p className="font-semibold mb-2">목표:</p>
              <ul className="list-disc space-y-1 pl-5">
                {tasks.map((task, index) => (
                  <li key={index}>{task.description}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
          {documents.map((doc, docIndex) => (
            <ScrollArea
              key={docIndex}
              className="max-h-[48vh] rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <h3 className="text-base font-semibold text-white mb-3">
                {doc.title}
              </h3>
              <div className="space-y-3 text-sm">
                {doc.entries.map((entry, entryIndex) => {
                  const id = `${docIndex}-${entryIndex}`;
                  const isMarked = marked.has(id);
                  const isSuspicious =
                    entry.flag === "suspicious" || entry.flag === "critical";

                  return (
                    <button
                      key={id}
                      onClick={() => {
                        if (isSuspicious) {
                          toggleEntry(id);
                        }
                      }}
                      className={`w-full text-left rounded-lg border-2 px-3 py-2 transition-all ${
                        isSuspicious
                          ? isMarked
                            ? "border-amber-400 bg-amber-400/20 text-white"
                            : "border-amber-400/40 bg-transparent text-white hover:border-amber-400 hover:bg-amber-400/10"
                          : "border-white/10 bg-white/5 text-white/70 cursor-default"
                      }`}
                    >
                      <p className="text-xs uppercase tracking-wide text-white/50">
                        {entry.label}
                      </p>
                      <p className="mt-1 text-white/90">{entry.content}</p>
                      {isMarked && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-amber-200">
                          <CheckCircle2 className="h-4 w-4" />
                          표시 완료
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 bg-[#0b1322] px-6 py-4">
          <div className="text-xs text-white/60">
            {requiredIds.length > 0 ? (
              <>
                {marked.size}/{requiredIds.length} 개의 이상 항목 표시됨
                {!allMarked && (
                  <button
                    className="ml-3 underline hover:text-white"
                    onClick={() => setShowHint((prev) => !prev)}
                  >
                    힌트 보기
                  </button>
                )}
              </>
            ) : (
              "확인할 항목이 없습니다."
            )}
            {showHint && !allMarked && (
              <div className="mt-2 text-amber-200">
                이상 항목은 붉은색 테두리를 가진 카드입니다.
              </div>
            )}
          </div>
          <Button
            onClick={onComplete}
            disabled={!allMarked}
            className="bg-[#00d9ff] text-black disabled:bg-white/10 disabled:text-white/30"
          >
            계속하기
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
