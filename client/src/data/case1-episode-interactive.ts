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
    | "player_name_input";
  id: string;
  data: any;
}

export interface Message {
  id: string;
  speaker: "detective" | "kastor" | "maya" | "ryan" | "daniel" | "alex" | "chris" | "client" | "system" | "narrator";
  text?: string;
  avatar?: string;
  celebration?: {
    caseNumber: number;
    caseTitle: string;
  };
  dataVisualization?: DataVisualization;
  isQuestion?: boolean;
  isCharacterCards?: boolean;
  isEvidencePresentation?: boolean;
  timestamp?: string;
  characterName?: string;
  photo?: string;
  evidenceNotification?: {
    title: string;
    icon?: string;
  };
  logicThought?: {
    title: string;
  };
}

export interface DataVisualization {
  type: "chart" | "table" | "log";
  title: string;
  data: any;
}

export interface StageSummary {
  stage: number;
  title: string;
  keyFindings: string[];
  evidenceCount: number;
  nextStageHint?: string;
}

export interface StoryNode {
  id: string;
  phase: "stage1" | "stage2" | "stage3" | "stage4" | "stage5";
  messages: Message[];
  interactiveSequence?: InteractiveSequence;
  dataVisualizations?: DataVisualization[];
  question?: {
    id: string;
    text: string;
    choices: {
      id: string;
      text: string;
      isCorrect: boolean;
      nextNode: string;
      feedback: string;
      clueAwarded?: {
        id: string;
        title: string;
        description: string;
      };
      evidenceAwarded?: any;
      pointsAwarded?: number;
      hintEvidenceId?: string;
      hintText?: string;
    }[];
  };
  autoAdvance?: {
    nextNode: string;
    delay: number;
  };
  stageSummary?: StageSummary;
  showCharacterCards?: boolean;
  evidencePresentation?: {
    prompt: string;
    npcStatement: string;
    npcCharacter: string;
    correctEvidenceId: string;
    correctFeedback: string;
    wrongFeedback: string;
    nextNode: string;
    wrongNode?: string;
    pointsAwarded?: number;
    penaltyPoints?: number;
  };
}

export const case1EpisodeInteractive: Record<string, StoryNode> = {
  // Scene 0 - First Meeting
  start: {
    id: "start",
    phase: "stage1",
    messages: [
      { id: "m1", speaker: "system", text: "Episode 1: The Missing Balance Patch (Interactive Version)" },
      { id: "m2", speaker: "system", text: "Data Detective Academy - Case #001" },
      { id: "m3", speaker: "narrator", text: "[Setting: Run-down office]" },
      { id: "m4", speaker: "kastor", text: "Zzz..." },
      { id: "m5", speaker: "narrator", text: "[Detective opens door and enters]" },
    ],
    autoAdvance: { nextNode: "first_meeting", delay: 1000 },
  },

  first_meeting: {
    id: "first_meeting",
    phase: "stage1",
    messages: [
      { id: "m6", speaker: "detective", text: "Is this the right place?" },
      { id: "m7", speaker: "kastor", text: "Huh? (waking up) Oh, the newbie?" },
      { id: "m8", speaker: "detective", text: "I'm the new detective." },
      { id: "m9", speaker: "kastor", text: "You don't look like a detective." },
      { id: "m10", speaker: "detective", text: "It's my first day!" },
      { id: "m11", speaker: "kastor", text: "Yeah, I can tell. What's your name?" },
    ],
    autoAdvance: { nextNode: "name_input", delay: 500 },
  },

  name_input: {
    id: "name_input",
    phase: "stage1",
    messages: [
      { id: "m12", speaker: "kastor", text: "Got it. I'm Kastor." },
      { id: "m13", speaker: "kastor", text: "Alright, we've got our first case. Ready to dive in?" },
    ],
    autoAdvance: { nextNode: "email_arrives", delay: 500 },
  },

  // Scene 1 - Client Email & Maya's Call
  email_arrives: {
    id: "email_arrives",
    phase: "stage1",
    messages: [
      { id: "m14", speaker: "kastor", text: "Mail's here!" },
      { id: "m15", speaker: "narrator", text: "[Opens email]" },
      { id: "m16", speaker: "system", text: "From: Maya Chen" },
      { id: "m17", speaker: "system", text: "Subject: URGENT! Please help!" },
      { id: "m18", speaker: "maya", text: "The Shadow character's win rate jumped from 50% to 85% overnight!" },
      { id: "m19", speaker: "maya", text: "We didn't release any patches... This is a disaster!" },
      {
        id: "m20",
        speaker: "system",
        text: "",
        evidenceNotification: {
          title: "EVIDENCE ADDED: Maya's Request Email",
          icon: "📧"
        }
      },
    ],
    question: {
      id: "q1",
      text: "What's your initial assessment?",
      choices: [
        {
          id: "c1",
          text: "So it suddenly became overpowered",
          isCorrect: true,
          nextNode: "call_maya",
          feedback: "Right. Something changed the character's strength.",
          pointsAwarded: 10,
        },
        {
          id: "c2",
          text: "It's probably just a bug",
          isCorrect: false,
          nextNode: "call_maya",
          feedback: "Possible, but let's gather more evidence first.",
          pointsAwarded: 5,
        },
      ],
    },
  },

  call_maya: {
    id: "call_maya",
    phase: "stage1",
    messages: [
      { id: "m21", speaker: "kastor", text: "Should we call the client?" },
      { id: "m22", speaker: "narrator", text: "[Phone rings]" },
      { id: "m23", speaker: "maya", text: "Hello! Is this the detective?" },
      { id: "m24", speaker: "detective", text: "Yes, I received your email." },
      { id: "m25", speaker: "maya", text: "This is a complete disaster! Players are rioting, the community is exploding with complaints..." },
      { id: "m26", speaker: "maya", text: "If we lose player trust... the game could die!" },
      { id: "m27", speaker: "detective", text: "Calm down. Tell me exactly what happened." },
      { id: "m28", speaker: "maya", text: "We have a character called Shadow, and starting on Day 28, it suddenly became way too strong." },
      { id: "m29", speaker: "maya", text: "But we didn't release any official patches!" },
      { id: "m30", speaker: "kastor", text: "Interesting. Can you send us the data?" },
      { id: "m31", speaker: "maya", text: "Yes! I'll send it right now!" },
      {
        id: "m32",
        speaker: "system",
        text: "",
        evidenceNotification: {
          title: "EVIDENCE ADDED: Maya's Testimony - 'No Official Patch'",
          icon: "💬"
        }
      },
      {
        id: "m33",
        speaker: "system",
        text: "",
        evidenceNotification: {
          title: "EVIDENCE ADDED: Character Performance Data",
          icon: "📊"
        }
      },
    ],
    question: {
      id: "q2",
      text: "What could be causing this?",
      choices: [
        {
          id: "c3",
          text: "Three possibilities: Hidden patch, bug, or someone tampered with it",
          isCorrect: true,
          nextNode: "kastor_response",
          feedback: "Good thinking! Those are the main possibilities.",
          pointsAwarded: 15,
        },
        {
          id: "c4",
          text: "Definitely a hidden patch",
          isCorrect: false,
          nextNode: "kastor_response",
          feedback: "Let's not jump to conclusions. We need evidence.",
          pointsAwarded: 5,
        },
      ],
    },
  },

  kastor_response: {
    id: "kastor_response",
    phase: "stage1",
    messages: [
      { id: "m34", speaker: "kastor", text: "Three possibilities. Hidden patch, bug, or..." },
      { id: "m35", speaker: "kastor", text: "Someone tampered with it." },
      { id: "m36", speaker: "detective", text: "I'm guessing the last one." },
      { id: "m37", speaker: "kastor", text: "Just a hunch? Detectives work with data, not feelings~" },
    ],
    autoAdvance: { nextNode: "graph_analysis_intro", delay: 1000 },
  },

  // Scene 2 - Graph Analysis (INTERACTIVE)
  graph_analysis_intro: {
    id: "graph_analysis_intro",
    phase: "stage2",
    messages: [
      { id: "m38", speaker: "kastor", text: "Alright, data's in! Time for you to analyze it." },
      { id: "m39", speaker: "kastor", text: "Shadow, Phoenix, Viper. What looks suspicious?" },
    ],
    interactiveSequence: {
      type: "graph_analysis",
      id: "graph1",
      data: {
        series: [
          {
            name: "Shadow",
            color: "#ef4444",
            data: [
              { day: 24, winRate: 49.5 },
              { day: 25, winRate: 50.1 },
              { day: 26, winRate: 49.8 },
              { day: 27, winRate: 50.2 },
              { day: 28, winRate: 84.7 },
              { day: 29, winRate: 85.1 },
              { day: 30, winRate: 85.3 },
            ],
          },
          {
            name: "Phoenix",
            color: "#3b82f6",
            data: [
              { day: 24, winRate: 52.3 },
              { day: 25, winRate: 52.8 },
              { day: 26, winRate: 53.1 },
              { day: 27, winRate: 53.5 },
              { day: 28, winRate: 55.2 },
              { day: 29, winRate: 55.8 },
              { day: 30, winRate: 56.1 },
            ],
          },
          {
            name: "Viper",
            color: "#10b981",
            data: [
              { day: 24, winRate: 48.2 },
              { day: 25, winRate: 48.5 },
              { day: 26, winRate: 48.1 },
              { day: 27, winRate: 47.9 },
              { day: 28, winRate: 47.5 },
              { day: 29, winRate: 47.2 },
              { day: 30, winRate: 46.8 },
            ],
          },
        ],
        question: "Which character shows an abnormal pattern? Select the suspicious line:",
        correctAnswer: "Shadow",
        enableZoom: true,
      },
    },
    autoAdvance: { nextNode: "graph_analysis_result", delay: 0 },
  },

  graph_analysis_result: {
    id: "graph_analysis_result",
    phase: "stage2",
    messages: [
      { id: "m40", speaker: "detective", text: "The red line starting from Day 28..." },
      { id: "m41", speaker: "kastor", text: "Like a rollercoaster, right?" },
      { id: "m42", speaker: "detective", text: "It shot straight up!" },
      { id: "m43", speaker: "narrator", text: "[INTERACTIVE: Zoom in on Day 28 spike]" },
      { id: "m44", speaker: "system", text: "Day 27: Win Rate 50.2% (Normal)" },
      { id: "m45", speaker: "system", text: "Day 28: Win Rate 84.7% (ABNORMAL!)" },
      { id: "m46", speaker: "system", text: "Day 29: Win Rate 85.1% (Sustained)" },
      {
        id: "m47",
        speaker: "system",
        text: "",
        evidenceNotification: {
          title: "EVIDENCE ADDED: Shadow Win Rate Spike Graph",
          icon: "📈"
        }
      },
      { id: "m48", speaker: "kastor", text: "Exactly! Something's definitely fishy." },
      { id: "m49", speaker: "detective", text: "Phoenix went up a bit too though?" },
      { id: "m50", speaker: "kastor", text: "That's a healthy increase. Shadow's is a rocket launch." },
      {
        id: "m51",
        speaker: "system",
        text: "",
        logicThought: {
          title: "LOGIC THOUGHT UNLOCKED: Shadow's Unnatural Power Spike"
        }
      },
      { id: "m52", speaker: "kastor", text: "Not bad for a rookie. Took you 10 minutes." },
    ],
    autoAdvance: { nextNode: "document_check", delay: 1000 },
  },

  // Scene 3 - Document Investigation (INTERACTIVE)
  document_check: {
    id: "document_check",
    phase: "stage2",
    messages: [
      { id: "m53", speaker: "kastor", text: "Let's check the official patch notes." },
    ],
    interactiveSequence: {
      type: "document_examination",
      id: "doc1",
      data: {
        title: "Day 28 Patch Notes",
        sections: [
          { label: "Phoenix", content: "Cooldown -2 seconds ✓", suspicious: false },
          { label: "Viper", content: "Bug fix (hitbox) ✓", suspicious: false },
          { label: "Shadow", content: "No changes listed ⚠️", suspicious: true },
        ],
        instruction: "Click on suspicious sections",
      },
    },
    autoAdvance: { nextNode: "document_result", delay: 0 },
  },

  document_result: {
    id: "document_result",
    phase: "stage2",
    messages: [
      { id: "m54", speaker: "detective", text: "It says Shadow wasn't changed." },
      {
        id: "m55",
        speaker: "system",
        text: "",
        evidenceNotification: {
          title: "EVIDENCE ADDED: Official Patch Notes - Day 28",
          icon: "📄"
        }
      },
      { id: "m56", speaker: "kastor", text: "But the win rate went up. Suspicious. Let's check the server logs!" },
    ],
    autoAdvance: { nextNode: "logs_check", delay: 500 },
  },

  logs_check: {
    id: "logs_check",
    phase: "stage2",
    messages: [
      { id: "m57", speaker: "kastor", text: "Search for 'Shadow' in the logs around Day 28." },
    ],
    interactiveSequence: {
      type: "document_examination",
      id: "logs1",
      data: {
        title: "Server Logs - Day 28",
        sections: [
          { label: "[Day 28 19:20]", content: "admin01 - Shadow data accessed (READ)", suspicious: false },
          { label: "[Day 28 23:47]", content: "admin01 - Shadow data modified (WRITE) ⚠️", suspicious: true },
          { label: "[Day 28 23:52]", content: "admin01 - Log deletion attempt (FAILED) 🚨", suspicious: true },
        ],
        instruction: "Look for suspicious entries",
      },
    },
    autoAdvance: { nextNode: "found_tampering", delay: 0 },
  },

  found_tampering: {
    id: "found_tampering",
    phase: "stage2",
    messages: [
      { id: "m58", speaker: "detective", text: "Wait, someone modified it!" },
      { id: "m59", speaker: "kastor", text: "And at 11 PM. Plus they tried to delete the logs." },
      {
        id: "m60",
        speaker: "system",
        text: "",
        evidenceNotification: {
          title: "EVIDENCE ADDED: Server Log - Unauthorized Modification",
          icon: "📝"
        }
      },
      {
        id: "m61",
        speaker: "system",
        text: "",
        logicThought: {
          title: "LOGIC THOUGHT UNLOCKED: Someone Tampered After Hours"
        }
      },
    ],
    autoAdvance: { nextNode: "logic_connection_intro", delay: 500 },
  },

  // Scene 3.5 - Logic Connection (INTERACTIVE)
  logic_connection_intro: {
    id: "logic_connection_intro",
    phase: "stage3",
    messages: [
      { id: "m62", speaker: "kastor", text: "Time to connect the dots. What do these clues tell us?" },
    ],
    interactiveSequence: {
      type: "logic_connection",
      id: "logic1",
      data: {
        thoughts: [
          { id: "t1", text: "Shadow's Unnatural Power Spike" },
          { id: "t2", text: "No Official Patch Released" },
          { id: "t3", text: "Someone Tampered After Hours" },
        ],
        correctConnections: [
          { from: "t1", to: "t2", deduction: "Unauthorized Patch Occurred" },
        ],
      },
    },
    autoAdvance: { nextNode: "logic_result", delay: 0 },
  },

  logic_result: {
    id: "logic_result",
    phase: "stage3",
    messages: [
      { id: "m63", speaker: "detective", text: "The official patch notes say Shadow wasn't changed..." },
      { id: "m64", speaker: "detective", text: "But the win rate proves it WAS changed!" },
      {
        id: "m65",
        speaker: "system",
        text: "",
        logicThought: {
          title: "NEW LOGIC UNLOCKED: Unauthorized Patch Occurred"
        }
      },
      { id: "m66", speaker: "detective", text: "Someone modified Shadow's data secretly after work hours!" },
      { id: "m67", speaker: "kastor", text: "Bingo! Now we need to find out WHO." },
      { id: "m68", speaker: "detective", text: "Maya should know who admin01 is!" },
    ],
    autoAdvance: { nextNode: "call_maya_admin", delay: 1000 },
  },

  call_maya_admin: {
    id: "call_maya_admin",
    phase: "stage3",
    messages: [
      { id: "m69", speaker: "narrator", text: "[Phone call]" },
      { id: "m70", speaker: "detective", text: "Maya, I checked the official documentation." },
      { id: "m71", speaker: "maya", text: "Yes, we didn't touch Shadow." },
      { id: "m72", speaker: "detective", text: "But the server logs show modification records by admin01." },
      { id: "m73", speaker: "maya", text: "...What? Then someone secretly...?" },
      { id: "m74", speaker: "maya", text: "admin01... Hold on, let me check." },
      { id: "m75", speaker: "maya", text: "admin01 is Ryan Nakamura. He's our balance designer..." },
      {
        id: "m76",
        speaker: "system",
        text: "",
        evidenceNotification: {
          title: "PROFILE ADDED: Ryan Nakamura - Balance Designer",
          icon: "👤"
        }
      },
      { id: "m77", speaker: "detective", text: "Did he work late that night?" },
      { id: "m78", speaker: "maya", text: "No! Day 28 was a no-overtime day!" },
      { id: "m79", speaker: "maya", text: "From home... did he log in secretly?" },
      {
        id: "m80",
        speaker: "system",
        text: "",
        evidenceNotification: {
          title: "EVIDENCE UPDATED: Maya's Testimony - 'Ryan Shouldn't Have Been Working'",
          icon: "💬"
        }
      },
      { id: "m81", speaker: "kastor", text: "Highly likely. We need to dig deeper." },
    ],
    autoAdvance: { nextNode: "timeline_intro", delay: 1000 },
  },

  // Scene 4 - Timeline Reconstruction (INTERACTIVE)
  timeline_intro: {
    id: "timeline_intro",
    phase: "stage3",
    messages: [
      { id: "m82", speaker: "kastor", text: "Let's filter admin01's activity logs!" },
      { id: "m83", speaker: "kastor", text: "Arrange these events in chronological order." },
    ],
    interactiveSequence: {
      type: "timeline_reconstruction",
      id: "timeline1",
      data: {
        events: [
          { id: "e1", time: "19:15", text: "Office login", order: 1 },
          { id: "e2", time: "19:20", text: "Shadow data accessed", order: 2 },
          { id: "e3", time: "19:45", text: "Office logout", order: 3 },
          { id: "e4", time: "23:35", text: "Home login ⚠️", order: 4, suspicious: true },
          { id: "e5", time: "23:47", text: "Shadow data modified 🚨", order: 5, suspicious: true },
          { id: "e6", time: "23:52", text: "Log deletion attempt 🚨", order: 6, suspicious: true },
        ],
        scrambled: true,
      },
    },
    autoAdvance: { nextNode: "timeline_result", delay: 0 },
  },

  timeline_result: {
    id: "timeline_result",
    phase: "stage3",
    messages: [
      {
        id: "m84",
        speaker: "system",
        text: "",
        evidenceNotification: {
          title: "EVIDENCE ADDED: Ryan's Activity Timeline",
          icon: "⏰"
        }
      },
      { id: "m85", speaker: "detective", text: "He logged back in from home after leaving work!" },
      { id: "m86", speaker: "kastor", text: "This was planned. But wait..." },
      { id: "m87", speaker: "kastor", text: "There's also admin02. Logged in at 10:30 PM." },
      { id: "m88", speaker: "system", text: "admin02 (Daniel):" },
      { id: "m89", speaker: "system", text: "22:30 - Login" },
      { id: "m90", speaker: "system", text: "22:35 - Server health check" },
      { id: "m91", speaker: "system", text: "22:40 - Logout" },
      { id: "m92", speaker: "system", text: "" },
      { id: "m93", speaker: "system", text: "admin01 (Ryan):" },
      { id: "m94", speaker: "system", text: "23:35 - Login" },
      { id: "m95", speaker: "system", text: "23:47 - Shadow modified" },
      { id: "m96", speaker: "detective", text: "admin02 left before admin01 logged in." },
      { id: "m97", speaker: "kastor", text: "Let's interview Daniel to confirm." },
    ],
    autoAdvance: { nextNode: "daniel_interview", delay: 1000 },
  },

  daniel_interview: {
    id: "daniel_interview",
    phase: "stage3",
    messages: [
      { id: "m98", speaker: "narrator", text: "[Call connects]" },
      { id: "m99", speaker: "daniel", text: "Hello? You were looking for me?" },
      { id: "m100", speaker: "detective", text: "Daniel Schmidt? I have a few questions." },
      { id: "m101", speaker: "daniel", text: "Sure, of course!" },
    ],
    question: {
      id: "q3",
      text: "What do you want to ask Daniel?",
      choices: [
        {
          id: "c5",
          text: "What were you doing on Day 28 at 10:30 PM?",
          isCorrect: true,
          nextNode: "daniel_question_1",
          feedback: "Good question. Let's hear his answer.",
          pointsAwarded: 10,
        },
        {
          id: "c6",
          text: "Do you know Ryan well?",
          isCorrect: true,
          nextNode: "daniel_question_2",
          feedback: "Understanding their relationship is important.",
          pointsAwarded: 10,
        },
      ],
    },
  },

  daniel_question_1: {
    id: "daniel_question_1",
    phase: "stage3",
    messages: [
      { id: "m102", speaker: "detective", text: "You logged in on Day 28 at 10:30 PM, correct?" },
      { id: "m103", speaker: "daniel", text: "Oh, yes! There was an emergency server check." },
      { id: "m104", speaker: "detective", text: "What did you do?" },
      { id: "m105", speaker: "daniel", text: "Just checked the server status. About 10 minutes?" },
      {
        id: "m106",
        speaker: "system",
        text: "",
        evidenceNotification: {
          title: "TESTIMONY ADDED: Daniel's Statement",
          icon: "💬"
        }
      },
    ],
    autoAdvance: { nextNode: "daniel_question_2", delay: 500 },
  },

  daniel_question_2: {
    id: "daniel_question_2",
    phase: "stage3",
    messages: [
      { id: "m107", speaker: "detective", text: "Do you know what Ryan was doing that night?" },
      { id: "m108", speaker: "daniel", text: "Ryan? He probably went home." },
      { id: "m109", speaker: "daniel", text: "We left together. Around 7 PM?" },
      { id: "m110", speaker: "kastor", text: "But Ryan logged back in at 11:35 PM." },
      { id: "m111", speaker: "daniel", text: "...What? From home?" },
      { id: "m112", speaker: "daniel", text: "That can't be right... Ryan's a good kid!" },
      { id: "m113", speaker: "detective", text: "Are you sure?" },
      { id: "m114", speaker: "daniel", text: "Yes! I've been his mentor for a year. He's hardworking and kind!" },
      {
        id: "m115",
        speaker: "system",
        text: "",
        evidenceNotification: {
          title: "PROFILE ADDED: Daniel Schmidt - Senior Admin, Ryan's Mentor",
          icon: "👤"
        }
      },
      { id: "m116", speaker: "kastor", text: "Understood. Thanks for your help." },
      { id: "m117", speaker: "narrator", text: "[Call ends]" },
      { id: "m118", speaker: "detective", text: "Daniel seems to know nothing." },
      { id: "m119", speaker: "kastor", text: "Yeah. Ryan acted alone." },
    ],
    autoAdvance: { nextNode: "ip_tracking", delay: 1000 },
  },

  // Scene 5 - IP Investigation & Database Search (INTERACTIVE)
  ip_tracking: {
    id: "ip_tracking",
    phase: "stage4",
    messages: [
      { id: "m120", speaker: "kastor", text: "admin01's IP trace is back!" },
      { id: "m121", speaker: "detective", text: "192.168.45.178?" },
      { id: "m122", speaker: "kastor", text: "This IP also played the game. Let's search it." },
    ],
    interactiveSequence: {
      type: "database_search",
      id: "db_search1",
      data: {
        searchType: "ip",
        searchValue: "192.168.45.178",
        results: [
          {
            ign: "Noctis",
            ip: "192.168.45.178",
            mainCharacter: "Shadow (95% pick rate)",
            session: "Day 28: 23:50~01:30",
            winRate: "48% → 88% 🚨",
          },
        ],
      },
    },
    autoAdvance: { nextNode: "found_noctis", delay: 0 },
  },

  found_noctis: {
    id: "found_noctis",
    phase: "stage4",
    messages: [
      {
        id: "m123",
        speaker: "system",
        text: "",
        evidenceNotification: {
          title: "EVIDENCE ADDED: Noctis Player Profile",
          icon: "🎮"
        }
      },
      { id: "m124", speaker: "detective", text: "Started playing 3 minutes after the modification!" },
      { id: "m125", speaker: "kastor", text: "Suspicious timing. But there's another Shadow player." },
      { id: "m126", speaker: "system", text: "IGN: ShadowFan99" },
      { id: "m127", speaker: "system", text: "Main Character: Shadow (87% pick rate)" },
      { id: "m128", speaker: "system", text: "Day 28 Session: 19:00~21:00" },
      { id: "m129", speaker: "system", text: "Win Rate: 62% → 65%" },
      { id: "m130", speaker: "detective", text: "ShadowFan99 also benefited." },
      { id: "m131", speaker: "kastor", text: "Let's interview both. You choose who to call first." },
    ],
    question: {
      id: "q4",
      text: "Who should we interview first?",
      choices: [
        {
          id: "c7",
          text: "Interview ShadowFan99 (Alex) first",
          isCorrect: true,
          nextNode: "alex_interview",
          feedback: "Good choice. Let's rule out other suspects first.",
          pointsAwarded: 10,
        },
        {
          id: "c8",
          text: "Interview Noctis (Ryan) first",
          isCorrect: false,
          nextNode: "alex_interview",
          feedback: "Actually, let's talk to Alex first to rule them out.",
          pointsAwarded: 5,
        },
      ],
    },
  },

  // Scene 5A - Alex Interview (INTERACTIVE)
  alex_interview: {
    id: "alex_interview",
    phase: "stage4",
    messages: [
      { id: "m132", speaker: "narrator", text: "[Call - Alex]" },
      { id: "m133", speaker: "alex", text: "Hello? What's this about?" },
      { id: "m134", speaker: "detective", text: "Alex Torres? I have some questions about the game." },
      { id: "m135", speaker: "alex", text: "Sure! I'm a Shadow main!" },
      { id: "m136", speaker: "narrator", text: "[INTERACTIVE: Testimony Analysis]" },
      { id: "m137", speaker: "alex", text: "I played Shadow on Day 28 from 7 PM to 9 PM!" },
      { id: "m138", speaker: "alex", text: "Shadow got so strong that day, it was awesome!" },
      { id: "m139", speaker: "alex", text: "I stopped at 9 PM and did homework after that." },
      { id: "m140", speaker: "alex", text: "I didn't log in again that night!" },
    ],
    question: {
      id: "q5",
      text: "Which statement do you want to press?",
      choices: [
        {
          id: "c9",
          text: "Press: 'Shadow got so strong that day'",
          isCorrect: true,
          nextNode: "alex_press_1",
          feedback: "Let's dig deeper into what Alex noticed.",
          pointsAwarded: 10,
        },
        {
          id: "c10",
          text: "Press: 'I didn't log in again that night'",
          isCorrect: true,
          nextNode: "alex_press_2",
          feedback: "Good. We should verify the alibi.",
          pointsAwarded: 10,
        },
      ],
    },
  },

  alex_press_1: {
    id: "alex_press_1",
    phase: "stage4",
    messages: [
      { id: "m141", speaker: "detective", text: "You noticed Shadow became stronger?" },
      { id: "m142", speaker: "alex", text: "Yeah! Suddenly I was winning way more matches!" },
      { id: "m143", speaker: "alex", text: "I thought it was just me getting better, but..." },
      { id: "m144", speaker: "detective", text: "But what?" },
      { id: "m145", speaker: "alex", text: "Other Shadow players were dominating too!" },
    ],
    autoAdvance: { nextNode: "alex_press_2", delay: 500 },
  },

  alex_press_2: {
    id: "alex_press_2",
    phase: "stage4",
    messages: [
      { id: "m146", speaker: "detective", text: "Can you prove you didn't log in after 9 PM?" },
      { id: "m147", speaker: "alex", text: "Check the logs! I have nothing to hide!" },
      { id: "m148", speaker: "narrator", text: "[PLAYER ACTION: Check game logs]" },
      { id: "m149", speaker: "system", text: "ShadowFan99 (Alex's IP):" },
      { id: "m150", speaker: "system", text: "19:02 - Login" },
      { id: "m151", speaker: "system", text: "20:58 - Logout ✓" },
      { id: "m152", speaker: "system", text: "[No further activity]" },
      {
        id: "m153",
        speaker: "system",
        text: "",
        evidenceNotification: {
          title: "EVIDENCE ADDED: Alex's Alibi - Logged out at 9 PM",
          icon: "✅"
        }
      },
      { id: "m154", speaker: "detective", text: "You're right. You logged out at 9 PM." },
      { id: "m155", speaker: "alex", text: "See? It wasn't me! I just played the game!" },
      { id: "m156", speaker: "detective", text: "Understood. Thank you." },
      { id: "m157", speaker: "narrator", text: "[Call ends]" },
      { id: "m158", speaker: "kastor", text: "Alex is clear. Now for Ryan..." },
    ],
    autoAdvance: { nextNode: "ryan_confrontation_intro", delay: 1000 },
  },

  // Scene 5B - Ryan Confrontation (INTERACTIVE)
  ryan_confrontation_intro: {
    id: "ryan_confrontation_intro",
    phase: "stage4",
    messages: [
      { id: "m159", speaker: "narrator", text: "[Call - Ryan]" },
      { id: "m160", speaker: "detective", text: "Ryan Nakamura?" },
      { id: "m161", speaker: "ryan", text: "Yes... what's going on? (nervous voice)" },
      { id: "m162", speaker: "narrator", text: "[INTERACTIVE: Confrontation Sequence]" },
      { id: "m163", speaker: "narrator", text: "Ryan's Testimony - 'I Was Just Working Late':" },
    ],
    autoAdvance: { nextNode: "ryan_testimony", delay: 500 },
  },

  ryan_testimony: {
    id: "ryan_testimony",
    phase: "stage4",
    messages: [
      { id: "m164", speaker: "ryan", text: "I sometimes log in from home to check things." },
      { id: "m165", speaker: "ryan", text: "Day 28 was a normal work day for me." },
      { id: "m166", speaker: "ryan", text: "I left the office around 7 PM with Daniel." },
      { id: "m167", speaker: "ryan", text: "I didn't do anything unusual that night." },
      { id: "m168", speaker: "ryan", text: "I don't know why Shadow's win rate changed." },
    ],
    interactiveSequence: {
      type: "testimony_press",
      id: "testimony1",
      data: {
        statements: [
          {
            id: "s1",
            speaker: "ryan",
            text: "I sometimes log in from home to check things.",
            pressResponse: "Y-yes... when there are urgent issues...",
            hasContradiction: false,
          },
          {
            id: "s2",
            speaker: "ryan",
            text: "Day 28 was a normal work day for me.",
            pressResponse: "Nothing special happened that day...",
            hasContradiction: false,
          },
          {
            id: "s3",
            speaker: "ryan",
            text: "I left the office around 7 PM with Daniel.",
            pressResponse: "Yes, Daniel can confirm this...",
            hasContradiction: true,
            contradictionEvidence: "ryan_home_login",
            contradictionFeedback: "But the logs show you logged in at 11:35 PM from home!",
          },
          {
            id: "s4",
            speaker: "ryan",
            text: "I didn't do anything unusual that night.",
            pressResponse: "Just a normal evening at home...",
            hasContradiction: true,
            contradictionEvidence: "shadow_modification_log",
            contradictionFeedback: "At 11:47 PM, you modified Shadow's data!",
          },
          {
            id: "s5",
            speaker: "ryan",
            text: "I don't know why Shadow's win rate changed.",
            pressResponse: "I really don't know...",
            hasContradiction: true,
            contradictionEvidence: "noctis_profile",
            contradictionFeedback: "And 3 minutes later, you logged into the game as Noctis from the same IP!",
          },
        ],
      },
    },
    autoAdvance: { nextNode: "ryan_caught", delay: 0 },
  },

  ryan_caught: {
    id: "ryan_caught",
    phase: "stage4",
    messages: [
      { id: "m169", speaker: "ryan", text: "......" },
      { id: "m170", speaker: "kastor", text: "We have all the evidence. The IP matches, the timing's perfect, and you modified the data." },
    ],
    autoAdvance: { nextNode: "evidence_chain_intro", delay: 1000 },
  },

  // Evidence Chain Assembly (INTERACTIVE)
  evidence_chain_intro: {
    id: "evidence_chain_intro",
    phase: "stage4",
    messages: [
      { id: "m171", speaker: "kastor", text: "Show him the complete evidence chain!" },
    ],
    interactiveSequence: {
      type: "evidence_presentation",
      id: "chain1",
      data: {
        evidencePieces: [
          { id: "ev1", text: "Ryan logged in from home (23:35)", order: 1 },
          { id: "ev2", text: "Ryan modified Shadow data (23:47)", order: 2 },
          { id: "ev3", text: "Ryan logged into game as Noctis (23:50)", order: 3 },
          { id: "ev4", text: "Noctis's win rate skyrocketed (48%→88%)", order: 4 },
          { id: "ev5", text: "Ryan attempted to delete logs (23:52)", order: 5 },
        ],
        instruction: "Arrange the evidence in chronological order",
      },
    },
    autoAdvance: { nextNode: "final_accusation", delay: 0 },
  },

  final_accusation: {
    id: "final_accusation",
    phase: "stage4",
    messages: [
      { id: "m172", speaker: "narrator", text: "[EVIDENCE CHAIN COMPLETE!]" },
      { id: "m173", speaker: "detective", text: "The evidence proves you illegally modified Shadow to boost your own gameplay." },
      { id: "m174", speaker: "ryan", text: "......" },
      { id: "m175", speaker: "ryan", text: "...I'm sorry." },
      { id: "m176", speaker: "narrator", text: "[CASE BREAKTHROUGH!]" },
    ],
    autoAdvance: { nextNode: "ryan_motive", delay: 1500 },
  },

  // Scene 6 - Motive & Resolution
  ryan_motive: {
    id: "ryan_motive",
    phase: "stage5",
    messages: [
      { id: "m177", speaker: "detective", text: "Why did you do it?" },
      { id: "m178", speaker: "narrator", text: "[INTERACTIVE: Motive Investigation]" },
      { id: "m179", speaker: "narrator", text: "Ryan's Confession:" },
      { id: "m180", speaker: "ryan", text: "I wanted to win in the company tournaments." },
      { id: "m181", speaker: "ryan", text: "I love Shadow but my skill wasn't good enough." },
      { id: "m182", speaker: "ryan", text: "I thought a small buff wouldn't hurt anyone." },
      { id: "m183", speaker: "ryan", text: "I didn't think it would cause this much chaos." },
      {
        id: "m184",
        speaker: "system",
        text: "",
        evidenceNotification: {
          title: "EVIDENCE ADDED: Ryan's Confession",
          icon: "📝"
        }
      },
    ],
    question: {
      id: "q6",
      text: "How do you respond to Ryan?",
      choices: [
        {
          id: "c11",
          text: "You betrayed your company's trust!",
          isCorrect: true,
          nextNode: "ryan_apology",
          feedback: "A harsh but fair assessment.",
          pointsAwarded: 10,
        },
        {
          id: "c12",
          text: "I understand, but it was still wrong",
          isCorrect: true,
          nextNode: "ryan_apology",
          feedback: "A balanced response showing empathy and justice.",
          pointsAwarded: 15,
        },
        {
          id: "c13",
          text: "Everyone makes mistakes",
          isCorrect: true,
          nextNode: "ryan_apology",
          feedback: "Sympathetic, though perhaps too forgiving.",
          pointsAwarded: 10,
        },
      ],
    },
  },

  ryan_apology: {
    id: "ryan_apology",
    phase: "stage5",
    messages: [
      { id: "m185", speaker: "ryan", text: "I really am sorry. There's no excuse for what I did." },
      { id: "m186", speaker: "kastor", text: "Alright, let's compile the final report." },
    ],
    autoAdvance: { nextNode: "case_report_intro", delay: 1000 },
  },

  // Scene 6.5 - Final Case Report Assembly (INTERACTIVE)
  case_report_intro: {
    id: "case_report_intro",
    phase: "stage5",
    messages: [
      { id: "m187", speaker: "kastor", text: "Put together the complete picture of what happened." },
      { id: "m188", speaker: "narrator", text: "[INTERACTIVE SEQUENCE: Case Summary]" },
    ],
    interactiveSequence: {
      type: "case_report_assembly",
      id: "report1",
      data: {
        fields: [
          {
            id: "who",
            label: "WHO:",
            options: ["Ryan Nakamura", "Daniel Schmidt", "Alex Torres", "Maya Chen"],
            correct: "Ryan Nakamura",
          },
          {
            id: "when",
            label: "WHEN:",
            options: ["Day 27, 19:20", "Day 28, 23:47 PM", "Day 28, 22:30", "Day 29, 01:00"],
            correct: "Day 28, 23:47 PM",
          },
          {
            id: "how",
            label: "HOW:",
            options: [
              "Unauthorized data modification",
              "Bug exploitation",
              "Official patch mistake",
              "Hacking attack",
            ],
            correct: "Unauthorized data modification",
          },
          {
            id: "why",
            label: "WHY:",
            options: [
              "Personal competitive advantage",
              "Testing game balance",
              "Sabotaging the company",
              "Accidental mistake",
            ],
            correct: "Personal competitive advantage",
          },
        ],
        evidenceChecklist: [
          "Server logs showing modification",
          "IP address match with Noctis",
          "Timeline of events",
          "Win rate data spike",
          "Ryan's confession",
        ],
      },
    },
    autoAdvance: { nextNode: "case_report_complete", delay: 0 },
  },

  case_report_complete: {
    id: "case_report_complete",
    phase: "stage5",
    messages: [
      { id: "m189", speaker: "narrator", text: "[CASE REPORT COMPLETE!]" },
    ],
    autoAdvance: { nextNode: "character_reactions", delay: 500 },
  },

  // Scene 7 - Character Reactions
  character_reactions: {
    id: "character_reactions",
    phase: "stage5",
    messages: [
      { id: "m190", speaker: "narrator", text: "[Maya calls]" },
      { id: "m191", speaker: "maya", text: "It really... was Ryan?" },
      { id: "m192", speaker: "detective", text: "Yes. He confessed." },
      { id: "m193", speaker: "maya", text: "...I'm disappointed. But I understand the pressure he felt." },
      { id: "m194", speaker: "maya", text: "Thank you so much for your help!" },
      { id: "m195", speaker: "system", text: "[CLIENT SATISFACTION: ★★★★★]" },
      { id: "m196", speaker: "narrator", text: "[Daniel calls]" },
      { id: "m197", speaker: "daniel", text: "Ryan... really did it?" },
      { id: "m198", speaker: "detective", text: "Yes. The evidence was clear." },
      { id: "m199", speaker: "daniel", text: "I trusted him... but thank you for finding the truth." },
      { id: "m200", speaker: "narrator", text: "[Alex messages]" },
      { id: "m201", speaker: "alex", text: "You caught the culprit? Thank goodness! Thanks!" },
    ],
    autoAdvance: { nextNode: "case_evaluation", delay: 1500 },
  },

  // Scene 8 - Case Evaluation with S RANK
  case_evaluation: {
    id: "case_evaluation",
    phase: "stage5",
    messages: [
      { id: "m202", speaker: "narrator", text: "[CASE EVALUATION SCREEN]" },
      { id: "m203", speaker: "system", text: "Evidence Collected: 12/12 ✓" },
      { id: "m204", speaker: "system", text: "Logic Connections Made: 5/5 ✓" },
      { id: "m205", speaker: "system", text: "Contradictions Found: 3/3 ✓" },
      { id: "m206", speaker: "system", text: "Interview Accuracy: 100% ✓" },
      { id: "m207", speaker: "system", text: "Time Taken: Optimal" },
      { id: "m208", speaker: "system", text: "" },
      { id: "m209", speaker: "system", text: "FINAL GRADE: S RANK 🏆" },
    ],
    autoAdvance: { nextNode: "case_closed", delay: 2000 },
  },

  case_closed: {
    id: "case_closed",
    phase: "stage5",
    messages: [
      { id: "m210", speaker: "kastor", text: "First case solved perfectly! 100 points!" },
      { id: "m211", speaker: "detective", text: "I feel accomplished!" },
      { id: "m212", speaker: "kastor", text: "That's the detective high! Ready for the next case?" },
      { id: "m213", speaker: "detective", text: "Already?!" },
      { id: "m214", speaker: "kastor", text: "Detectives are busy~ Get used to it!" },
      { id: "m215", speaker: "system", text: "[CASE #001 COMPLETE]" },
      { id: "m216", speaker: "system", text: "[NEXT CASE UNLOCKED]" },
    ],
  },
};
