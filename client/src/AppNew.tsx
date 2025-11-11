import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useDetectiveGame } from "./lib/stores/useDetectiveGame";
import { useAudio } from "./lib/stores/useAudio";
import TitleSplash from "./components/TitleSplash";
import MainMenu from "./components/MainMenu";
import EpisodeSelectionScreen from "./components/EpisodeSelectionScreen";
import { GameScene } from "./components/GameScene";
import SceneTransition from "./components/SceneTransition";
import "@fontsource/inter";

type Screen =
  | "splash"
  | "menu"
  | "episodes"
  | "settings"
  | "game";

function AppNew() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const { phase, setPhase, startCase, setCurrentNode } = useDetectiveGame();
  const { setBackgroundMusic, setSuccessSound, setHitSound } = useAudio();

  // Initialize audio
  useEffect(() => {
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    const successSound = new Audio("/sounds/success.mp3");
    successSound.volume = 0.5;
    setSuccessSound(successSound);

    const hitSound = new Audio("/sounds/hit.mp3");
    hitSound.volume = 0.4;
    setHitSound(hitSound);
  }, [setBackgroundMusic, setSuccessSound, setHitSound]);

  // Check for save data
  const hasSaveData = false; // TODO: Implement save system

  // Episode data
  const episodes = [
    {
      id: 1,
      title: "The Missing Balance Patch",
      difficulty: 2,
      duration: "30-40 min",
      thumbnail: "/episodes/ep1-thumbnail.png",
      isLocked: false
    },
    {
      id: 2,
      title: "The Ghost User's Ranking Manipulation",
      difficulty: 3,
      duration: "45-60 min",
      thumbnail: "/episodes/ep2-thumbnail.png",
      isLocked: true
    },
    {
      id: 3,
      title: "The Perfect Victory",
      difficulty: 4,
      duration: "50-60 min",
      thumbnail: "/episodes/ep3-thumbnail.png",
      isLocked: true,
      isDemo: true
    }
  ];

  // Handlers
  const handleSplashComplete = () => {
    setCurrentScreen("menu");
  };

  const handleNewGame = () => {
    setCurrentScreen("episodes");
  };

  const handleContinue = () => {
    // TODO: Load save data
    setCurrentScreen("game");
  };

  const handleEpisodes = () => {
    setCurrentScreen("episodes");
  };

  const handleSettings = () => {
    setCurrentScreen("settings");
  };

  const handleSelectEpisode = (episodeId: number) => {
    setSelectedEpisode(episodeId);
    startCase(episodeId, false); // Start new case without resume mode

    // Set initial node based on episode
    switch (episodeId) {
      case 1:
        setCurrentNode("start");
        break;
      case 2:
        setCurrentNode("ep2_start");
        break;
      case 3:
        setCurrentNode("ep3_start");
        break;
    }

    setPhase("intro");
    setCurrentScreen("game");
  };

  const handleBackToMenu = () => {
    setCurrentScreen("menu");
    setPhase("menu");
  };

  const handleBackToEpisodes = () => {
    setCurrentScreen("episodes");
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e]" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
      <AnimatePresence mode="wait">
        {/* Splash Screen */}
        {currentScreen === "splash" && (
          <SceneTransition show={true} type="fade">
            <TitleSplash onComplete={handleSplashComplete} />
          </SceneTransition>
        )}

        {/* Main Menu */}
        {currentScreen === "menu" && (
          <SceneTransition show={true} type="fade">
            <MainMenu
              onNewGame={handleNewGame}
              onContinue={handleContinue}
              onEpisodes={handleEpisodes}
              onSettings={handleSettings}
              hasSaveData={hasSaveData}
            />
          </SceneTransition>
        )}

        {/* Episode Selection */}
        {currentScreen === "episodes" && (
          <SceneTransition show={true} type="slide-right">
            <EpisodeSelectionScreen
              onBack={handleBackToMenu}
              onSelectEpisode={handleSelectEpisode}
              episodes={episodes}
            />
          </SceneTransition>
        )}

        {/* Game Scene */}
        {currentScreen === "game" && (
          <SceneTransition show={true} type="fade" duration={0.8}>
            <GameScene />
          </SceneTransition>
        )}

        {/* Settings - TODO */}
        {currentScreen === "settings" && (
          <div className="flex h-screen items-center justify-center bg-[#1a1a2e] text-white">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="mt-2 text-white/60">Coming soon...</p>
              <button
                onClick={handleBackToMenu}
                className="mt-4 rounded-lg bg-[#00d9ff] px-6 py-2 text-black font-bold"
              >
                Back to Menu
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AppNew;
