import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Check, X } from "lucide-react";

interface WinRatePredictionProps {
  targetValue: number;
  tolerance: number;
  onComplete: (correct: boolean) => void;
}

export function WinRatePrediction({ targetValue, tolerance, onComplete }: WinRatePredictionProps) {
  const [prediction, setPrediction] = useState(50);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    const difference = Math.abs(prediction - targetValue);
    const isCorrect = difference <= tolerance;
    
    setTimeout(() => {
      onComplete(isCorrect);
    }, 2000);
  };

  const difference = Math.abs(prediction - targetValue);
  const isCorrect = difference <= tolerance;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-blue-900">Predict the Win Rate</h4>
        </div>
        <p className="text-sm text-blue-800">
          Based on the data you've seen, what do you think Shadow Reaper's win rate will be after the patch?
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Your Prediction:</span>
            <span className="text-2xl font-bold text-blue-600">{prediction}%</span>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={prediction}
            onChange={(e) => !submitted && setPrediction(parseInt(e.target.value))}
            disabled={submitted}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${prediction}%, #e5e7eb ${prediction}%, #e5e7eb 100%)`
            }}
          />
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {!submitted && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Submit Prediction
          </motion.button>
        )}

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              isCorrect
                ? 'bg-green-100 border border-green-300'
                : 'bg-yellow-100 border border-yellow-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-yellow-600" />
              )}
              <span className="font-semibold text-gray-900">
                {isCorrect ? 'Great prediction!' : 'Close enough!'}
              </span>
            </div>
            <p className="text-sm text-gray-700">
              You predicted <strong>{prediction}%</strong>. The actual win rate was <strong>{targetValue}%</strong>.
              {isCorrect 
                ? ' Your data analysis skills are excellent!' 
                : ` You were ${difference}% off, but that's still good observation!`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
