import {
  Message,
  StoryNode,
  InteractiveSequence,
  DataVisualization
} from "./episode-types";

/**
 * Episode 2: The Ghost User's Ranking Manipulation
 *
 * ACT 1: Investigation Setup (Stage 1-2)
 * ACT 2: Deep Dive & Misdirection (Stage 3-4)
 * ACT 3: Confrontation & Resolution (Stage 5-7)
 */

export const case2Episode1: Record<string, StoryNode> = {
  // ============================================
  // OPENING & SETUP
  // ============================================

  start: {
    id: "start",
    phase: "stage1",
    messages: [
      {
        id: "m1",
        speaker: "narrator",
        text: "[Setting: Kastor Data Detective Agency. Morning sunlight streams through dusty windows.]",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
      },
      { id: "m2", speaker: "kastor", text: "Morning! Ready for Case #002?" },
      { id: "m3", speaker: "detective", text: "Already? I just finished Case #001!" },
      { id: "m4", speaker: "kastor", text: "Detectives don't get vacation days~ Client's waiting!" },
      { id: "m5", speaker: "detective", text: "(This job is exhausting...)" },
      {
        id: "m6",
        speaker: "narrator",
        text: "[A nervous woman enters the office]"
      },
      { id: "m7", speaker: "maya", text: "Hello! Are you the data detectives?", characterName: "Maya Chen" },
      { id: "m8", speaker: "kastor", text: "That's us! What's the problem?" },
      { id: "m9", speaker: "maya", text: "I'm Maya Chen, Lead Analyst at Zenith Games.", characterName: "Maya Chen" },
      { id: "m10", speaker: "maya", text: "Our game ranking system was... corrupted.", characterName: "Maya Chen" },
    ],
    autoAdvance: { nextNode: "maya_explains", delay: 800 },
  },

  maya_explains: {
    id: "maya_explains",
    phase: "stage1",
    messages: [
      { id: "m11", speaker: "detective", text: "Corrupted how?" },
      { id: "m12", speaker: "maya", text: "Yesterday morning, dozens of ghost accounts appeared in Top 100.", characterName: "Maya Chen" },
      { id: "m13", speaker: "maya", text: "All created within 5 minutes. All have 98% win rates.", characterName: "Maya Chen" },
      { id: "m14", speaker: "maya", text: "They're pushing legitimate players down!", characterName: "Maya Chen" },
      { id: "m15", speaker: "kastor", text: "98% win rate? In 5 minutes?", reaction: "🤔" },
      { id: "m16", speaker: "kastor", text: "Smells like bots!" },
      { id: "m17", speaker: "detective", text: "Can I see the ranking data?" },
      { id: "m18", speaker: "maya", text: "Yes! Here's the current Top 10.", characterName: "Maya Chen" },
    ],
    autoAdvance: { nextNode: "show_rankings", delay: 500 },
  },

  show_rankings: {
    id: "show_rankings",
    phase: "stage1",
    messages: [
      { id: "m19", speaker: "system", text: "📊 RANKING DATA" },
    ],
    dataVisualizations: [{
      type: "table",
      title: "Game Rankings - Top 10",
      data: {
        headers: ["Rank", "Username", "Win Rate", "Account Age", "Play Time", "Friends"],
        rows: [
          ["1", "User_7743", "98%", "7 days", "12 hours", "0"],
          ["2", "DragonKing", "67%", "456 days", "2341 hours", "234"],
          ["3", "Player_9521", "97%", "6 days", "11 hours", "0"],
          ["4", "ShadowBlade", "72%", "289 days", "1823 hours", "167"],
          ["5", "Ghost_4422", "98%", "7 days", "13 hours", "0"],
          ["6", "ProGamer99", "69%", "512 days", "2901 hours", "445"],
          ["7", "Bot_Hunter", "96%", "7 days", "10 hours", "0"],
          ["8", "ElitePlayer", "74%", "198 days", "1456 hours", "312"],
          ["9", "User_3309", "98%", "6 days", "12 hours", "0"],
          ["10", "LegendKiller", "71%", "334 days", "2134 hours", "289"],
        ],
      },
    }],
    autoAdvance: { nextNode: "kastor_analysis", delay: 2000 },
  },

  kastor_analysis: {
    id: "kastor_analysis",
    phase: "stage1",
    messages: [
      { id: "m20", speaker: "kastor", text: "See the pattern?", reaction: "👀" },
      { id: "m21", speaker: "detective", text: "Some accounts have very short ages..." },
      { id: "m22", speaker: "kastor", text: "And zero friends! Real players make friends!" },
      { id: "m23", speaker: "kastor", text: "Let's identify the ghost accounts!" },
    ],
    autoAdvance: { nextNode: "interactive_ghost_selection", delay: 500 },
  },

  // ============================================
  // INTERACTIVE #1: Ghost Account Selection
  // ============================================

  interactive_ghost_selection: {
    id: "interactive_ghost_selection",
    phase: "stage1",
    messages: [
      { id: "m24", speaker: "system", text: "🎯 INTERACTIVE CHALLENGE" },
      { id: "m25", speaker: "kastor", text: "Select 3 accounts that look suspicious!" },
      { id: "m26", speaker: "kastor", text: "Hint: Check account age and friend count!" },
    ],
    interactiveSequence: {
      type: "ghost_account_selection",
      id: "ghost_selection_1",
      data: {
        accounts: [
          { id: "acc1", username: "User_7743", rank: 1, accountAge: 7, playTime: 12, winRate: 98, friendCount: 0, isGhost: true },
          { id: "acc2", username: "DragonKing", rank: 2, accountAge: 456, playTime: 2341, winRate: 67, friendCount: 234, isGhost: false },
          { id: "acc3", username: "Player_9521", rank: 3, accountAge: 6, playTime: 11, winRate: 97, friendCount: 0, isGhost: true },
          { id: "acc4", username: "ShadowBlade", rank: 4, accountAge: 289, playTime: 1823, winRate: 72, friendCount: 167, isGhost: false },
          { id: "acc5", username: "Ghost_4422", rank: 5, accountAge: 7, playTime: 13, winRate: 98, friendCount: 0, isGhost: true },
          { id: "acc6", username: "ProGamer99", rank: 6, accountAge: 512, playTime: 2901, winRate: 69, friendCount: 445, isGhost: false },
          { id: "acc7", username: "Bot_Hunter", rank: 7, accountAge: 7, playTime: 10, winRate: 96, friendCount: 0, isGhost: true },
          { id: "acc8", username: "ElitePlayer", rank: 8, accountAge: 198, playTime: 1456, winRate: 74, friendCount: 312, isGhost: false },
          { id: "acc9", username: "User_3309", rank: 9, accountAge: 6, playTime: 12, winRate: 98, friendCount: 0, isGhost: true },
          { id: "acc10", username: "LegendKiller", rank: 10, accountAge: 334, playTime: 2134, winRate: 71, friendCount: 289, isGhost: false },
        ],
        maxSelections: 3,
        targetCount: 3, // Need to find at least 3 ghost accounts
      }
    },
    autoAdvance: { nextNode: "ghost_selection_result", delay: 0 },
  },

  ghost_selection_result: {
    id: "ghost_selection_result",
    phase: "stage1",
    messages: [
      { id: "m27", speaker: "kastor", text: "Good eye!", reaction: "👍" },
      { id: "m28", speaker: "kastor", text: "New accounts + high win rate + zero friends = BOTS!" },
      { id: "m29", speaker: "detective", text: "But who's controlling them?" },
      { id: "m30", speaker: "maya", text: "That's what we need to find out...", characterName: "Maya Chen" },
      { id: "m31", speaker: "kastor", text: "Let's check their login patterns!" },
    ],
    autoAdvance: { nextNode: "show_login_patterns", delay: 800 },
  },

  // ============================================
  // LOGIN PATTERN ANALYSIS
  // ============================================

  show_login_patterns: {
    id: "show_login_patterns",
    phase: "stage1",
    messages: [
      { id: "m32", speaker: "maya", text: "Here are the login times for all accounts.", characterName: "Maya Chen" },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Login Patterns - Last 24 Hours",
      data: {
        entries: [
          { account: "User_7743", time: "03:00:00", session: "120 min", location: "KR → JP → DE" },
          { account: "DragonKing", time: "18:34:12", session: "87 min", location: "USA" },
          { account: "Player_9521", time: "03:00:17", session: "120 min", location: "JP → KR → US" },
          { account: "Ghost_4422", time: "03:00:05", session: "120 min", location: "DE → KR → CN" },
          { account: "ProGamer99", time: "21:15:34", session: "143 min", location: "USA" },
          { account: "Bot_Hunter", time: "03:00:02", session: "120 min", location: "CN → JP → KR" },
        ],
      },
    }],
    autoAdvance: { nextNode: "pattern_discussion", delay: 2000 },
  },

  pattern_discussion: {
    id: "pattern_discussion",
    phase: "stage1",
    messages: [
      { id: "m33", speaker: "kastor", text: "Notice anything weird?", reaction: "🤔" },
      { id: "m34", speaker: "detective", text: "All the suspicious accounts logged in at exactly 03:00..." },
      { id: "m35", speaker: "kastor", text: "Exactly! Down to the second!" },
      { id: "m36", speaker: "kastor", text: "And look at locations - jumping between countries!" },
      { id: "m37", speaker: "detective", text: "No human plays like that!" },
      { id: "m38", speaker: "kastor", text: "Time for a pattern matching game!", reaction: "🎮" },
    ],
    autoAdvance: { nextNode: "interactive_pattern_matching", delay: 500 },
  },

  // ============================================
  // INTERACTIVE #2: Pattern Matching
  // ============================================

  interactive_pattern_matching: {
    id: "interactive_pattern_matching",
    phase: "stage1",
    messages: [
      { id: "m39", speaker: "system", text: "🎯 INTERACTIVE CHALLENGE" },
      { id: "m40", speaker: "kastor", text: "Sort these patterns: Normal vs Bot!" },
      { id: "m41", speaker: "kastor", text: "Hint: Bots have perfect timing and location hopping!" },
    ],
    interactiveSequence: {
      type: "pattern_matching",
      id: "pattern_match_1",
      data: {
        patterns: [
          {
            id: "p1",
            type: "normal",
            loginTime: "18:34",
            sessionLength: 87,
            location: ["USA"],
            consistency: "random",
            description: "Login: 18:34, Session: 87min, Location: USA"
          },
          {
            id: "p2",
            type: "bot",
            loginTime: "03:00",
            sessionLength: 120,
            location: ["KR", "JP", "DE"],
            consistency: "fixed",
            description: "Login: 03:00:00, Session: 120min, Location: KR→JP→DE"
          },
          {
            id: "p3",
            type: "normal",
            loginTime: "21:15",
            sessionLength: 143,
            location: ["USA"],
            consistency: "random",
            description: "Login: 21:15, Session: 143min, Location: USA"
          },
          {
            id: "p4",
            type: "bot",
            loginTime: "03:00",
            sessionLength: 120,
            location: ["JP", "KR", "US"],
            consistency: "fixed",
            description: "Login: 03:00:17, Session: 120min, Location: JP→KR→US"
          },
          {
            id: "p5",
            type: "normal",
            loginTime: "19:42",
            sessionLength: 65,
            location: ["EU"],
            consistency: "random",
            description: "Login: 19:42, Session: 65min, Location: EU"
          },
          {
            id: "p6",
            type: "bot",
            loginTime: "03:00",
            sessionLength: 120,
            location: ["DE", "KR", "CN"],
            consistency: "fixed",
            description: "Login: 03:00:05, Session: 120min, Location: DE→KR→CN"
          },
        ]
      }
    },
    autoAdvance: { nextNode: "pattern_result", delay: 0 },
  },

  pattern_result: {
    id: "pattern_result",
    phase: "stage1",
    messages: [
      { id: "m42", speaker: "kastor", text: "Perfect!", reaction: "⭐" },
      { id: "m43", speaker: "kastor", text: "Bot patterns are obvious once you know what to look for!" },
      { id: "m44", speaker: "detective", text: "Fixed timing, distributed IPs, exact session lengths..." },
      { id: "m45", speaker: "maya", text: "So these ARE bots! But who created them?", characterName: "Maya Chen" },
      { id: "m46", speaker: "kastor", text: "Let's check when these accounts were created!" },
    ],
    autoAdvance: { nextNode: "account_creation_analysis", delay: 800 },
  },

  // ============================================
  // ACT 1 CHECKPOINT
  // ============================================

  account_creation_analysis: {
    id: "account_creation_analysis",
    phase: "stage2",
    messages: [
      {
        id: "m47",
        speaker: "system",
        text: "📊 ACT 1 COMPLETE",
        celebration: {
          type: "mini",
          title: "Ghost Accounts Identified!",
          points: 50
        }
      },
      { id: "m48", speaker: "narrator", text: "[You've identified bot patterns and suspicious accounts]" },
      { id: "m49", speaker: "maya", text: "Here's the account creation log.", characterName: "Maya Chen" },
    ],
    dataVisualizations: [{
      type: "table",
      title: "Account Creation Timeline",
      data: {
        headers: ["Timestamp", "Account", "Email Domain", "IP Address"],
        rows: [
          ["2024-11-04 03:00:00", "User_7743", "tempmail.net", "185.220.101.5"],
          ["2024-11-04 03:00:01", "Player_9521", "10minutemail.com", "185.220.101.5"],
          ["2024-11-04 03:00:02", "Ghost_4422", "tempmail.net", "185.220.101.5"],
          ["2024-11-04 03:00:03", "Bot_Hunter", "guerrillamail.com", "185.220.101.5"],
          ["2024-11-04 03:00:04", "User_3309", "tempmail.net", "185.220.101.5"],
        ],
      },
    }],
    autoAdvance: { nextNode: "creation_pattern_discussion", delay: 2000 },
  },

  creation_pattern_discussion: {
    id: "creation_pattern_discussion",
    phase: "stage2",
    messages: [
      { id: "m50", speaker: "kastor", text: "Look at this!", reaction: "🚨" },
      { id: "m51", speaker: "kastor", text: "All created in 5 seconds!" },
      { id: "m52", speaker: "kastor", text: "Same IP address! Disposable email domains!" },
      { id: "m53", speaker: "detective", text: "This was automated..." },
      { id: "m54", speaker: "maya", text: "Can we filter by email domain?", characterName: "Maya Chen" },
      { id: "m55", speaker: "kastor", text: "Good idea! Let's try!" },
    ],
    autoAdvance: { nextNode: "interactive_email_filter", delay: 500 },
  },

  // ============================================
  // INTERACTIVE #3: Email Domain Filter
  // ============================================

  interactive_email_filter: {
    id: "interactive_email_filter",
    phase: "stage2",
    messages: [
      { id: "m56", speaker: "system", text: "🎯 INTERACTIVE CHALLENGE" },
      { id: "m57", speaker: "kastor", text: "Select suspicious email domains!" },
      { id: "m58", speaker: "kastor", text: "Hint: Check creation window (< 10 min = suspicious)!" },
    ],
    interactiveSequence: {
      type: "email_filter",
      id: "email_filter_1",
      data: {
        domains: [
          { domain: "tempmail.net", count: 47, creationWindow: 5, isSuspicious: true },
          { domain: "gmail.com", count: 234, creationWindow: 14400, isSuspicious: false },
          { domain: "10minutemail.com", count: 12, creationWindow: 8, isSuspicious: true },
          { domain: "yahoo.com", count: 156, creationWindow: 7200, isSuspicious: false },
          { domain: "guerrillamail.com", count: 8, creationWindow: 6, isSuspicious: true },
          { domain: "outlook.com", count: 189, creationWindow: 8640, isSuspicious: false },
        ]
      }
    },
    autoAdvance: { nextNode: "email_filter_result", delay: 0 },
  },

  email_filter_result: {
    id: "email_filter_result",
    phase: "stage2",
    messages: [
      { id: "m59", speaker: "kastor", text: "Excellent filtering!", reaction: "✅" },
      { id: "m60", speaker: "kastor", text: "Disposable email services = bot accounts!" },
      { id: "m61", speaker: "detective", text: "So someone automated account creation..." },
      { id: "m62", speaker: "maya", text: "But why? What's the motive?", characterName: "Maya Chen" },
      { id: "m63", speaker: "kastor", text: "Let's reconstruct the timeline!" },
    ],
    autoAdvance: { nextNode: "interactive_timeline", delay: 500 },
  },

  // ============================================
  // INTERACTIVE #4: Timeline Reconstruction
  // ============================================

  interactive_timeline: {
    id: "interactive_timeline",
    phase: "stage2",
    messages: [
      { id: "m64", speaker: "system", text: "🎯 INTERACTIVE CHALLENGE" },
      { id: "m65", speaker: "kastor", text: "Arrange events in chronological order!" },
    ],
    interactiveSequence: {
      type: "timeline_reconstruction",
      id: "timeline_1",
      data: {
        events: [
          { id: "e1", timestamp: "2024-11-04 03:00:00", description: "47 accounts created", actor: "automated", correctPosition: 1 },
          { id: "e2", timestamp: "2024-11-04 03:00:17", description: "First account login", actor: "User_7743", correctPosition: 2 },
          { id: "e3", timestamp: "2024-11-04 03:05:00", description: "All accounts active", actor: "system", correctPosition: 3 },
          { id: "e4", timestamp: "2024-11-04 03:06:00", description: "Ranking manipulation detected", actor: "system", correctPosition: 4 },
          { id: "e5", timestamp: "2024-11-04 08:00:00", description: "Players report anomalies", actor: "community", correctPosition: 5 },
        ]
      }
    },
    autoAdvance: { nextNode: "timeline_result", delay: 0 },
  },

  timeline_result: {
    id: "timeline_result",
    phase: "stage2",
    messages: [
      { id: "m66", speaker: "kastor", text: "Perfect timeline!", reaction: "📅" },
      { id: "m67", speaker: "detective", text: "So it happened early morning when staff wasn't watching..." },
      { id: "m68", speaker: "maya", text: "We need to check our server code!", characterName: "Maya Chen" },
      { id: "m69", speaker: "maya", text: "Maybe there's a vulnerability?", characterName: "Maya Chen" },
      { id: "m70", speaker: "kastor", text: "Good thinking! Let's examine the ranking algorithm!" },
    ],
    autoAdvance: { nextNode: "act2_start", delay: 800 },
  },

  // ============================================
  // ACT 2: DEEP DIVE & MISDIRECTION
  // ============================================

  act2_start: {
    id: "act2_start",
    phase: "stage3",
    messages: [
      {
        id: "m71",
        speaker: "system",
        text: "📊 ACT 2: DEEP DIVE",
        celebration: {
          type: "mini",
          title: "Evidence Collected!",
          points: 30
        }
      },
      { id: "m72", speaker: "narrator", text: "[Maya brings up the ranking algorithm code]" },
      { id: "m73", speaker: "maya", text: "This is our ranking calculation system.", characterName: "Maya Chen" },
      { id: "m74", speaker: "kastor", text: "Let's read the code carefully!" },
    ],
    autoAdvance: { nextNode: "show_code", delay: 500 },
  },

  show_code: {
    id: "show_code",
    phase: "stage3",
    messages: [
      { id: "m75", speaker: "system", text: "💻 RANKING ALGORITHM CODE" },
    ],
    dataVisualizations: [{
      type: "log",
      title: "ranking_algorithm.py",
      data: {
        entries: [
          { line: 1, code: "def calculateRanking(player):" },
          { line: 2, code: "    baseScore = player.wins * 100" },
          { line: 3, code: "" },
          { line: 4, code: "    if player.playTime > 100:" },
          { line: 5, code: "        timeBonus = 50" },
          { line: 6, code: "" },
          { line: 7, code: "    if player.accountAge < 7:" },
          { line: 8, code: "        newbieBonus = 200" },
          { line: 9, code: "" },
          { line: 10, code: "    if player.flag == 'ghost':" },
          { line: 11, code: "        ghostBonus = 500" },
          { line: 12, code: "" },
          { line: 13, code: "    return baseScore + timeBonus + newbieBonus + ghostBonus" },
        ],
      },
    }],
    autoAdvance: { nextNode: "code_discussion", delay: 2000 },
  },

  code_discussion: {
    id: "code_discussion",
    phase: "stage3",
    messages: [
      { id: "m76", speaker: "kastor", text: "Wait... what's this 'ghost' flag?", reaction: "🚨" },
      { id: "m77", speaker: "maya", text: "I... I don't know. I've never seen that before!", characterName: "Maya Chen" },
      { id: "m78", speaker: "detective", text: "Line 10-11 gives +500 bonus to 'ghost' flagged accounts!" },
      { id: "m79", speaker: "kastor", text: "That's the backdoor!", reaction: "💥" },
      { id: "m80", speaker: "kastor", text: "Let's debug this code!" },
    ],
    autoAdvance: { nextNode: "interactive_code_debug", delay: 500 },
  },

  // ============================================
  // INTERACTIVE #5: Code Debugging
  // ============================================

  interactive_code_debug: {
    id: "interactive_code_debug",
    phase: "stage3",
    messages: [
      { id: "m81", speaker: "system", text: "🎯 INTERACTIVE CHALLENGE" },
      { id: "m82", speaker: "kastor", text: "Find the suspicious code lines! (Select 3)" },
      { id: "m83", speaker: "kastor", text: "Hint: Look for conditional statements!" },
    ],
    interactiveSequence: {
      type: "code_debugging",
      id: "code_debug_1",
      data: {
        codeLines: [
          { line: 1, code: "def calculateRanking(player):", suspicious: false },
          { line: 2, code: "    baseScore = player.wins * 100", suspicious: false },
          { line: 3, code: "", suspicious: false },
          { line: 4, code: "    if player.playTime > 100:", suspicious: false },
          { line: 5, code: "        timeBonus = 50", suspicious: false },
          { line: 6, code: "", suspicious: false },
          { line: 7, code: "    if player.accountAge < 7:", suspicious: true },
          { line: 8, code: "        newbieBonus = 200", suspicious: true },
          { line: 9, code: "", suspicious: false },
          { line: 10, code: "    if player.flag == 'ghost':", suspicious: true },
          { line: 11, code: "        ghostBonus = 500", suspicious: true },
          { line: 12, code: "", suspicious: false },
          { line: 13, code: "    return baseScore + timeBonus + newbieBonus + ghostBonus", suspicious: false },
        ],
        maxSelections: 3,
        targetLines: [7, 10, 11],
      }
    },
    autoAdvance: { nextNode: "code_debug_result", delay: 0 },
  },

  code_debug_result: {
    id: "code_debug_result",
    phase: "stage3",
    messages: [
      { id: "m84", speaker: "kastor", text: "Found the backdoors!", reaction: "✅" },
      { id: "m85", speaker: "kastor", text: "Line 7-8: Bonus for new accounts!" },
      { id: "m86", speaker: "kastor", text: "Line 10-11: Hidden 'ghost' flag bonus!" },
      { id: "m87", speaker: "detective", text: "Who added this code?" },
      { id: "m88", speaker: "maya", text: "Let me check the git history...", characterName: "Maya Chen" },
    ],
    autoAdvance: { nextNode: "show_git_commits", delay: 800 },
  },

  // [CONTINUE WITH MORE NODES...]
  // This is just ACT 1-2. Would you like me to continue with ACT 3 and the remaining interactive sequences?

  // Placeholder for remaining story
  show_git_commits: {
    id: "show_git_commits",
    phase: "stage4",
    messages: [
      { id: "m89", speaker: "maya", text: "To be continued...", characterName: "Maya Chen" },
      { id: "m90", speaker: "system", text: "🚧 Episode 2 is still being developed!" },
      { id: "m91", speaker: "kastor", text: "More content coming soon!" },
    ],
  },
};
