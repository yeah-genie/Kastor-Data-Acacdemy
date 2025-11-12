import type { Evidence, Episode } from "@/types";
import { useGameStore } from "@/store/gameStore";

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  points: number;
  predicate: (state: ReturnType<typeof useGameStore.getState>) => boolean;
}

export class ProgressTracker {
  calculateEpisodeProgress(episode: Episode): number {
    const state = useGameStore.getState();
    const totalScenes = episode.scenes.length;
    const visited = episode.scenes.filter((scene) => state.sceneHistory.includes(scene.id)).length;
    const evidenceTotal = episode.evidence.length;
    const evidenceCollected = episode.evidence.filter((item) =>
      state.collectedEvidence.some((collected) => collected.id === item.id),
    ).length;
    const sceneWeight = totalScenes ? visited / totalScenes : 0;
    const evidenceWeight = evidenceTotal ? evidenceCollected / evidenceTotal : 0;
    return Math.round((sceneWeight * 0.6 + evidenceWeight * 0.4) * 100);
  }

  recordSceneVisit(sceneId: string) {
    const store = useGameStore.getState();
    store.goToScene(sceneId);
  }

  recordEvidence(evidence: Evidence) {
    const store = useGameStore.getState();
    store.addEvidence(evidence);
  }
}

export class AchievementManager {
  private definitions: AchievementDefinition[];

  constructor(definitions?: AchievementDefinition[]) {
    this.definitions =
      definitions ??
      [
        {
          id: "first-evidence",
          title: "First Evidence",
          description: "Collect your first piece of evidence.",
          points: 50,
          predicate: (state) => state.collectedEvidence.length > 0,
        },
        {
          id: "pattern-detective",
          title: "Detective's Eye",
          description: "Find a hidden pattern without using hints.",
          points: 75,
          predicate: (state) => state.gameProgress >= 40 && state.madeChoices.length >= 1,
        },
        {
          id: "truth-seeker",
          title: "Truth Seeker",
          description: "Make the correct accusation scene choice.",
          points: 100,
          predicate: (state) => state.madeChoices.some((choice) => choice.consequence?.sceneUnlock?.includes("ep4-resolution")),
        },
      ];
  }

  evaluateAchievements(): string[] {
    const state = useGameStore.getState();
    return this.definitions
      .filter((definition) => definition.predicate(state))
      .map((definition) => definition.id);
  }
}
