import { create } from "zustand";
import { globalSoundManager } from "@/utils/soundManager";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  masterVolume: number;
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  registerEffect: (id: string, src: string, options?: { loop?: boolean; volume?: number }) => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  playEffect: (id: string, options?: { interrupt?: boolean; volume?: number }) => void;
  playHit: () => void;
  playSuccess: () => void;
  playMessageSound: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: false,
  masterVolume: 0.7,

  setBackgroundMusic: (music) => {
    music.loop = true;
    music.volume = get().isMuted ? 0 : get().masterVolume * 0.4;
    set({ backgroundMusic: music });
  },
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),

  registerEffect: (id, src, options) => {
    if (globalSoundManager) {
      globalSoundManager.preload(id, src, options);
    }
  },

  toggleMute: () => {
    const { isMuted, backgroundMusic } = get();
    const nextMuted = !isMuted;
    set({ isMuted: nextMuted });
    if (globalSoundManager) {
      globalSoundManager.muted = nextMuted;
    }
    if (backgroundMusic) {
      backgroundMusic.muted = nextMuted;
      if (nextMuted) {
        backgroundMusic.pause();
      } else {
        backgroundMusic
          .play()
          .then(() => {})
          .catch(() => {});
      }
    }
  },

  setVolume: (volume) => {
    const clamped = Math.max(0, Math.min(1, volume));
    set({ masterVolume: clamped });
    if (globalSoundManager) {
      globalSoundManager.masterVolume = clamped;
    }
    const { backgroundMusic } = get();
    if (backgroundMusic) {
      backgroundMusic.volume = clamped * 0.4;
    }
  },

  playEffect: (id, options) => {
    if (globalSoundManager) {
      globalSoundManager.play(id, options);
    }
  },

  playHit: () => {
    const { hitSound, isMuted, masterVolume } = get();
    if (isMuted) return;
    if (globalSoundManager) {
      globalSoundManager.play("ui-hit", { volume: masterVolume * 0.4 });
      return;
    }
    if (!hitSound) return;
    const clone = hitSound.cloneNode() as HTMLAudioElement;
    clone.volume = masterVolume * 0.4;
    clone.play().catch(() => {});
  },

  playSuccess: () => {
    const { isMuted, masterVolume } = get();
    if (isMuted) return;
    if (globalSoundManager) {
      globalSoundManager.play("ui-success", { volume: masterVolume * 0.5 });
      return;
    }
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 860;
      oscillator.type = "triangle";
      gainNode.gain.setValueAtTime(0.25 * masterVolume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.18);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.18);
    } catch {
      // ignore playback errors
    }
  },

  playMessageSound: () => {
    const { isMuted, masterVolume } = get();
    if (isMuted) return;
    if (globalSoundManager) {
      globalSoundManager.play("ui-message", { volume: masterVolume * 0.3 });
    }
  },
}));
