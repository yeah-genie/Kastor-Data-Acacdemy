import { useState, forwardRef } from "react";
import { BaseEvidenceCard } from "./BaseEvidenceCard";
import { DataEvidence } from "@/lib/stores/useDetectiveGame";
import { BarChart3, Bookmark } from "lucide-react";

interface DataCardProps {
  evidence: DataEvidence;
  delay?: number;
  isHighlighted?: boolean;
  collapsed?: boolean;
}

export const DataCard = forwardRef<HTMLDivElement, DataCardProps>(
  ({ evidence, delay = 0, isHighlighted = false, collapsed = false }, ref) => {
    const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);

    if (collapsed) {
      return (
        <div className="flex items-center gap-2 p-3 min-w-[120px]">
          <BarChart3 className="w-6 h-6 text-green-600 flex-shrink-0" />
          <p className="text-sm font-semibold text-gray-900 line-clamp-2">{evidence.title}</p>
        </div>
      );
    }

    const toggleHighlight = (index: number) => {
      setHighlightedIndices(prev => 
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    };

    return (
      <BaseEvidenceCard delay={delay} isHighlighted={isHighlighted} ref={ref}>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
          <h4 className="font-semibold text-sm md:text-base text-gray-900 truncate">{evidence.title}</h4>
        </div>
        
        {evidence.dataType === "log" && evidence.data?.entries && (
          <div className="space-y-2">
            <div className="text-[10px] md:text-xs text-gray-600 mb-2 flex items-center gap-2">
              <Bookmark className="w-3 h-3 flex-shrink-0" />
              <span>Tap log entries to highlight important ones</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 md:p-3 font-mono text-[10px] md:text-xs overflow-x-auto border border-gray-200 max-h-64 overflow-y-auto">
              {evidence.data.entries.map((entry: any, entryIdx: number) => (
                <div
                  key={entryIdx}
                  onClick={() => toggleHighlight(entryIdx)}
                  className={`py-1 px-2 rounded cursor-pointer transition-colors ${
                    highlightedIndices.includes(entryIdx)
                      ? "bg-yellow-100 text-yellow-900 border-l-2 border-yellow-500"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-blue-600">{entry.time}</span>
                  {" | "}
                  <span className="text-green-600">{entry.user}</span>
                  {" | "}
                  <span className="text-purple-600">{entry.action}</span>
                  {entry.ip && (
                    <>
                      {" | "}
                      <span className="text-orange-600">{entry.ip}</span>
                    </>
                  )}
                  {highlightedIndices.includes(entryIdx) && (
                    <span className="ml-2 text-yellow-600">★</span>
                  )}
                </div>
              ))}
            </div>
            {highlightedIndices.length > 0 && (
              <div className="text-[10px] md:text-xs text-green-700 bg-green-50 border border-green-200 p-2 rounded">
                ✓ {highlightedIndices.length} important {highlightedIndices.length === 1 ? "entry" : "entries"} highlighted
              </div>
            )}
          </div>
        )}

        {evidence.dataType === "table" && evidence.data?.headers && evidence.data?.rows && (
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-[10px] md:text-xs border-collapse">
              <thead>
                <tr className="bg-green-50">
                  {evidence.data.headers.map((header: string, i: number) => (
                    <th key={i} className="border border-gray-200 px-2 md:px-3 py-1 md:py-2 text-left font-semibold text-green-700 whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {evidence.data.rows.map((row: string[], i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {row.map((cell, j) => (
                      <td key={j} className="border border-gray-200 px-2 md:px-3 py-1 md:py-2 text-gray-700 whitespace-nowrap">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {evidence.dataType === "chart" && (
          <p className="text-xs md:text-sm text-gray-600 italic">Chart visualization (view in chat for interactive display)</p>
        )}

        {!["log", "table", "chart"].includes(evidence.dataType || "") && (
          <p className="text-xs md:text-sm text-gray-600">Data Type: {evidence.dataType}</p>
        )}
      </BaseEvidenceCard>
    );
  }
);

DataCard.displayName = "DataCard";
