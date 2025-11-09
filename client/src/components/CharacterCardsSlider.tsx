import { motion } from "framer-motion";
import { CharacterEvidence } from "@/lib/stores/useDetectiveGame";
import { useState } from "react";

interface CharacterCardsSliderProps {
  characters: CharacterEvidence[];
}

export function CharacterCardsSlider({ characters }: CharacterCardsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="my-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl md:text-xl">📋</span>
          <p className="text-base md:text-sm font-semibold text-amber-900">Team profiles have been updated in your notebook!</p>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-2xl">
          <motion.div
            className="flex"
            animate={{ x: `-${currentIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {characters.map((char) => (
              <div
                key={char.id}
                className="min-w-full px-2"
              >
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 border-2 border-blue-200 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    {char.photo && (
                      <img
                        src={char.photo}
                        alt={char.name}
                        className="w-24 h-24 md:w-20 md:h-20 rounded-2xl object-cover object-center border-2 border-blue-400 shadow-md"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-xl font-bold text-gray-900 mb-1">{char.name}</h3>
                      <p className="text-base md:text-sm text-blue-700 font-semibold">{char.role}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
                    <p className="text-sm md:text-xs font-bold text-gray-800 mb-1">PROFILE</p>
                    <p className="text-base md:text-sm text-gray-800 leading-relaxed">{char.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {characters.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-blue-600 w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to character ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
