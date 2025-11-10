import {
  Message,
  StoryNode,
} from "./case1-episode-final";

/**
 * Episode 2: The Ghost User's Ranking Manipulation
 * Full implementation based on complete script
 *
 * Characters:
 * - Marcus Chen (CTO)
 * - Elena Kovač (Security Lead, culprit)
 * - Nina Reyes (Junior Analyst, witness)
 * - Camille Beaumont (Former employee, victim)
 */

export const case2EpisodeFull: Record<string, StoryNode> = {
  // ============================================
  // STAGE 0: OPENING
  // ============================================

  start: {
    id: "start",
    phase: "stage1",
    messages: [
      {
        id: "m1",
        speaker: "narrator",
        text: "[Setting: Detective Office. One week after Episode 1.]",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
      },
      { id: "m2", speaker: "kastor", text: "Ahh... peaceful~", reaction: "😌" },
      { id: "m3", speaker: "detective", text: "It's been a week since Episode 1 ended, right?" },
      { id: "m4", speaker: "kastor", text: "Yep! Now that we've rested, time for the next case!" },
      { id: "m5", speaker: "detective", text: "Already?!" },
      { id: "m6", speaker: "kastor", text: "Of course! We're famous now!" },
      { id: "m7", speaker: "detective", text: "Famous?" },
      { id: "m8", speaker: "kastor", text: "Yeah! Word got out about the Ryan case! Requests will pour in now!" },
      {
        id: "m9",
        speaker: "narrator",
        text: "[Email notification - DING!]",
        soundEffect: "notification"
      },
      { id: "m10", speaker: "kastor", text: "See? Right on cue!", reaction: "👀" },
      { id: "m11", speaker: "detective", text: "Wow..." },
      { id: "m12", speaker: "kastor", text: "Should we open it?" },
    ],
    autoAdvance: { nextNode: "email_arrives", delay: 500 },
  },

  email_arrives: {
    id: "email_arrives",
    phase: "stage1",
    messages: [
      {
        id: "m13",
        speaker: "system",
        text: "📧 NEW EMAIL",
        email: {
          from: "Marcus Chen (CTO, Legend Arena) <marcus.chen@legendarena.com>",
          subject: "URGENT! Ranking System Manipulation!",
          body: `Hello detectives!

I'm Marcus, CTO of Legend Arena.

Thank you for solving the Shadow incident last time.
We were able to handle it quickly thanks to you.

But... we have another problem. 😰

This time it's even more serious!

🚨 Top rankers' scores are suddenly dropping!
🚨 Unknown new users are rapidly climbing the ranks!
🚨 But these users... have almost no play history!

The community is in chaos.
They're calling them "ghost accounts."

If we don't solve this quickly... the game could collapse!

Please help us!

- Marcus`
        }
      },
    ],
    autoAdvance: { nextNode: "discuss_email", delay: 1000 },
  },

  discuss_email: {
    id: "discuss_email",
    phase: "stage1",
    messages: [
      { id: "m14", speaker: "detective", text: "Legend Arena... that's the company from last time!" },
      { id: "m15", speaker: "kastor", text: "Huh? Again? Already?", reaction: "🤔" },
      { id: "m16", speaker: "detective", text: "It says top ranker scores are dropping..." },
      { id: "m17", speaker: "kastor", text: "And ghost accounts!" },
      { id: "m18", speaker: "detective", text: "Ghosts?" },
      { id: "m19", speaker: "kastor", text: "Yeah! Accounts that don't really exist, like ghosts!" },
      { id: "m20", speaker: "detective", text: "...How is that possible?" },
      { id: "m21", speaker: "kastor", text: "That's what we need to find out!" },
      { id: "m22", speaker: "kastor", text: "Oh! Ghostbusters!", reaction: "👻" },
      { id: "m23", speaker: "detective", text: "...Here we go again." },
      { id: "m24", speaker: "kastor", text: "Who you gonna call?" },
      { id: "m25", speaker: "detective", text: "Can we just work?" },
      { id: "m26", speaker: "kastor", text: "Okay okay~ Let's call him!" },
    ],
    autoAdvance: { nextNode: "call_marcus_intro", delay: 500 },
  },

  call_marcus_intro: {
    id: "call_marcus_intro",
    phase: "stage1",
    messages: [
      {
        id: "m27",
        speaker: "narrator",
        text: "[Phone connecting...]"
      },
      { id: "m28", speaker: "marcus", text: "Hello! Are you the detectives?!", characterName: "Marcus Chen" },
      { id: "m29", speaker: "detective", text: "Yes, we got your email." },
      { id: "m30", speaker: "marcus", text: "Thank goodness! The situation is critical!", characterName: "Marcus Chen" },
      { id: "m31", speaker: "marcus", text: "Seven out of our top 10 rankers have been pushed down!", characterName: "Marcus Chen" },
      { id: "m32", speaker: "marcus", text: "And in their place... completely unknown new users!", characterName: "Marcus Chen" },
      { id: "m33", speaker: "kastor", text: "Do they have play history?" },
      { id: "m34", speaker: "marcus", text: "Barely any! These accounts were created less than a week ago...", characterName: "Marcus Chen" },
      { id: "m35", speaker: "marcus", text: "But suddenly they're at the top!", characterName: "Marcus Chen" },
      { id: "m36", speaker: "detective", text: "Is that even possible normally?" },
      { id: "m37", speaker: "marcus", text: "Absolutely not! In our ranking system...", characterName: "Marcus Chen" },
      { id: "m38", speaker: "marcus", text: "You need to play for months to reach the top!", characterName: "Marcus Chen" },
      { id: "m39", speaker: "kastor", text: "Interesting. Send us the data." },
      { id: "m40", speaker: "marcus", text: "I'll send it right away!", characterName: "Marcus Chen" },
      { id: "m41", speaker: "marcus", text: "And... please hurry!", characterName: "Marcus Chen" },
      { id: "m42", speaker: "marcus", text: "If this hits the press... the company is finished!", characterName: "Marcus Chen" },
      {
        id: "m43",
        speaker: "narrator",
        text: "[Call ends]"
      },
      { id: "m44", speaker: "detective", text: "He's really putting pressure on us?" },
      { id: "m45", speaker: "kastor", text: "He's the CTO. He's responsible." },
      { id: "m46", speaker: "detective", text: "This seems more complicated than last time..." },
      { id: "m47", speaker: "kastor", text: "Then it's more fun!", reaction: "🎮" },
      { id: "m48", speaker: "detective", text: "Fun is..." },
      { id: "m49", speaker: "kastor", text: "Just kidding~ But it really is interesting!" },
      { id: "m50", speaker: "kastor", text: "Ghost accounts... who made them, and why?" },
    ],
    autoAdvance: { nextNode: "ranking_changes", delay: 800 },
  },

  // ============================================
  // STAGE 1: INCIDENT - Ranking Changes
  // ============================================

  ranking_changes: {
    id: "ranking_changes",
    phase: "stage1",
    messages: [
      {
        id: "m51",
        speaker: "system",
        text: "📊 STAGE 1: INCIDENT",
        celebration: {
          type: "mini",
          title: "New case! Ghostbusters!",
          points: 10
        }
      },
      {
        id: "m52",
        speaker: "narrator",
        text: "[Data arrives from Marcus]"
      },
      { id: "m53", speaker: "kastor", text: "Alright! Ranking data is here!" },
    ],
    dataVisualizations: [{
      type: "table",
      title: "Ranking Changes (1 Week Comparison)",
      data: {
        headers: ["Rank", "Before (1 week ago)", "Now", "Change"],
        rows: [
          ["1", "DragonKing (2847 pts)", "User_7743 (2901 pts) 🚨", "NEW"],
          ["2", "PhoenixRise (2756 pts)", "DragonKing (2798 pts)", "↓ -1"],
          ["3", "ShadowMaster (2698 pts)", "Player_9521 (2789 pts) 🚨", "NEW"],
          ["4", "WinterKnight (2645 pts)", "PhoenixRise (2734 pts)", "↓ -2"],
          ["5", "EliteGamer (2598 pts)", "User_3318 (2701 pts) 🚨", "NEW"],
          ["6", "ProPlayer88 (2567 pts)", "ShadowMaster (2654 pts)", "↓ -3"],
          ["7", "MasterRank (2534 pts)", "Ghost_4422 (2689 pts) 🚨", "NEW"],
          ["8", "TopGunner (2489 pts)", "Bot_Hunter (2670 pts) 🚨", "NEW"],
          ["9", "AcePlayer (2445 pts)", "User_3309 (2658 pts) 🚨", "NEW"],
          ["10", "IceQueen (2401 pts)", "Account_5529 (2645 pts) 🚨", "NEW"],
        ],
      },
    }],
    autoAdvance: { nextNode: "discuss_rankings", delay: 2000 },
  },

  discuss_rankings: {
    id: "discuss_rankings",
    phase: "stage1",
    messages: [
      { id: "m54", speaker: "detective", text: "User_7743, Player_9521, User_3318..." },
      { id: "m55", speaker: "kastor", text: "All the names are mechanical." },
      { id: "m56", speaker: "detective", text: "User_number, Player_number..." },
      { id: "m57", speaker: "kastor", text: "Not names a person would create." },
      { id: "m58", speaker: "detective", text: "And the scores are higher than the original #1!" },
      { id: "m59", speaker: "kastor", text: "2901 points! Isn't that crazy?", reaction: "😱" },
      { id: "m60", speaker: "detective", text: "Can you jump this much in a week?" },
      { id: "m61", speaker: "kastor", text: "If I use the chicken analogy..." },
      { id: "m62", speaker: "detective", text: "Don't!" },
      { id: "m63", speaker: "kastor", text: "Aw~ It's fun though!" },
      { id: "m64", speaker: "detective", text: "Let's check the profiles first!" },
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
      { id: "m65", speaker: "system", text: "🎯 INTERACTIVE CHALLENGE" },
      { id: "m66", speaker: "kastor", text: "Let's identify the ghost accounts!" },
      { id: "m67", speaker: "kastor", text: "Select accounts that look suspicious!" },
    ],
    interactiveSequence: {
      type: "ghost_account_selection",
      id: "ghost_selection_1",
      data: {
        accounts: [
          { id: "acc1", username: "User_7743", rank: 1, accountAge: 7, playTime: 12, winRate: 98, friendCount: 0, isGhost: true },
          { id: "acc2", username: "DragonKing", rank: 2, accountAge: 456, playTime: 2341, winRate: 67, friendCount: 234, isGhost: false },
          { id: "acc3", username: "Player_9521", rank: 3, accountAge: 6, playTime: 11, winRate: 97, friendCount: 0, isGhost: true },
          { id: "acc4", username: "PhoenixRise", rank: 4, accountAge: 389, playTime: 2123, winRate: 72, friendCount: 189, isGhost: false },
          { id: "acc5", username: "User_3318", rank: 5, accountAge: 7, playTime: 13, winRate: 98, friendCount: 0, isGhost: true },
          { id: "acc6", username: "ShadowMaster", rank: 6, accountAge: 512, playTime: 2801, winRate: 69, friendCount: 412, isGhost: false },
          { id: "acc7", username: "Ghost_4422", rank: 7, accountAge: 6, playTime: 10, winRate: 98, friendCount: 0, isGhost: true },
          { id: "acc8", username: "WinterKnight", rank: 8, accountAge: 298, playTime: 1656, winRate: 71, friendCount: 267, isGhost: false },
          { id: "acc9", username: "Bot_Hunter", rank: 9, accountAge: 7, playTime: 12, winRate: 96, friendCount: 0, isGhost: true },
          { id: "acc10", username: "EliteGamer", rank: 10, accountAge: 401, playTime: 2456, winRate: 68, friendCount: 378, isGhost: false },
        ],
        maxSelections: 3,
        targetCount: 3,
      }
    },
    autoAdvance: { nextNode: "ghost_selection_result", delay: 0 },
  },

  ghost_selection_result: {
    id: "ghost_selection_result",
    phase: "stage1",
    messages: [
      { id: "m68", speaker: "kastor", text: "Good eye!", reaction: "👍" },
      { id: "m69", speaker: "kastor", text: "New accounts + high win rate + zero friends = BOTS!" },
      { id: "m70", speaker: "detective", text: "But who's controlling them?" },
      { id: "m71", speaker: "kastor", text: "That's what we need to find out!" },
      { id: "m72", speaker: "kastor", text: "Let's check their profiles in detail!" },
    ],
    autoAdvance: { nextNode: "profile_investigation", delay: 800 },
  },

  // Profile details
  profile_investigation: {
    id: "profile_investigation",
    phase: "stage1",
    messages: [
      { id: "m73", speaker: "system", text: "👤 USER PROFILE" },
    ],
    dataVisualizations: [{
      type: "table",
      title: "User_7743 Profile",
      data: {
        headers: ["Field", "Value", "Normal?"],
        rows: [
          ["Account Created", "7 days ago", "🚨"],
          ["Play Time", "12 hours", "🚨"],
          ["Win Rate", "98%", "🚨🚨"],
          ["Main Character", "Shadow", "✓"],
          ["Friends", "0", "🚨"],
          ["Guild", "None", "🚨"],
          ["Chat History", "0 messages", "🚨🚨"],
        ],
      },
    }],
    autoAdvance: { nextNode: "profile_discussion", delay: 2000 },
  },

  profile_discussion: {
    id: "profile_discussion",
    phase: "stage1",
    messages: [
      { id: "m74", speaker: "detective", text: "Only 12 hours of play time!" },
      { id: "m75", speaker: "kastor", text: "But over 2900 points?" },
      { id: "m76", speaker: "detective", text: "And 98% win rate!" },
      { id: "m77", speaker: "kastor", text: "That's not human... must be a bot...", reaction: "🤖" },
      { id: "m78", speaker: "detective", text: "A bot?" },
      { id: "m79", speaker: "kastor", text: "Robot! A program that plays the game automatically!" },
      { id: "m80", speaker: "detective", text: "Those exist?" },
      { id: "m81", speaker: "kastor", text: "Plenty! But usually their win rates aren't this high." },
      { id: "m82", speaker: "detective", text: "So someone made very advanced bots..." },
      { id: "m83", speaker: "kastor", text: "Exactly! Let's check the logs!" },
    ],
    autoAdvance: { nextNode: "log_analysis_prep", delay: 500 },
  },

  // ============================================
  // STAGE 2: INVESTIGATION - Log Analysis
  // ============================================

  log_analysis_prep: {
    id: "log_analysis_prep",
    phase: "stage2",
    messages: [
      {
        id: "m84",
        speaker: "system",
        text: "📊 STAGE 2: DATA COLLECTION",
        celebration: {
          type: "mini",
          title: "Pattern discovered!",
          points: 15
        }
      },
      { id: "m85", speaker: "kastor", text: "Server log time!" },
      { id: "m86", speaker: "detective", text: "Logs again..." },
      { id: "m87", speaker: "kastor", text: "Logs don't lie! You learned that last time!", reaction: "📊" },
      {
        id: "m88",
        speaker: "narrator",
        text: "[Loading log data...]"
      },
      { id: "m89", speaker: "kastor", text: "Got logs for the ghost accounts." },
      { id: "m90", speaker: "detective", text: "What should we look for?" },
      { id: "m91", speaker: "kastor", text: "Connection patterns! If they're human, it'll be irregular..." },
      { id: "m92", speaker: "kastor", text: "If they're bots... it'll be regular!" },
      { id: "m93", speaker: "detective", text: "Oh! That makes sense!" },
    ],
    autoAdvance: { nextNode: "show_login_patterns", delay: 500 },
  },

  show_login_patterns: {
    id: "show_login_patterns",
    phase: "stage2",
    messages: [
      { id: "m94", speaker: "system", text: "📋 CONNECTION LOGS" },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Login Patterns Comparison",
      data: {
        entries: [
          { title: "NORMAL USER (DragonKing)", login: "18:34", session: "87 min", location: "USA" },
          { title: "GHOST (User_7743)", login: "03:00:00 🚨", session: "120 min 🚨", location: "KR → JP → DE 🚨" },
          { title: "NORMAL USER (PhoenixRise)", login: "21:15", session: "143 min", location: "USA" },
          { title: "GHOST (Player_9521)", login: "03:00:17 🚨", session: "120 min 🚨", location: "JP → KR → US 🚨" },
          { title: "GHOST (Ghost_4422)", login: "03:00:05 🚨", session: "120 min 🚨", location: "DE → KR → CN 🚨" },
        ],
      },
    }],
    autoAdvance: { nextNode: "pattern_discussion", delay: 2000 },
  },

  pattern_discussion: {
    id: "pattern_discussion",
    phase: "stage2",
    messages: [
      { id: "m95", speaker: "kastor", text: "Notice anything weird?", reaction: "🤔" },
      { id: "m96", speaker: "detective", text: "All the suspicious accounts logged in at exactly 03:00..." },
      { id: "m97", speaker: "kastor", text: "Exactly! Down to the second!" },
      { id: "m98", speaker: "kastor", text: "And look at locations - jumping between countries!" },
      { id: "m99", speaker: "detective", text: "No human plays like that!" },
      { id: "m100", speaker: "kastor", text: "VPN! Technology to fake your location!" },
      { id: "m101", speaker: "kastor", text: "Time for a pattern matching game!", reaction: "🎮" },
    ],
    autoAdvance: { nextNode: "interactive_pattern_matching", delay: 500 },
  },

  // ============================================
  // INTERACTIVE #2: Pattern Matching
  // ============================================

  interactive_pattern_matching: {
    id: "interactive_pattern_matching",
    phase: "stage2",
    messages: [
      { id: "m102", speaker: "system", text: "🎯 INTERACTIVE CHALLENGE" },
      { id: "m103", speaker: "kastor", text: "Sort these patterns: Normal vs Bot!" },
      { id: "m104", speaker: "kastor", text: "Hint: Bots have perfect timing and location hopping!" },
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
    phase: "stage2",
    messages: [
      { id: "m105", speaker: "kastor", text: "Perfect!", reaction: "⭐" },
      { id: "m106", speaker: "kastor", text: "Bot patterns are obvious once you know what to look for!" },
      { id: "m107", speaker: "detective", text: "Fixed timing, distributed IPs, exact session lengths..." },
      { id: "m108", speaker: "kastor", text: "Humans can't do this. Not even 1 minute of variation.", reaction: "🤖" },
      { id: "m109", speaker: "detective", text: "So these ARE bots!" },
      { id: "m110", speaker: "kastor", text: "Almost certain! 99%!" },
      { id: "m111", speaker: "detective", text: "99% again." },
      { id: "m112", speaker: "kastor", text: "It's a habit~", reaction: "😅" },
      { id: "m113", speaker: "kastor", text: "Let's check when these accounts were created!" },
    ],
    autoAdvance: { nextNode: "account_creation_analysis", delay: 800 },
  },

  // ============================================
  // Account Creation Timeline
  // ============================================

  account_creation_analysis: {
    id: "account_creation_analysis",
    phase: "stage2",
    messages: [
      { id: "m114", speaker: "kastor", text: "Next! Account creation logs!" },
      { id: "m115", speaker: "detective", text: "Looking at when they were created, right?" },
      { id: "m116", speaker: "kastor", text: "Right! And how they were created!" },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Account Creation Records (Last Week)",
      data: {
        entries: [
          { time: "Day 1, 03:00:00", account: "User_7743 created" },
          { time: "Day 1, 03:00:17", account: "Player_9521 created" },
          { time: "Day 1, 03:00:31", account: "User_3318 created" },
          { time: "Day 1, 03:00:45", account: "Account_5529 created" },
          { time: "Day 1, 03:01:02", account: "User_8841 created" },
          { time: "...", account: "(47 accounts total, created within 5 minutes) 🚨" },
        ],
      },
    }],
    autoAdvance: { nextNode: "creation_discussion", delay: 2000 },
  },

  creation_discussion: {
    id: "creation_discussion",
    phase: "stage2",
    messages: [
      { id: "m117", speaker: "detective", text: "47 accounts in 5 minutes?!" },
      { id: "m118", speaker: "kastor", text: "Not humanly possible!", reaction: "🚨" },
      { id: "m119", speaker: "detective", text: "Automated script?" },
      { id: "m120", speaker: "kastor", text: "Oh! Learning from what you learned? Correct!" },
      { id: "m121", speaker: "detective", text: "Who could make something like this?" },
      { id: "m122", speaker: "kastor", text: "That's the question... who?" },
      { id: "m123", speaker: "detective", text: "Insider? Outsider?" },
      { id: "m124", speaker: "kastor", text: "We need to dig deeper." },
      { id: "m125", speaker: "kastor", text: "Should we check the email domains?" },
    ],
    dataVisualizations: [{
      type: "table",
      title: "Email Patterns",
      data: {
        headers: ["Account", "Email", "Domain Type"],
        rows: [
          ["User_7743", "user7743@tempmail.net", "Temporary 🚨"],
          ["Player_9521", "player9521@tempmail.net", "Temporary 🚨"],
          ["User_3318", "user3318@tempmail.net", "Temporary 🚨"],
          ["Ghost_4422", "ghost4422@guerrillamail.com", "Temporary 🚨"],
          ["(All 47 accounts)", "From temp email services", "🚨🚨"],
        ],
      },
    }],
    autoAdvance: { nextNode: "email_pattern_result", delay: 2000 },
  },

  email_pattern_result: {
    id: "email_pattern_result",
    phase: "stage2",
    messages: [
      { id: "m126", speaker: "detective", text: "They're all from the same type of service!" },
      { id: "m127", speaker: "kastor", text: "Tempmail! A site that creates temporary emails!" },
      { id: "m128", speaker: "detective", text: "What's that?" },
      { id: "m129", speaker: "kastor", text: "Emails you use for 10 minutes and throw away!" },
      { id: "m130", speaker: "kastor", text: "Often used for spam." },
      { id: "m131", speaker: "detective", text: "This was completely planned...", reaction: "🤔" },
      {
        id: "m132",
        speaker: "system",
        text: "🎉 Evidence Collected!",
        celebration: {
          type: "mini",
          title: "Creation pattern analyzed!",
          points: 20
        }
      },
    ],
    autoAdvance: { nextNode: "stage3_interviews_intro", delay: 800 },
  },

  // ============================================
  // STAGE 3: WITNESS INTERVIEWS
  // ============================================

  stage3_interviews_intro: {
    id: "stage3_interviews_intro",
    phase: "stage3",
    messages: [
      {
        id: "m133",
        speaker: "system",
        text: "📊 STAGE 3: WITNESS INTERVIEWS",
        celebration: {
          type: "mini",
          title: "Investigation deepens!",
          points: 15
        }
      },
      { id: "m134", speaker: "kastor", text: "We should ask someone who knows the internal situation." },
      { id: "m135", speaker: "detective", text: "Who?" },
      { id: "m136", speaker: "kastor", text: "Security lead! The person responsible for security!" },
      {
        id: "m137",
        speaker: "narrator",
        text: "[Phone connecting...]"
      },
    ],
    autoAdvance: { nextNode: "elena_interview_1", delay: 500 },
  },

  // Elena Interview - First (Misdirection begins)
  elena_interview_1: {
    id: "elena_interview_1",
    phase: "stage3",
    messages: [
      { id: "m138", speaker: "elena", text: "Hello! This is Elena!", characterName: "Elena Kovač" },
      { id: "m139", speaker: "detective", text: "Hello, I'm a detective. May I ask a few questions?" },
      { id: "m140", speaker: "elena", text: "Of course! I'll help however I can! Full support!", characterName: "Elena Kovač" },
      { id: "m141", speaker: "kastor", text: "(whispers) She talks a lot...", reaction: "🤔" },
      { id: "m142", speaker: "detective", text: "Have you noticed anything unusual in the server access logs recently?" },
      { id: "m143", speaker: "elena", text: "Hmm... nothing special! I check every day!", characterName: "Elena Kovač" },
      { id: "m144", speaker: "elena", text: "Our system is really secure! External intrusion is impossible...", characterName: "Elena Kovač" },
      { id: "m145", speaker: "elena", text: "Our firewall is up to date, encryption is perfect...", characterName: "Elena Kovač" },
      { id: "m146", speaker: "kastor", text: "(whispers) A bit too confident?", reaction: "👀" },
      { id: "m147", speaker: "detective", text: "Could anyone internally do something like this?" },
      { id: "m148", speaker: "elena", text: "Internally?! No way! Our team members are all trustworthy!", characterName: "Elena Kovač" },
      { id: "m149", speaker: "elena", text: "I've been managing for 6 months and there've been no issues!", characterName: "Elena Kovač" },
      { id: "m150", speaker: "detective", text: "Six months...? Who was in charge before you?" },
      { id: "m151", speaker: "elena", text: "Ah... before me... it was Camille.", characterName: "Elena Kovač" },
      { id: "m152", speaker: "detective", text: "Camille?" },
      { id: "m153", speaker: "elena", text: "Camille Beaumont. She was the former Security Lead.", characterName: "Elena Kovač" },
      { id: "m154", speaker: "elena", text: "But there were some issues... she was let go.", characterName: "Elena Kovač" },
      { id: "m155", speaker: "kastor", text: "What kind of issues?" },
      { id: "m156", speaker: "elena", text: "Well... she was complicated.", characterName: "Elena Kovač" },
      { id: "m157", speaker: "elena", text: "She was stubborn, didn't work well with the team...", characterName: "Elena Kovač" },
      { id: "m158", speaker: "elena", text: "Honestly, everyone struggled working with her.", characterName: "Elena Kovač" },
      { id: "m159", speaker: "detective", text: "Specifically, what happened?" },
      { id: "m160", speaker: "elena", text: "She kept insisting there was a problem with the ranking system.", characterName: "Elena Kovač" },
      { id: "m161", speaker: "elena", text: "But when we tested it, there was no problem, you know?", characterName: "Elena Kovač" },
      { id: "m162", speaker: "elena", text: "Eventually she fought with her boss... and got fired.", characterName: "Elena Kovač" },
      { id: "m163", speaker: "kastor", text: "Can we contact her now?" },
      { id: "m164", speaker: "elena", text: "I don't know... she probably won't answer?", characterName: "Elena Kovač" },
      { id: "m165", speaker: "elena", text: "She was really angry at me when she left!", characterName: "Elena Kovač" },
      { id: "m166", speaker: "detective", text: "Why?" },
      { id: "m167", speaker: "elena", text: "...I don't know. She just seemed to hate me.", characterName: "Elena Kovač" },
      { id: "m168", speaker: "kastor", text: "I see. Thank you." },
      { id: "m169", speaker: "elena", text: "I hope I was helpful! Call again anytime!", characterName: "Elena Kovač" },
      {
        id: "m170",
        speaker: "narrator",
        text: "[Call ends]"
      },
      { id: "m171", speaker: "detective", text: "Camille seems suspicious." },
      { id: "m172", speaker: "kastor", text: "Yeah... but..." },
      { id: "m173", speaker: "detective", text: "But what?" },
      { id: "m174", speaker: "kastor", text: "Elena's way of speaking was a bit strange.", reaction: "🤔" },
      { id: "m175", speaker: "detective", text: "Strange how?" },
      { id: "m176", speaker: "kastor", text: "Too eager... like she's hiding something." },
      { id: "m177", speaker: "detective", text: "I think Camille is the culprit." },
      { id: "m178", speaker: "kastor", text: "Don't rush! Let's interview one more person." },
    ],
    autoAdvance: { nextNode: "nina_interview", delay: 800 },
  },

  // Nina Interview - Twist Begins
  nina_interview: {
    id: "nina_interview",
    phase: "stage3",
    messages: [
      { id: "m179", speaker: "kastor", text: "Should we call Nina?" },
      { id: "m180", speaker: "detective", text: "Nina?" },
      { id: "m181", speaker: "kastor", text: "Yeah! Junior analyst. Marcus recommended her." },
      {
        id: "m182",
        speaker: "narrator",
        text: "[Phone connecting...]"
      },
      { id: "m183", speaker: "nina", text: "Hello?", characterName: "Nina Reyes" },
      { id: "m184", speaker: "detective", text: "Nina Reyes? I'd like to ask you a few things." },
      { id: "m185", speaker: "nina", text: "Yes! Ask me anything!", characterName: "Nina Reyes" },
      { id: "m186", speaker: "detective", text: "Do you know Camille Beaumont?" },
      { id: "m187", speaker: "nina", text: "...Camille?", characterName: "Nina Reyes" },
      { id: "m188", speaker: "detective", text: "Yes." },
      { id: "m189", speaker: "nina", text: "She was... really good to me. (voice trembling)", characterName: "Nina Reyes", reaction: "😢" },
      { id: "m190", speaker: "detective", text: "Was good to you?" },
      { id: "m191", speaker: "nina", text: "Yes! She was really kind to me!", characterName: "Nina Reyes" },
      { id: "m192", speaker: "nina", text: "When I first joined... I didn't know anything...", characterName: "Nina Reyes" },
      { id: "m193", speaker: "nina", text: "She taught me everything. Data analysis, pattern finding...", characterName: "Nina Reyes" },
      { id: "m194", speaker: "detective", text: "Then why was she fired?" },
      { id: "m195", speaker: "nina", text: "...That's... unfair.", characterName: "Nina Reyes" },
      { id: "m196", speaker: "kastor", text: "Unfair?" },
      { id: "m197", speaker: "nina", text: "She really did find a problem! In the ranking system!", characterName: "Nina Reyes" },
      { id: "m198", speaker: "nina", text: "But... nobody believed her.", characterName: "Nina Reyes" },
      { id: "m199", speaker: "detective", text: "What kind of problem?" },
      { id: "m200", speaker: "nina", text: "A bug where score calculation goes wrong under certain conditions.", characterName: "Nina Reyes" },
      { id: "m201", speaker: "nina", text: "She even brought evidence...", characterName: "Nina Reyes" },
      { id: "m202", speaker: "nina", text: "But the team leader... just ignored it.", characterName: "Nina Reyes" },
      { id: "m203", speaker: "detective", text: "Elena ignored it?" },
      { id: "m204", speaker: "nina", text: "...Yes. Elena was the team leader.", characterName: "Nina Reyes" },
      { id: "m205", speaker: "nina", text: "And shortly after... Camille was fired.", characterName: "Nina Reyes" },
      { id: "m206", speaker: "nina", text: "The reason was... teamwork issues...", characterName: "Nina Reyes" },
      { id: "m207", speaker: "kastor", text: "What do you think, Nina?" },
      { id: "m208", speaker: "nina", text: "I... found it strange.", characterName: "Nina Reyes" },
      { id: "m209", speaker: "nina", text: "Camille was quiet but not a bad person.", characterName: "Nina Reyes" },
      { id: "m210", speaker: "nina", text: "Rather, Elena...", characterName: "Nina Reyes" },
      { id: "m211", speaker: "detective", text: "Elena?" },
      { id: "m212", speaker: "nina", text: "...No. Sorry. I said too much.", characterName: "Nina Reyes" },
      { id: "m213", speaker: "kastor", text: "It's okay. You've been very helpful." },
      { id: "m214", speaker: "nina", text: "If you... find Camille...", characterName: "Nina Reyes" },
      { id: "m215", speaker: "nina", text: "Please tell her I'm sorry.", characterName: "Nina Reyes" },
      { id: "m216", speaker: "nina", text: "I... couldn't do anything.", characterName: "Nina Reyes", reaction: "😢" },
      {
        id: "m217",
        speaker: "narrator",
        text: "[Call ends]"
      },
      { id: "m218", speaker: "detective", text: "...That's a completely different story." },
      { id: "m219", speaker: "kastor", text: "Right? Elena said Camille was the problem...", reaction: "🤔" },
      { id: "m220", speaker: "detective", text: "But Nina says Camille was the victim." },
      { id: "m221", speaker: "kastor", text: "Which one is lying?" },
      { id: "m222", speaker: "detective", text: "Or maybe... both are just seeing from their own perspective?" },
      { id: "m223", speaker: "kastor", text: "Oh! Good thinking!" },
      { id: "m224", speaker: "kastor", text: "But there's only one truth. We need to dig deeper." },
      {
        id: "m225",
        speaker: "system",
        text: "🎉 Plot Twist!",
        celebration: {
          type: "mini",
          title: "Misdirection discovered!",
          points: 15
        }
      },
    ],
    autoAdvance: { nextNode: "algorithm_analysis_intro", delay: 800 },
  },

  // ============================================
  // STAGE 4: ALGORITHM ANALYSIS
  // ============================================

  algorithm_analysis_intro: {
    id: "algorithm_analysis_intro",
    phase: "stage4",
    messages: [
      {
        id: "m226",
        speaker: "system",
        text: "📊 STAGE 4: ALGORITHM ANALYSIS"
      },
      { id: "m227", speaker: "kastor", text: "We need to look at the algorithm directly." },
      { id: "m228", speaker: "detective", text: "Algorithm?" },
      { id: "m229", speaker: "kastor", text: "Yeah! The program that calculates scores!" },
      { id: "m230", speaker: "kastor", text: "The thing Camille said had problems!" },
      {
        id: "m231",
        speaker: "narrator",
        text: "[Requesting code access from Marcus...]"
      },
      {
        id: "m232",
        speaker: "system",
        text: "📧 Marcus: Sending the algorithm code. Please handle with care."
      },
      { id: "m233", speaker: "kastor", text: "Code arrived! Let's read it carefully!" },
    ],
    autoAdvance: { nextNode: "show_algorithm_code", delay: 500 },
  },

  show_algorithm_code: {
    id: "show_algorithm_code",
    phase: "stage4",
    messages: [
      { id: "m234", speaker: "system", text: "💻 RANKING ALGORITHM CODE" },
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
          { line: 7, code: "    if player.accountAge < 7: 🚨" },
          { line: 8, code: "        newbieBonus = 200 🚨" },
          { line: 9, code: "" },
          { line: 10, code: "    if player.flag == 'ghost': 🚨🚨🚨" },
          { line: 11, code: "        ghostBonus = 500 🚨🚨🚨" },
          { line: 12, code: "" },
          { line: 13, code: "    return baseScore + timeBonus + newbieBonus + ghostBonus" },
        ],
      },
    }],
    autoAdvance: { nextNode: "code_discussion", delay: 2000 },
  },

  code_discussion: {
    id: "code_discussion",
    phase: "stage4",
    messages: [
      { id: "m235", speaker: "detective", text: "Hmm... something's weird..." },
      { id: "m236", speaker: "kastor", text: "Where?" },
      { id: "m237", speaker: "detective", text: "Here! if player.flag == 'ghost'" },
      { id: "m238", speaker: "kastor", text: "Oh! You found it!", reaction: "🎯" },
      { id: "m239", speaker: "detective", text: "If the ghost flag is on, add 500 points?!" },
      { id: "m240", speaker: "kastor", text: "That's the backdoor!", reaction: "🚨" },
      { id: "m241", speaker: "kastor", text: "Let's debug this code!" },
    ],
    autoAdvance: { nextNode: "interactive_code_debug", delay: 500 },
  },

  // Interactive: Code Debugging
  interactive_code_debug: {
    id: "interactive_code_debug",
    phase: "stage4",
    messages: [
      { id: "m242", speaker: "system", text: "🎯 INTERACTIVE CHALLENGE" },
      { id: "m243", speaker: "kastor", text: "Find the suspicious code lines! (Select 3)" },
      { id: "m244", speaker: "kastor", text: "Hint: Look for conditional statements!" },
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
    phase: "stage4",
    messages: [
      { id: "m245", speaker: "kastor", text: "Found the backdoors!", reaction: "✅" },
      { id: "m246", speaker: "kastor", text: "Line 7-8: Bonus for new accounts!" },
      { id: "m247", speaker: "kastor", text: "Line 10-11: Hidden 'ghost' flag bonus!", reaction: "🚨" },
      { id: "m248", speaker: "detective", text: "Who added this code?" },
      { id: "m249", speaker: "kastor", text: "Let me check the git history..." },
      {
        id: "m250",
        speaker: "system",
        text: "🎉 Backdoor Found!",
        celebration: {
          type: "mini",
          title: "Backdoor discovered!",
          points: 25
        }
      },
    ],
    autoAdvance: { nextNode: "git_commit_history", delay: 800 },
  },

  // Git Commit History
  git_commit_history: {
    id: "git_commit_history",
    phase: "stage4",
    messages: [
      { id: "m251", speaker: "system", text: "📜 GIT COMMIT HISTORY" },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Git Commit Log - ranking_algorithm.py",
      data: {
        entries: [
          { commit: "a7f39d2", author: "camille.beaumont", date: "6 months ago", message: "Add newbie protection - TESTING ONLY" },
          { commit: "", changes: "+ if player.flag == 'ghost':", highlight: true },
          { commit: "", changes: "+     ghostBonus = 500", highlight: true },
        ],
      },
    }],
    autoAdvance: { nextNode: "git_discussion", delay: 2000 },
  },

  git_discussion: {
    id: "git_discussion",
    phase: "stage4",
    messages: [
      { id: "m252", speaker: "detective", text: "Camille added it!" },
      { id: "m253", speaker: "kastor", text: "6 months ago... right before she was fired." },
      { id: "m254", speaker: "detective", text: "Then Camille is definitely the culprit!" },
      { id: "m255", speaker: "kastor", text: "Wait. Look at the message." },
      { id: "m256", speaker: "detective", text: "TESTING ONLY?" },
      { id: "m257", speaker: "kastor", text: "It says it's for testing. Maybe she added it to find bugs..." },
      { id: "m258", speaker: "detective", text: "But she left it without deleting it!" },
      { id: "m259", speaker: "kastor", text: "That's... true but..." },
      { id: "m260", speaker: "kastor", text: "Something's off. We need to dig more.", reaction: "🤔" },
    ],
    autoAdvance: { nextNode: "access_logs_check", delay: 800 },
  },

  // Access Logs - Twist!
  access_logs_check: {
    id: "access_logs_check",
    phase: "stage4",
    messages: [
      { id: "m261", speaker: "kastor", text: "Let's see who recently activated this code!" },
      { id: "m262", speaker: "system", text: "📋 SERVER ACCESS LOGS" },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Code Activation History",
      data: {
        entries: [
          { date: "Day -180", user: "camille.beaumont", action: "Code added (INACTIVE)" },
          { date: "Day -179 ~ Day -7", user: "---", action: "(No access)" },
          { date: "Day -7", user: "elena.kovac", action: "Code ACTIVATED 🚨🚨🚨" },
          { date: "Day -7", user: "system", action: "47 accounts created, flag='ghost' set" },
        ],
      },
    }],
    autoAdvance: { nextNode: "access_logs_discussion", delay: 2000 },
  },

  access_logs_discussion: {
    id: "access_logs_discussion",
    phase: "stage4",
    messages: [
      { id: "m263", speaker: "detective", text: "...Elena?!", reaction: "😱" },
      { id: "m264", speaker: "kastor", text: "What?" },
      { id: "m265", speaker: "detective", text: "Elena activated the code!" },
      { id: "m266", speaker: "kastor", text: "The code Camille added..." },
      { id: "m267", speaker: "detective", text: "Elena turned it on a week ago!", reaction: "🚨" },
      { id: "m268", speaker: "kastor", text: "Wow... plot twist!" },
      { id: "m269", speaker: "detective", text: "Elena was the culprit!" },
      { id: "m270", speaker: "kastor", text: "Wait wait! Don't rush!" },
      { id: "m271", speaker: "detective", text: "Why? The evidence is clear!" },
      { id: "m272", speaker: "kastor", text: "What did Nina say?" },
      { id: "m273", speaker: "detective", text: "That Camille reported the algorithm problem..." },
      { id: "m274", speaker: "kastor", text: "And Elena ignored it." },
      { id: "m275", speaker: "detective", text: "...So Elena deliberately ignored it?" },
      { id: "m276", speaker: "kastor", text: "Probably. But why?" },
      { id: "m277", speaker: "detective", text: "How do we find out?" },
      { id: "m278", speaker: "kastor", text: "We ask her!", reaction: "📞" },
      {
        id: "m279",
        speaker: "system",
        text: "🎉 Real Culprit Found!",
        celebration: {
          type: "mini",
          title: "Real culprit found!",
          points: 30
        }
      },
    ],
    autoAdvance: { nextNode: "elena_interrogation", delay: 1000 },
  },

  // ============================================
  // STAGE 5: CONFRONTATION
  // ============================================

  elena_interrogation: {
    id: "elena_interrogation",
    phase: "stage5",
    messages: [
      {
        id: "m280",
        speaker: "system",
        text: "📊 STAGE 5: CONFRONTATION"
      },
      {
        id: "m281",
        speaker: "narrator",
        text: "[Phone reconnecting...]"
      },
      { id: "m282", speaker: "elena", text: "You called again! How can I help?", characterName: "Elena Kovač" },
      { id: "m283", speaker: "detective", text: "Elena, there's a code modification record from a week ago." },
      { id: "m284", speaker: "elena", text: "...Code modification?", characterName: "Elena Kovač" },
      { id: "m285", speaker: "kastor", text: "Ranking algorithm. Ghost flag activation." },
      { id: "m286", speaker: "elena", text: "Ah... that... was just routine maintenance!", characterName: "Elena Kovač" },
      { id: "m287", speaker: "detective", text: "You activated test code during routine maintenance?" },
      { id: "m288", speaker: "elena", text: "That was... a mistake! I forgot...", characterName: "Elena Kovač" },
      { id: "m289", speaker: "kastor", text: "Did you also create 47 accounts by mistake?" },
      { id: "m290", speaker: "elena", text: "......", characterName: "Elena Kovač" },
      { id: "m291", speaker: "detective", text: "Elena, please tell us the truth." },
      { id: "m292", speaker: "elena", text: "...Do you have proof?", characterName: "Elena Kovač" },
      { id: "m293", speaker: "kastor", text: "Server logs, account creation records, code activation logs." },
      { id: "m294", speaker: "kastor", text: "They're all from your account." },
      { id: "m295", speaker: "elena", text: "......", characterName: "Elena Kovač", reaction: "😨" },
      {
        id: "m296",
        speaker: "narrator",
        text: "[Long silence...]"
      },
      { id: "m297", speaker: "elena", text: "...Camille started it first.", characterName: "Elena Kovač" },
      { id: "m298", speaker: "detective", text: "What?" },
      { id: "m299", speaker: "elena", text: "When Camille discovered the algorithm problem...", characterName: "Elena Kovač" },
      { id: "m300", speaker: "elena", text: "I worked with her on it. Finding a solution...", characterName: "Elena Kovač" },
      { id: "m301", speaker: "elena", text: "But Camille just wanted to report it to the company!", characterName: "Elena Kovač" },
      { id: "m302", speaker: "elena", text: "I wanted... to make it into an improvement proposal!", characterName: "Elena Kovač" },
      { id: "m303", speaker: "kastor", text: "An improvement proposal?" },
      { id: "m304", speaker: "elena", text: "Yes! A new user protection system!", characterName: "Elena Kovač" },
      { id: "m305", speaker: "elena", text: "It was my idea! I designed it!", characterName: "Elena Kovač" },
      { id: "m306", speaker: "detective", text: "But didn't Camille discover it first?" },
      { id: "m307", speaker: "elena", text: "Camille discovered it, but... I solved it!", characterName: "Elena Kovač" },
      { id: "m308", speaker: "elena", text: "But Camille... tried not to acknowledge my contribution!", characterName: "Elena Kovač" },
      { id: "m309", speaker: "nina", text: "That's a lie!", characterName: "Nina Reyes (joining call)" },
      { id: "m310", speaker: "elena", text: "Nina?!", characterName: "Elena Kovač", reaction: "😱" },
      { id: "m311", speaker: "nina", text: "I saw everything! Camille's documents!", characterName: "Nina Reyes" },
      { id: "m312", speaker: "nina", text: "The improvement proposal was hers!", characterName: "Nina Reyes" },
      { id: "m313", speaker: "nina", text: "You stole it!", characterName: "Nina Reyes", reaction: "😡" },
      { id: "m314", speaker: "elena", text: "......", characterName: "Elena Kovač" },
      { id: "m315", speaker: "detective", text: "Elena, is that true?" },
      { id: "m316", speaker: "elena", text: "...I just...", characterName: "Elena Kovač", reaction: "😢" },
      { id: "m317", speaker: "elena", text: "Wanted recognition.", characterName: "Elena Kovač" },
      { id: "m318", speaker: "elena", text: "I was always in Camille's shadow.", characterName: "Elena Kovač" },
      { id: "m319", speaker: "elena", text: "Skills, evaluations... Camille was always above me.", characterName: "Elena Kovač" },
      { id: "m320", speaker: "elena", text: "Just this once... I wanted to shine.", characterName: "Elena Kovač" },
      { id: "m321", speaker: "kastor", text: "So you got Camille fired?" },
      { id: "m322", speaker: "elena", text: "...Yes.", characterName: "Elena Kovač" },
      { id: "m323", speaker: "elena", text: "I reported it as teamwork issues.", characterName: "Elena Kovač" },
      { id: "m324", speaker: "elena", text: "It was a lie. All of it.", characterName: "Elena Kovač" },
      { id: "m325", speaker: "detective", text: "Then why did you create the ghost accounts?" },
      { id: "m326", speaker: "elena", text: "...To prove Camille was right.", characterName: "Elena Kovač" },
      { id: "m327", speaker: "detective", text: "What do you mean?" },
      { id: "m328", speaker: "elena", text: "There really was a problem with the algorithm.", characterName: "Elena Kovač" },
      { id: "m329", speaker: "elena", text: "I tried to submit the improvement proposal...", characterName: "Elena Kovač" },
      { id: "m330", speaker: "elena", text: "But the company rejected it.", characterName: "Elena Kovač" },
      { id: "m331", speaker: "elena", text: "So... I wanted to show how serious the problem was...", characterName: "Elena Kovač" },
      { id: "m332", speaker: "kastor", text: "You attacked the system with ghost accounts." },
      { id: "m333", speaker: "elena", text: "...Yes.", characterName: "Elena Kovač" },
      { id: "m334", speaker: "elena", text: "I'm sorry.", characterName: "Elena Kovač", reaction: "😢" },
      {
        id: "m335",
        speaker: "system",
        text: "🎉 MAJOR DISCOVERY!",
        celebration: {
          type: "major",
          title: "Confession obtained!",
          points: 50
        }
      },
    ],
    autoAdvance: { nextNode: "camille_contact", delay: 1000 },
  },

  // ============================================
  // Camille Truth
  // ============================================

  camille_contact: {
    id: "camille_contact",
    phase: "stage5",
    messages: [
      {
        id: "m336",
        speaker: "narrator",
        text: "[Successfully contacted Camille]"
      },
      { id: "m337", speaker: "camille", text: "...Who is this?", characterName: "Camille Beaumont" },
      { id: "m338", speaker: "detective", text: "I'm a detective. Investigating the Legend Arena case." },
      { id: "m339", speaker: "camille", text: "...I'm done with that company.", characterName: "Camille Beaumont" },
      { id: "m340", speaker: "kastor", text: "Elena confessed." },
      { id: "m341", speaker: "camille", text: "......", characterName: "Camille Beaumont" },
      { id: "m342", speaker: "camille", text: "...What did she say?", characterName: "Camille Beaumont" },
      { id: "m343", speaker: "detective", text: "That she stole your algorithm improvement proposal." },
      { id: "m344", speaker: "detective", text: "And that she framed you to get you fired." },
      { id: "m345", speaker: "camille", text: "...I knew.", characterName: "Camille Beaumont" },
      { id: "m346", speaker: "kastor", text: "You knew?" },
      { id: "m347", speaker: "camille", text: "I'm not stupid.", characterName: "Camille Beaumont" },
      { id: "m348", speaker: "camille", text: "I saw Elena copying my documents.", characterName: "Camille Beaumont" },
      { id: "m349", speaker: "detective", text: "Then why didn't you say anything?" },
      { id: "m350", speaker: "camille", text: "...I had no proof.", characterName: "Camille Beaumont" },
      { id: "m351", speaker: "camille", text: "And... nobody believed me anyway.", characterName: "Camille Beaumont", reaction: "😔" },
      { id: "m352", speaker: "kastor", text: "The ghost accounts... did you create them?" },
      { id: "m353", speaker: "camille", text: "...No.", characterName: "Camille Beaumont" },
      { id: "m354", speaker: "detective", text: "No?" },
      { id: "m355", speaker: "camille", text: "I only left the code. For testing.", characterName: "Camille Beaumont" },
      { id: "m356", speaker: "camille", text: "I thought if someone found it someday...", characterName: "Camille Beaumont" },
      { id: "m357", speaker: "camille", text: "They'd notice the system problem.", characterName: "Camille Beaumont" },
      { id: "m358", speaker: "camille", text: "I never thought Elena would exploit it...", characterName: "Camille Beaumont" },
      { id: "m359", speaker: "detective", text: "So Elena did everything." },
      { id: "m360", speaker: "camille", text: "...Seems so.", characterName: "Camille Beaumont" },
      { id: "m361", speaker: "camille", text: "Ironic, isn't it.", characterName: "Camille Beaumont" },
      { id: "m362", speaker: "camille", text: "She proved I was right... using my code.", characterName: "Camille Beaumont" },
      { id: "m363", speaker: "kastor", text: "Do you want to come back? To the company?" },
      { id: "m364", speaker: "camille", text: "...I don't know.", characterName: "Camille Beaumont" },
      { id: "m365", speaker: "camille", text: "I'm too tired.", characterName: "Camille Beaumont" },
      { id: "m366", speaker: "camille", text: "I've proven it... that's enough.", characterName: "Camille Beaumont", reaction: "😔" },
      {
        id: "m367",
        speaker: "system",
        text: "💡 Truth Revealed!",
        celebration: {
          type: "mini",
          title: "Truth revealed!",
          points: 20
        }
      },
    ],
    autoAdvance: { nextNode: "marcus_decision", delay: 1000 },
  },

  // ============================================
  // STAGE 6: RESOLUTION
  // ============================================

  marcus_decision: {
    id: "marcus_decision",
    phase: "stage5",
    messages: [
      {
        id: "m368",
        speaker: "system",
        text: "📊 STAGE 6: RESOLUTION"
      },
      {
        id: "m369",
        speaker: "narrator",
        text: "[Meeting with Marcus]"
      },
      { id: "m370", speaker: "marcus", text: "...Elena did this...", characterName: "Marcus Chen", reaction: "😔" },
      { id: "m371", speaker: "detective", text: "Yes. The evidence is clear." },
      { id: "m372", speaker: "marcus", text: "Camille was... innocent.", characterName: "Marcus Chen" },
      { id: "m373", speaker: "kastor", text: "Elena framed her." },
      { id: "m374", speaker: "marcus", text: "...It's my fault.", characterName: "Marcus Chen" },
      { id: "m375", speaker: "detective", text: "What?" },
      { id: "m376", speaker: "marcus", text: "I was the one who ignored Camille's report.", characterName: "Marcus Chen" },
      { id: "m377", speaker: "marcus", text: "Elena... made it sound more plausible.", characterName: "Marcus Chen" },
      { id: "m378", speaker: "marcus", text: "Better communication...", characterName: "Marcus Chen" },
      { id: "m379", speaker: "marcus", text: "Camille didn't talk much...", characterName: "Marcus Chen" },
      { id: "m380", speaker: "marcus", text: "...It was a mistake. A big mistake.", characterName: "Marcus Chen", reaction: "😞" },
      { id: "m381", speaker: "kastor", text: "You can make it right now." },
      { id: "m382", speaker: "marcus", text: "I need to contact Camille.", characterName: "Marcus Chen" },
      { id: "m383", speaker: "marcus", text: "Apologize... offer her position back...", characterName: "Marcus Chen" },
      { id: "m384", speaker: "detective", text: "What will you do about Elena?" },
      { id: "m385", speaker: "marcus", text: "...", characterName: "Marcus Chen" },
    ],
    question: {
      id: "q_ethical_choice",
      text: "🎯 ETHICAL DECISION: What should Marcus do?",
      choices: [
        {
          id: "choice_strict",
          text: "A) Elena must be fired immediately (Strict)",
          isCorrect: true,
          nextNode: "ending_strict",
          feedback: "Justice first. Clear consequences for wrongdoing.",
          pointsAwarded: 20,
        },
        {
          id: "choice_lenient",
          text: "B) Give Elena a second chance (Lenient)",
          isCorrect: true,
          nextNode: "ending_lenient",
          feedback: "Mercy matters. Everyone deserves redemption.",
          pointsAwarded: 20,
        },
        {
          id: "choice_balanced",
          text: "C) The company is also responsible (Balanced)",
          isCorrect: true,
          nextNode: "ending_balanced",
          feedback: "Systemic issues need systemic solutions. Wise choice.",
          pointsAwarded: 30,
        },
      ],
    },
  },

  // Multiple endings based on player choice
  ending_strict: {
    id: "ending_strict",
    phase: "stage5",
    messages: [
      { id: "m386", speaker: "marcus", text: "...Termination.", characterName: "Marcus Chen" },
      { id: "m387", speaker: "marcus", text: "And legal action.", characterName: "Marcus Chen" },
      { id: "m388", speaker: "detective", text: "Understood." },
      {
        id: "m389",
        speaker: "narrator",
        text: "[1 week later]"
      },
      { id: "m390", speaker: "kastor", text: "Elena was fired. Legal proceedings ongoing." },
      { id: "m391", speaker: "detective", text: "And Camille?" },
      { id: "m392", speaker: "kastor", text: "Still considering the offer." },
    ],
    autoAdvance: { nextNode: "epilogue", delay: 800 },
  },

  ending_lenient: {
    id: "ending_lenient",
    phase: "stage5",
    messages: [
      { id: "m393", speaker: "marcus", text: "...Probation.", characterName: "Marcus Chen" },
      { id: "m394", speaker: "marcus", text: "She can redeem herself.", characterName: "Marcus Chen" },
      { id: "m395", speaker: "detective", text: "I hope she does." },
      {
        id: "m396",
        speaker: "narrator",
        text: "[1 week later]"
      },
      { id: "m397", speaker: "kastor", text: "Elena is on probation. Working to make amends." },
      { id: "m398", speaker: "detective", text: "And Camille?" },
      { id: "m399", speaker: "kastor", text: "Accepted the offer. Returning next month." },
    ],
    autoAdvance: { nextNode: "epilogue", delay: 800 },
  },

  ending_balanced: {
    id: "ending_balanced",
    phase: "stage5",
    messages: [
      { id: "m400", speaker: "marcus", text: "Elena will face consequences.", characterName: "Marcus Chen" },
      { id: "m401", speaker: "marcus", text: "But we're also changing our systems.", characterName: "Marcus Chen" },
      { id: "m402", speaker: "marcus", text: "Better communication channels, anonymous reporting...", characterName: "Marcus Chen" },
      { id: "m403", speaker: "detective", text: "That sounds fair." },
      {
        id: "m404",
        speaker: "narrator",
        text: "[1 week later]"
      },
      { id: "m405", speaker: "kastor", text: "Elena resigned. Company implemented new policies." },
      { id: "m406", speaker: "detective", text: "And Camille?" },
      { id: "m407", speaker: "kastor", text: "Consulting for the company. On her own terms." },
    ],
    autoAdvance: { nextNode: "epilogue", delay: 800 },
  },

  // ============================================
  // STAGE 7: EPILOGUE
  // ============================================

  epilogue: {
    id: "epilogue",
    phase: "stage5",
    messages: [
      {
        id: "m408",
        speaker: "narrator",
        text: "[Detective Office]",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
      },
      { id: "m409", speaker: "kastor", text: "Complicated case." },
      { id: "m410", speaker: "detective", text: "Good and evil weren't clear." },
      { id: "m411", speaker: "kastor", text: "That's reality.", reaction: "🤔" },
      { id: "m412", speaker: "kastor", text: "Elena... wasn't purely evil." },
      { id: "m413", speaker: "detective", text: "She wanted recognition." },
      { id: "m414", speaker: "kastor", text: "Just went about it the wrong way." },
      { id: "m415", speaker: "detective", text: "But Camille was wronged." },
      { id: "m416", speaker: "kastor", text: "Right. That's why we revealed the truth!" },
      { id: "m417", speaker: "detective", text: "This was really complicated." },
      { id: "m418", speaker: "kastor", text: "Right? Harder than Episode 1?", reaction: "😅" },
      { id: "m419", speaker: "detective", text: "Yeah... definitely." },
      { id: "m420", speaker: "kastor", text: "But you did it!" },
      { id: "m421", speaker: "detective", text: "We did." },
      { id: "m422", speaker: "kastor", text: "Yeah! We did!", reaction: "🎉" },
      {
        id: "m423",
        speaker: "narrator",
        text: "[High five]"
      },
      { id: "m424", speaker: "detective", text: "When's the next case?" },
      { id: "m425", speaker: "kastor", text: "Who knows? One week? Two weeks?" },
      { id: "m426", speaker: "detective", text: "I want to rest..." },
      { id: "m427", speaker: "kastor", text: "Rest well! The next one will be harder!" },
      { id: "m428", speaker: "detective", text: "...Again?" },
      { id: "m429", speaker: "kastor", text: "Of course! They get progressively harder!" },
      { id: "m430", speaker: "detective", text: "(Oh no...)" },
      { id: "m431", speaker: "kastor", text: "It's okay! You're doing great!" },
      { id: "m432", speaker: "kastor", text: "Should we celebrate with chicken?", reaction: "🍗" },
      { id: "m433", speaker: "detective", text: "Chicken again?" },
      { id: "m434", speaker: "kastor", text: "Chicken is always right!" },
      { id: "m435", speaker: "detective", text: "(laughs) ...Can't argue with that.", reaction: "😊" },
      {
        id: "m436",
        speaker: "system",
        text: "✅ EPISODE 2 - COMPLETE",
        celebration: {
          type: "major",
          title: "The Ghost User's Ranking Manipulation",
          caseNumber: 2,
          caseTitle: "The Ghost User's Ranking Manipulation"
        }
      },
    ],
  },
};
