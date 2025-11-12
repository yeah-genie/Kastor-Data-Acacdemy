type SoundEntry = {
  id: string;
  audio: HTMLAudioElement;
};

export class SoundManager {
  private sounds = new Map<string, SoundEntry>();
  private _masterVolume = 0.7;
  private _muted = false;

  preload(id: string, src: string, options?: { loop?: boolean; volume?: number }) {
    if (typeof window === "undefined") return;
    const audio = new Audio(src);
    audio.loop = options?.loop ?? false;
    audio.volume = options?.volume ?? this._masterVolume;
    this.sounds.set(id, { id, audio });
  }

  play(id: string, options?: { interrupt?: boolean; volume?: number }) {
    if (this._muted) return;
    const entry = this.sounds.get(id);
    if (!entry) return;
    const audio = options?.interrupt ? entry.audio : (entry.audio.cloneNode() as HTMLAudioElement);
    audio.volume = options?.volume ?? this._masterVolume;
    audio.play().catch(() => {});
  }

  stop(id: string) {
    const entry = this.sounds.get(id);
    if (!entry) return;
    entry.audio.pause();
    entry.audio.currentTime = 0;
  }

  set masterVolume(value: number) {
    this._masterVolume = Math.max(0, Math.min(1, value));
    this.sounds.forEach((entry) => {
      entry.audio.volume = this._masterVolume;
    });
  }

  get masterVolume() {
    return this._masterVolume;
  }

  set muted(value: boolean) {
    this._muted = value;
    this.sounds.forEach((entry) => {
      entry.audio.muted = value;
    });
  }

  get muted() {
    return this._muted;
  }
}

export const globalSoundManager = typeof window !== "undefined" ? new SoundManager() : null;
