import { useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, GripVertical, AlertTriangle } from "lucide-react";
import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";

interface TimelineEvent {
  id: string;
  time: string;
  text: string;
  order: number;
  suspicious?: boolean;
}

interface TimelineReconstructionProps {
  events: TimelineEvent[];
  onComplete: (correct: boolean) => void;
}

function SortableEvent({ event }: { event: TimelineEvent }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: event.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border-2 ${
        event.suspicious
          ? "bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-800"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none flex-shrink-0">
        <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs sm:text-sm">{event.time}</span>
          {event.suspicious && <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />}
        </div>
        <p className="text-xs sm:text-sm truncate">{event.text}</p>
      </div>
    </div>
  );
}

export function TimelineReconstruction({ events, onComplete }: TimelineReconstructionProps) {
  const recordInteractiveSequence = useDetectiveGame((state) => state.recordInteractiveSequence);
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const [sortedEvents, setSortedEvents] = useState(() => shuffleArray(events));
  const [isChecking, setIsChecking] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedEvents.findIndex((e) => e.id === active.id);
      const newIndex = sortedEvents.findIndex((e) => e.id === over.id);

      const newOrder = [...sortedEvents];
      const [removed] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, removed);

      setSortedEvents(newOrder);
    }
  };

  const checkOrder = () => {
    setIsChecking(true);
    setShowFeedback(true);

    const correct = sortedEvents.every((event, index) => {
      const originalEvent = events.find((e) => e.id === event.id);
      return originalEvent && originalEvent.order === index + 1;
    });

    setIsCorrect(correct);

    if (correct) {
      recordInteractiveSequence();
    }

    setTimeout(() => {
      onComplete(correct);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto max-h-[90vh] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2 justify-center text-lg sm:text-xl">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          Timeline Reconstruction
        </CardTitle>
        <p className="text-center text-sm sm:text-base text-muted-foreground">
          Drag to arrange events in order
        </p>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 overflow-y-auto flex-1">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortedEvents.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {sortedEvents.map((event) => (
                <SortableEvent key={event.id} event={event} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {!showFeedback && (
          <Button onClick={checkOrder} className="w-full" size="lg">
            Check Timeline
          </Button>
        )}

        {showFeedback && (
          <div
            className={`p-3 sm:p-4 rounded-lg ${
              isCorrect
                ? "bg-green-100 dark:bg-green-900/20 border border-green-500"
                : "bg-red-100 dark:bg-red-900/20 border border-red-500"
            }`}
          >
            <p
              className={`text-sm sm:text-base font-medium ${
                isCorrect
                  ? "text-green-900 dark:text-green-100"
                  : "text-red-900 dark:text-red-100"
              }`}
            >
              {isCorrect
                ? "✓ Perfect! The timeline shows Ryan logged in from home after work hours!"
                : "✗ Not quite right. Look at the times carefully - what happened after Ryan left work?"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
