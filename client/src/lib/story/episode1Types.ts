export interface EpisodeMetadata {
  caseId: number;
  episodeCode: string;
  title: string;
  tagline?: string;
  description?: string;
  setting?: string;
  difficulty?: string;
  themeColor?: string;
  background?: string;
  relatedEpisodes?: string[];
}

export interface EpisodeStructure {
  acts: {
    id: string;
    label: string;
    scenes: string[];
  }[];
}

export interface EpisodeLayout {
  background: string;
  lighting?: string;
  hud?: string;
}

export interface EpisodeDialogue {
  speaker: string;
  text?: string;
  type?: string;
  mood?: string;
  expression?: string;
  image?: string;
  soundEffect?: string;
  reaction?: string;
}

export interface EpisodeInteractionBase {
  id: string;
  type: string;
  postDialogue?: EpisodeDialogue[];
  [key: string]: any;
}

export type EpisodeInteraction = EpisodeInteractionBase;

export interface EpisodeScene {
  id: string;
  code?: string;
  title?: string;
  location?: string;
  phase?: string;
  layout?: EpisodeLayout;
  goals?: string[];
  dialogue: EpisodeDialogue[];
  interactions?: EpisodeInteraction[];
  hints?: any[];
  next?: string | null;
  unlockCondition?: string;
}

export interface EpisodeGlossary {
  characters?: any[];
  mechanics?: any[];
  rewards?: any[];
}

export interface EpisodeData {
  metadata: EpisodeMetadata;
  structure: EpisodeStructure;
  scenes: EpisodeScene[];
  glossary?: EpisodeGlossary;
}
