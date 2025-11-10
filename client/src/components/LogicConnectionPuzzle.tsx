import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Brain, ArrowRight, Check } from "lucide-react";
import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";

interface Thought {
  id: string;
  text: string;
}

interface Connection {
  from: string;
  to: string;
  deduction: string;
}

interface LogicConnectionPuzzleProps {
  thoughts: Thought[];
  correctConnections: Connection[];
  onComplete: () => void;
}

export function LogicConnectionPuzzle({
  thoughts,
  correctConnections,
  onComplete,
}: LogicConnectionPuzzleProps) {
  const recordLogicConnection = useDetectiveGame((state) => state.recordLogicConnection);
  const [selectedThoughts, setSelectedThoughts] = useState<string[]>([]);
  const [madeConnections, setMadeConnections] = useState<Connection[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleThoughtClick = (thoughtId: string) => {
    if (showSuccess) return;

    if (selectedThoughts.includes(thoughtId)) {
      setSelectedThoughts(selectedThoughts.filter((id) => id !== thoughtId));
    } else if (selectedThoughts.length < 2) {
      const newSelected = [...selectedThoughts, thoughtId];
      setSelectedThoughts(newSelected);

      if (newSelected.length === 2) {
        checkConnection(newSelected[0], newSelected[1]);
      }
    }
  };

  const checkConnection = (from: string, to: string) => {
    const connection = correctConnections.find(
      (c) => (c.from === from && c.to === to) || (c.from === to && c.to === from)
    );

    if (connection) {
      setMadeConnections([...madeConnections, connection]);
      recordLogicConnection();

      setTimeout(() => {
        setSelectedThoughts([]);

        if (madeConnections.length + 1 === correctConnections.length) {
          setShowSuccess(true);
          setTimeout(onComplete, 2000);
        }
      }, 1000);
    } else {
      setTimeout(() => {
        setSelectedThoughts([]);
      }, 500);
    }
  };

  const isThoughtConnected = (thoughtId: string) => {
    return madeConnections.some((c) => c.from === thoughtId || c.to === thoughtId);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto max-h-[90vh] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2 justify-center text-lg sm:text-xl">
          <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
          Logic Connection
        </CardTitle>
        <p className="text-center text-sm sm:text-base text-muted-foreground">
          Connect related thoughts to form deductions
        </p>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 overflow-y-auto flex-1">
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {thoughts.map((thought) => (
            <Button
              key={thought.id}
              variant={
                selectedThoughts.includes(thought.id)
                  ? "default"
                  : isThoughtConnected(thought.id)
                  ? "secondary"
                  : "outline"
              }
              size="lg"
              onClick={() => handleThoughtClick(thought.id)}
              disabled={isThoughtConnected(thought.id) || showSuccess}
              className="h-auto py-3 sm:py-4 px-4 sm:px-6 text-left whitespace-normal min-h-[60px]"
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5 sm:mt-1 flex-shrink-0">
                  {isThoughtConnected(thought.id) ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-current" />
                  )}
                </div>
                <span className="flex-1 text-sm sm:text-base">{thought.text}</span>
              </div>
            </Button>
          ))}
        </div>

        {madeConnections.length > 0 && (
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-sm sm:text-base font-semibold text-center">Deductions Made:</h3>
            {madeConnections.map((conn, index) => (
              <div
                key={index}
                className="bg-blue-100 dark:bg-blue-900/20 border border-blue-500 rounded-lg p-3 sm:p-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm flex-1">
                    {thoughts.find((t) => t.id === conn.from)?.text}
                  </span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm flex-1">
                    {thoughts.find((t) => t.id === conn.to)?.text}
                  </span>
                </div>
                <div className="mt-2 text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-100">
                  💡 {conn.deduction}
                </div>
              </div>
            ))}
          </div>
        )}

        {showSuccess && (
          <div className="bg-green-100 dark:bg-green-900/20 border border-green-500 rounded-lg p-3 sm:p-4 text-center">
            <p className="text-sm sm:text-base font-medium text-green-900 dark:text-green-100">
              ✓ All connections made! The picture is becoming clearer...
            </p>
          </div>
        )}

        <div className="text-center text-xs sm:text-sm text-muted-foreground">
          Select two thoughts to connect them
          <br />
          {madeConnections.length} / {correctConnections.length} connections made
        </div>
      </CardContent>
    </Card>
  );
}
