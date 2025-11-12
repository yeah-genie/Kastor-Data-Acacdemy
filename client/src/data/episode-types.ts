export interface InteractiveSequence {
  type:
    | "graph_analysis"
    | "logic_connection"
    | "timeline_reconstruction"
    | "testimony_press"
    | "evidence_presentation"
    | "document_examination"
    | "database_search"
    | "case_report_assembly"
    | "log_filtering"
    | "ghost_account_selection"
    | "pattern_matching"
    | "email_filter"
    | "code_debugging";
    | "graph-analysis"
    | "timeline"
    | "database-search"
    | "testimony-press"
    | "document-viewer"
    | "case-report"
    | "rank-display";
  id: string;
  data: any;
}

export interface Message {
  id: string;
  speaker:
    | "detective"
    | "kastor"
    | "maya"
    | "kaito"
    | "lukas"
    | "diego"
    | "system"
    | "narrator"
    | "chris"
    | "ryan"
    | "client"
    | "marcus"
    | "elena"
    | "nina"
    | "camille"
    | "jake"
    | "alex"
    | "harrison"
    | "luna"
    | "fixer";
  text: string;
  avatar?: string;
  characterName?: string;
  celebration?: {
    type: "mini" | "major";
    title: string;
    points?: number;
    caseNumber?: number;
    caseTitle?: string;
  };
  timestamp?: string;
  email?: {
    from: string;
    subject: string;
    body: string;
  };
  voicemail?: {
    from: string;
    timestamp: string;
    text: string;
    autoPlay?: boolean;
  };
  image?: string;
  photo?: string;
  soundEffect?: string;
  reaction?: string;
}

export interface DataVisualization {
  type: "chart" | "table" | "log";
  title: string;
  data: any;
}

export interface Hint {
  level: 1 | 2 | 3;
  title: string;
  content: string;
  cost?: number;
}

export interface StoryNode {
  id: string;
  phase: "stage1" | "stage2" | "stage3" | "stage4" | "stage5";
  messages: Message[];
  interactiveSequence?: InteractiveSequence;
  hints?: Hint[];
  question?: {
    id: string;
    text: string;
    choices: {
      id: string;
      text: string;
      isCorrect: boolean;
      nextNode: string;
      feedback: string;
      pointsAwarded?: number;
    }[];
  };
  autoAdvance?: {
    nextNode: string;
    delay: number;
  };
}
