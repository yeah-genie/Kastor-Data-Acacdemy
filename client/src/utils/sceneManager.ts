import type { Choice, Episode, Scene } from "@/types";
import { useGameStore } from "@/store/gameStore";

interface SceneManagerOptions {
  episodes: Episode[];
}

export class SceneManager {
  private episodeMap: Map<string, Episode>;

  constructor(options: SceneManagerOptions) {
    this.episodeMap = new Map(options.episodes.map((episode) => [episode.id, episode]));
  }

  getEpisode(episodeId: string): Episode | undefined {
    return this.episodeMap.get(episodeId);
  }

  loadScene(sceneId: string): Scene | undefined {
    const { currentEpisode } = useGameStore.getState();
    if (!currentEpisode) return undefined;
    const episode = this.getEpisode(currentEpisode);
    return episode?.scenes.find((scene) => scene.id === sceneId);
  }

  checkRequirements(scene: Scene): boolean {
    const { hasEvidence, madeChoices } = useGameStore.getState();
    if (!scene.requirements) return true;
    const requiredEvidence = scene.requirements.evidence ?? [];
    const requiredChoices = scene.requirements.choices ?? [];
    const evidenceOk = requiredEvidence.every((evidenceId) => hasEvidence(evidenceId));
    const choicesOk = requiredChoices.every((choiceId) =>
      madeChoices.some((choice) => choice.id === choiceId),
    );
    return evidenceOk && choicesOk;
  }

  transitionToScene(sceneId: string, transitionType: "fade" | "slide-left" | "slide-right" | "zoom" = "fade") {
    const scene = this.loadScene(sceneId);
    if (!scene) {
      console.warn(`SceneManager: Unable to transition, scene ${sceneId} not found.`);
      return;
    }
    if (!this.checkRequirements(scene)) {
      console.warn(`SceneManager: Requirements not met for scene ${sceneId}.`);
      return;
    }
    const store = useGameStore.getState();
    store.goToScene(sceneId);
    store.recordProgress(store.sceneHistory.length * 5);
    if (scene.nextScene && !store.unlockedScenes.includes(scene.nextScene)) {
      store.unlockScene(scene.nextScene);
    }
    // TransitionType currently informational; hook into UI animation system if needed.
    console.debug(`SceneManager: Transitioned to ${sceneId} with transition ${transitionType}.`);
  }

  getNextScene(currentSceneId: string, choice?: Choice): string | null {
    if (choice?.nextScene) {
      return choice.nextScene;
    }
    const scene = this.loadScene(currentSceneId);
    return scene?.nextScene ?? null;
  }

  preloadNextScene(sceneId: string) {
    const nextScene = this.loadScene(sceneId);
    if (!nextScene?.messages) return;
    const imageAssets = nextScene.messages
      ?.flatMap((message) => message.attachments ?? [])
      .filter((attachment) => attachment.type === "image");
    if (imageAssets && typeof window !== "undefined") {
      imageAssets.forEach((asset) => {
        if (typeof asset.content === "string") {
          const img = new Image();
          img.src = asset.content;
        }
      });
    }
  }
}

export default SceneManager;
