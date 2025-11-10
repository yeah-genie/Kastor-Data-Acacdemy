import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { FileText, Check, X } from "lucide-react";
import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";
import { motion } from "framer-motion";

interface ReportField {
  id: string;
  label: string;
  options: string[];
  correct: string;
}

interface CaseReportAssemblyProps {
  fields: ReportField[];
  evidenceChecklist: string[];
  onComplete: () => void;
}

export function CaseReportAssembly({
  fields,
  evidenceChecklist,
  onComplete,
}: CaseReportAssemblyProps) {
  const recordInteractiveSequence = useDetectiveGame(
    (state) => state.recordInteractiveSequence
  );
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSelect = (fieldId: string, value: string) => {
    setSelections((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const allFieldsSelected = fields.every((field) => selections[field.id]);

  const handleSubmit = () => {
    setShowFeedback(true);

    const allCorrect = fields.every(
      (field) => selections[field.id] === field.correct
    );

    if (allCorrect) {
      setIsComplete(true);
      recordInteractiveSequence();

      setTimeout(() => {
        onComplete();
      }, 2500);
    }
  };

  const getFieldStatus = (field: ReportField) => {
    if (!showFeedback) return null;
    return selections[field.id] === field.correct ? "correct" : "incorrect";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto max-h-[90vh] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2 justify-center text-lg sm:text-xl">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          Final Case Report
        </CardTitle>
        <p className="text-center text-sm sm:text-base text-muted-foreground">
          Fill in the complete case summary
        </p>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 overflow-y-auto flex-1">
        <div className="space-y-6">
          {/* Report Fields */}
          {fields.map((field) => {
            const status = getFieldStatus(field);
            return (
              <div key={field.id} className="space-y-2">
                <label className="font-bold text-lg flex items-center gap-2">
                  {field.label}
                  {status === "correct" && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                  {status === "incorrect" && (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {field.options.map((option) => (
                    <Button
                      key={option}
                      variant={
                        selections[field.id] === option
                          ? status === "correct"
                            ? "default"
                            : status === "incorrect"
                            ? "destructive"
                            : "default"
                          : "outline"
                      }
                      className={`justify-start text-left h-auto py-3 px-4 ${
                        selections[field.id] === option &&
                        status === "correct"
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
                      }`}
                      onClick={() =>
                        !showFeedback && handleSelect(field.id, option)
                      }
                      disabled={showFeedback}
                    >
                      <span className="text-sm sm:text-base">{option}</span>
                      {selections[field.id] === option && status === "correct" && (
                        <Check className="w-4 h-4 ml-auto" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Evidence Checklist */}
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-lg mb-3">EVIDENCE:</h3>
            <div className="space-y-2">
              {evidenceChecklist.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          {!showFeedback && (
            <Button
              onClick={handleSubmit}
              disabled={!allFieldsSelected}
              size="lg"
              className="w-full"
            >
              Submit Case Report
            </Button>
          )}

          {/* Success Message */}
          {isComplete && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-6 bg-green-100 dark:bg-green-900/20 border-2 border-green-500 rounded-lg text-center"
            >
              <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-xl font-bold text-green-700 dark:text-green-400">
                CASE REPORT COMPLETE! ✓
              </p>
            </motion.div>
          )}

          {/* Retry Message */}
          {showFeedback && !isComplete && (
            <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-500 rounded-lg text-center">
              <p className="text-red-700 dark:text-red-400">
                Some answers are incorrect. Review the evidence and try again!
              </p>
              <Button
                onClick={() => {
                  setShowFeedback(false);
                  setSelections({});
                }}
                variant="outline"
                className="mt-3"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
