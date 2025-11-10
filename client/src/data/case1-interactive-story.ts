export interface InteractiveSequence {
  type: "graph_analysis" | "logic_connection" | "timeline_reconstruction" | "testimony_press" | "evidence_presentation" | "document_examination";
  id: string;
  data: any;
}

export interface Message {
  id: string;
  speaker: "detective" | "kastor" | "maya" | "ryan" | "daniel" | "alex" | "system" | "narrator";
  text: string;
  avatar?: string;
}

export interface StoryNode {
  id: string;
  phase: "stage1" | "stage2" | "stage3" | "stage4" | "stage5";
  messages: Message[];
  interactiveSequence?: InteractiveSequence;
  question?: {
    id: string;
    text: string;
    choices: {
      id: string;
      text: string;
      isCorrect: boolean;
      nextNode: string;
      feedback: string;
      evidenceAwarded?: any;
      pointsAwarded?: number;
    }[];
  };
  autoAdvance?: {
    nextNode: string;
    delay: number;
  };
}

export const case1InteractiveStory: Record<string, StoryNode> = {
  start: {
    id: "start",
    phase: "stage1",
    messages: [
      { id: "m1", speaker: "system", text: "Episode 1: The Missing Balance Patch" },
      { id: "m2", speaker: "system", text: "Data Detective Academy - Case #001" },
      { id: "m3", speaker: "narrator", text: "A run-down detective office. Papers scattered everywhere." },
      { id: "m4", speaker: "kastor", text: "Zzz..." },
      { id: "m5", speaker: "narrator", text: "[You open the door and enter]" },
    ],
    autoAdvance: { nextNode: "first_meeting", delay: 1000 },
  },

  first_meeting: {
    id: "first_meeting",
    phase: "stage1",
    messages: [
      { id: "m6", speaker: "detective", text: "Is this the right place?" },
      { id: "m7", speaker: "kastor", text: "Huh? [waking up] Oh, the newbie?" },
      { id: "m8", speaker: "detective", text: "I'm the new detective." },
      { id: "m9", speaker: "kastor", text: "You don't look like a detective." },
      { id: "m10", speaker: "detective", text: "It's my first day!" },
      { id: "m11", speaker: "kastor", text: "Yeah, I can tell. What's your name?" },
      { id: "m12", speaker: "kastor", text: "Okay. I'm Kastor." },
      { id: "m13", speaker: "kastor", text: "Alright, we've got our first case. Ready to dive in?" },
    ],
    autoAdvance: { nextNode: "email_arrives", delay: 500 },
  },

  email_arrives: {
    id: "email_arrives",
    phase: "stage1",
    messages: [
      { id: "m14", speaker: "kastor", text: "Mail's here!" },
      { id: "m15", speaker: "system", text: "From: Maya Chen" },
      { id: "m16", speaker: "system", text: "Subject: URGENT! Please help!" },
      { id: "m17", speaker: "maya", text: "The Shadow character's win rate jumped from 50% to 85% overnight!" },
      { id: "m18", speaker: "maya", text: "We didn't release any patches... This is a disaster!" },
    ],
    question: {
      id: "q1",
      text: "What's your initial assessment?",
      choices: [
        {
          id: "c1",
          text: "It suddenly became overpowered",
          isCorrect: true,
          nextNode: "call_maya",
          feedback: "Right. Something changed the character's strength.",
          pointsAwarded: 10,
        },
        {
          id: "c2",
          text: "It's probably a bug",
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
      { id: "m19", speaker: "kastor", text: "Should we call the client?" },
      { id: "m20", speaker: "maya", text: "Hello! Is this the detective?" },
      { id: "m21", speaker: "detective", text: "Yes, I received your email." },
      { id: "m22", speaker: "maya", text: "This is a complete disaster! Players are rioting, the community is exploding with complaints..." },
      { id: "m23", speaker: "maya", text: "If we lose player trust... the game could die!" },
      { id: "m24", speaker: "detective", text: "Calm down. Tell me exactly what happened." },
      { id: "m25", speaker: "maya", text: "We have a character called Shadow, and starting on Day 28, it suddenly became way too strong." },
      { id: "m26", speaker: "maya", text: "But we didn't release any official patches!" },
      { id: "m27", speaker: "kastor", text: "Interesting. Can you send us the data?" },
      { id: "m28", speaker: "maya", text: "Yes! I'll send it right now!" },
    ],
    autoAdvance: { nextNode: "graph_analysis_intro", delay: 1000 },
  },

  graph_analysis_intro: {
    id: "graph_analysis_intro",
    phase: "stage2",
    messages: [
      { id: "m29", speaker: "kastor", text: "Alright, data's in! Time for you to analyze it." },
      { id: "m30", speaker: "kastor", text: "Shadow, Phoenix, Viper. What looks suspicious?" },
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
        question: "Which character shows an abnormal pattern?",
        correctAnswer: "Shadow",
      },
    },
    autoAdvance: { nextNode: "graph_analysis_result", delay: 0 },
  },

  graph_analysis_result: {
    id: "graph_analysis_result",
    phase: "stage2",
    messages: [
      { id: "m31", speaker: "detective", text: "The red line starting from Day 28..." },
      { id: "m32", speaker: "kastor", text: "Like a rollercoaster, right?" },
      { id: "m33", speaker: "detective", text: "It shot straight up!" },
      { id: "m34", speaker: "kastor", text: "Exactly! Something's definitely fishy." },
      { id: "m35", speaker: "detective", text: "Phoenix went up a bit too though?" },
      { id: "m36", speaker: "kastor", text: "That's a healthy increase. Shadow's is a rocket launch." },
      { id: "m37", speaker: "detective", text: "Shadow is definitely the most suspicious." },
      { id: "m38", speaker: "kastor", text: "Not bad for a rookie. Took you 10 minutes." },
    ],
    autoAdvance: { nextNode: "document_check", delay: 1000 },
  },

  document_check: {
    id: "document_check",
    phase: "stage2",
    messages: [
      { id: "m39", speaker: "kastor", text: "Let's check the official patch notes." },
    ],
    interactiveSequence: {
      type: "document_examination",
      id: "doc1",
      data: {
        title: "Day 28 Patch Notes",
        sections: [
          { label: "Phoenix", content: "Cooldown -2 seconds", suspicious: false },
          { label: "Viper", content: "Bug fix (hitbox)", suspicious: false },
          { label: "Shadow", content: "No changes listed", suspicious: true },
        ],
      },
    },
    autoAdvance: { nextNode: "logs_check", delay: 0 },
  },

  logs_check: {
    id: "logs_check",
    phase: "stage2",
    messages: [
      { id: "m40", speaker: "detective", text: "It says Shadow wasn't changed." },
      { id: "m41", speaker: "kastor", text: "But the win rate went up. Suspicious. Let's check the server logs!" },
    ],
    interactiveSequence: {
      type: "document_examination",
      id: "logs1",
      data: {
        title: "Server Logs - Day 28",
        sections: [
          { label: "[Day 28 19:20]", content: "admin01 - Shadow data accessed (READ)", suspicious: false },
          { label: "[Day 28 23:47]", content: "admin01 - Shadow data modified (WRITE)", suspicious: true },
          { label: "[Day 28 23:52]", content: "admin01 - Log deletion attempt (FAILED)", suspicious: true },
        ],
      },
    },
    autoAdvance: { nextNode: "found_tampering", delay: 0 },
  },

  found_tampering: {
    id: "found_tampering",
    phase: "stage2",
    messages: [
      { id: "m42", speaker: "detective", text: "Wait, someone modified it!" },
      { id: "m43", speaker: "kastor", text: "And at 11 PM. Plus they tried to delete the logs." },
    ],
    question: {
      id: "q2",
      text: "What does this evidence tell us?",
      choices: [
        {
          id: "c3",
          text: "Someone tampered with Shadow after hours",
          isCorrect: true,
          nextNode: "logic_connection_intro",
          feedback: "Correct! The official patch notes say no changes, but logs show modification.",
          pointsAwarded: 20,
        },
        {
          id: "c4",
          text: "The logs might be wrong",
          isCorrect: false,
          nextNode: "logic_connection_intro",
          feedback: "Server logs are very reliable. Let's investigate further.",
          pointsAwarded: 5,
        },
      ],
    },
  },

  logic_connection_intro: {
    id: "logic_connection_intro",
    phase: "stage3",
    messages: [
      { id: "m44", speaker: "kastor", text: "Time to connect the dots. What do these clues tell us?" },
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
          { from: "t2", to: "t3", deduction: "Secret Modification" },
        ],
      },
    },
    autoAdvance: { nextNode: "call_maya_admin", delay: 0 },
  },

  call_maya_admin: {
    id: "call_maya_admin",
    phase: "stage3",
    messages: [
      { id: "m45", speaker: "detective", text: "Maya, I checked the official documentation." },
      { id: "m46", speaker: "maya", text: "Yes, we didn't touch Shadow." },
      { id: "m47", speaker: "detective", text: "But the server logs show modification records by admin01." },
      { id: "m48", speaker: "maya", text: "...What? Then someone secretly...?" },
      { id: "m49", speaker: "maya", text: "admin01... Hold on, let me check." },
      { id: "m50", speaker: "maya", text: "admin01 is Ryan Nakamura. He's our balance designer..." },
      { id: "m51", speaker: "detective", text: "Did he work late that night?" },
      { id: "m52", speaker: "maya", text: "No! Day 28 was a no-overtime day!" },
      { id: "m53", speaker: "maya", text: "From home... did he log in secretly?" },
      { id: "m54", speaker: "kastor", text: "Highly likely. We need to dig deeper." },
    ],
    autoAdvance: { nextNode: "timeline_intro", delay: 1000 },
  },

  timeline_intro: {
    id: "timeline_intro",
    phase: "stage3",
    messages: [
      { id: "m55", speaker: "kastor", text: "Let's filter admin01's activity logs!" },
      { id: "m56", speaker: "kastor", text: "Arrange these events in chronological order." },
    ],
    interactiveSequence: {
      type: "timeline_reconstruction",
      id: "timeline1",
      data: {
        events: [
          { id: "e1", time: "19:15", text: "Office login", order: 1 },
          { id: "e2", time: "19:20", text: "Shadow data accessed", order: 2 },
          { id: "e3", time: "19:45", text: "Office logout", order: 3 },
          { id: "e4", time: "23:35", text: "Home login", order: 4, suspicious: true },
          { id: "e5", time: "23:47", text: "Shadow data modified", order: 5, suspicious: true },
          { id: "e6", time: "23:52", text: "Log deletion attempt", order: 6, suspicious: true },
        ],
      },
    },
    autoAdvance: { nextNode: "timeline_result", delay: 0 },
  },

  timeline_result: {
    id: "timeline_result",
    phase: "stage3",
    messages: [
      { id: "m57", speaker: "detective", text: "He logged back in from home after leaving work!" },
      { id: "m58", speaker: "kastor", text: "This was planned. But wait..." },
      { id: "m59", speaker: "kastor", text: "There's also admin02. Logged in at 10:30 PM." },
      { id: "m60", speaker: "detective", text: "That person seems suspicious too." },
      { id: "m61", speaker: "kastor", text: "Let's interview Daniel to confirm." },
    ],
    autoAdvance: { nextNode: "daniel_interview", delay: 1000 },
  },

  daniel_interview: {
    id: "daniel_interview",
    phase: "stage3",
    messages: [
      { id: "m62", speaker: "daniel", text: "Hello? You were looking for me?" },
      { id: "m63", speaker: "detective", text: "Daniel Schmidt? I have a few questions." },
      { id: "m64", speaker: "daniel", text: "Sure, of course!" },
      { id: "m65", speaker: "detective", text: "You logged in on Day 28 at 10:30 PM, correct?" },
      { id: "m66", speaker: "daniel", text: "Oh, yes! There was an emergency server check." },
      { id: "m67", speaker: "detective", text: "What did you do?" },
      { id: "m68", speaker: "daniel", text: "Just checked the server status. About 10 minutes?" },
      { id: "m69", speaker: "detective", text: "Do you know what Ryan was doing that night?" },
      { id: "m70", speaker: "daniel", text: "Ryan? He probably went home." },
      { id: "m71", speaker: "daniel", text: "We left together. Around 7 PM?" },
      { id: "m72", speaker: "kastor", text: "But Ryan logged back in at 11:35 PM." },
      { id: "m73", speaker: "daniel", text: "...What? From home?" },
      { id: "m74", speaker: "daniel", text: "That can't be right... Ryan's a good kid!" },
      { id: "m75", speaker: "detective", text: "Are you sure?" },
      { id: "m76", speaker: "daniel", text: "Yes! I've been his mentor for a year. He's hardworking and kind!" },
      { id: "m77", speaker: "kastor", text: "Understood. Thanks for your help." },
    ],
    autoAdvance: { nextNode: "ip_tracking", delay: 1000 },
  },

  ip_tracking: {
    id: "ip_tracking",
    phase: "stage4",
    messages: [
      { id: "m78", speaker: "kastor", text: "admin01's IP trace is back!" },
      { id: "m79", speaker: "detective", text: "192.168.45.178?" },
      { id: "m80", speaker: "kastor", text: "This IP also played the game. Let's search it." },
      { id: "m81", speaker: "system", text: "IGN: Noctis" },
      { id: "m82", speaker: "system", text: "IP: 192.168.45.178" },
      { id: "m83", speaker: "system", text: "Main Character: Shadow (95% pick rate)" },
      { id: "m84", speaker: "system", text: "Day 28 Session: 23:50~01:30" },
      { id: "m85", speaker: "system", text: "Win Rate: 48% → 88%" },
      { id: "m86", speaker: "detective", text: "Started playing 3 minutes after the modification!" },
    ],
    autoAdvance: { nextNode: "alex_interview", delay: 1000 },
  },

  alex_interview: {
    id: "alex_interview",
    phase: "stage4",
    messages: [
      { id: "m87", speaker: "alex", text: "Hello? What's this about?" },
      { id: "m88", speaker: "detective", text: "Alex Torres? I have some questions about the game." },
      { id: "m89", speaker: "alex", text: "Sure! I'm a Shadow main!" },
      { id: "m90", speaker: "detective", text: "You played on Day 28?" },
      { id: "m91", speaker: "alex", text: "Yeah! From 7 PM to 9 PM!" },
      { id: "m92", speaker: "alex", text: "Shadow got so strong that day, it was awesome!" },
      { id: "m93", speaker: "detective", text: "Did you play after 11 PM that night?" },
      { id: "m94", speaker: "alex", text: "No! I stopped at 9 and did homework!" },
      { id: "m95", speaker: "alex", text: "Wait, am I a suspect?!" },
      { id: "m96", speaker: "kastor", text: "Relax. Just confirming." },
      { id: "m97", speaker: "alex", text: "It wasn't me! Really! I just played the game!" },
      { id: "m98", speaker: "kastor", text: "Alex has an alibi. Logged out at 9." },
    ],
    autoAdvance: { nextNode: "ryan_confrontation_intro", delay: 1000 },
  },

  ryan_confrontation_intro: {
    id: "ryan_confrontation_intro",
    phase: "stage4",
    messages: [
      { id: "m99", speaker: "kastor", text: "Now for Ryan... Time to present our evidence." },
      { id: "m100", speaker: "ryan", text: "Yes... what's going on?" },
    ],
    autoAdvance: { nextNode: "ryan_testimony", delay: 500 },
  },

  ryan_testimony: {
    id: "ryan_testimony",
    phase: "stage4",
    messages: [
      { id: "m101", speaker: "ryan", text: "I sometimes log in from home to check things." },
      { id: "m102", speaker: "ryan", text: "Day 28 was a normal work day for me." },
      { id: "m103", speaker: "ryan", text: "I left the office around 7 PM with Daniel." },
      { id: "m104", speaker: "ryan", text: "I didn't do anything unusual that night." },
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
            contradictionEvidence: "home_login_log",
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
        ],
      },
    },
    autoAdvance: { nextNode: "evidence_chain", delay: 0 },
  },

  evidence_chain: {
    id: "evidence_chain",
    phase: "stage4",
    messages: [
      { id: "m105", speaker: "kastor", text: "Show him the complete evidence chain!" },
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
      },
    },
    autoAdvance: { nextNode: "ryan_confession", delay: 0 },
  },

  ryan_confession: {
    id: "ryan_confession",
    phase: "stage5",
    messages: [
      { id: "m106", speaker: "detective", text: "The evidence proves you illegally modified Shadow to boost your own gameplay." },
      { id: "m107", speaker: "ryan", text: "......" },
      { id: "m108", speaker: "ryan", text: "...I'm sorry." },
      { id: "m109", speaker: "detective", text: "Why did you do it?" },
      { id: "m110", speaker: "ryan", text: "I... I wanted to win." },
      { id: "m111", speaker: "ryan", text: "I kept losing in the company tournaments." },
      { id: "m112", speaker: "ryan", text: "I really love Shadow... but my skill wasn't there..." },
      { id: "m113", speaker: "ryan", text: "So I thought, if I just make it a little... a little stronger..." },
      { id: "m114", speaker: "ryan", text: "I'm truly sorry. There's no excuse." },
    ],
    autoAdvance: { nextNode: "case_summary", delay: 1500 },
  },

  case_summary: {
    id: "case_summary",
    phase: "stage5",
    messages: [
      { id: "m115", speaker: "kastor", text: "Alright, let's wrap this up." },
      { id: "m116", speaker: "detective", text: "Ryan Nakamura, on Day 28 at 11:47 PM..." },
      { id: "m117", speaker: "detective", text: "Used his developer privileges to illegally buff Shadow." },
      { id: "m118", speaker: "detective", text: "Then logged into the game as his IGN Noctis..." },
      { id: "m119", speaker: "detective", text: "And boosted his win rate from 48% to 88%." },
      { id: "m120", speaker: "kastor", text: "Motive?" },
      { id: "m121", speaker: "detective", text: "Competitive drive. He wanted to win." },
      { id: "m122", speaker: "kastor", text: "Perfect deduction!" },
    ],
    autoAdvance: { nextNode: "reactions", delay: 1000 },
  },

  reactions: {
    id: "reactions",
    phase: "stage5",
    messages: [
      { id: "m123", speaker: "maya", text: "It really... was Ryan?" },
      { id: "m124", speaker: "detective", text: "Yes. He confessed." },
      { id: "m125", speaker: "maya", text: "...I'm disappointed. But I understand." },
      { id: "m126", speaker: "maya", text: "Thank you so much for your help!" },
      { id: "m127", speaker: "daniel", text: "Ryan... really did it?" },
      { id: "m128", speaker: "detective", text: "Yes. The evidence was clear." },
      { id: "m129", speaker: "daniel", text: "I trusted him... but thank you for finding the truth." },
      { id: "m130", speaker: "alex", text: "You caught the culprit? Thank goodness! Thanks!" },
    ],
    autoAdvance: { nextNode: "case_closed", delay: 1500 },
  },

  case_closed: {
    id: "case_closed",
    phase: "stage5",
    messages: [
      { id: "m131", speaker: "kastor", text: "First case solved perfectly!" },
      { id: "m132", speaker: "detective", text: "I feel accomplished!" },
      { id: "m133", speaker: "kastor", text: "That's the detective high! Ready for the next case?" },
      { id: "m134", speaker: "detective", text: "Already?!" },
      { id: "m135", speaker: "kastor", text: "Detectives are busy~ Get used to it!" },
      { id: "m136", speaker: "system", text: "CASE #001 COMPLETE" },
    ],
  },
};
