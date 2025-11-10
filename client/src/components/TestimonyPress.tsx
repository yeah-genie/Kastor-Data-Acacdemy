import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { MessageSquare, AlertCircle, FileText } from "lucide-react";
import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";

interface Statement {
  id: string;
  speaker: string;
  text: string;
  pressResponse?: string;
  hasContradiction: boolean;
  contradictionEvidence?: string;
  contradictionFeedback?: string;
}

interface TestimonyPressProps {
  statements: Statement[];
  onComplete: () => void;
}

export function TestimonyPress({ statements, onComplete }: TestimonyPressProps) {
  const recordContradiction = useDetectiveGame((state) => state.recordContradiction);
  const [currentStatementIndex, setCurrentStatementIndex] = useState(0);
  const [pressedStatements, setPressedStatements] = useState<Set<string>>(new Set());
  const [foundContradictions, setFoundContradictions] = useState<Set<string>>(new Set());
  const [showPressResponse, setShowPressResponse] = useState(false);
  const [showContradiction, setShowContradiction] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentStatement = statements[currentStatementIndex];
  const allContradictionsFound = statements
    .filter((s) => s.hasContradiction)
    .every((s) => foundContradictions.has(s.id));

  const handlePress = () => {
    if (!currentStatement.pressResponse) return;

    setPressedStatements(new Set([...pressedStatements, currentStatement.id]));
    setShowPressResponse(true);
  };

  const handlePresentEvidence = () => {
    if (!currentStatement.hasContradiction) {
      alert("No contradiction here!");
      return;
    }

    setFoundContradictions(new Set([...foundContradictions, currentStatement.id]));
    setShowContradiction(true);
    recordContradiction();

    setTimeout(() => {
      if (foundContradictions.size + 1 === statements.filter((s) => s.hasContradiction).length) {
        setShowSuccess(true);
        setTimeout(onComplete, 2000);
      }
    }, 2000);
  };

  const handleNext = () => {
    if (currentStatementIndex < statements.length - 1) {
      setCurrentStatementIndex(currentStatementIndex + 1);
      setShowPressResponse(false);
      setShowContradiction(false);
    }
  };

  const handlePrevious = () => {
    if (currentStatementIndex > 0) {
      setCurrentStatementIndex(currentStatementIndex - 1);
      setShowPressResponse(false);
      setShowContradiction(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-center">
          <MessageSquare className="w-6 h-6" />
          Testimony Analysis
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Press statements for more info or present evidence to find contradictions
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center text-sm text-muted-foreground">
          Statement {currentStatementIndex + 1} of {statements.length}
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 min-h-32">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="font-semibold text-sm mb-2">{currentStatement.speaker}:</p>
              <p className="text-lg">{currentStatement.text}</p>
              {foundContradictions.has(currentStatement.id) && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded">
                  <AlertCircle className="w-3 h-3" />
                  Contradiction Found
                </div>
              )}
            </div>
          </div>
        </div>

        {showPressResponse && currentStatement.pressResponse && (
          <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-500 rounded-lg p-4">
            <p className="text-sm font-semibold mb-1">Response:</p>
            <p className="text-blue-900 dark:text-blue-100">{currentStatement.pressResponse}</p>
          </div>
        )}

        {showContradiction && currentStatement.contradictionFeedback && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-500 rounded-lg p-4 animate-pulse">
            <p className="text-sm font-bold mb-1 text-red-900 dark:text-red-100">
              🎯 OBJECTION!
            </p>
            <p className="text-red-900 dark:text-red-100">{currentStatement.contradictionFeedback}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handlePress}
            disabled={
              showPressResponse ||
              !currentStatement.pressResponse ||
              foundContradictions.has(currentStatement.id)
            }
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Press
          </Button>
          <Button
            variant="default"
            onClick={handlePresentEvidence}
            disabled={
              showContradiction || foundContradictions.has(currentStatement.id)
            }
          >
            <FileText className="w-4 h-4 mr-2" />
            Present Evidence
          </Button>
        </div>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={handlePrevious} disabled={currentStatementIndex === 0}>
            ← Previous
          </Button>
          <Button
            variant="ghost"
            onClick={handleNext}
            disabled={currentStatementIndex === statements.length - 1}
          >
            Next →
          </Button>
        </div>

        {showSuccess && (
          <div className="bg-green-100 dark:bg-green-900/20 border border-green-500 rounded-lg p-4 text-center">
            <p className="font-medium text-green-900 dark:text-green-100">
              ✓ All contradictions exposed! The truth is revealed!
            </p>
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground">
          Contradictions found: {foundContradictions.size} /{" "}
          {statements.filter((s) => s.hasContradiction).length}
        </div>
      </CardContent>
    </Card>
  );
}
