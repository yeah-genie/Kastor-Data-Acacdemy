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
      { id: "m3", speaker: "kastor", text: "대반전이네." },
      { id: "m4", speaker: "detective", text: "뭐가요?" },
      { id: "m5", speaker: "kastor", text: "Dark Horses 우승. 3-0 완승." },
      { id: "m6", speaker: "detective", text: "강한 팀이에요?" },
      { id: "m7", speaker: "kastor", text: "무명팀. 근데 우승 후보를 박살냈어.", reaction: "🤔" },
      { id: "m8", speaker: "detective", text: "대반전이네요..." },
      { id: "m9", speaker: "kastor", text: "응. 근데 뭔가..." },
      { id: "m10", speaker: "kastor", text: "이상한 냄새가 나." },
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
      { id: "m13", speaker: "kastor", text: "Marcus야." },
      { id: "m14", speaker: "detective", text: "또 사건이네요." },
      { id: "m15", speaker: "kastor", text: "가자." },
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
      { id: "m19", speaker: "maya", text: "결승전이 이상해.", characterName: "Maya Zhang" },
      { id: "m20", speaker: "detective", text: "어떻게요?" },
      { id: "m21", speaker: "maya", text: "Phoenix가 질 리 없어.", characterName: "Maya Zhang" },
      { id: "m22", speaker: "maya", text: "10연승 팀이었어. 압도적이었어.", characterName: "Maya Zhang" },
      { id: "m23", speaker: "ryan", text: "데이터가...", characterName: "Ryan Nakamura" },
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
      { id: "m24", speaker: "detective", text: "갑자기 떨어졌네요!" },
      { id: "m25", speaker: "kastor", text: "Day 40... 결승전 날이네." },
      { id: "m26", speaker: "marcus", text: "Exactly.", characterName: "Marcus Chen" },
      { id: "m27", speaker: "maya", text: "커뮤니티에서 승부조작 의혹이...", characterName: "Maya Zhang", reaction: "😰" },
      { id: "m28", speaker: "maya", text: "또 내부자면 어쩌지...", characterName: "Maya Zhang" },
      { id: "m29", speaker: "ryan", text: "저... 아니에요!", characterName: "Ryan Nakamura", reaction: "😨" },
      { id: "m30", speaker: "maya", text: "아니 Ryan! 네 얘기 아니야!", characterName: "Maya Zhang" },
      { id: "m31", speaker: "marcus", text: "Calm down, everyone.", characterName: "Marcus Chen" },
      { id: "m32", speaker: "marcus", text: "That's why I called you.", characterName: "Marcus Chen" },
      { id: "m33", speaker: "marcus", text: "조사해줘. 제발.", characterName: "Marcus Chen" },
      { id: "m34", speaker: "kastor", text: "데이터부터 보자." },
      { id: "m35", speaker: "narrator", text: "[Door opens]" },
      { id: "m36", speaker: "camille", text: "도와드릴게요.", characterName: "Camille Beaumont" },
      { id: "m37", speaker: "detective", text: "Camille! 오래간만이에요!" },
      { id: "m38", speaker: "camille", text: "(미소) 네.", characterName: "Camille Beaumont" },
      { id: "m39", speaker: "camille", text: "데이터 준비했어요.", characterName: "Camille Beaumont" },
    ],
    autoAdvance: { nextNode: "jake_interview_intro", delay: 800 },
  },

  // Scene 2: Jake Interview
  jake_interview_intro: {
    id: "jake_interview_intro",
    phase: "stage1",
    messages: [
      { id: "m40", speaker: "kastor", text: "먼저 Phoenix 팀 주장이랑 얘기해보자." },
      { id: "m41", speaker: "detective", text: "Jake Morrison?" },
      { id: "m42", speaker: "kastor", text: "응. 전화해볼게." },
      { id: "m43", speaker: "narrator", text: "[Calling Jake 'Blaze' Morrison...]" },
    ],
    autoAdvance: { nextNode: "jake_interview", delay: 500 },
  },

  jake_interview: {
    id: "jake_interview",
    phase: "stage1",
    messages: [
      { id: "m44", speaker: "jake", text: "Hello?", characterName: "Jake 'Blaze' Morrison" },
      { id: "m45", speaker: "detective", text: "Jake, this is the detective investigating the finals." },
      { id: "m46", speaker: "jake", text: "...Finally.", characterName: "Jake Morrison", reaction: "😔" },
      { id: "m47", speaker: "jake", text: "우린... 3개월 준비했어요.", characterName: "Jake Morrison" },
      { id: "m48", speaker: "jake", text: "매일 12시간씩. 전략, 팀워크, 전부.", characterName: "Jake Morrison" },
      { id: "m49", speaker: "jake", text: "예선 10연승이었어요!", characterName: "Jake Morrison" },
      { id: "m50", speaker: "detective", text: "결승에서 무슨 일이 있었나요?" },
      { id: "m51", speaker: "jake", text: "...이상했어요.", characterName: "Jake Morrison" },
      { id: "m52", speaker: "jake", text: "제 손이 제 손이 아닌 것 같았어요.", characterName: "Jake Morrison", reaction: "😰" },
      { id: "m53", speaker: "jake", text: "스킬이 안 나가고, 타이밍이 어긋나고...", characterName: "Jake Morrison" },
      { id: "m54", speaker: "jake", text: "팀원들 전부 똑같았어요.", characterName: "Jake Morrison" },
      { id: "m55", speaker: "kastor", text: "Dark Horses는?" },
      { id: "m56", speaker: "jake", text: "(분노) 완벽했어요!", characterName: "Jake Morrison", reaction: "😡" },
      { id: "m57", speaker: "jake", text: "우리가 뭘 해도 바로 카운터!", characterName: "Jake Morrison" },
      { id: "m58", speaker: "jake", text: "마치... 대본이 있는 것 같았어요!", characterName: "Jake Morrison" },
      { id: "m59", speaker: "detective", text: "대본?" },
      { id: "m60", speaker: "jake", text: "리허설한 것처럼 정확했어요.", characterName: "Jake Morrison" },
      { id: "m61", speaker: "jake", text: "...승부조작 맞죠?", characterName: "Jake Morrison" },
      { id: "m62", speaker: "detective", text: "확인해볼게요." },
      { id: "m63", speaker: "jake", text: "제발... 우리 억울해요.", characterName: "Jake Morrison", reaction: "😢" },
      { id: "m64", speaker: "jake", text: "(목소리 떨림)", characterName: "Jake Morrison" },
      { id: "m65", speaker: "jake", text: "증명해주세요. 우리 실력이 없어서 진 게 아니라는 걸.", characterName: "Jake Morrison" },
      { id: "m66", speaker: "detective", text: "...최선을 다할게요." },
      {
        id: "m67",
        speaker: "system",
        text: "🎉 Testimony Recorded!",
        celebration: {
          type: "mini",
          title: "Victim testimony obtained",
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
      { id: "m69", speaker: "kastor", text: "126경기 데이터." },
      { id: "m70", speaker: "detective", text: "많네요..." },
      { id: "m71", speaker: "kastor", text: "뭐가 이상한지 찾아봐." },
      { id: "m72", speaker: "detective", text: "어떻게요?" },
      { id: "m73", speaker: "kastor", text: "직접 봐. 느낌이 올 거야.", reaction: "👀" },
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
      { id: "m76", speaker: "detective", text: "이 3경기가 완전 이상해요!" },
      { id: "m77", speaker: "kastor", text: "왜?" },
      { id: "m78", speaker: "detective", text: "Phoenix는 갑자기 초보처럼..." },
      { id: "m79", speaker: "detective", text: "Dark Horses는 프로를 넘어서..." },
      { id: "m80", speaker: "kastor", text: "좋아. 그럼 왜 그럴까?" },
      { id: "m81", speaker: "detective", text: "...조작?", reaction: "🤔" },
      { id: "m82", speaker: "kastor", text: "증거는?" },
      { id: "m83", speaker: "detective", text: "아직..." },
      { id: "m84", speaker: "kastor", text: "찾아봐." },
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
      { id: "m86", speaker: "kastor", text: "타임라인을 확인해보자." },
      { id: "m87", speaker: "detective", text: "뭘 찾는 거예요?" },
      { id: "m88", speaker: "kastor", text: "변화. 갑작스러운 변화." },
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
      { id: "m89", speaker: "detective", text: "Harrison이 Day 38에..." },
      { id: "m90", speaker: "kastor", text: "..." },
      { id: "m91", speaker: "detective", text: "수상하지 않아요?" },
      { id: "m92", speaker: "kastor", text: "타이밍은... 그래.", reaction: "🤔" },
      { id: "m93", speaker: "kastor", text: "근데 타이밍만으로는 부족해." },
      { id: "m94", speaker: "detective", text: "더 찾아야겠네요." },
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
      { id: "m96", speaker: "kastor", text: "베팅 데이터를 봐야겠어." },
      { id: "m97", speaker: "detective", text: "베팅이요?" },
      { id: "m98", speaker: "kastor", text: "응. 승부조작이면 누군가 베팅으로 돈을 벌었을 거야." },
      { id: "m99", speaker: "detective", text: "어떻게 구하죠?" },
      { id: "m100", speaker: "kastor", text: "베팅 플랫폼에 연락해볼게." },
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
      { id: "m110", speaker: "detective", text: "급격히 바뀌었어요!" },
      { id: "m111", speaker: "kastor", text: "누군가 결과를 알았어.", reaction: "🎯" },
      { id: "m112", speaker: "detective", text: "어떻게 알 수 있죠?" },
      { id: "m113", speaker: "kastor", text: "계정을 찾아봐야 해." },
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
      { id: "m116", speaker: "detective", text: "'F'로 시작하네요!" },
      { id: "m117", speaker: "kastor", text: "패턴이야. 의도적인.", reaction: "🎯" },
      { id: "m118", speaker: "detective", text: "F가 뭘까요?" },
      { id: "m119", speaker: "kastor", text: "...모르겠어." },
      { id: "m120", speaker: "detective", text: "계정 추적할 수 있어요?" },
      { id: "m121", speaker: "kastor", text: "해보자." },
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
      { id: "m122", speaker: "detective", text: "전부 막혀있어요!", reaction: "😰" },
      { id: "m123", speaker: "kastor", text: "프로의 솜씨야." },
      { id: "m124", speaker: "detective", text: "근데 03:00 AM..." },
      { id: "m125", speaker: "kastor", text: "응. 패턴이 있어." },
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
      { id: "m128", speaker: "kastor", text: "Dark Horses 팀원들을 인터뷰해야겠어." },
      { id: "m129", speaker: "detective", text: "누구부터요?" },
      { id: "m130", speaker: "kastor", text: "Alex Torres. 신입 프로게이머." },
      { id: "m131", speaker: "detective", text: "Alex...?" },
      { id: "m132", speaker: "kastor", text: "왜?" },
      { id: "m133", speaker: "detective", text: "...아는 이름이에요." },
    ],
    autoAdvance: { nextNode: "alex_interview", delay: 800 },
  },

  // Scene 6: Alex Interview
  alex_interview: {
    id: "alex_interview",
    phase: "stage3",
    messages: [
      { id: "m134", speaker: "narrator", text: "[Video call connecting...]" },
      { id: "m135", speaker: "alex", text: "Hello? ...어?", characterName: "Alex 'Shadow' Torres" },
      { id: "m136", speaker: "detective", text: "Alex!" },
      { id: "m137", speaker: "alex", text: "탐정님?! 와... 오래간만이에요!", characterName: "Alex Torres", reaction: "😊" },
      { id: "m138", speaker: "kastor", text: "너희 아는 사이야?" },
      { id: "m139", speaker: "detective", text: "Ghost User 사건 때 만났어요." },
      { id: "m140", speaker: "alex", text: "그때 도와주셔서... 프로 됐어요!", characterName: "Alex Torres" },
      { id: "m141", speaker: "detective", text: "축하해요!" },
      { id: "m142", speaker: "alex", text: "(미소 → 어두워짐)", characterName: "Alex Torres" },
      { id: "m143", speaker: "alex", text: "...결승전 때문이죠?", characterName: "Alex Torres", reaction: "😔" },
      { id: "m144", speaker: "detective", text: "네." },
      { id: "m145", speaker: "alex", text: "저도... 이상하다고 생각했어요.", characterName: "Alex Torres" },
      { id: "m146", speaker: "detective", text: "뭐가요?" },
      { id: "m147", speaker: "alex", text: "너무 쉬웠어요.", characterName: "Alex Torres" },
      { id: "m148", speaker: "alex", text: "Phoenix는 프로 최강팀인데...", characterName: "Alex Torres" },
      { id: "m149", speaker: "alex", text: "제가 이기는 게... 말이 안 돼요.", characterName: "Alex Torres" },
      { id: "m150", speaker: "alex", text: "처음엔 기뻤어요. '내가 잘하나보다!'", characterName: "Alex Torres" },
      { id: "m151", speaker: "alex", text: "근데... 보면 볼수록 이상했어요.", characterName: "Alex Torres", reaction: "🤔" },
      { id: "m152", speaker: "kastor", text: "어떻게?" },
      { id: "m153", speaker: "alex", text: "Phoenix가 실수를 너무 많이 했어요.", characterName: "Alex Torres" },
      { id: "m154", speaker: "alex", text: "프로가 할 수 없는 실수들...", characterName: "Alex Torres" },
      { id: "m155", speaker: "alex", text: "그리고 코치님이...", characterName: "Alex Torres" },
      { id: "m156", speaker: "detective", text: "Harrison?" },
      { id: "m157", speaker: "alex", text: "'전략대로만 하면 된다'고 했어요.", characterName: "Alex Torres" },
      { id: "m158", speaker: "alex", text: "그 전략이... 너무 완벽했어요.", characterName: "Alex Torres" },
      { id: "m159", speaker: "alex", text: "Phoenix가 뭘 할지 다 맞췄어요.", characterName: "Alex Torres" },
      { id: "m160", speaker: "detective", text: "어떻게요?" },
      { id: "m161", speaker: "alex", text: "...모르겠어요.", characterName: "Alex Torres" },
      { id: "m162", speaker: "alex", text: "(망설임)", characterName: "Alex Torres" },
      { id: "m163", speaker: "alex", text: "아, 그리고...", characterName: "Alex Torres" },
      { id: "m164", speaker: "alex", text: "코치님이 누군가랑 메시지 주고받는 거 봤어요.", characterName: "Alex Torres" },
      { id: "m165", speaker: "detective", text: "누구요?" },
      { id: "m166", speaker: "alex", text: "화면에 'F'만 잠깐 보였어요.", characterName: "Alex Torres" },
      { id: "m167", speaker: "alex", text: "암호화된 것 같았어요.", characterName: "Alex Torres" },
      { id: "m168", speaker: "kastor", text: "F...", reaction: "🎯" },
      { id: "m169", speaker: "alex", text: "저... 괜찮을까요?", characterName: "Alex Torres", reaction: "😰" },
      { id: "m170", speaker: "alex", text: "승부조작이면... 저도 팀이었으니까...", characterName: "Alex Torres" },
      { id: "m171", speaker: "detective", text: "괜찮아요. 당신은 몰랐잖아요." },
      { id: "m172", speaker: "alex", text: "...고맙습니다.", characterName: "Alex Torres" },
      { id: "m173", speaker: "alex", text: "Ghost User 때도 도와주시고...", characterName: "Alex Torres" },
      { id: "m174", speaker: "alex", text: "또 도와주시네요.", characterName: "Alex Torres", reaction: "😢" },
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
      { id: "m176", speaker: "kastor", text: "이제 Harrison이랑 얘기해보자." },
      { id: "m177", speaker: "detective", text: "의심해요?" },
      { id: "m178", speaker: "kastor", text: "...응." },
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
      { id: "m189", speaker: "harrison", text: "Did they? (웃음)", characterName: "Harrison Webb" },
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
      { id: "m214", speaker: "kastor", text: "뭔가 이상하지 않았어?" },
      { id: "m215", speaker: "detective", text: "Harrison이..." },
      { id: "m216", speaker: "kastor", text: "거짓말을 찾아봐!" },
      { id: "m217", speaker: "system", text: "📊 HARRISON'S CONTRADICTIONS" },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Statement Analysis - Suspicious Elements",
      data: {
        entries: [
          { statement: "'you see' 5번 반복", analysis: "말버릇 (긴장 신호)", severity: "△ Minor" },
          { statement: "'at home' → 'training facility'", analysis: "장소 모순!", severity: "🚨 Major" },
          { statement: "'last year finals'", analysis: "Phoenix는 신생팀 (1년차)", severity: "🚨🚨 Critical" },
          { statement: "실수 인정 후 급하게 정정", analysis: "거짓말 감춤", severity: "🚨 Major" },
        ],
      },
    }],
    autoAdvance: { nextNode: "statement_result", delay: 2500 },
  },

  statement_result: {
    id: "statement_result",
    phase: "stage3",
    messages: [
      { id: "m218", speaker: "detective", text: "집이라고 했다가 시설이라고 했어요!" },
      { id: "m219", speaker: "detective", text: "그리고 작년 결승? Phoenix는 신생팀인데!", reaction: "🎯" },
      { id: "m220", speaker: "kastor", text: "오! 잘 잡았네!" },
      { id: "m221", speaker: "detective", text: "거짓말하고 있어요!" },
      { id: "m222", speaker: "kastor", text: "응. 하지만..." },
      { id: "m223", speaker: "kastor", text: "이것만으론 증거가 부족해." },
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
      { id: "m224", speaker: "kastor", text: "서버 로그를 봐야겠어." },
      { id: "m225", speaker: "detective", text: "Camille한테 부탁할까요?" },
      { id: "m226", speaker: "kastor", text: "응." },
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
      { id: "m230", speaker: "detective", text: "Phoenix만 지연이!", reaction: "😱" },
      { id: "m231", speaker: "kastor", text: "47-51ms... 미묘해." },
      { id: "m232", speaker: "detective", text: "게이머한테는요?" },
      { id: "m233", speaker: "kastor", text: "치명적이야. 프로는 5ms 차이도 느껴." },
      { id: "m234", speaker: "detective", text: "누가 했을까요?" },
      { id: "m235", speaker: "kastor", text: "고위 권한이 필요해." },
    ],
    autoAdvance: { nextNode: "ryan_suspicion", delay: 800 },
  },

  ryan_suspicion: {
    id: "ryan_suspicion",
    phase: "stage3",
    messages: [
      { id: "m236", speaker: "narrator", text: "[Marcus's office]" },
      { id: "m237", speaker: "maya", text: "(문 열고) Ryan!", characterName: "Maya Zhang" },
      { id: "m238", speaker: "ryan", text: "...네?", characterName: "Ryan Nakamura" },
      { id: "m239", speaker: "maya", text: "서버 권한 있지?", characterName: "Maya Zhang" },
      { id: "m240", speaker: "ryan", text: "네, 있지만...", characterName: "Ryan Nakamura" },
      { id: "m241", speaker: "maya", text: "또 너야?!", characterName: "Maya Zhang", reaction: "😡" },
      { id: "m242", speaker: "ryan", text: "아니에요! 저 아니에요!", characterName: "Ryan Nakamura", reaction: "😨" },
      { id: "m243", speaker: "detective", text: "Ryan, 그날 뭐 했어요?" },
      { id: "m244", speaker: "ryan", text: "경기 모니터링이요! 제 업무예요!", characterName: "Ryan Nakamura" },
      { id: "m245", speaker: "ryan", text: "지연 같은 거 안 했어요!", characterName: "Ryan Nakamura" },
      { id: "m246", speaker: "maya", text: "Shadow 사건 때도...", characterName: "Maya Zhang" },
      { id: "m247", speaker: "ryan", text: "그건 제가 잘못했어요! 인정해요!", characterName: "Ryan Nakamura", reaction: "😢" },
      { id: "m248", speaker: "ryan", text: "근데 이번은 진짜 아니에요!", characterName: "Ryan Nakamura" },
      { id: "m249", speaker: "narrator", text: "[Camille enters]" },
      { id: "m250", speaker: "camille", text: "Ryan 아니에요.", characterName: "Camille Beaumont" },
      { id: "m251", speaker: "camille", text: "로그 확인했어요. 클린합니다.", characterName: "Camille Beaumont" },
      { id: "m252", speaker: "maya", text: "그럼 누구야?", characterName: "Maya Zhang" },
      { id: "m253", speaker: "camille", text: "...CTO급 권한이 필요해요.", characterName: "Camille Beaumont" },
      { id: "m254", speaker: "camille", text: "Marcus님급이 아니면 불가능합니다.", characterName: "Camille Beaumont" },
      { id: "m255", speaker: "narrator", text: "[Silence]" },
      { id: "m256", speaker: "marcus", text: "...나 아니야.", characterName: "Marcus Chen" },
      { id: "m257", speaker: "camille", text: "알아요. 당신도 클린합니다.", characterName: "Camille Beaumont" },
      { id: "m258", speaker: "camille", text: "하지만 누군가는 그 권한을 썼어요.", characterName: "Camille Beaumont" },
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
      { id: "m260", speaker: "camille", text: "(메시지) 이거 봐요.", characterName: "Camille Beaumont" },
      { id: "m261", speaker: "system", text: "📧 Additional file received" },
      { id: "m262", speaker: "kastor", text: "뭐야?" },
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
      { id: "m264", speaker: "detective", text: "F와 H!", reaction: "🎯" },
      { id: "m265", speaker: "kastor", text: "그리고 03:00..." },
      { id: "m266", speaker: "detective", text: "베팅 계정 생성 시각이랑 같아요!" },
      { id: "m267", speaker: "kastor", text: "F-PRIME... F로 시작하는 계정들..." },
      { id: "m268", speaker: "detective", text: "연결돼요!" },
      { id: "m269", speaker: "narrator", text: "[🎵 SOUND: Puzzle pieces connecting]" },
      { id: "m270", speaker: "kastor", text: "F가 총괄이고, H가..." },
      { id: "m271", speaker: "detective", text: "Harrison!" },
      { id: "m272", speaker: "kastor", text: "하지만 F는..." },
      { id: "m273", speaker: "detective", text: "누구죠?" },
      { id: "m274", speaker: "kastor", text: "...모르겠어.", reaction: "🤔" },
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
      { id: "m277", speaker: "detective", text: "증거를 정리해볼게요." },
      { id: "m278", speaker: "kastor", text: "응. 뭐가 있어?" },
      { id: "m279", speaker: "system", text: "📊 EVIDENCE SUMMARY" },
    ],
    dataVisualizations: [{
      type: "log",
      title: "Evidence Chain - Harrison Investigation",
      data: {
        entries: [
          { evidence: "1. Phoenix 퍼포먼스 급락", strength: "✓ Strong", status: "Confirmed" },
          { evidence: "2. Harrison 합류 (Day 38)", strength: "△ Timing", status: "Suspicious" },
          { evidence: "3. 베팅 패턴 F-계정", strength: "✓ Strong", status: "Pattern Found" },
          { evidence: "4. 베팅 계정 익명", strength: "✗ Weak", status: "Untraceable" },
          { evidence: "5. 서버 지연 로그", strength: "✓ Strong", status: "Confirmed" },
          { evidence: "6. 서버 권한자 불명", strength: "✗ Weak", status: "Encrypted" },
          { evidence: "7. F-H 암호 메시지", strength: "△ Medium", status: "Partial" },
          { evidence: "8. Harrison 거짓말", strength: "△ Medium", status: "Contradictions" },
          { evidence: "---", strength: "---", status: "---" },
          { evidence: "CONCLUSION", strength: "심증 100%", status: "물증 부족" },
        ],
      },
    }],
    autoAdvance: { nextNode: "evidence_result", delay: 2500 },
  },

  evidence_result: {
    id: "evidence_result",
    phase: "stage4",
    messages: [
      { id: "m281", speaker: "kastor", text: "심증은 있는데...", reaction: "😔" },
      { id: "m282", speaker: "detective", text: "물증이 약해요." },
      { id: "m283", speaker: "kastor", text: "Harrison은 너무 치밀해." },
      { id: "m284", speaker: "kastor", text: "그리고 F는... 손도 못 대." },
      { id: "m285", speaker: "detective", text: "그럼 어떻게 해요?" },
      { id: "m286", speaker: "kastor", text: "(한숨)" },
      { id: "m287", speaker: "kastor", text: "...모르겠어." },
      { id: "m288", speaker: "detective", text: "Kastor?" },
      { id: "m289", speaker: "kastor", text: "진짜 모르겠어." },
      { id: "m290", speaker: "kastor", text: "이런 적 처음이야.", reaction: "😞" },
      { id: "m291", speaker: "narrator", text: "[Silence]" },
      { id: "m292", speaker: "detective", text: "그럼... 져야 하나요?" },
      { id: "m293", speaker: "kastor", text: "아니." },
      { id: "m294", speaker: "kastor", text: "할 수 있는 건 해야지." },
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
      { id: "m297", speaker: "marcus", text: "결론이 뭐야?", characterName: "Marcus Chen" },
      { id: "m298", speaker: "detective", text: "Harrison이 의심됩니다." },
      { id: "m299", speaker: "detective", text: "베팅 계정, 서버 지연, 암호 메시지..." },
      { id: "m300", speaker: "detective", text: "전부 연결됩니다." },
      { id: "m301", speaker: "marcus", text: "증거는?", characterName: "Marcus Chen" },
      { id: "m302", speaker: "detective", text: "...부족합니다.", reaction: "😔" },
      { id: "m303", speaker: "maya", text: "부족하다고?", characterName: "Maya Zhang" },
      { id: "m304", speaker: "detective", text: "법적으로 증명하기엔..." },
      { id: "m305", speaker: "detective", text: "Harrison이 너무 치밀하게 준비했어요." },
      { id: "m306", speaker: "narrator", text: "[Jake joins video call]" },
      { id: "m307", speaker: "jake", text: "그럼... 이대로 끝나는 거예요?", characterName: "Jake Morrison", reaction: "😡" },
      { id: "m308", speaker: "jake", text: "제 억울함은... 그냥?", characterName: "Jake Morrison" },
      { id: "m309", speaker: "detective", text: "죄송해요." },
      { id: "m310", speaker: "jake", text: "...", characterName: "Jake Morrison" },
      { id: "m311", speaker: "jake", text: "탐정님도 못 하면 누가 해요?!", characterName: "Jake Morrison", reaction: "😢" },
      { id: "m312", speaker: "narrator", text: "[Call disconnected]" },
      { id: "m313", speaker: "marcus", text: "...어떻게 하지?", characterName: "Marcus Chen" },
    ],
    question: {
      id: "q_final_decision",
      text: "🎯 DIFFICULT DECISION: How should we handle this?",
      choices: [
        {
          id: "choice_public",
          text: "A) 의혹 공개 - Expose suspicions to community",
          isCorrect: true,
          nextNode: "ending_public",
          feedback: "Truth matters. Even without perfect proof.",
          pointsAwarded: 20,
        },
        {
          id: "choice_internal",
          text: "B) 내부 처리 - Internal resolution, rematch",
          isCorrect: true,
          nextNode: "ending_internal",
          feedback: "Protect the company, partial justice.",
          pointsAwarded: 20,
        },
        {
          id: "choice_continue",
          text: "C) 조사 계속 - Keep investigating, find proof",
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
      { id: "m314", speaker: "detective", text: "커뮤니티에 공개해요." },
      { id: "m315", speaker: "marcus", text: "하지만...", characterName: "Marcus Chen" },
      { id: "m316", speaker: "detective", text: "사람들은 알 권리가 있어요." },
      { id: "m317", speaker: "narrator", text: "[2 weeks later]" },
      { id: "m318", speaker: "kastor", text: "Harrison 평판이 추락했대." },
      { id: "m319", speaker: "detective", text: "법적 조치는?" },
      { id: "m320", speaker: "kastor", text: "없어. 증거 부족이래." },
      { id: "m321", speaker: "detective", text: "Jake는?" },
      { id: "m322", speaker: "kastor", text: "여전히 불만족이야. 당연하지.", reaction: "😔" },
    ],
    autoAdvance: { nextNode: "epilogue_intro", delay: 1000 },
  },

  // Ending B: Internal Resolution
  ending_internal: {
    id: "ending_internal",
    phase: "stage4",
    messages: [
      { id: "m323", speaker: "detective", text: "내부에서 처리해요." },
      { id: "m324", speaker: "marcus", text: "Harrison 계약 해지, Phoenix 재경기?", characterName: "Marcus Chen" },
      { id: "m325", speaker: "detective", text: "네." },
      { id: "m326", speaker: "narrator", text: "[2 weeks later]" },
      { id: "m327", speaker: "kastor", text: "Harrison은 조용히 해고됐어." },
      { id: "m328", speaker: "detective", text: "Jake는?" },
      { id: "m329", speaker: "kastor", text: "부분적으로 만족했대. 하지만...", reaction: "😔" },
      { id: "m330", speaker: "kastor", text: "진실은 묻혔어." },
    ],
    autoAdvance: { nextNode: "epilogue_intro", delay: 1000 },
  },

  // Ending C: Continue Investigation (Canon)
  ending_continue: {
    id: "ending_continue",
    phase: "stage4",
    messages: [
      { id: "m331", speaker: "detective", text: "포기 안 해요." },
      { id: "m332", speaker: "marcus", text: "하지만...", characterName: "Marcus Chen" },
      { id: "m333", speaker: "detective", text: "증거 찾을 거예요. 꼭.", reaction: "💪" },
      { id: "m334", speaker: "kastor", text: "..." },
      { id: "m335", speaker: "kastor", text: "좋아. 나도 같이." },
      { id: "m336", speaker: "maya", text: "우리도 돕겠어.", characterName: "Maya Zhang" },
      { id: "m337", speaker: "camille", text: "저도요.", characterName: "Camille Beaumont" },
      { id: "m338", speaker: "ryan", text: "저도 돕고 싶어요!", characterName: "Ryan Nakamura" },
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
      { id: "m341", speaker: "kastor", text: "Harrison은 계약 해지됐대." },
      { id: "m342", speaker: "detective", text: "증거 없이?" },
      { id: "m343", speaker: "kastor", text: "Marcus가 조용히 처리했어." },
      { id: "m344", speaker: "kastor", text: "Jake는... 재경기 제안 거부했대." },
      { id: "m345", speaker: "detective", text: "왜요?" },
      { id: "m346", speaker: "kastor", text: "진실이 밝혀지지 않았으니까.", reaction: "😔" },
      { id: "m347", speaker: "detective", text: "..." },
      { id: "m348", speaker: "narrator", text: "[Silence]" },
      { id: "m349", speaker: "detective", text: "F는 누구일까요?" },
      { id: "m350", speaker: "kastor", text: "모르겠어." },
      { id: "m351", speaker: "kastor", text: "하지만... 언젠가 알게 될 거야." },
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
      { id: "m354", speaker: "detective", text: "또 사건이에요!", reaction: "😱" },
      { id: "m355", speaker: "kastor", text: "...바빠지는군." },
      { id: "m356", speaker: "kastor", text: "가자." },
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
      { id: "m358", speaker: "fixer", text: "(변조된 음성) Perfect.", characterName: "???" },
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
