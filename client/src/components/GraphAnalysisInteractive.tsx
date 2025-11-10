import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check, X } from "lucide-react";
import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";

interface GraphDataPoint {
  day: number;
  winRate: number;
}

interface SeriesData {
  name: string;
  color: string;
  data: GraphDataPoint[];
}

interface GraphAnalysisInteractiveProps {
  series: SeriesData[];
  question: string;
  correctAnswer: string;
  onComplete: (correct: boolean) => void;
}

export function GraphAnalysisInteractive({
  series,
  question,
  correctAnswer,
  onComplete,
}: GraphAnalysisInteractiveProps) {
  const recordInteractiveSequence = useDetectiveGame((state) => state.recordInteractiveSequence);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    const isCorrect = answer === correctAnswer;

    if (isCorrect) {
      recordInteractiveSequence();
    }

    setTimeout(() => {
      onComplete(isCorrect);
    }, 2000);
  };

  const chartData = series[0].data.map((point, index) => {
    const dataPoint: any = { day: `Day ${point.day}` };
    series.forEach((s) => {
      dataPoint[s.name] = s.data[index].winRate;
    });
    return dataPoint;
  });

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <Card className="w-full max-w-4xl mx-auto max-h-[90vh] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-center text-lg sm:text-xl">📊 Data Analysis</CardTitle>
        <p className="text-center text-sm sm:text-base text-muted-foreground">{question}</p>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 overflow-y-auto flex-1">
        <div className="w-full h-64 sm:h-80 bg-slate-50 dark:bg-slate-900 rounded-lg p-2 sm:p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                label={{ value: "Win Rate %", angle: -90, position: "insideLeft", style: { fontSize: 10 } }}
              />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {series.map((s) => (
                <Line
                  key={s.name}
                  type="monotone"
                  dataKey={s.name}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {series.map((s) => (
            <Button
              key={s.name}
              variant={selectedAnswer === s.name ? "default" : "outline"}
              size="lg"
              onClick={() => !showFeedback && handleSelect(s.name)}
              disabled={showFeedback}
              className="relative h-auto py-4 text-base sm:text-lg"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="truncate">{s.name}</span>
              </div>
              {showFeedback && selectedAnswer === s.name && (
                <div className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2">
                  {isCorrect ? (
                    <div className="bg-green-500 rounded-full p-1">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  ) : (
                    <div className="bg-red-500 rounded-full p-1">
                      <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  )}
                </div>
              )}
            </Button>
          ))}
        </div>

        {showFeedback && (
          <div
            className={`p-3 sm:p-4 rounded-lg ${
              isCorrect
                ? "bg-green-100 dark:bg-green-900/20 border border-green-500"
                : "bg-red-100 dark:bg-red-900/20 border border-red-500"
            }`}
          >
            <p className={`text-sm sm:text-base font-medium ${isCorrect ? "text-green-900 dark:text-green-100" : "text-red-900 dark:text-red-100"}`}>
              {isCorrect
                ? "✓ Correct! Shadow shows an abnormal spike on Day 28!"
                : "✗ Not quite. Look at the dramatic change on Day 28."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
