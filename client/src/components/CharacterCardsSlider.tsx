import { CharacterEvidence } from "@/lib/stores/useDetectiveGame";
import { CharacterProfileCard } from "./CharacterProfileCard";

interface CharacterCardsSliderProps {
  characters: CharacterEvidence[];
  showNotification?: boolean;
}

export function CharacterCardsSlider({ characters, showNotification = false }: CharacterCardsSliderProps) {
  return (
    <div className="my-4">
      {showNotification && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <p className="text-sm font-semibold text-blue-900">Team profiles have been updated in your notebook!</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {characters.map((char) => (
          <CharacterProfileCard key={char.id} character={char} />
        ))}
      </div>
    </div>
  );
}
