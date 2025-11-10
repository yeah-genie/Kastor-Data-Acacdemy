import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { FileText, ZoomIn, AlertTriangle } from "lucide-react";

interface DocumentSection {
  label: string;
  content: string;
  suspicious: boolean;
}

interface DocumentExaminationProps {
  title: string;
  sections: DocumentSection[];
  onComplete: () => void;
}

export function DocumentExamination({ title, sections, onComplete }: DocumentExaminationProps) {
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [foundSuspicious, setFoundSuspicious] = useState<Set<number>>(new Set());

  const handleSectionClick = (index: number) => {
    setSelectedSection(index);
    if (sections[index].suspicious) {
      setFoundSuspicious(new Set([...foundSuspicious, index]));
    }
  };

  const allFound = sections.every((section, index) => !section.suspicious || foundSuspicious.has(index));

  const handleContinue = () => {
    onComplete();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-center">
          <FileText className="w-6 h-6" />
          Document Examination
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Click on sections to examine them closely
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-4 text-center">{title}</h3>
          <div className="space-y-3">
            {sections.map((section, index) => (
              <div key={index}>
                <button
                  onClick={() => handleSectionClick(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedSection === index
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                  } ${
                    section.suspicious && foundSuspicious.has(index)
                      ? "bg-red-50 dark:bg-red-900/10 border-red-300"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">{section.label}</div>
                      <div className="text-sm">{section.content}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <ZoomIn className="w-5 h-5 text-muted-foreground" />
                      {foundSuspicious.has(index) && (
                        <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectedSection !== null && (
          <div
            className={`p-4 rounded-lg border-2 ${
              sections[selectedSection].suspicious
                ? "bg-red-100 dark:bg-red-900/20 border-red-500"
                : "bg-blue-100 dark:bg-blue-900/20 border-blue-500"
            }`}
          >
            <p className="font-semibold text-sm mb-2">Examination Result:</p>
            {sections[selectedSection].suspicious ? (
              <p className="text-red-900 dark:text-red-100">
                ⚠️ This section contains suspicious information! Something doesn't add up here.
              </p>
            ) : (
              <p className="text-blue-900 dark:text-blue-100">
                This section appears normal and matches expectations.
              </p>
            )}
          </div>
        )}

        {foundSuspicious.size > 0 && (
          <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
            <p className="font-semibold text-sm mb-1 text-yellow-900 dark:text-yellow-100">
              Suspicious items found: {foundSuspicious.size}
            </p>
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              These discrepancies are crucial evidence!
            </p>
          </div>
        )}

        {allFound && (
          <Button onClick={handleContinue} className="w-full" size="lg">
            Continue Investigation
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
