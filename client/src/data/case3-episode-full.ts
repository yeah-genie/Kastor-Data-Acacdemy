import type { StoryNode } from "./episode-types";

/**
 * Episode 3: The Perfect Victory
 * Demo Finale - Match-fixing investigation with incomplete resolution
 *
 * New Characters:
 * - Jake "Blaze" Morrison: Pro gamer, victim
 * - Alex "Shadow" Torres: Pro gamer, returning from Episode 2
 * - Coach Harrison Webb: Mastermind, cunning manipulator
 * - Luna Park: Betting platform operator
 * - The Fixer: Mystery figure (teaser only)
 *
 * Story Structure:
 * - ACT 1: The Upset (Opening, Tournament anomaly, Jake interview)
 * - ACT 2: Deep Dive (Data analysis, Timeline, Betting patterns)
 * - ACT 3: The Web (Alex interview, Harrison interview, Server logs, Encrypted messages)
 * - FINAL ACT: Incomplete Victory (Evidence compilation, Difficult decision)
 * - EPILOGUE: The Fixer (Setup for Episode 4)
 */

export const case3EpisodeFull: Record<string, StoryNode> = {
  // ============================================
  // ACT 1: THE UPSET
  // ============================================

  start: {
    id: "start",
    phase: "stage1",
    messages: [
      {
        id: "m1",
        speaker: "narrator",
        text: "[Setting: Detective Office. Two weeks after Episode 2.]",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
      },
      { id: "m2", speaker: "kastor", text: "(reading newspaper)", reaction: "📰" },
        { id: "m3", speaker: "kastor", text: "Quite the upset." },
        { id: "m4", speaker: "detective", text: "What happened?" },
        { id: "m5", speaker: "kastor", text: "Dark Horses won. 3-0 sweep." },
        { id: "m6", speaker: "detective", text: "Are they that strong?" },
        { id: "m7", speaker: "kastor", text: "Unknown team. But they crushed the favourite.", reaction: "🤔" },
        { id: "m8", speaker: "detective", text: "That is a massive upset..." },
        { id: "m9", speaker: "kastor", text: "Yeah. Something feels off." },
        { id: "m10", speaker: "kastor", text: "There's a strange smell in the data." },
    ],
    autoAdvance: { nextNode: "email_arrives", delay: 800 },
  },

  email_arrives: {
    id: "email_arrives",
    phase: "stage1",
    messages: [
      { id: "m11", speaker: "system", text: "📧 NEW EMAIL" },
      {
        id: "m12",
        speaker: "system",
        text: "📧 NEW EMAIL",
        email: {
          from: "Marcus Chen (CTO, Legend Arena) <marcus.chen@legendarena.com>",
          subject: "Urgent - Need investigation",
          body: `Hello detectives!

Something's wrong with our tournament.

The finals results don't make sense.
Community is raising match-fixing allegations.

Please come.

- Marcus`
        }
      },
        { id: "m13", speaker: "kastor", text: "Marcus is calling." },
        { id: "m14", speaker: "detective", text: "Sounds like another case." },
        { id: "m15", speaker: "kastor", text: "Let's move." },
      {
        id: "m16",
        speaker: "system",
        text: "🎉 New Case!",
        celebration: {
          type: "mini",
          title: "Episode 3: The Perfect Victory",
          points: 10
        }
      },
    ],
    autoAdvance: { nextNode: "legend_arena_meeting", delay: 1000 },
  },

  // Scene 1: Legend Arena Meeting
  legend_arena_meeting: {
    id: "legend_arena_meeting",
    phase: "stage1",
    messages: [
      {
        id: "m17",
        speaker: "narrator",
        text: "[Legend Arena Headquarters - Conference Room]",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80"
      },
      { id: "m18", speaker: "marcus", text: "Thanks for coming.", characterName: "Marcus Chen" },
        { id: "m19", speaker: "marcus", text: "The finals were... off.", characterName: "Marcus Chen" },
        { id: "m20", speaker: "maya", text: "There's no way Phoenix should have lost.", characterName: "Maya Zhang" },
        { id: "m21", speaker: "detective", text: "Show me." },
        { id: "m22", speaker: "maya", text: "Ten straight wins in qualifiers. They were unstoppable.", characterName: "Maya Zhang" },
        { id: "m23", speaker: "ryan", text: "The data backs it up...", characterName: "Ryan Nakamura" },
    ],
    dataVisualizations: [{
      type: "graph",
      title: "Phoenix Rising - Performance (40 Days)",
      data: {
        labels: ["Day 1-10", "Day 11-20", "Day 21-30", "Day 31-39", "Day 40"],
        datasets: [{
          label: "Win Rate %",
          data: [65, 72, 78, 85, 0],
        }]
      }
    }],
    autoAdvance: { nextNode: "data_discussion", delay: 2000 },
  },

  data_discussion: {
    id: "data_discussion",
    phase: "stage1",
    messages: [
        { id: "m24", speaker: "detective", text: "That drop is brutal." },
        { id: "m25", speaker: "kastor", text: "Day 40... the finals." },
      { id: "m26", speaker: "marcus", text: "Exactly.", characterName: "Marcus Chen" },
        { id: "m27", speaker: "maya", text: "The community is already screaming match-fixing...", characterName: "Maya Zhang", reaction: "😰" },
        { id: "m28", speaker: "maya", text: "What if it's another insider?", characterName: "Maya Zhang" },
        { id: "m29", speaker: "ryan", text: "It wasn't me!", characterName: "Ryan Nakamura", reaction: "😨" },
        { id: "m30", speaker: "maya", text: "Ryan, I didn't mean you.", characterName: "Maya Zhang" },
        { id: "m31", speaker: "marcus", text: "Hey—focus.", characterName: "Marcus Chen" },
        { id: "m32", speaker: "marcus", text: "That's why I called you.", characterName: "Marcus Chen" },
        { id: "m33", speaker: "marcus", text: "Please investigate. We need answers.", characterName: "Marcus Chen" },
        { id: "m34", speaker: "kastor", text: "Let's start with the data." },
        { id: "m35", speaker: "narrator", text: "[Door opens]" },
        { id: "m36", speaker: "camille", text: "I can help.", characterName: "Camille Beaumont" },
        { id: "m37", speaker: "detective", text: "Camille! Long time no see." },
        { id: "m38", speaker: "camille", text: "(smiles) Likewise.", characterName: "Camille Beaumont" },
        { id: "m39", speaker: "camille", text: "I pulled the records you asked for.", characterName: "Camille Beaumont" },
    ],
    autoAdvance: { nextNode: "jake_interview_intro", delay: 800 },
  },

  // Scene 2: Jake Interview
  jake_interview_intro: {
    id: "jake_interview_intro",
    phase: "stage1",
    messages: [
        { id: "m40", speaker: "kastor", text: "First, let's speak with Phoenix's captain." },
        { id: "m41", speaker: "detective", text: "Jake Morrison?" },
        { id: "m42", speaker: "kastor", text: "Yeah. I'll patch him in." },
        { id: "m43", speaker: "narrator", text: "[Dialling Jake “Blaze” Morrison...]" },
    ],
    autoAdvance: { nextNode: "jake_interview", delay: 500 },
  },

  jake_interview: {
    id: "jake_interview",
    phase: "stage1",
    messages: [
        { id: "m44", speaker: "jake", text: "Hello?", characterName: "Jake 'Blaze' Morrison" },
        { id: "m45", speaker: "detective", text: "Jake, we're investigating the finals." },
        { id: "m46", speaker: "jake", text: "...Finally.", characterName: "Jake Morrison", reaction: "😔" },
        { id: "m47", speaker: "jake", text: "We trained for three months straight.", characterName: "Jake Morrison" },
        { id: "m48", speaker: "jake", text: "Twelve hours a day. Strategy, teamwork, everything.", characterName: "Jake Morrison" },
        { id: "m49", speaker: "jake", text: "Ten straight wins in qualifiers!", characterName: "Jake Morrison" },
        { id: "m50", speaker: "detective", text: "What happened in the finals?" },
        { id: "m51", speaker: "jake", text: "...Something was wrong.", characterName: "Jake Morrison" },
        { id: "m52", speaker: "jake", text: "My hands didn't feel like my own.", characterName: "Jake Morrison", reaction: "😰" },
        { id: "m53", speaker: "jake", text: "Skills wouldn't trigger. My timing slipped.", characterName: "Jake Morrison" },
        { id: "m54", speaker: "jake", text: "All my teammates said the same thing.", characterName: "Jake Morrison" },
        { id: "m55", speaker: "kastor", text: "What about Dark Horses?" },
        { id: "m56", speaker: "jake", text: "(furious) They were perfect!", characterName: "Jake Morrison", reaction: "😡" },
        { id: "m57", speaker: "jake", text: "No matter what we tried, they countered instantly!", characterName: "Jake Morrison" },
        { id: "m58", speaker: "jake", text: "It was like... they had a script!", characterName: "Jake Morrison" },
        { id: "m59", speaker: "detective", text: "A script?" },
        { id: "m60", speaker: "jake", text: "Every move felt rehearsed. Too precise.", characterName: "Jake Morrison" },
        { id: "m61", speaker: "jake", text: "It was rigged, wasn't it?", characterName: "Jake Morrison" },
        { id: "m62", speaker: "detective", text: "We're going to find out." },
        { id: "m63", speaker: "jake", text: "Please... we feel robbed.", characterName: "Jake Morrison", reaction: "😢" },
        { id: "m64", speaker: "jake", text: "(voice shaking)", characterName: "Jake Morrison" },
        { id: "m65", speaker: "jake", text: "Prove we didn't lose because we weren't good enough.", characterName: "Jake Morrison" },
        { id: "m66", speaker: "detective", text: "We'll do everything we can." },
      {
        id: "m67",
        speaker: "system",
          text: "🎉 Testimony recorded!",
        celebration: {
          type: "mini",
            title: "Victim testimony logged",
          points: 15
        }
      },
    ],
    autoAdvance: { nextNode: "act2_intro", delay: 1000 },
  },

  // ============================================
  // ACT 2: DEEP DIVE
  // ============================================

  act2_intro: {
    id: "act2_intro",
    phase: "stage2",
    messages: [
      {
        id: "m68",
        speaker: "system",
        text: "📊 ACT 2: DEEP DIVE"
      },
        { id: "m69", speaker: "kastor", text: "We've got data from 126 matches." },
        { id: "m70", speaker: "detective", text: "That's... a lot." },
        { id: "m71", speaker: "kastor", text: "Find what doesn't belong." },
        { id: "m72", speaker: "detective", text: "Any tips?" },
        { id: "m73", speaker: "kastor", text: "Trust your gut. You'll feel it.", reaction: "👀" },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Match Performance Data (Selected)",
      data: {
        entries: [
          { match: "Prelim-1", winRate: "52%", apm: "280", reaction: "250ms", status: "Normal ✓" },
          { match: "Prelim-2", winRate: "48%", apm: "290", reaction: "240ms", status: "Normal ✓" },
          { match: "Semi-1", winRate: "51%", apm: "300", reaction: "245ms", status: "Normal ✓" },
          { match: "Finals-1", winRate: "0%", apm: "180", reaction: "380ms", status: "⚠️ OUTLIER" },
          { match: "Finals-2", winRate: "0%", apm: "175", reaction: "395ms", status: "⚠️ OUTLIER" },
          { match: "Finals-3", winRate: "0%", apm: "170", reaction: "410ms", status: "⚠️ OUTLIER" },
        ],
      },
    }],
    autoAdvance: { nextNode: "outlier_result", delay: 2000 },
  },

  outlier_result: {
    id: "outlier_result",
    phase: "stage2",
    messages: [
        { id: "m76", speaker: "detective", text: "These three finals matches are completely abnormal!" },
        { id: "m77", speaker: "kastor", text: "Why?" },
        { id: "m78", speaker: "detective", text: "Phoenix suddenly played like beginners..." },
        { id: "m79", speaker: "detective", text: "Dark Horses played beyond top-tier pro level." },
        { id: "m80", speaker: "kastor", text: "So what's your theory?" },
        { id: "m81", speaker: "detective", text: "...Match-fixing?", reaction: "🤔" },
        { id: "m82", speaker: "kastor", text: "Proof?" },
        { id: "m83", speaker: "detective", text: "Not yet." },
        { id: "m84", speaker: "kastor", text: "Then keep looking." },
      {
        id: "m85",
        speaker: "system",
        text: "🎉 Pattern Recognized!",
        celebration: {
          type: "mini",
          title: "Abnormal matches identified",
          points: 20
        }
      },
    ],
    autoAdvance: { nextNode: "timeline_analysis", delay: 800 },
  },

  // Scene 4: Timeline Analysis
  timeline_analysis: {
    id: "timeline_analysis",
    phase: "stage2",
    messages: [
        { id: "m86", speaker: "kastor", text: "Let's examine the timeline." },
        { id: "m87", speaker: "detective", text: "What am I scanning for?" },
        { id: "m88", speaker: "kastor", text: "Sudden change. Anything out of place." },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Timeline - Day 1 to Day 40",
      data: {
        entries: [
          { date: "Day 1-39", event: "Phoenix training hours: Increasing ✓" },
          { date: "Day 1-39", event: "Phoenix sleep quality: Normal ✓" },
          { date: "Day 1-39", event: "Equipment changes: None ✓" },
          { date: "Day 1-39", event: "Game patches: None ✓" },
          { date: "Day 38", event: "⚠️ Harrison Webb joins Dark Horses" },
          { date: "Day 40", event: "Finals - Phoenix 0:3 Dark Horses" },
        ],
      },
    }],
    autoAdvance: { nextNode: "timeline_discussion", delay: 2000 },
  },

  timeline_discussion: {
    id: "timeline_discussion",
    phase: "stage2",
    messages: [
        { id: "m89", speaker: "detective", text: "Harrison joined on Day 38..." },
        { id: "m90", speaker: "kastor", text: "..." },
        { id: "m91", speaker: "detective", text: "That's suspicious, right?" },
        { id: "m92", speaker: "kastor", text: "The timing fits.", reaction: "🤔" },
        { id: "m93", speaker: "kastor", text: "But timing alone isn't evidence." },
        { id: "m94", speaker: "detective", text: "Then we gather more." },
      {
        id: "m95",
        speaker: "system",
        text: "🎉 Timeline Analyzed!",
        celebration: {
          type: "mini",
          title: "Suspicious timing identified",
          points: 20
        }
      },
    ],
    autoAdvance: { nextNode: "betting_analysis_intro", delay: 800 },
  },

  // Scene 5: Betting Analysis
  betting_analysis_intro: {
    id: "betting_analysis_intro",
    phase: "stage2",
    messages: [
        { id: "m96", speaker: "kastor", text: "Next stop: betting data." },
        { id: "m97", speaker: "detective", text: "Gambling figures?" },
        { id: "m98", speaker: "kastor", text: "If the match was fixed, someone cashed in." },
        { id: "m99", speaker: "detective", text: "Can we get access?" },
        { id: "m100", speaker: "kastor", text: "I'll call the platform." },
      { id: "m101", speaker: "narrator", text: "[Calling Luna Park...]" },
      { id: "m102", speaker: "luna", text: "Luna Park speaking.", characterName: "Luna Park" },
      { id: "m103", speaker: "kastor", text: "This is Detective Kastor. We need betting data." },
      { id: "m104", speaker: "luna", text: "For what?", characterName: "Luna Park" },
      { id: "m105", speaker: "kastor", text: "Legend Arena finals. Match-fixing investigation." },
      { id: "m106", speaker: "luna", text: "...", characterName: "Luna Park" },
      { id: "m107", speaker: "luna", text: "I'll send the data.", characterName: "Luna Park" },
      { id: "m108", speaker: "luna", text: "Numbers don't lie.", characterName: "Luna Park" },
    ],
    autoAdvance: { nextNode: "betting_data", delay: 800 },
  },

  betting_data: {
    id: "betting_data",
    phase: "stage2",
    messages: [
      { id: "m109", speaker: "system", text: "📊 BETTING DATA" },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Betting Flow - Legend Arena Finals",
      data: {
        entries: [
          { phase: "Prelims ~ Semis", phoenix: "80%", darkHorses: "5%" },
          { phase: "Finals -24h", phoenix: "45%", darkHorses: "40%" },
          { phase: "Finals -3h", phoenix: "30%", darkHorses: "60%" },
          { phase: "Finals -1h", phoenix: "25%", darkHorses: "65%" },
        ],
      },
    }],
    autoAdvance: { nextNode: "betting_discussion", delay: 2000 },
  },

  betting_discussion: {
    id: "betting_discussion",
    phase: "stage2",
    messages: [
        { id: "m110", speaker: "detective", text: "The odds swing is ridiculous!" },
        { id: "m111", speaker: "kastor", text: "Someone knew the outcome.", reaction: "🎯" },
        { id: "m112", speaker: "detective", text: "How could they know?" },
        { id: "m113", speaker: "kastor", text: "We trace the accounts." },
      { id: "m114", speaker: "system", text: "📊 BETTING ACCOUNT DATA" },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Betting Accounts - Suspicious Pattern",
      data: {
        entries: [
          { account: "JohnDoe123", amount: "$50", team: "Phoenix", status: "Normal ✓" },
          { account: "GamerFan", amount: "$100", team: "Various", status: "Normal ✓" },
          { account: "Account_F7743", amount: "$50,000", team: "Dark Horses", status: "⚠️ SUSPICIOUS" },
          { account: "Account_F9521", amount: "$30,000", team: "Dark Horses", status: "⚠️ SUSPICIOUS" },
          { account: "Account_F3318", amount: "$75,000", team: "Dark Horses", status: "⚠️ SUSPICIOUS" },
          { account: "Account_F1124", amount: "$45,000", team: "Dark Horses", status: "⚠️ SUSPICIOUS" },
          { account: "Account_F8856", amount: "$60,000", team: "Dark Horses", status: "⚠️ SUSPICIOUS" },
          { account: "---", amount: "Total", team: "$455,000", status: "🚨 PATTERN: F-prefix" },
        ],
      },
    }],
    autoAdvance: { nextNode: "betting_result", delay: 2000 },
  },

  betting_result: {
    id: "betting_result",
    phase: "stage2",
    messages: [
        { id: "m116", speaker: "detective", text: "They all start with 'F'!" },
        { id: "m117", speaker: "kastor", text: "That's deliberate.", reaction: "🎯" },
        { id: "m118", speaker: "detective", text: "What does F stand for?" },
        { id: "m119", speaker: "kastor", text: "No idea yet." },
        { id: "m120", speaker: "detective", text: "Can we trace the accounts?" },
        { id: "m121", speaker: "kastor", text: "Let's try." },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Account Trace Results",
      data: {
        entries: [
          { field: "IP Address", value: "VPN (constantly changing) ❌" },
          { field: "Email", value: "Disposable (protonmail) ❌" },
          { field: "Payment", value: "Cryptocurrency (untraceable) ❌" },
          { field: "Creation Time", value: "All created at 03:00 AM ⚠️" },
        ],
      },
    }],
    autoAdvance: { nextNode: "betting_trace_discussion", delay: 2000 },
  },

  betting_trace_discussion: {
    id: "betting_trace_discussion",
    phase: "stage2",
    messages: [
        { id: "m122", speaker: "detective", text: "Everything's blocked!", reaction: "😰" },
        { id: "m123", speaker: "kastor", text: "Professional work." },
        { id: "m124", speaker: "detective", text: "But every transfer hits at 03:00 AM..." },
        { id: "m125", speaker: "kastor", text: "Yeah. There's a pattern." },
      {
        id: "m126",
        speaker: "system",
        text: "🎉 Betting Pattern Found!",
        celebration: {
          type: "mini",
          title: "Suspicious accounts identified",
          points: 25
        }
      },
    ],
    autoAdvance: { nextNode: "act3_intro", delay: 1000 },
  },

  // ============================================
  // ACT 3: THE WEB
  // ============================================

  act3_intro: {
    id: "act3_intro",
    phase: "stage3",
    messages: [
      {
        id: "m127",
        speaker: "system",
        text: "📊 ACT 3: THE WEB"
      },
        { id: "m128", speaker: "kastor", text: "We need to interview Dark Horses." },
        { id: "m129", speaker: "detective", text: "Who first?" },
        { id: "m130", speaker: "kastor", text: "Alex Torres. The rookie pro." },
      { id: "m131", speaker: "detective", text: "Alex...?" },
        { id: "m132", speaker: "kastor", text: "Why?" },
        { id: "m133", speaker: "detective", text: "...I know that name." },
    ],
    autoAdvance: { nextNode: "alex_interview", delay: 800 },
  },

  // Scene 6: Alex Interview
  alex_interview: {
    id: "alex_interview",
    phase: "stage3",
    messages: [
      { id: "m134", speaker: "narrator", text: "[Video call connecting...]" },
        { id: "m135", speaker: "alex", text: "Hello? ...Wait—", characterName: "Alex 'Shadow' Torres" },
      { id: "m136", speaker: "detective", text: "Alex!" },
        { id: "m137", speaker: "alex", text: "Detective?! Wow... it's been forever!", characterName: "Alex Torres", reaction: "😊" },
        { id: "m138", speaker: "kastor", text: "You two know each other?" },
        { id: "m139", speaker: "detective", text: "We met during the Ghost User case." },
        { id: "m140", speaker: "alex", text: "Thanks to your help... I went pro!", characterName: "Alex Torres" },
        { id: "m141", speaker: "detective", text: "Congratulations!" },
        { id: "m142", speaker: "alex", text: "(smile fades)", characterName: "Alex Torres" },
        { id: "m143", speaker: "alex", text: "This is about the finals, isn't it?", characterName: "Alex Torres", reaction: "😔" },
        { id: "m144", speaker: "detective", text: "Yeah." },
        { id: "m145", speaker: "alex", text: "I thought something was wrong too.", characterName: "Alex Torres" },
        { id: "m146", speaker: "detective", text: "What tipped you off?" },
        { id: "m147", speaker: "alex", text: "It was too easy.", characterName: "Alex Torres" },
        { id: "m148", speaker: "alex", text: "Phoenix is the strongest pro team...", characterName: "Alex Torres" },
        { id: "m149", speaker: "alex", text: "Me beating them doesn't make sense.", characterName: "Alex Torres" },
        { id: "m150", speaker: "alex", text: "At first I was happy. 'Maybe I'm just that good!'", characterName: "Alex Torres" },
        { id: "m151", speaker: "alex", text: "But the more I watched the replay, the stranger it felt.", characterName: "Alex Torres", reaction: "🤔" },
        { id: "m152", speaker: "kastor", text: "How so?" },
        { id: "m153", speaker: "alex", text: "Phoenix kept making mistakes pros don't make.", characterName: "Alex Torres" },
        { id: "m154", speaker: "alex", text: "Over and over.", characterName: "Alex Torres" },
        { id: "m155", speaker: "alex", text: "And Coach...", characterName: "Alex Torres" },
      { id: "m156", speaker: "detective", text: "Harrison?" },
        { id: "m157", speaker: "alex", text: "He kept saying, 'Just follow the strategy.'", characterName: "Alex Torres" },
        { id: "m158", speaker: "alex", text: "The strategy was too perfect.", characterName: "Alex Torres" },
        { id: "m159", speaker: "alex", text: "He predicted every Phoenix play.", characterName: "Alex Torres" },
        { id: "m160", speaker: "detective", text: "How?" },
        { id: "m161", speaker: "alex", text: "...I don't know.", characterName: "Alex Torres" },
        { id: "m162", speaker: "alex", text: "(hesitates)", characterName: "Alex Torres" },
        { id: "m163", speaker: "alex", text: "Oh, and...", characterName: "Alex Torres" },
        { id: "m164", speaker: "alex", text: "I saw him messaging someone.", characterName: "Alex Torres" },
        { id: "m165", speaker: "detective", text: "Who?" },
        { id: "m166", speaker: "alex", text: "I only caught an 'F' on the screen.", characterName: "Alex Torres" },
        { id: "m167", speaker: "alex", text: "It looked encrypted.", characterName: "Alex Torres" },
        { id: "m168", speaker: "kastor", text: "F..." , reaction: "🎯" },
        { id: "m169", speaker: "alex", text: "Am I... going to be okay?", characterName: "Alex Torres", reaction: "😰" },
        { id: "m170", speaker: "alex", text: "If it was match-fixing, I was on the team...", characterName: "Alex Torres" },
        { id: "m171", speaker: "detective", text: "You're innocent. You didn't know." },
        { id: "m172", speaker: "alex", text: "...Thank you.", characterName: "Alex Torres" },
        { id: "m173", speaker: "alex", text: "You helped me with the Ghost User case...", characterName: "Alex Torres" },
        { id: "m174", speaker: "alex", text: "And you're helping me again.", characterName: "Alex Torres", reaction: "😢" },
      {
        id: "m175",
        speaker: "system",
        text: "🎉 Key Witness!",
        celebration: {
          type: "mini",
          title: "Critical testimony obtained",
          points: 30
        }
      },
    ],
    autoAdvance: { nextNode: "harrison_interview_intro", delay: 1000 },
  },

  // Scene 7: Harrison Interview
  harrison_interview_intro: {
    id: "harrison_interview_intro",
    phase: "stage3",
    messages: [
        { id: "m176", speaker: "kastor", text: "Time to talk to Harrison." },
        { id: "m177", speaker: "detective", text: "You think he's involved?" },
        { id: "m178", speaker: "kastor", text: "...Yeah." },
      { id: "m179", speaker: "narrator", text: "[Calling Coach Harrison Webb...]" },
    ],
    autoAdvance: { nextNode: "harrison_interview", delay: 500 },
  },

  harrison_interview: {
    id: "harrison_interview",
    phase: "stage3",
    messages: [
      { id: "m180", speaker: "harrison", text: "Good afternoon, detectives.", characterName: "Coach Harrison Webb" },
      { id: "m181", speaker: "detective", text: "Coach, how did you prepare for Phoenix?" },
      { id: "m182", speaker: "harrison", text: "Standard analysis, you see.", characterName: "Harrison Webb" },
      { id: "m183", speaker: "harrison", text: "I've been coaching for 15 years.", characterName: "Harrison Webb" },
      { id: "m184", speaker: "harrison", text: "Pattern recognition is my specialty.", characterName: "Harrison Webb" },
      { id: "m185", speaker: "detective", text: "But you joined 2 days before finals." },
      { id: "m186", speaker: "harrison", text: "Yes. Sufficient time, you see.", characterName: "Harrison Webb" },
      { id: "m187", speaker: "harrison", text: "Experience trumps talent.", characterName: "Harrison Webb" },
      { id: "m188", speaker: "kastor", text: "Players said you predicted their moves perfectly." },
        { id: "m189", speaker: "harrison", text: "Did they? *chuckles*", characterName: "Harrison Webb" },
      { id: "m190", speaker: "harrison", text: "Phoenix has patterns, you see.", characterName: "Harrison Webb" },
      { id: "m191", speaker: "harrison", text: "Good teams develop habits.", characterName: "Harrison Webb" },
      { id: "m192", speaker: "harrison", text: "I simply read them.", characterName: "Harrison Webb" },
      { id: "m193", speaker: "detective", text: "Too perfectly, though." },
      { id: "m194", speaker: "harrison", text: "Is perfection suspicious?", characterName: "Harrison Webb" },
      { id: "m195", speaker: "harrison", text: "I'm a professional, you see.", characterName: "Harrison Webb" },
      { id: "m196", speaker: "kastor", text: "What did you do the night before finals?" },
      { id: "m197", speaker: "harrison", text: "Reviewed strategies at home.", characterName: "Harrison Webb" },
      { id: "m198", speaker: "harrison", text: "Dark Horses' training facility, you see.", characterName: "Harrison Webb" },
      { id: "m199", speaker: "harrison", text: "Prepared counter-tactics.", characterName: "Harrison Webb" },
      { id: "m200", speaker: "detective", text: "Did you watch Phoenix's previous games?" },
      { id: "m201", speaker: "harrison", text: "Of course. All 12 matches, you see.", characterName: "Harrison Webb" },
      { id: "m202", speaker: "harrison", text: "Especially their finals last year.", characterName: "Harrison Webb" },
      { id: "m203", speaker: "kastor", text: "..." },
      { id: "m204", speaker: "detective", text: "Last year?" },
      { id: "m205", speaker: "harrison", text: "Yes, their performance was— wait.", characterName: "Harrison Webb" },
      { id: "m206", speaker: "harrison", text: "I meant... this year's matches.", characterName: "Harrison Webb" },
      { id: "m207", speaker: "harrison", text: "My apologies. Long day.", characterName: "Harrison Webb" },
      { id: "m208", speaker: "detective", text: "..." },
      { id: "m209", speaker: "harrison", text: "Is there anything else?", characterName: "Harrison Webb" },
      { id: "m210", speaker: "harrison", text: "I have training scheduled.", characterName: "Harrison Webb" },
      { id: "m211", speaker: "detective", text: "No, that's all." },
      { id: "m212", speaker: "harrison", text: "Good day.", characterName: "Harrison Webb" },
      { id: "m213", speaker: "narrator", text: "[Call ended]" },
    ],
    autoAdvance: { nextNode: "statement_analysis", delay: 800 },
  },

  // Statement Analysis
  statement_analysis: {
    id: "statement_analysis",
    phase: "stage3",
    messages: [
        { id: "m214", speaker: "kastor", text: "Didn't that feel off to you?" },
        { id: "m215", speaker: "detective", text: "Harrison was..." },
        { id: "m216", speaker: "kastor", text: "Call out the lies!" },
      { id: "m217", speaker: "system", text: "📊 HARRISON'S CONTRADICTIONS" },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Statement Analysis - Suspicious Elements",
      data: {
        entries: [
            { statement: "'you see' repeated 5 times", analysis: "Verbal tic (stress indicator)", severity: "△ Minor" },
            { statement: "'at home' → 'training facility'", analysis: "Location contradiction", severity: "🚨 Major" },
            { statement: "'last year finals'", analysis: "Phoenix is a first-year team", severity: "🚨🚨 Critical" },
            { statement: "Quick correction after slip", analysis: "Attempt to cover lie", severity: "🚨 Major" },
        ],
      },
    }],
    autoAdvance: { nextNode: "statement_result", delay: 2500 },
  },

  statement_result: {
    id: "statement_result",
    phase: "stage3",
    messages: [
        { id: "m218", speaker: "detective", text: "He said 'at home' then switched to 'training facility'!" },
        { id: "m219", speaker: "detective", text: "And 'last year's finals'? Phoenix didn't exist last year!", reaction: "🎯" },
        { id: "m220", speaker: "kastor", text: "Nice catch." },
        { id: "m221", speaker: "detective", text: "He's lying." },
        { id: "m222", speaker: "kastor", text: "Yeah, but..." },
        { id: "m223", speaker: "kastor", text: "We still need hard evidence." },
      {
        id: "m224",
        speaker: "system",
        text: "🎉 Lies Detected!",
        celebration: {
          type: "mini",
          title: "Contradictions found",
          points: 30
        }
      },
    ],
    autoAdvance: { nextNode: "server_log_intro", delay: 800 },
  },

  // Scene 8: Server Logs
  server_log_intro: {
    id: "server_log_intro",
    phase: "stage3",
    messages: [
        { id: "m224", speaker: "kastor", text: "We need server logs." },
        { id: "m225", speaker: "detective", text: "Should we ask Camille?" },
        { id: "m226", speaker: "kastor", text: "Do it." },
      { id: "m227", speaker: "narrator", text: "[Message to Camille...]" },
      { id: "m228", speaker: "system", text: "📧 Data received from Camille" },
    ],
    autoAdvance: { nextNode: "server_log_data", delay: 500 },
  },

  server_log_data: {
    id: "server_log_data",
    phase: "stage3",
    messages: [
      { id: "m229", speaker: "system", text: "💻 GAME SERVER LOG" },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Day 40 - Finals Match Server Log",
      data: {
        entries: [
          { time: "03:12:47", event: "Match Start" },
          { time: "03:12:50", event: "⚠️ Latency injection: Phoenix +47ms" },
          { time: "03:45:23", event: "⚠️ Latency injection: Phoenix +51ms" },
          { time: "04:18:51", event: "⚠️ Latency injection: Phoenix +49ms" },
          { time: "04:22:15", event: "Match End" },
          { time: "04:22:18", event: "Latency removed" },
          { time: "---", event: "Authorization: [ENCRYPTED] 🚨" },
        ],
      },
    }],
    autoAdvance: { nextNode: "server_log_discussion", delay: 2000 },
  },

  server_log_discussion: {
    id: "server_log_discussion",
    phase: "stage3",
    messages: [
        { id: "m230", speaker: "detective", text: "Only Phoenix got the latency spike!", reaction: "😱" },
        { id: "m231", speaker: "kastor", text: "47-51ms... subtle." },
        { id: "m232", speaker: "detective", text: "Matters to pros?" },
        { id: "m233", speaker: "kastor", text: "Absolutely. Five milliseconds can ruin a play." },
        { id: "m234", speaker: "detective", text: "Who could inject that?" },
        { id: "m235", speaker: "kastor", text: "Needs top-tier privileges." },
    ],
    autoAdvance: { nextNode: "ryan_suspicion", delay: 800 },
  },

  ryan_suspicion: {
    id: "ryan_suspicion",
    phase: "stage3",
    messages: [
      { id: "m236", speaker: "narrator", text: "[Marcus's office]" },
        { id: "m237", speaker: "maya", text: "(bursting in) Ryan!", characterName: "Maya Zhang" },
        { id: "m238", speaker: "ryan", text: "...Yeah?", characterName: "Ryan Nakamura" },
        { id: "m239", speaker: "maya", text: "You have server access, right?", characterName: "Maya Zhang" },
        { id: "m240", speaker: "ryan", text: "I do, but—", characterName: "Ryan Nakamura" },
        { id: "m241", speaker: "maya", text: "Was it you again?!", characterName: "Maya Zhang", reaction: "😡" },
        { id: "m242", speaker: "ryan", text: "No! It wasn't me!", characterName: "Ryan Nakamura", reaction: "😨" },
        { id: "m243", speaker: "detective", text: "Ryan, what were you doing that night?" },
        { id: "m244", speaker: "ryan", text: "Watching the match! That's my job!", characterName: "Ryan Nakamura" },
        { id: "m245", speaker: "ryan", text: "I didn't inject latency or anything!", characterName: "Ryan Nakamura" },
        { id: "m246", speaker: "maya", text: "We trusted you once and—", characterName: "Maya Zhang" },
        { id: "m247", speaker: "ryan", text: "I messed up back then, I admit it!", characterName: "Ryan Nakamura", reaction: "😢" },
        { id: "m248", speaker: "ryan", text: "But this time I'm clean!", characterName: "Ryan Nakamura" },
      { id: "m249", speaker: "narrator", text: "[Camille enters]" },
        { id: "m250", speaker: "camille", text: "It wasn't Ryan.", characterName: "Camille Beaumont" },
        { id: "m251", speaker: "camille", text: "I checked the logs. He's clean.", characterName: "Camille Beaumont" },
        { id: "m252", speaker: "maya", text: "Then who?", characterName: "Maya Zhang" },
        { id: "m253", speaker: "camille", text: "You need CTO-level credentials to pull that off.", characterName: "Camille Beaumont" },
        { id: "m254", speaker: "camille", text: "Only Marcus or someone with his access.", characterName: "Camille Beaumont" },
      { id: "m255", speaker: "narrator", text: "[Silence]" },
        { id: "m256", speaker: "marcus", text: "...It wasn't me.", characterName: "Marcus Chen" },
        { id: "m257", speaker: "camille", text: "I know. You're clean too.", characterName: "Camille Beaumont" },
        { id: "m258", speaker: "camille", text: "But someone used that level of access.", characterName: "Camille Beaumont" },
      {
        id: "m259",
        speaker: "system",
        text: "🎉 Server Log Found!",
        celebration: {
          type: "mini",
          title: "Critical evidence discovered",
          points: 30
        }
      },
    ],
    autoAdvance: { nextNode: "encrypted_message_intro", delay: 1000 },
  },

  // Scene 9: Encrypted Messages (HIGHLIGHT)
  encrypted_message_intro: {
    id: "encrypted_message_intro",
    phase: "stage3",
    messages: [
        { id: "m260", speaker: "camille", text: "(message) Check this out.", characterName: "Camille Beaumont" },
        { id: "m261", speaker: "system", text: "📧 Additional file received" },
        { id: "m262", speaker: "kastor", text: "What is it?" },
    ],
    autoAdvance: { nextNode: "encrypted_message_data", delay: 500 },
  },

  encrypted_message_data: {
    id: "encrypted_message_data",
    phase: "stage3",
    messages: [
      { id: "m263", speaker: "system", text: "🔐 ENCRYPTED MESSAGE LOG" },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Encrypted Communication Log",
      data: {
        entries: [
          { date: "Day 38, 03:00:15", from: "F-PRIME", to: "H-SEVEN", content: "[AES-256 ENCRYPTED]" },
          { date: "Day 39, 03:00:42", from: "H-SEVEN", to: "F-PRIME", content: "[AES-256 ENCRYPTED]" },
          { date: "Day 40, 03:01:08", from: "F-PRIME", to: "H-SEVEN", content: "[PARTIALLY DECRYPTED]" },
          { date: "---", from: "Content", to: "Preview", content: "...stage is set...proceed...wire transfer..." },
        ],
      },
    }],
    autoAdvance: { nextNode: "encrypted_message_discussion", delay: 2000 },
  },

  encrypted_message_discussion: {
    id: "encrypted_message_discussion",
    phase: "stage3",
    messages: [
        { id: "m264", speaker: "detective", text: "F and H!", reaction: "🎯" },
        { id: "m265", speaker: "kastor", text: "And 03:00 AM on the dot..." },
        { id: "m266", speaker: "detective", text: "Same timing as the betting accounts!" },
        { id: "m267", speaker: "kastor", text: "F-PRIME... all those F-prefix accounts..." },
        { id: "m268", speaker: "detective", text: "It's all connected!" },
      { id: "m269", speaker: "narrator", text: "[🎵 SOUND: Puzzle pieces connecting]" },
        { id: "m270", speaker: "kastor", text: "F orchestrates, H executes..." },
        { id: "m271", speaker: "detective", text: "Harrison!" },
        { id: "m272", speaker: "kastor", text: "But F is still..." },
        { id: "m273", speaker: "detective", text: "Who are they?" },
        { id: "m274", speaker: "kastor", text: "...No idea yet.", reaction: "🤔" },
      {
        id: "m275",
        speaker: "system",
        text: "🎉 MAJOR DISCOVERY!",
        celebration: {
          type: "major",
          title: "The Fixer Exists",
          points: 40
        }
      },
    ],
    autoAdvance: { nextNode: "final_act_intro", delay: 1000 },
  },

  // ============================================
  // FINAL ACT: INCOMPLETE VICTORY
  // ============================================

  final_act_intro: {
    id: "final_act_intro",
    phase: "stage4",
    messages: [
      {
        id: "m276",
        speaker: "system",
        text: "📊 FINAL ACT: INCOMPLETE VICTORY"
      },
        { id: "m277", speaker: "detective", text: "Let's line up what we have." },
        { id: "m278", speaker: "kastor", text: "Alright. Hit me." },
      { id: "m279", speaker: "system", text: "📊 EVIDENCE SUMMARY" },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Evidence Chain - Harrison Investigation",
      data: {
        entries: [
            { evidence: "1. Phoenix performance collapse", strength: "✓ Strong", status: "Confirmed" },
            { evidence: "2. Harrison joins (Day 38)", strength: "△ Timing", status: "Suspicious" },
            { evidence: "3. F-prefix betting pattern", strength: "✓ Strong", status: "Pattern found" },
            { evidence: "4. Anonymous betting accounts", strength: "✗ Weak", status: "Untraceable" },
            { evidence: "5. Server latency logs", strength: "✓ Strong", status: "Confirmed" },
            { evidence: "6. High-level access usage", strength: "✗ Weak", status: "Encrypted trail" },
            { evidence: "7. F↔H encrypted messages", strength: "△ Medium", status: "Partial decrypt" },
            { evidence: "8. Harrison inconsistencies", strength: "△ Medium", status: "Contradictions" },
            { evidence: "---", strength: "---", status: "---" },
            { evidence: "Conclusion", strength: "Circumstantial 100%", status: "Hard proof missing" },
        ],
      },
    }],
    autoAdvance: { nextNode: "evidence_result", delay: 2500 },
  },

  evidence_result: {
    id: "evidence_result",
    phase: "stage4",
    messages: [
        { id: "m281", speaker: "kastor", text: "We've got motive and pattern...", reaction: "😔" },
        { id: "m282", speaker: "detective", text: "But the hard evidence is thin." },
        { id: "m283", speaker: "kastor", text: "Harrison covered his tracks too well." },
        { id: "m284", speaker: "kastor", text: "And F is still untouchable." },
        { id: "m285", speaker: "detective", text: "So what do we do?" },
        { id: "m286", speaker: "kastor", text: "(sighs)" },
        { id: "m287", speaker: "kastor", text: "...I don't know." },
        { id: "m288", speaker: "detective", text: "Kastor?" },
        { id: "m289", speaker: "kastor", text: "I really don't know." },
        { id: "m290", speaker: "kastor", text: "This is a first for me.", reaction: "😞" },
        { id: "m291", speaker: "narrator", text: "[Silence]" },
        { id: "m292", speaker: "detective", text: "So... do we lose?" },
        { id: "m293", speaker: "kastor", text: "No." },
        { id: "m294", speaker: "kastor", text: "We do what we can." },
      {
        id: "m295",
        speaker: "system",
        text: "🎉 Evidence Compiled!",
        celebration: {
          type: "mini",
          title: "Investigation complete (incomplete proof)",
          points: 25
        }
      },
    ],
    autoAdvance: { nextNode: "final_meeting", delay: 1000 },
  },

  // Scene 11: Final Meeting
  final_meeting: {
    id: "final_meeting",
    phase: "stage4",
    messages: [
      {
        id: "m296",
        speaker: "narrator",
        text: "[Marcus's office - Full team meeting]",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80"
      },
        { id: "m297", speaker: "marcus", text: "Bottom line?", characterName: "Marcus Chen" },
        { id: "m298", speaker: "detective", text: "Everything points to Harrison." },
        { id: "m299", speaker: "detective", text: "The betting accounts, the latency, the encrypted messages..." },
        { id: "m300", speaker: "detective", text: "They're all connected." },
        { id: "m301", speaker: "marcus", text: "Do we have proof?", characterName: "Marcus Chen" },
        { id: "m302", speaker: "detective", text: "...Not enough to stand up in court.", reaction: "😔" },
        { id: "m303", speaker: "maya", text: "Not enough?", characterName: "Maya Zhang" },
        { id: "m304", speaker: "detective", text: "Nothing admissible yet." },
        { id: "m305", speaker: "detective", text: "Harrison covered his tracks." },
        { id: "m306", speaker: "narrator", text: "[Jake joins the call]" },
        { id: "m307", speaker: "jake", text: "So... we just let this go?", characterName: "Jake Morrison", reaction: "😡" },
        { id: "m308", speaker: "jake", text: "Do we just stay quiet while our work gets trashed?", characterName: "Jake Morrison" },
        { id: "m309", speaker: "detective", text: "I'm sorry." },
        { id: "m310", speaker: "jake", text: "...", characterName: "Jake Morrison" },
        { id: "m311", speaker: "jake", text: "If even you can't fix this, who can?!", characterName: "Jake Morrison", reaction: "😢" },
        { id: "m312", speaker: "narrator", text: "[Call disconnected]" },
        { id: "m313", speaker: "marcus", text: "...What do we do?", characterName: "Marcus Chen" },
    ],
    question: {
      id: "q_final_decision",
      text: "🎯 DIFFICULT DECISION: How should we handle this?",
      choices: [
        {
          id: "choice_public",
            text: "A) Go public - Share suspicions with the community",
          isCorrect: true,
          nextNode: "ending_public",
          feedback: "Truth matters. Even without perfect proof.",
          pointsAwarded: 20,
        },
        {
          id: "choice_internal",
            text: "B) Handle it internally - Rematch & quiet dismissal",
          isCorrect: true,
          nextNode: "ending_internal",
          feedback: "Protect the company, partial justice.",
          pointsAwarded: 20,
        },
        {
          id: "choice_continue",
            text: "C) Keep digging - Hold off until we find proof",
          isCorrect: true,
          nextNode: "ending_continue",
          feedback: "Patience and determination. The truth will come.",
          pointsAwarded: 30,
        },
      ],
    },
  },

  // Ending A: Public Exposure
  ending_public: {
    id: "ending_public",
    phase: "stage4",
    messages: [
        { id: "m314", speaker: "detective", text: "We go public." },
        { id: "m315", speaker: "marcus", text: "Are you sure?", characterName: "Marcus Chen" },
        { id: "m316", speaker: "detective", text: "People deserve to know what happened." },
      { id: "m317", speaker: "narrator", text: "[2 weeks later]" },
        { id: "m318", speaker: "kastor", text: "Harrison's reputation tanked." },
        { id: "m319", speaker: "detective", text: "Any legal action?" },
        { id: "m320", speaker: "kastor", text: "None. They said lack of evidence." },
        { id: "m321", speaker: "detective", text: "How's Jake?" },
        { id: "m322", speaker: "kastor", text: "Still angry. Can't blame him.", reaction: "😔" },
    ],
    autoAdvance: { nextNode: "epilogue_intro", delay: 1000 },
  },

  // Ending B: Internal Resolution
  ending_internal: {
    id: "ending_internal",
    phase: "stage4",
    messages: [
        { id: "m323", speaker: "detective", text: "We handle it internally." },
        { id: "m324", speaker: "marcus", text: "Terminate Harrison, offer Phoenix a rematch?", characterName: "Marcus Chen" },
        { id: "m325", speaker: "detective", text: "Yeah." },
      { id: "m326", speaker: "narrator", text: "[2 weeks later]" },
        { id: "m327", speaker: "kastor", text: "Harrison was quietly fired." },
        { id: "m328", speaker: "detective", text: "And Jake?" },
        { id: "m329", speaker: "kastor", text: "Says he's half-satisfied. But...", reaction: "😔" },
        { id: "m330", speaker: "kastor", text: "The truth stayed buried." },
    ],
    autoAdvance: { nextNode: "epilogue_intro", delay: 1000 },
  },

  // Ending C: Continue Investigation (Canon)
  ending_continue: {
    id: "ending_continue",
    phase: "stage4",
    messages: [
        { id: "m331", speaker: "detective", text: "We don't give up." },
        { id: "m332", speaker: "marcus", text: "Even now?", characterName: "Marcus Chen" },
        { id: "m333", speaker: "detective", text: "We'll find the proof. I promise.", reaction: "💪" },
        { id: "m334", speaker: "kastor", text: "..." },
        { id: "m335", speaker: "kastor", text: "Alright. I'm in." },
        { id: "m336", speaker: "maya", text: "Count me in too.", characterName: "Maya Zhang" },
        { id: "m337", speaker: "camille", text: "Same here.", characterName: "Camille Beaumont" },
        { id: "m338", speaker: "ryan", text: "I want to help!", characterName: "Ryan Nakamura" },
    ],
    autoAdvance: { nextNode: "epilogue_intro", delay: 1000 },
  },

  // ============================================
  // EPILOGUE: THE FIXER
  // ============================================

  epilogue_intro: {
    id: "epilogue_intro",
    phase: "stage5",
    messages: [
      {
        id: "m339",
        speaker: "system",
        text: "📊 EPILOGUE: THE FIXER"
      },
      {
        id: "m340",
        speaker: "narrator",
        text: "[2 weeks later - Detective Office]",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
      },
        { id: "m341", speaker: "kastor", text: "Harrison's contract was terminated." },
        { id: "m342", speaker: "detective", text: "Without proof?" },
        { id: "m343", speaker: "kastor", text: "Marcus handled it quietly." },
        { id: "m344", speaker: "kastor", text: "Jake turned down the rematch." },
        { id: "m345", speaker: "detective", text: "Why?" },
        { id: "m346", speaker: "kastor", text: "Because the truth never surfaced.", reaction: "😔" },
      { id: "m347", speaker: "detective", text: "..." },
      { id: "m348", speaker: "narrator", text: "[Silence]" },
        { id: "m349", speaker: "detective", text: "Who is F, anyway?" },
        { id: "m350", speaker: "kastor", text: "No idea." },
        { id: "m351", speaker: "kastor", text: "But we will find out." },
    ],
    autoAdvance: { nextNode: "next_case_teaser", delay: 1000 },
  },

  next_case_teaser: {
    id: "next_case_teaser",
    phase: "stage5",
    messages: [
      { id: "m352", speaker: "system", text: "📧 URGENT MESSAGE" },
      {
        id: "m353",
        speaker: "system",
        text: "📧 URGENT MESSAGE",
        email: {
          from: "Marcus Chen <marcus.chen@legendarena.com>",
          subject: "CRITICAL! DATABASE BREACH!",
          body: `Help! Our database was breached!

Player data, algorithms... all stolen!

This is worse than before.

Please come immediately!

- Marcus`
        }
      },
        { id: "m354", speaker: "detective", text: "Another case already!", reaction: "😱" },
        { id: "m355", speaker: "kastor", text: "...Busy nights ahead." },
        { id: "m356", speaker: "kastor", text: "Let's move." },
    ],
    autoAdvance: { nextNode: "fixer_reveal", delay: 1000 },
  },

  fixer_reveal: {
    id: "fixer_reveal",
    phase: "stage5",
    messages: [
      {
        id: "m357",
        speaker: "narrator",
        text: "[Location: Unknown - Dark room]",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
      },
        { id: "m358", speaker: "fixer", text: "(distorted voice) Perfect.", characterName: "???" },
      { id: "m359", speaker: "fixer", text: "They took the bait.", characterName: "???" },
      { id: "m360", speaker: "fixer", text: "Phase 3 complete.", characterName: "The Fixer" },
      { id: "m361", speaker: "fixer", text: "Initiating Phase 4.", characterName: "The Fixer" },
    ],
    dataVisualizations: [{
      type: "log",
      title: "[CLASSIFIED MONITOR]",
      data: {
        entries: [
          { field: "Target", value: "Legend Arena Database" },
          { field: "Objective", value: "Extraction" },
          { field: "Status", value: "Agent Deploying..." },
          { field: "Codename", value: "- The Fixer" },
        ],
      },
    }],
    autoAdvance: { nextNode: "episode_complete", delay: 3000 },
  },

  episode_complete: {
    id: "episode_complete",
    phase: "stage5",
    messages: [
      {
        id: "m362",
        speaker: "system",
        text: "🎬 TO BE CONTINUED...",
        celebration: {
          type: "major",
          title: "Episode 3 Complete (Demo Finale)",
          caseNumber: 3,
          caseTitle: "The Perfect Victory"
        }
      },
    ],
  },
};
