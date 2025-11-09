import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface IPMatchingData {
  ipAddresses: Array<{
    id: string;
    ip: string;
    description: string;
  }>;
  people: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  correctMatches: Record<string, string>;
}

interface IPMatchingPuzzleProps {
  data: IPMatchingData;
  onComplete: () => void;
}

export function IPMatchingPuzzle({ data, onComplete }: IPMatchingPuzzleProps) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedIP, setSelectedIP] = useState<string | null>(null);

  const handleIPClick = (ipId: string) => {
    setSelectedIP(ipId);
  };

  const handlePersonClick = (personId: string) => {
    if (selectedIP) {
      setMatches(prev => ({
        ...prev,
        [selectedIP]: personId
      }));
      setSelectedIP(null);
    }
  };

  const handleSubmit = () => {
    setShowResult(true);
    const allCorrect = Object.keys(data.correctMatches).every(
      ipId => matches[ipId] === data.correctMatches[ipId]
    );
    
    if (allCorrect) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const isCorrectMatch = (ipId: string, personId: string) => {
    return data.correctMatches[ipId] === personId;
  };

  const allMatched = data.ipAddresses.every(ip => matches[ip.id]);

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <p className="text-sm text-amber-900">
          🎯 <strong>Match each IP address to the correct person</strong>
          <br />
          Click an IP address, then click the person it belongs to.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* IP Addresses */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">IP Addresses</h4>
          {data.ipAddresses.map((ip) => (
            <motion.div
              key={ip.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !showResult && handleIPClick(ip.id)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedIP === ip.id
                  ? 'border-blue-500 bg-blue-50'
                  : matches[ip.id]
                  ? showResult && isCorrectMatch(ip.id, matches[ip.id])
                    ? 'border-green-500 bg-green-50'
                    : showResult
                    ? 'border-red-500 bg-red-50'
                    : 'border-purple-300 bg-purple-50'
                  : 'border-gray-300 bg-white hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm font-semibold text-gray-900">{ip.ip}</p>
                  <p className="text-xs text-gray-600 mt-1">{ip.description}</p>
                </div>
                {matches[ip.id] && (
                  <div className="text-xs font-medium text-gray-700">
                    ↔ {data.people.find(p => p.id === matches[ip.id])?.name}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* People */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Team Members</h4>
          {data.people.map((person) => {
            const matchedToThis = Object.entries(matches).find(([_, personId]) => personId === person.id);
            const isMatched = !!matchedToThis;
            
            return (
              <motion.div
                key={person.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !showResult && handlePersonClick(person.id)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedIP && !isMatched
                    ? 'border-blue-400 bg-blue-50 hover:border-blue-500'
                    : isMatched
                    ? showResult && matchedToThis && isCorrectMatch(matchedToThis[0], person.id)
                      ? 'border-green-500 bg-green-50'
                      : showResult
                      ? 'border-red-500 bg-red-50'
                      : 'border-purple-300 bg-purple-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{person.name}</p>
                    <p className="text-xs text-gray-600">{person.role}</p>
                  </div>
                  {showResult && matchedToThis && (
                    <div>
                      {isCorrectMatch(matchedToThis[0], person.id) ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {allMatched && !showResult && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
        >
          ✓ Submit Matches
        </motion.button>
      )}

      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            Object.keys(data.correctMatches).every(ipId => matches[ipId] === data.correctMatches[ipId])
              ? 'bg-green-100 border border-green-300'
              : 'bg-red-100 border border-red-300'
          }`}
        >
          {Object.keys(data.correctMatches).every(ipId => matches[ipId] === data.correctMatches[ipId]) ? (
            <>
              <p className="font-semibold text-green-900">🎉 Perfect! All matches are correct!</p>
              <p className="text-sm text-green-700 mt-1">The IP addresses clearly show who was using which computer.</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-red-900">Not quite right. Try again!</p>
              <p className="text-sm text-red-700 mt-1">Check which IP addresses belong to which team members.</p>
              <button
                onClick={() => {
                  setShowResult(false);
                  setMatches({});
                }}
                className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg"
              >
                Reset and Try Again
              </button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
