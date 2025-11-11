import { useEffect, useMemo, useRef, useState } from "react";
import episode1 from "@/data/episode1.json";
import { useEpisodeController } from "@/lib/story/useEpisodeController";
import type { EpisodeInteraction } from "@/lib/story/episode1Types";
import VisualNovelDialogue from "./VisualNovelDialogue";
import GameHUD from "./GameHUD";
import SceneTransition from "./SceneTransition";
import { TextInputInteraction } from "./visual-novel/TextInputInteraction";
import { DocumentViewer } from "./visual-novel/DocumentViewer";
import { DocumentComparison } from "./visual-novel/DocumentComparison";
import { RankDisplay } from "./visual-novel/RankDisplay";
import { GraphAnalysisInteractive } from "./GraphAnalysisInteractive";
import { TimelineReconstruction as TimelineReconstructionInteractive } from "./interactive/TimelineReconstruction";
import { DatabaseSearch } from "./DatabaseSearch";
import { TestimonyPress } from "./TestimonyPress";
import { CaseReportAssembly } from "./CaseReportAssembly";
import { useDetectiveGame } from "@/lib/stores/useDetectiveGame";
import { CaseEvaluationScreen } from "./CaseEvaluationScreen";
import { useAudio } from "@/lib/stores/useAudio";

interface VisualNovelGameProps {
  onExit: () => void;
}

type RewardState = {
  title?: string;
  xp?: number;
  variant?: string;
};

const BACKGROUND_MAP: Record<string, string> = {
  "office-evening": "linear-gradient(120deg, #2d3a5f 0%, #10172b 100%)",
  "office-night": "linear-gradient(135deg, #151b2d 0%, #070b13 100%)",
  "call-interface": "linear-gradient(135deg, #18364c 0%, #0c121c 100%)",
  "data-center": "linear-gradient(120deg, #104357 0%, #0f172a 100%)",
  "hologram-room": "linear-gradient(135deg, #1f1b3a 0%, #090a14 100%)",
  "timeline-board": "linear-gradient(120deg, #3d2c52 0%, #140d22 100%)",
  "network-grid": "linear-gradient(130deg, #123546 0%, #0a111d 100%)",
  "interrogation-room": "linear-gradient(135deg, #2b1d2f 0%, #0f0a18 100%)",
  "evidence-room": "linear-gradient(130deg, #2a313e 0%, #10141b 100%)",
  "office-dawn": "linear-gradient(135deg, #5d4b63 0%, #1d1a28 100%)",
  "report-room": "linear-gradient(135deg, #27364f 0%, #0c121f 100%)",
  "evaluation-terminal": "linear-gradient(120deg, #1b2336 0%, #080b12 100%)",
  "lobby-morning": "linear-gradient(130deg, #3f4a66 0%, #141722 100%)",
  "encrypted-terminal": "linear-gradient(135deg, #2b1f40 0%, #090614 100%)"
};

const EPISODE_TOTAL_EVIDENCE = episode1.glossary?.rewards?.length ?? 6;

function getBackground(id?: string) {
  if (!id) return "linear-gradient(135deg, #111827 0%, #05070c 100%)";
  return BACKGROUND_MAP[id] ?? "linear-gradient(135deg, #111827 0%, #05070c 100%)";
}

function mapTimelineEvents(interaction: EpisodeInteraction) {
  const source = interaction.events ?? interaction.data?.events ?? [];
  return source.map((event: any, index: number) => ({
    id: event.id ?? `event-${index}`,
    timestamp: event.time ?? event.timestamp ?? "",
    description: event.text ?? event.description ?? "",
    actor: event.actor ?? "",
    correctPosition: event.order ?? event.correctPosition ?? index + 1
  }));
}

function mapDatabaseResults(interaction: EpisodeInteraction) {
  const source = interaction.results ?? interaction.data?.results ?? [];
  return source.map((result: any) => ({
    ign: result.ign ?? result.name ?? "Unknown",
    ip: result.ip ?? "",
    mainCharacter: result.mainCharacter ?? result.character ?? "",
    session: result.session ?? result.playtime ?? "",
    winRate: result.winRate ?? result.winRateChange ?? ""
  }));
}

function mapTestimonyStatements(interaction: EpisodeInteraction) {
  const source = interaction.statements ?? interaction.data?.statements ?? [];
  return source.map((statement: any, index: number) => ({
    id: statement.id ?? `statement-${index}`,
    speaker: statement.speaker ?? "Witness",
    text: statement.text ?? "",
    pressResponse: statement.pressResponse,
    hasContradiction: statement.hasContradiction ?? false,
    contradictionEvidence: statement.contradictionEvidence,
    contradictionFeedback: statement.contradictionFeedback
  }));
}

function mapCaseReportFields(interaction: EpisodeInteraction) {
  const fields = interaction.fields ?? interaction.data?.fields ?? [];
  return fields.map((field: any, index: number) => ({
    id: field.id ?? `field-${index}`,
    label: field.label ?? field.name ?? "Field",
    options: field.options ?? [],
    correct: field.correct ?? field.answer ?? ""
  }));
}

export function VisualNovelGame({ onExit }: VisualNovelGameProps) {
  const hintsUsed = useDetectiveGame((state) => state.hintsUsed);
  const maxHints = useDetectiveGame((state) => state.maxHints);
  const evidenceCollected = useDetectiveGame((state) => state.evidenceCollected);
  const score = useDetectiveGame((state) => state.score);
  const addScore = useDetectiveGame((state) => state.addScore);
  const calculateGrade = useDetectiveGame((state) => state.calculateGrade);

  const { playMessageSound } = useAudio();

  const rewardTimeoutRef = useRef<number>();
  const [recentReward, setRecentReward] = useState<RewardState | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const controller = useEpisodeController(episode1, {
    onReward: (reward) => {
      if (reward?.xp) {
        addScore(reward.xp);
      }
      setRecentReward(reward);
      if (rewardTimeoutRef.current) {
        window.clearTimeout(rewardTimeoutRef.current);
      }
      rewardTimeoutRef.current = window.setTimeout(() => {
        setRecentReward(null);
      }, 2400);
    }
  });

  useEffect(() => {
    if (controller.mode === "complete") {
      setShowEvaluation(true);
    }
  }, [controller.mode]);

  useEffect(() => {
    if (controller.currentLine) {
      playMessageSound();
    }
  }, [controller.currentLine?.raw, playMessageSound]);

  useEffect(() => {
    return () => {
      if (rewardTimeoutRef.current) {
        window.clearTimeout(rewardTimeoutRef.current);
      }
    };
  }, []);

  const background = useMemo(
    () => getBackground(controller.currentScene?.layout?.background),
    [controller.currentScene?.layout?.background]
  );

  const choices = controller.choices?.map((choice) => ({
    id: choice.id,
    text: choice.text,
    onSelect: () => controller.selectChoice(choice.id)
  }));

  const renderInteractionOverlay = () => {
    const interaction = controller.interaction;
    if (!interaction) return null;

    const overlay = (child: React.ReactNode) => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-2 sm:px-4">
        {child}
      </div>
    );

    switch (interaction.type) {
      case "text-input":
        return (
          <TextInputInteraction
            prompt={interaction.prompt ?? "당신의 이름은 무엇인가요?"}
            validation={interaction.validation}
            onSubmit={(value) => controller.submitTextInput(value)}
            onCancel={onExit}
          />
        );

      case "document-viewer":
        return (
          <DocumentViewer
            title={interaction.name ?? interaction.title ?? "Document"}
            content={interaction.content ?? []}
            meta={interaction.meta}
            onClose={() => controller.completeInteraction()}
          />
        );

      case "document-compare":
        return overlay(
          <DocumentComparison
            documents={interaction.documents ?? []}
            tasks={interaction.tasks ?? []}
            onComplete={() => controller.completeInteraction()}
          />
        );

      case "graph-analysis":
        return overlay(
          <GraphAnalysisInteractive
            series={interaction.graph?.series ?? interaction.series ?? []}
            question={interaction.graph?.question ?? interaction.prompt ?? ""}
            correctAnswer={interaction.graph?.correctAnswer ?? interaction.correctAnswer}
            onComplete={() => controller.completeInteraction()}
          />
        );

      case "timeline":
      case "timeline_reconstruction":
        return overlay(
          <TimelineReconstructionInteractive
            data={{ events: mapTimelineEvents(interaction) }}
            onComplete={() => controller.completeInteraction()}
          />
        );

      case "database-search":
        return overlay(
          <DatabaseSearch
            searchType={interaction.searchType ?? "IP"}
            searchValue={interaction.searchValue ?? interaction.expected ?? ""}
            results={mapDatabaseResults(interaction)}
            onComplete={() => controller.completeInteraction()}
          />
        );

      case "testimony-press":
        return overlay(
          <TestimonyPress
            statements={mapTestimonyStatements(interaction)}
            onComplete={() => controller.completeInteraction()}
          />
        );

      case "case-report":
      case "case_report_assembly":
        return overlay(
          <CaseReportAssembly
            fields={mapCaseReportFields(interaction)}
            evidenceChecklist={interaction.evidenceChecklist ?? []}
            onComplete={() => controller.completeInteraction()}
          />
        );

      case "rank-display":
        return overlay(
          <RankDisplay
            ranks={interaction.ranks ?? []}
            activeRankId={
              (() => {
                try {
                  const grade = calculateGrade();
                  return grade ? `${grade.toLowerCase()}-rank` : undefined;
                } catch {
                  return undefined;
                }
              })()
            }
            onContinue={() => controller.completeInteraction()}
          />
        );

      default:
        return null;
    }
  };

  if (showEvaluation) {
    return <CaseEvaluationScreen onContinue={onExit} />;
  }

  return (
    <div className="relative min-h-screen bg-[#05070c] text-white">
      <GameHUD
        episodeTitle={episode1.metadata.title}
        hintsUsed={hintsUsed}
        maxHints={maxHints}
        evidenceCollected={evidenceCollected.length}
        totalEvidence={EPISODE_TOTAL_EVIDENCE}
        score={score}
        onBack={onExit}
        onSettings={() => {
          // TODO: open settings modal
        }}
      />

      <div className="pt-[104px]">
        <SceneTransition show={controller.mode !== "complete"} type="fade">
          <VisualNovelDialogue
            background={background}
            characters={[]}
            speakerName={controller.currentLine?.speaker ?? "Narrator"}
            dialogueText={controller.currentLine?.text ?? ""}
            choices={choices}
            onAdvance={
              controller.mode === "dialogue" && !choices
                ? controller.advance
                : undefined
            }
            autoAdvance={false}
          />
        </SceneTransition>
      </div>

      {renderInteractionOverlay()}

      {recentReward && (
        <div className="pointer-events-none fixed left-1/2 top-24 z-40 w-full max-w-xs -translate-x-1/2">
          <div className="rounded-xl border border-[#00d9ff]/40 bg-[#0b1220]/90 px-4 py-3 text-center shadow-lg shadow-[#00d9ff]/20">
            <p className="text-xs uppercase tracking-[0.3em] text-[#00d9ff]/70">
              보상 획득
            </p>
            {recentReward.title && (
              <p className="mt-1 text-sm text-white">{recentReward.title}</p>
            )}
            {recentReward.xp && (
              <p className="mt-1 text-sm text-[#00d9ff] font-semibold">
                +{recentReward.xp} XP
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
