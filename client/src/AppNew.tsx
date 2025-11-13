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
import { useGameStore, MANUAL_SAVE_SLOTS, type SaveSlotId } from "@/store/gameStore";
import {
  clearAnalytics,
  endSession,
  exportSessionData,
  getActiveAnalyticsSessionId,
  getAllSessions,
  startSession,
  type UserSession,
} from "@/utils/analytics";

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
  const { setBackgroundMusic, setSuccessSound, setHitSound, registerEffect } = useAudio();
  const startEpisode = useGameStore((state) => state.startEpisode);
  const loadProgress = useGameStore((state) => state.loadProgress);
  const saveProgress = useGameStore((state) => state.saveProgress);
  const saveSlots = useGameStore((state) => state.saveSlots);
  const autoSaveSlot = useGameStore((state) => state.autoSaveSlot);
  const setAutoSaveSlot = useGameStore((state) => state.setAutoSaveSlot);
  const currentEpisodeId = useGameStore((state) => state.currentEpisode);
  const currentSceneId = useGameStore((state) => state.currentScene);
  const gameProgress = useGameStore((state) => state.gameProgress);

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

    registerEffect("ui-hit", "/sounds/hit.mp3", { volume: 0.4 });
    registerEffect("ui-success", "/sounds/success.mp3", { volume: 0.5 });
    registerEffect("ui-message", "/sounds/hit.mp3", { volume: 0.2 });
  }, [registerEffect, setBackgroundMusic, setSuccessSound, setHitSound]);

  const hasSaveData = Object.values(saveSlots).some((value) => value !== null);

  const [selectedSaveSlot, setSelectedSaveSlot] = useState<SaveSlotId>(MANUAL_SAVE_SLOTS[0]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [analyticsSessions, setAnalyticsSessions] = useState<UserSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (currentScreen === "settings") {
      const sessions = getAllSessions();
      setAnalyticsSessions(sessions);
      const activeId = getActiveAnalyticsSessionId();
      setActiveSessionId(activeId);
      setSelectedSessionId((prev: string | null) => {
        if (prev && sessions.some((session: UserSession) => session.sessionId === prev)) {
          return prev;
        }
        return activeId ?? sessions[0]?.sessionId ?? null;
      });
    }
  }, [currentScreen]);

  useEffect(() => {
    if (analyticsSessions.length === 0) {
      setSelectedSessionId(null);
      return;
    }
    setSelectedSessionId((prev: string | null) => {
      if (prev && analyticsSessions.some((session: UserSession) => session.sessionId === prev)) {
        return prev;
      }
      const activeId = getActiveAnalyticsSessionId();
      return activeId ?? analyticsSessions[0]?.sessionId ?? null;
    });
  }, [analyticsSessions]);

  const formatTimestamp = (value?: string | null) => {
    if (!value) return "저장된 기록 없음";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const downloadTextFile = (filename: string, content: string, mime: string) => {
    if (typeof window === "undefined") return;
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleManualSave = () => {
    saveProgress(selectedSaveSlot);
    setAutoSaveSlot(selectedSaveSlot);
    setStatusMessage(`${selectedSaveSlot} 슬롯에 저장되었습니다.`);
  };

  const handleManualLoad = () => {
    loadProgress(selectedSaveSlot);
    setStatusMessage(`${selectedSaveSlot} 슬롯에서 진행 상황을 불러왔습니다.`);
  };

  const handleStartAnalyticsSession = () => {
    const episodeId = currentEpisodeId ?? "episode-unknown";
    const session = startSession(episodeId);
    setStatusMessage(`새로운 세션(${session.sessionId})을 시작했습니다.`);
    setActiveSessionId(session.sessionId);
    setAnalyticsSessions(getAllSessions());
    setSelectedSessionId(session.sessionId);
  };

  const handleEndAnalyticsSession = () => {
    const sessionId = getActiveAnalyticsSessionId();
    if (!sessionId) {
      setStatusMessage("종료할 활성 세션이 없습니다.");
      return;
    }
    endSession(sessionId, {
      finalScore: gameProgress,
      completionRate: gameProgress,
    });
    setStatusMessage(`세션(${sessionId})을 종료했습니다.`);
    setActiveSessionId(null);
    setAnalyticsSessions(getAllSessions());
  };

  const handleExportSession = (format: "json" | "csv") => {
    const sessionId = selectedSessionId ?? activeSessionId ?? analyticsSessions[0]?.sessionId;
    if (!sessionId) {
      setStatusMessage("내보낼 세션 데이터가 없습니다.");
      return;
    }
    const exported = exportSessionData(sessionId, format);
    if (!exported) {
      setStatusMessage("선택한 세션에 데이터가 없습니다.");
      return;
    }
    const filename =
      format === "json"
        ? `analytics-${sessionId}.json`
        : `analytics-${sessionId}.csv`;
    downloadTextFile(filename, exported, format === "json" ? "application/json" : "text/csv");
    setStatusMessage(`${filename} 파일을 다운로드했습니다.`);
  };

  const handleClearAnalytics = () => {
    clearAnalytics();
    setAnalyticsSessions([]);
    setActiveSessionId(null);
    setSelectedSessionId(null);
    setStatusMessage("Analytics 데이터가 초기화되었습니다.");
  };

  // Episode data
  const episodes = [
    {
      id: 1,
      title: "The Missing Balance Patch",
      difficulty: 2,
      duration: "30-40 min",
      thumbnail: "/episodes/ep1-thumbnail.png",
      isLocked: false,
    },
    {
      id: 2,
      title: "The Ghost User's Ranking Manipulation",
      difficulty: 3,
      duration: "45-60 min",
      thumbnail: "/episodes/ep2-thumbnail.png",
      isLocked: true,
    },
    {
      id: 3,
      title: "The Perfect Victory",
      difficulty: 4,
      duration: "50-60 min",
      thumbnail: "/episodes/ep3-thumbnail.png",
      isLocked: true,
      isDemo: true,
    },
  ];

  // Handlers
  const handleSplashComplete = () => {
    setCurrentScreen("menu");
  };

  const handleNewGame = () => {
    setCurrentScreen("episodes");
  };

  const handleContinue = () => {
    if (hasSaveData) {
      loadProgress(autoSaveSlot);
      setCurrentScreen("game");
      setPhase("stage1");
    }
  };

  const handleEpisodes = () => {
    setCurrentScreen("episodes");
  };

  const handleSettings = () => {
    setCurrentScreen("settings");
  };

  const handleSelectEpisode = (episodeId: number) => {
    setSelectedEpisode(episodeId);
    startCase(episodeId, false);

    switch (episodeId) {
      case 1:
        setCurrentNode("start");
        startEpisode("episode-1", "start");
        break;
      case 2:
        setCurrentNode("ep2_start");
        startEpisode("episode-2", "ep2_start");
        break;
      case 3:
        setCurrentNode("ep3_start");
        startEpisode("episode-3", "ep3_start");
        break;
      default:
        startEpisode(`episode-${episodeId}`);
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

        {/* Settings */}
        {currentScreen === "settings" && (
          <div className="min-h-screen bg-[#101028] text-white">
            <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-10">
              <div>
                <h1 className="text-3xl font-bold">Investigation Settings</h1>
                <p className="mt-2 text-sm text-white/60">
                  저장 슬롯을 관리하고 K-LIF Analytics 세션을 제어하세요.
                </p>
                {statusMessage && (
                  <div className="mt-4 rounded-xl border border-cyan-400/60 bg-cyan-500/10 px-4 py-3 text-sm">
                    {statusMessage}
                  </div>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl">
                  <h2 className="text-xl font-semibold">수동 저장 & 불러오기</h2>
                  <p className="mt-1 text-sm text-white/65">
                    3개의 세이브 슬롯을 활용해 수사 진행 상황을 관리하세요.
                  </p>
                  <div className="mt-4 space-y-3">
                    {MANUAL_SAVE_SLOTS.map((slotId) => {
                      const snapshot = saveSlots[slotId];
                      const isActive = selectedSaveSlot === slotId;
                      return (
                        <button
                          key={slotId}
                          type="button"
                          onClick={() => setSelectedSaveSlot(slotId)}
                          className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                            isActive
                              ? "border-cyan-400 bg-cyan-500/10"
                              : "border-white/10 bg-white/0 hover:border-white/25 hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{slotId.replace("SAVE_SLOT_", "Slot ")}</span>
                            {autoSaveSlot === slotId && (
                              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-300">
                                Auto
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-white/60">
                            {formatTimestamp(snapshot?.lastSavedAt)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleManualSave}
                      className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-black shadow hover:bg-cyan-400"
                    >
                      현재 상태 저장
                    </button>
                    <button
                      type="button"
                      onClick={handleManualLoad}
                      className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:border-cyan-400"
                    >
                      선택 슬롯 불러오기
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-white/40">
                    자동 저장 슬롯: {autoSaveSlot}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl">
                  <h2 className="text-xl font-semibold">K-LIF Analytics</h2>
                  <p className="mt-1 text-sm text-white/65">
                    학습 효과 측정을 위한 세션을 시작하거나 종료하고, 데이터를 내보내세요.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleStartAnalyticsSession}
                      className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow hover:bg-emerald-400"
                    >
                      새 세션 시작
                    </button>
                    <button
                      type="button"
                      onClick={handleEndAnalyticsSession}
                      className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:border-emerald-400"
                    >
                      활성 세션 종료
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAnalytics}
                      className="rounded-lg border border-red-400/60 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10"
                    >
                      Analytics 초기화
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <h3 className="text-sm font-semibold text-white/80">세션 목록</h3>
                    {analyticsSessions.length === 0 ? (
                      <p className="text-xs text-white/50">저장된 세션 데이터가 없습니다.</p>
                    ) : (
                      <div className="space-y-2">
                        {analyticsSessions.slice(0, 3).map((session) => (
                          <label
                            key={session.sessionId}
                            className={`block rounded-lg border px-3 py-2 text-xs transition ${
                              selectedSessionId === session.sessionId
                                ? "border-cyan-400 bg-cyan-500/10"
                                : "border-white/15 hover:border-white/30"
                            }`}
                          >
                            <input
                              type="radio"
                              name="analytics-session"
                              value={session.sessionId}
                              checked={selectedSessionId === session.sessionId}
                              onChange={() => setSelectedSessionId(session.sessionId)}
                              className="mr-2"
                            />
                            <span className="font-semibold">{session.sessionId}</span>
                            <span className="ml-2 text-white/60">
                              {new Date(session.startTime).toLocaleString()}
                            </span>
                            {activeSessionId === session.sessionId && (
                              <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
                                Active
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleExportSession("json")}
                      className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:border-cyan-400"
                    >
                      JSON 내보내기
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExportSession("csv")}
                      className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:border-cyan-400"
                    >
                      CSV 내보내기
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-white/45">
                    현재 씬: {currentSceneId ?? "알 수 없음"} · 현재 에피소드: {currentEpisodeId ?? "미진행"}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
              <button
                onClick={handleBackToMenu}
                  className="rounded-lg border border-white/20 px-5 py-2 text-sm font-semibold hover:border-cyan-400"
              >
                  메인 메뉴로 돌아가기
              </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AppNew;
