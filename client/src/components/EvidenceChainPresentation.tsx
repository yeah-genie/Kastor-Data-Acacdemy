import { useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Scale, GripVertical, ArrowDown } from "lucide-react";

interface EvidencePiece {
  id: string;
  text: string;
  order: number;
}

interface EvidenceChainPresentationProps {
  evidencePieces: EvidencePiece[];
  onComplete: (correct: boolean) => void;
}

function SortableEvidence({ evidence, index }: { evidence: EvidencePiece; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: evidence.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing pt-1">
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <span className="font-mono text-xs text-muted-foreground">#{index + 1}</span>
          <p>{evidence.text}</p>
        </div>
      </div>
      {index < 4 && (
        <div className="flex justify-center py-1">
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

export function EvidenceChainPresentation({
  evidencePieces,
  onComplete,
}: EvidenceChainPresentationProps) {
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const [sortedPieces, setSortedPieces] = useState(() => shuffleArray(evidencePieces));
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedPieces.findIndex((e) => e.id === active.id);
      const newIndex = sortedPieces.findIndex((e) => e.id === over.id);

      const newOrder = [...sortedPieces];
      const [removed] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, removed);

      setSortedPieces(newOrder);
    }
  };

  const checkChain = () => {
    setShowFeedback(true);

    const correct = sortedPieces.every((piece, index) => {
      const originalPiece = evidencePieces.find((e) => e.id === piece.id);
      return originalPiece && originalPiece.order === index + 1;
    });

    setIsCorrect(correct);

    setTimeout(() => {
      onComplete(correct);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-center">
          <Scale className="w-6 h-6" />
          Evidence Chain
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Arrange the evidence in logical order to prove the case
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={sortedPieces.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div>
              {sortedPieces.map((piece, index) => (
                <SortableEvidence key={piece.id} evidence={piece} index={index} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {!showFeedback && (
          <Button onClick={checkChain} className="w-full" size="lg">
            Present Evidence Chain
          </Button>
        )}

        {showFeedback && (
          <div
            className={`p-4 rounded-lg ${
              isCorrect
                ? "bg-green-100 dark:bg-green-900/20 border border-green-500"
                : "bg-red-100 dark:bg-red-900/20 border border-red-500"
            }`}
          >
            <p
              className={`font-medium ${
                isCorrect
                  ? "text-green-900 dark:text-green-100"
                  : "text-red-900 dark:text-red-100"
              }`}
            >
              {isCorrect
                ? "✓ Perfect! The evidence chain proves Ryan's guilt beyond doubt!"
                : "✗ The chain doesn't flow logically. Think about what happened first, then what followed."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
