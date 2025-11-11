import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  EpisodeData,
  EpisodeDialogue,
  EpisodeInteraction,
  EpisodeScene
} from "./episode1Types";

type Phase = "dialogue" | "interaction" | "post";

interface UseEpisodeControllerOptions {
  onReward?: (reward: { xp?: number; items?: string[]; title?: string; variant?: string }) => void;
}

export interface ResolvedDialogue {
  speaker: string;
  text: string;
  type?: string;
  raw: EpisodeDialogue;
}

export interface ChoiceOption {
  id: string;
  text: string;
  data: any;
}

export interface EpisodeControllerState {
  currentScene: EpisodeScene | null;
  currentLine: ResolvedDialogue | null;
  mode: "dialogue" | "interaction" | "complete";
  choices?: ChoiceOption[];
  interaction: EpisodeInteraction | null;
  advance: () => void;
  selectChoice: (choiceId: string) => void;
  submitTextInput: (value: string) => void;
  completeInteraction: (payload?: any) => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  sceneProgress: { index: number; total: number };
}

const PLACEHOLDER_REGEX = /\[(\w+)\]/g;

export function useEpisodeController(
  episode: EpisodeData,
  options?: UseEpisodeControllerOptions
): EpisodeControllerState {
  const sceneOrder = useMemo(
    () => episode.structure.acts.flatMap((act) => act.scenes),
    [episode.structure.acts]
  );

  const sceneMap = useMemo(() => {
    const map = new Map<string, EpisodeScene>();
    episode.scenes.forEach((scene) => {
      map.set(scene.id, scene);
    });
    return map;
  }, [episode.scenes]);

  const [currentSceneId, setCurrentSceneId] = useState<string>(
    sceneOrder[0] ?? ""
  );
  const [dialogueList, setDialogueList] = useState<EpisodeDialogue[]>(() => {
    const initialScene = sceneMap.get(sceneOrder[0] ?? "");
    return initialScene?.dialogue ?? [];
  });
  const [dialogueIndex, setDialogueIndex] = useState<number>(0);
  const [phase, setPhase] = useState<Phase>("dialogue");
  const [interactionIndex, setInteractionIndex] = useState<number>(0);
  const [pendingNextStep, setPendingNextStep] = useState<"interaction" | "scene" | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [playerName, setPlayerName] = useState<string>("Detective");

  const processedRewards = useRef<Set<string>>(new Set());

  const currentScene = sceneMap.get(currentSceneId) ?? null;
  const currentSceneIdx = sceneOrder.indexOf(currentSceneId);

  useEffect(() => {
    if (!currentScene) return;
    setDialogueList(currentScene.dialogue ?? []);
    setDialogueIndex(0);
    setInteractionIndex(0);
    setPhase("dialogue");
    setPendingNextStep(null);
  }, [currentScene]);

  const substitutePlaceholders = useCallback((text?: string) => {
    if (!text) return "";
    return text.replace(PLACEHOLDER_REGEX, (match, key) => {
      if (key.toLowerCase() === "name") {
        return playerName;
      }
      return match;
    });
  }, [playerName]);

  const currentInteraction =
    currentScene?.interactions?.[interactionIndex] ?? null;

  const currentLineRaw =
    (phase === "dialogue" || phase === "post") && dialogueList.length > 0
      ? dialogueList[Math.min(dialogueIndex, dialogueList.length - 1)]
      : undefined;

  const currentLine: ResolvedDialogue | null = currentLineRaw
    ? {
        speaker: currentLineRaw.speaker,
        text: substitutePlaceholders(currentLineRaw.text),
        type: currentLineRaw.type,
        raw: currentLineRaw
      }
    : null;

  useEffect(() => {
    if (!currentLineRaw || currentLineRaw.type !== "celebration" || !currentLineRaw.reward) {
      return;
    }
    const key = `${currentSceneId}:${phase}:${dialogueIndex}`;
    if (processedRewards.current.has(key)) {
      return;
    }
    processedRewards.current.add(key);
    options?.onReward?.(currentLineRaw.reward);
  }, [currentLineRaw, currentSceneId, phase, dialogueIndex, options]);

  const moveToNextScene = useCallback(() => {
    const scene = sceneMap.get(currentSceneId);
    const targetId =
      (scene?.next && scene.next.length > 0 ? scene.next : null) ??
      (() => {
        const idx = sceneOrder.indexOf(currentSceneId);
        if (idx >= 0 && idx < sceneOrder.length - 1) {
          return sceneOrder[idx + 1];
        }
        return null;
      })();

    if (targetId) {
      setCurrentSceneId(targetId);
    } else {
      setIsComplete(true);
    }
  }, [currentSceneId, sceneMap, sceneOrder]);

  const finalizePostPhase = useCallback(() => {
    if (pendingNextStep === "interaction") {
      setPhase("interaction");
      setPendingNextStep(null);
    } else {
      setPendingNextStep(null);
      moveToNextScene();
    }
  }, [pendingNextStep, moveToNextScene]);

  const advance = useCallback(() => {
    if (isComplete) return;
    if (phase === "interaction") {
      if (currentInteraction?.type === "choice") return;
      return;
    }

    if (dialogueList.length === 0) {
      if (phase === "dialogue") {
        if (currentScene?.interactions && currentScene.interactions.length > 0) {
          setPhase("interaction");
        } else {
          moveToNextScene();
        }
      } else {
        finalizePostPhase();
      }
      return;
    }

    if (dialogueIndex < dialogueList.length - 1) {
      setDialogueIndex((prev) => prev + 1);
      return;
    }

    if (phase === "dialogue") {
      if (currentScene?.interactions && interactionIndex < (currentScene.interactions.length ?? 0)) {
        setPhase("interaction");
      } else {
        moveToNextScene();
      }
    } else {
      finalizePostPhase();
    }
  }, [
    isComplete,
    phase,
    dialogueList.length,
    dialogueIndex,
    currentScene,
    currentInteraction,
    interactionIndex,
    finalizePostPhase,
    moveToNextScene
  ]);

  const completeInteraction = useCallback((payload?: any) => {
    if (!currentScene?.interactions) {
      setPhase("dialogue");
      return;
    }
    const interaction = currentScene.interactions[interactionIndex];
    if (!interaction) {
      setPhase("dialogue");
      return;
    }

    if (interaction.type === "text-input" && payload?.value) {
      setPlayerName(payload.value);
    }

    if (interaction.type === "choice" && payload?.choice) {
      if (payload.choice.pointsAwarded) {
        options?.onReward?.({
          xp: payload.choice.pointsAwarded,
          title: payload.choice.feedback,
          variant: "choice"
        });
      }
    }

    const nextIndex = interactionIndex + 1;
    const hasMore = nextIndex < currentScene.interactions.length;

    const postDialogue: EpisodeDialogue[] | undefined =
      payload?.postDialogueOverride ?? interaction.postDialogue;

    setInteractionIndex(nextIndex);

    if (postDialogue && postDialogue.length > 0) {
      setDialogueList(postDialogue);
      setDialogueIndex(0);
      setPhase("post");
      setPendingNextStep(hasMore ? "interaction" : "scene");
    } else {
      if (hasMore) {
        setPhase("interaction");
      } else {
        moveToNextScene();
      }
    }
  }, [currentScene, interactionIndex, moveToNextScene, options]);

  const selectChoice = useCallback((choiceId: string) => {
    const interaction = currentScene?.interactions?.[interactionIndex];
    if (!interaction || interaction.type !== "choice") return;
    const choice = interaction.choices?.find((item: any) => item.id === choiceId);
    if (!choice) return;

    const feedbackDialogue: EpisodeDialogue[] = choice.feedback
      ? [
          {
            speaker: choice.feedbackSpeaker ?? "Kastor",
            text: choice.feedback
          }
        ]
      : [];

    completeInteraction({
      choice,
      postDialogueOverride: [...feedbackDialogue, ...(interaction.postDialogue ?? [])]
    });
  }, [currentScene, interactionIndex, completeInteraction]);

  const submitTextInput = useCallback((value: string) => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    completeInteraction({ value: trimmed });
  }, [completeInteraction]);

  const mode: "dialogue" | "interaction" | "complete" = isComplete
    ? "complete"
    : phase === "interaction" && currentInteraction?.type === "choice"
    ? "dialogue"
    : phase === "interaction"
    ? "interaction"
    : "dialogue";

  const choices: ChoiceOption[] | undefined =
    phase === "interaction" && currentInteraction?.type === "choice"
      ? currentInteraction.choices?.map((choice: any) => ({
          id: choice.id,
          text: choice.label ?? choice.text ?? choice.id,
          data: choice
        }))
      : undefined;

  return {
    currentScene,
    currentLine,
    mode,
    choices,
    interaction:
      phase === "interaction" && currentInteraction?.type !== "choice"
        ? currentInteraction
        : null,
    advance,
    selectChoice,
    submitTextInput,
    completeInteraction,
    playerName,
    setPlayerName,
    sceneProgress: {
      index: currentSceneIdx >= 0 ? currentSceneIdx + 1 : 0,
      total: sceneOrder.length
    }
  };
}
