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
    | "log_filtering";
  id: string;
  data: any;
}

export interface Message {
  id: string;
  speaker: "detective" | "kastor" | "maya" | "kaito" | "lukas" | "diego" | "system" | "narrator";
  text: string;
  avatar?: string;
  celebration?: {
    type: "mini" | "major";
    title: string;
    points?: number;
  };
  timestamp?: string;
  email?: {
    from: string;
    subject: string;
    body: string;
  };
  image?: string; // Unsplash image for narrator actions
  soundEffect?: string; // Sound effect to play
}

export interface DataVisualization {
  type: "chart" | "table" | "log";
  title: string;
  data: any;
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
      pointsAwarded?: number;
    }[];
  };
  autoAdvance?: {
    nextNode: string;
    delay: number;
  };
}

// Character names updated:
// Ryan Nakamura → Kaito Nakamura (Japanese-American, 25)
// Daniel Schmidt → Lukas Schmidt (German, 32)
// Alex Torres → Diego Torres (Latino, 19)
// Maya Chen → Maya Zhang (Chinese-American, 28)

export const case1EpisodeFinal: Record<string, StoryNode> = {
  // STAGE 0: INTRODUCTION
  start: {
    id: "start",
    phase: "stage1",
    messages: [
      { id: "m2", speaker: "system", text: "Data Detective Academy - Case #001" },
      {
        id: "m3",
        speaker: "narrator",
        text: "[Setting: A run-down detective office. Dust on the desk. Papers everywhere.]",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
      },
      { id: "m4", speaker: "kastor", text: "Zzzzz..." },
      {
        id: "m5",
        speaker: "narrator",
        text: "[Door opens - You enter]",
        soundEffect: "door-open"
      },
    ],
    autoAdvance: { nextNode: "office_intro", delay: 1000 },
  },

  office_intro: {
    id: "office_intro",
    phase: "stage1",
    messages: [
      { id: "m6", speaker: "detective", text: "...Is this the right place?" },
      { id: "m7", speaker: "kastor", text: "Hm?" },
      {
        id: "m8",
        speaker: "narrator",
        text: "[Kastor wakes up and stretches]",
        soundEffect: "yawn"
      },
      { id: "m9", speaker: "kastor", text: "Oh! New person?" },
      { id: "m10", speaker: "detective", text: "I'm the new detective." },
      { id: "m11", speaker: "kastor", text: "Detective? You don't look like one." },
      { id: "m12", speaker: "detective", text: "It's my first day!" },
      { id: "m13", speaker: "kastor", text: "I can tell. It's written all over your face." },
      { id: "m14", speaker: "detective", text: "(This guy...)" },
      { id: "m15", speaker: "kastor", text: "I'm Kastor. Your partner!" },
      { id: "m16", speaker: "detective", text: "Nice to meet you, I guess?" },
      { id: "m17", speaker: "kastor", text: "Name?" },
    ],
    autoAdvance: { nextNode: "name_input", delay: 500 },
  },

  name_input: {
    id: "name_input",
    phase: "stage1",
    messages: [
      { id: "m18", speaker: "detective", text: "[Your name]" },
      { id: "m19", speaker: "kastor", text: "Cool name! Spell it right?" },
      { id: "m20", speaker: "detective", text: "I just typed it myself, so yes." },
      { id: "m21", speaker: "kastor", text: "Good! No refunds on name tags." },
      { id: "m22", speaker: "detective", text: "What?" },
      { id: "m23", speaker: "kastor", text: "Kidding~ But seriously, we're broke." },
      { id: "m24", speaker: "detective", text: "(What kind of agency is this...)" },
      {
        id: "m25",
        speaker: "system",
        text: "🎉 Partnership formed!",
        celebration: { type: "mini", title: "Partnership formed!", points: 5 }
      },
    ],
    autoAdvance: { nextNode: "email_arrives", delay: 800 },
  },

  // SCENE 1: FIRST CASE
  email_arrives: {
    id: "email_arrives",
    phase: "stage1",
    messages: [
      { id: "m26", speaker: "narrator", text: "[DING! - Email notification]", soundEffect: "notification" },
      { id: "m27", speaker: "kastor", text: "Ooh! Mail!" },
      { id: "m28", speaker: "detective", text: "Already?" },
      { id: "m29", speaker: "kastor", text: "Yep! You're lucky! No cases = boring." },
      { id: "m30", speaker: "detective", text: "Is that... good luck?" },
      { id: "m31", speaker: "kastor", text: "Obviously! Now click it!" },
      {
        id: "m33",
        speaker: "system",
        text: "",
        email: {
          from: "Maya Zhang <maya.zhang@legendarena.com>",
          subject: "🚨 URGENT! Need Help!",
          body: `Hello detectives! I'm Maya, director of Legend Arena.

We have a HUGE problem! 😰

Our character Shadow's win rate jumped from 50% to 85% in ONE DAY!

We didn't patch him! I have no idea why this happened!

Players are furious! The community is exploding!

If we lose player trust... the game is finished!

PLEASE HELP US!

- Maya Zhang
Director, Legend Arena`
        }
      },
    ],
    autoAdvance: { nextNode: "first_hypothesis", delay: 1000 },
  },

  first_hypothesis: {
    id: "first_hypothesis",
    phase: "stage1",
    messages: [
      { id: "m42", speaker: "kastor", text: "Ooh! Game case! Fun!" },
      { id: "m43", speaker: "detective", text: "Shadow got way stronger overnight..." },
      { id: "m44", speaker: "kastor", text: "35% jump! That's insane!" },
      { id: "m45", speaker: "detective", text: "Is that a lot?" },
      { id: "m46", speaker: "kastor", text: "It's like... eating half a chicken, then suddenly eating THREE chickens." },
      { id: "m47", speaker: "detective", text: "...What kind of analogy is that?" },
      { id: "m48", speaker: "kastor", text: "Didn't work? Okay, imagine—" },
      { id: "m49", speaker: "detective", text: "NO! I get it! It's a lot!" },
      { id: "m50", speaker: "kastor", text: "See? Food analogies work!" },
      { id: "m51", speaker: "detective", text: "(Why food...)" },
      { id: "m52", speaker: "kastor", text: "So! Three possibilities! Pick one!" },
    ],
    question: {
      id: "q1",
      text: "What's your first hypothesis?",
      choices: [
        {
          id: "c1",
          text: "Official patch (they're lying)",
          isCorrect: false,
          nextNode: "kastor_response",
          feedback: "Possible, but let's not assume they're lying yet!",
          pointsAwarded: 5,
        },
        {
          id: "c2",
          text: "Rare bug",
          isCorrect: false,
          nextNode: "kastor_response",
          feedback: "Could be! But bugs usually make things weaker, not stronger.",
          pointsAwarded: 5,
        },
        {
          id: "c3",
          text: "Someone secretly modified data",
          isCorrect: true,
          nextNode: "kastor_response",
          feedback: "Ooh! Crime vibes! I like it!",
          pointsAwarded: 10,
        },
      ],
    },
  },

  kastor_response: {
    id: "kastor_response",
    phase: "stage1",
    messages: [
      { id: "m53", speaker: "detective", text: "Just... a feeling." },
      { id: "m54", speaker: "kastor", text: "Detectives can't work on feelings~" },
      { id: "m55", speaker: "detective", text: "Then what?" },
      { id: "m56", speaker: "kastor", text: "DATA! Numbers don't lie!" },
      { id: "m57", speaker: "detective", text: "People do?" },
      { id: "m58", speaker: "kastor", text: "All the time! Let's go check!" },
      {
        id: "m59",
        speaker: "system",
        text: "🎉 Case accepted! +10 points",
        celebration: { type: "mini", title: "Case accepted!", points: 10 }
      },
    ],
    autoAdvance: { nextNode: "call_maya_intro", delay: 800 },
  },

  call_maya_intro: {
    id: "call_maya_intro",
    phase: "stage1",
    messages: [
      { id: "m60", speaker: "kastor", text: "Should we call the client?" },
      { id: "m61", speaker: "detective", text: "Good idea!" },
      { id: "m62", speaker: "narrator", text: "[Phone ringing...]" },
    ],
    autoAdvance: { nextNode: "maya_call", delay: 1000 },
  },

  maya_call: {
    id: "maya_call",
    phase: "stage1",
    messages: [
      { id: "m63", speaker: "maya", text: "Hello?! Is this the detective agency?!" },
      { id: "m64", speaker: "detective", text: "Yes, we got your email." },
      { id: "m65", speaker: "maya", text: "Thank goodness! This is a DISASTER!" },
      { id: "m66", speaker: "maya", text: "Players are complaining everywhere! The forums are on fire!" },
      { id: "m67", speaker: "maya", text: "Social media is going crazy!" },
      { id: "m68", speaker: "maya", text: "If we don't fix this soon... our game's reputation will be DESTROYED!" },
      { id: "m69", speaker: "detective", text: "Please calm down. Tell us exactly what happened." },
      { id: "m70", speaker: "maya", text: "Right. Sorry. Okay..." },
      { id: "m71", speaker: "maya", text: "Shadow is one of our characters." },
      { id: "m72", speaker: "maya", text: "Starting Day 28, he got INSANELY strong." },
      { id: "m73", speaker: "maya", text: "But here's the thing—WE DIDN'T PATCH HIM!" },
      { id: "m74", speaker: "kastor", text: "Interesting. Can you send us the data?" },
      { id: "m75", speaker: "maya", text: "Yes! Sending now! Player stats, patch notes, everything!" },
      { id: "m76", speaker: "detective", text: "Thank you. We'll investigate." },
      { id: "m77", speaker: "maya", text: "Please hurry! Every minute counts!" },
      { id: "m78", speaker: "narrator", text: "[Call ends]" },
    ],
    autoAdvance: { nextNode: "after_maya_call", delay: 800 },
  },

  after_maya_call: {
    id: "after_maya_call",
    phase: "stage1",
    messages: [
      { id: "m79", speaker: "kastor", text: "She's stressed." },
      { id: "m80", speaker: "detective", text: "Wouldn't you be?" },
      { id: "m81", speaker: "kastor", text: "Nah. I'd take a nap first." },
      { id: "m82", speaker: "detective", text: "..." },
      { id: "m83", speaker: "kastor", text: "Kidding! Data's here. Let's start!" },
    ],
    autoAdvance: { nextNode: "graph_analysis_intro", delay: 1000 },
  },

  // STAGE 2: GRAPH ANALYSIS
  graph_analysis_intro: {
    id: "graph_analysis_intro",
    phase: "stage2",
    messages: [
      { id: "m84", speaker: "kastor", text: "Alright! Data time!" },
      {
        id: "m85",
        speaker: "narrator",
        text: "[Screen shows graph with three colored lines]",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
      },
      { id: "m86", speaker: "detective", text: "Three lines..." },
      { id: "m87", speaker: "kastor", text: "Yep! Shadow, Phoenix, Viper. See anything weird?" },
      { id: "m88", speaker: "detective", text: "Um..." },
      { id: "m89", speaker: "kastor", text: "Hint! One of them took a rollercoaster ride!" },
      { id: "m90", speaker: "detective", text: "A rollercoaster?" },
      { id: "m91", speaker: "kastor", text: "Yeah! Slowly climbing, then WHOOOOSH!" },
      { id: "m92", speaker: "detective", text: "Oh! The red line!" },
      { id: "m93", speaker: "kastor", text: "Which one's that?" },
      { id: "m94", speaker: "detective", text: "Shadow! It shoots up on Day 28!" },
      { id: "m95", speaker: "kastor", text: "Nice! That's our guy!" },
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
      { id: "m96", speaker: "detective", text: "50% to 85%... That's a 35% jump!" },
      { id: "m97", speaker: "kastor", text: "Exactly! This isn't normal growth." },
      { id: "m98", speaker: "detective", text: "Phoenix also went up a bit..." },
      { id: "m99", speaker: "kastor", text: "Phoenix is a good kid. Slow and steady." },
      { id: "m100", speaker: "detective", text: "But Shadow's like a rocket launch!" },
      { id: "m101", speaker: "kastor", text: "Bingo! For a rookie, you're pretty fast!" },
      { id: "m102", speaker: "detective", text: "Really?" },
      { id: "m103", speaker: "kastor", text: "Yeah! Usually takes 30 minutes. You did it in 10!" },
      { id: "m104", speaker: "detective", text: "That's... good?" },
      { id: "m105", speaker: "kastor", text: "Very good! Natural talent maybe?" },
      { id: "m106", speaker: "detective", text: "(smiles)" },
      {
        id: "m107",
        speaker: "system",
        text: "🎉 Pattern recognized! +15 points",
        celebration: { type: "mini", title: "Pattern recognized!", points: 15 }
      },
    ],
    autoAdvance: { nextNode: "document_check", delay: 1000 },
  },

  // STAGE 3: DOCUMENT INVESTIGATION
  document_check: {
    id: "document_check",
    phase: "stage2",
    messages: [
      { id: "m108", speaker: "kastor", text: "Next! Official patch notes!" },
      {
        id: "m109",
        speaker: "narrator",
        text: "[Document appears on screen]",
        image: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&q=80"
      },
    ],
    interactiveSequence: {
      type: "document_examination",
      id: "doc1",
      data: {
        title: "DAY 28 PATCH NOTES",
        sections: [
          { label: "Phoenix", content: "Skill cooldown -2 seconds ✓", suspicious: false },
          { label: "Shadow", content: "No changes", suspicious: true },
          { label: "Server", content: "Maintenance completed", suspicious: false },
        ],
      },
    },
    autoAdvance: { nextNode: "document_reaction", delay: 0 },
  },

  document_reaction: {
    id: "document_reaction",
    phase: "stage2",
    messages: [
      { id: "m110", speaker: "detective", text: "It says Shadow wasn't changed." },
      { id: "m111", speaker: "kastor", text: "But he DID get stronger, right?" },
      { id: "m112", speaker: "detective", text: "Yeah..." },
      { id: "m113", speaker: "kastor", text: "Suspicious! Let's check the server logs!" },
      { id: "m114", speaker: "detective", text: "Server logs?" },
      { id: "m115", speaker: "kastor", text: "Real records! Documents can lie, logs can't." },
    ],
    autoAdvance: { nextNode: "server_logs", delay: 800 },
  },

  server_logs: {
    id: "server_logs",
    phase: "stage2",
    messages: [
      {
        id: "m116",
        speaker: "narrator",
        text: "[Server logs appear]",
        image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80"
      },
    ],
    interactiveSequence: {
      type: "document_examination",
      id: "logs1",
      data: {
        title: "SERVER LOGS - DAY 28",
        sections: [
          { label: "[02:13]", content: "System: Phoenix cooldown -2s", suspicious: false },
          { label: "[23:47]", content: "admin01: Shadow data modified ⚠️", suspicious: true },
          { label: "[23:52]", content: "admin01: Log deletion attempt (FAILED) 🚨", suspicious: true },
        ],
      },
    },
    autoAdvance: { nextNode: "logs_discovery", delay: 0 },
  },

  logs_discovery: {
    id: "logs_discovery",
    phase: "stage2",
    messages: [
      { id: "m117", speaker: "detective", text: "Wait! Someone DID modify Shadow!" },
      { id: "m118", speaker: "kastor", text: "At 11:47 PM! And tried to delete the evidence!" },
      { id: "m119", speaker: "detective", text: "But the official notes say nothing changed!" },
      { id: "m120", speaker: "kastor", text: "Exactly! Someone's lying!" },
      { id: "m121", speaker: "detective", text: "We need to ask Maya!" },
      {
        id: "m122",
        speaker: "system",
        text: "🎉 Contradiction found! +20 points",
        celebration: { type: "mini", title: "Contradiction found!", points: 20 }
      },
    ],
    autoAdvance: { nextNode: "call_maya_admin", delay: 1000 },
  },

  call_maya_admin: {
    id: "call_maya_admin",
    phase: "stage2",
    messages: [
      { id: "m123", speaker: "narrator", text: "[Quick call to Maya]" },
      { id: "m124", speaker: "detective", text: "Maya, we checked the official documents." },
      { id: "m125", speaker: "maya", text: "Yes, we didn't touch Shadow that day." },
      { id: "m126", speaker: "detective", text: "But server logs show admin01 modified him." },
      { id: "m127", speaker: "maya", text: "WHAT?! That's... let me check who that is..." },
      { id: "m128", speaker: "maya", text: "admin01 is... Kaito Nakamura. Our balance designer." },
      { id: "m129", speaker: "detective", text: "Did he work late that night?" },
      { id: "m130", speaker: "maya", text: "No! Day 28 was an early day! No overtime!" },
      { id: "m131", speaker: "maya", text: "If he logged in from home... that would be..." },
      { id: "m132", speaker: "kastor", text: "Unauthorized. We need to dig deeper." },
      { id: "m133", speaker: "maya", text: "Please... find out the truth." },
      { id: "m134", speaker: "narrator", text: "[Call ends]" },
    ],
    autoAdvance: { nextNode: "log_filtering_intro", delay: 1000 },
  },

  // Clean the logs
  log_filtering_intro: {
    id: "log_filtering_intro",
    phase: "stage2",
    messages: [
      { id: "m135", speaker: "kastor", text: "These logs are messy. Let's clean up!" },
      { id: "m136", speaker: "detective", text: "Clean up?" },
      { id: "m137", speaker: "kastor", text: "Remove unrelated stuff! Only keep evidence!" },
    ],
    interactiveSequence: {
      type: "log_filtering",
      id: "filter1",
      data: {
        entries: [
          { id: "e1", text: "Day 27: Player complained about lag", keep: false },
          { id: "e2", text: "Day 28 02:13: Phoenix modification (verified)", keep: true },
          { id: "e3", text: "Day 28: Player loved new map", keep: false },
          { id: "e4", text: "Day 28 23:47: admin01 - Shadow modified", keep: true },
          { id: "e5", text: "Day 28 23:52: admin01 - Log deletion attempt", keep: true },
        ],
      },
    },
    autoAdvance: { nextNode: "log_filtering_result", delay: 0 },
  },

  log_filtering_result: {
    id: "log_filtering_result",
    phase: "stage2",
    messages: [
      { id: "m138", speaker: "kastor", text: "Much better! Now we can see clearly!" },
      { id: "m139", speaker: "detective", text: "Everything points to admin01..." },
      { id: "m140", speaker: "kastor", text: "Kaito. But we need more evidence." },
      { id: "m141", speaker: "detective", text: "What's next?" },
      { id: "m142", speaker: "kastor", text: "Timeline! Let's see what Kaito actually did!" },
    ],
    autoAdvance: { nextNode: "timeline_intro", delay: 1000 },
  },

  // STAGE 3: TIMELINE RECONSTRUCTION
  timeline_intro: {
    id: "timeline_intro",
    phase: "stage3",
    messages: [
      { id: "m143", speaker: "kastor", text: "Time to track Kaito's movements!" },
      {
        id: "m144",
        speaker: "narrator",
        text: "[Filtering admin01 activities...]",
        image: "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&q=80"
      },
    ],
    interactiveSequence: {
      type: "timeline_reconstruction",
      id: "timeline1",
      data: {
        events: [
          { id: "e1", time: "19:15", text: "Login (Office)", order: 1 },
          { id: "e2", time: "19:20", text: "Checked Shadow data", order: 2 },
          { id: "e3", time: "19:45", text: "Logout (Office)", order: 3 },
          { id: "e4", time: "23:35", text: "Login (Home) ⚠️", order: 4, suspicious: true },
          { id: "e5", time: "23:47", text: "Modified Shadow (+35% damage, +20% defense) 🚨", order: 5, suspicious: true },
          { id: "e6", time: "23:52", text: "Tried to delete logs (FAILED) 🚨", order: 6, suspicious: true },
          { id: "e7", time: "00:05", text: "Logout (Home)", order: 7 },
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
      { id: "m145", speaker: "detective", text: "He checked the data at work..." },
      { id: "m146", speaker: "kastor", text: "Then went home and modified it!" },
      { id: "m147", speaker: "detective", text: "Why from home?" },
      { id: "m148", speaker: "kastor", text: "Hmm... I'm hungry." },
      { id: "m149", speaker: "detective", text: "What?! We're working!" },
      { id: "m150", speaker: "kastor", text: "Kidding~ To avoid being caught, obviously!" },
      { id: "m151", speaker: "kastor", text: "At the office: CCTV, people everywhere." },
      { id: "m152", speaker: "kastor", text: "At home: Quiet, alone, sneaky~" },
      { id: "m153", speaker: "detective", text: "So it was planned!" },
      { id: "m154", speaker: "kastor", text: "Yep! Very calculated!" },
      {
        id: "m155",
        speaker: "system",
        text: "🎉 Timeline complete! +20 points",
        celebration: { type: "mini", title: "Timeline complete!", points: 20 }
      },
    ],
    autoAdvance: { nextNode: "admin02_discover", delay: 1000 },
  },

  admin02_discover: {
    id: "admin02_discover",
    phase: "stage3",
    messages: [
      {
        id: "m156",
        speaker: "narrator",
        text: "[Scrolling through logs...]",
        image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80"
      },
      { id: "m157", speaker: "kastor", text: "Wait. There's admin02 too." },
      { id: "m158", speaker: "system", text: "ADMIN02 ACTIVITY:" },
      { id: "m159", speaker: "system", text: "22:30 - Login (Office)" },
      { id: "m160", speaker: "system", text: "22:35 - Server status check" },
      { id: "m161", speaker: "system", text: "22:40 - Logout (Office)" },
      { id: "m162", speaker: "detective", text: "Another admin! Is he suspicious too?" },
      { id: "m163", speaker: "kastor", text: "Let's ask him!" },
    ],
    autoAdvance: { nextNode: "lukas_interview", delay: 1000 },
  },

  lukas_interview: {
    id: "lukas_interview",
    phase: "stage3",
    messages: [
      { id: "m164", speaker: "narrator", text: "[Calling Lukas Schmidt...]" },
      { id: "m165", speaker: "detective", text: "Hello, Mr. Schmidt?" },
      { id: "m166", speaker: "lukas", text: "Yes? Who is this?" },
      { id: "m167", speaker: "detective", text: "We're investigating the Shadow incident. May we ask a few questions?" },
      { id: "m168", speaker: "lukas", text: "Of course! Anything to help!" },
      { id: "m169", speaker: "detective", text: "You logged in at 10:30 PM on Day 28?" },
      { id: "m170", speaker: "lukas", text: "Ah yes! Emergency server check. Just routine maintenance." },
      { id: "m171", speaker: "detective", text: "Did you modify anything?" },
      { id: "m172", speaker: "lukas", text: "No, just checked status. Logged out in 10 minutes." },
      { id: "m173", speaker: "detective", text: "Do you know what Kaito was doing that night?" },
      { id: "m174", speaker: "lukas", text: "Kaito? He went home! We left together around 7 PM." },
      { id: "m175", speaker: "kastor", text: "But he logged in again at 11:35 PM." },
      { id: "m176", speaker: "lukas", text: "What?! From home?!" },
      { id: "m177", speaker: "lukas", text: "That... That can't be right!" },
      { id: "m178", speaker: "lukas", text: "Kaito's a good kid! I mentored him for a year! He's hardworking and honest!" },
      { id: "m179", speaker: "detective", text: "We have the logs, Mr. Schmidt." },
      { id: "m180", speaker: "lukas", text: "I... I see. I'm shocked. Are you sure?" },
      { id: "m181", speaker: "kastor", text: "99% sure." },
      { id: "m182", speaker: "detective", text: "Why 99%?" },
      { id: "m183", speaker: "kastor", text: "Always leave 1% for aliens!" },
      { id: "m184", speaker: "detective", text: "..." },
      { id: "m185", speaker: "lukas", text: "I... I need to process this. Thank you for letting me know." },
      { id: "m186", speaker: "narrator", text: "[Call ends]" },
    ],
    autoAdvance: { nextNode: "after_lukas", delay: 1000 },
  },

  after_lukas: {
    id: "after_lukas",
    phase: "stage3",
    messages: [
      { id: "m187", speaker: "detective", text: "He really believed in Kaito." },
      { id: "m188", speaker: "kastor", text: "Sad. But truth is truth!" },
      { id: "m189", speaker: "kastor", text: "Time to track his IP!" },
    ],
    autoAdvance: { nextNode: "ip_tracking", delay: 1000 },
  },

  // STAGE 4: IP TRACKING & CONFRONTATION
  ip_tracking: {
    id: "ip_tracking",
    phase: "stage4",
    messages: [
      { id: "m190", speaker: "kastor", text: "IP tracking results are in!" },
      { id: "m191", speaker: "detective", text: "What's an IP?" },
      { id: "m192", speaker: "kastor", text: "Like... an internet address? Where you connect from?" },
      { id: "m193", speaker: "detective", text: "Oh! Like a home address!" },
      { id: "m194", speaker: "kastor", text: "Exactly! And guess what?" },
      { id: "m195", speaker: "kastor", text: "admin01's IP... was ALSO used to play the game!" },
      { id: "m196", speaker: "detective", text: "So Kaito plays the game too?" },
      { id: "m197", speaker: "kastor", text: "Yep! Let's search the player database!" },
    ],
    interactiveSequence: {
      type: "database_search",
      id: "db1",
      data: {
        searchType: "ip",
        searchValue: "192.168.45.178",
        results: [
          {
            ign: "Noctis",
            ip: "192.168.45.178",
            mainCharacter: "Shadow (95% usage rate)",
            session: "Day 28: 23:50 - 01:30",
            winRate: "48% → 88% 🚨",
          },
        ],
      },
    },
    autoAdvance: { nextNode: "noctis_found", delay: 0 },
  },

  noctis_found: {
    id: "noctis_found",
    phase: "stage4",
    messages: [
      { id: "m198", speaker: "detective", text: "23:50! Three minutes after the modification!" },
      { id: "m199", speaker: "kastor", text: "Timing is PERFECT!" },
      { id: "m200", speaker: "detective", text: "And his win rate jumped 40%!" },
      { id: "m201", speaker: "kastor", text: "From losing to winning. Motivation clear!" },
      {
        id: "m202",
        speaker: "system",
        text: "🎉 Culprit identified! +25 points",
        celebration: { type: "mini", title: "Culprit identified!", points: 25 }
      },
    ],
    autoAdvance: { nextNode: "diego_check", delay: 1000 },
  },

  diego_check: {
    id: "diego_check",
    phase: "stage4",
    messages: [
      { id: "m203", speaker: "system", text: "ADDITIONAL RESULT:" },
      { id: "m204", speaker: "system", text: "Username: ShadowFan99" },
      { id: "m205", speaker: "system", text: "Day 28 playtime: 19:00 - 21:00" },
      { id: "m206", speaker: "system", text: "Win rate: 62% → 65% (normal)" },
      { id: "m207", speaker: "detective", text: "There's another Shadow player!" },
      { id: "m208", speaker: "kastor", text: "But he played BEFORE the modification." },
      { id: "m209", speaker: "detective", text: "We should check with him anyway." },
    ],
    autoAdvance: { nextNode: "diego_interview", delay: 1000 },
  },

  diego_interview: {
    id: "diego_interview",
    phase: "stage4",
    messages: [
      { id: "m210", speaker: "narrator", text: "[Calling Diego Torres...]" },
      { id: "m211", speaker: "diego", text: "Hello? Who's this?" },
      { id: "m212", speaker: "detective", text: "Hi Diego, we're investigating the Shadow balance issue." },
      { id: "m213", speaker: "diego", text: "Oh! I'm a Shadow main! Did something happen?!" },
      { id: "m214", speaker: "detective", text: "You played on Day 28 from 7-9 PM?" },
      { id: "m215", speaker: "diego", text: "Yeah! And Shadow felt AMAZING! I was so happy!" },
      { id: "m216", speaker: "detective", text: "Did you play after 9 PM?" },
      { id: "m217", speaker: "diego", text: "No! I had homework! Logged off at 9, studied until midnight." },
      { id: "m218", speaker: "detective", text: "So you didn't play late at night?" },
      { id: "m219", speaker: "diego", text: "No way! I had a paper due! Wait... Am I a suspect?!" },
      { id: "m220", speaker: "diego", text: "I didn't do anything! I swear! I just play the game!" },
      { id: "m221", speaker: "kastor", text: "Relax! We're just checking." },
      { id: "m222", speaker: "diego", text: "Phew! You scared me!" },
      { id: "m223", speaker: "detective", text: "Thanks for your cooperation." },
      { id: "m224", speaker: "diego", text: "No problem! Catch the bad guy, okay?!" },
      { id: "m225", speaker: "narrator", text: "[Call ends]" },
    ],
    autoAdvance: { nextNode: "after_diego", delay: 1000 },
  },

  after_diego: {
    id: "after_diego",
    phase: "stage4",
    messages: [
      { id: "m226", speaker: "kastor", text: "Diego's clear. He has an alibi." },
      { id: "m227", speaker: "detective", text: "So Noctis is..." },
      { id: "m228", speaker: "kastor", text: "Kaito Nakamura. Time to confront him!" },
    ],
    autoAdvance: { nextNode: "kaito_confrontation", delay: 1000 },
  },

  kaito_confrontation: {
    id: "kaito_confrontation",
    phase: "stage4",
    messages: [
      { id: "m229", speaker: "narrator", text: "[Calling Kaito Nakamura...]" },
      { id: "m230", speaker: "detective", text: "Hello, Kaito?" },
      { id: "m231", speaker: "kaito", text: "...Yes? Who is this?" },
      { id: "m232", speaker: "detective", text: "We're detectives investigating the Shadow incident." },
      { id: "m233", speaker: "kaito", text: "...What about it?" },
      { id: "m234", speaker: "detective", text: "Day 28, 11:35 PM. You logged in from home." },
      { id: "m235", speaker: "kaito", text: "...Who told you that?" },
      { id: "m236", speaker: "kastor", text: "Server logs." },
      { id: "m237", speaker: "kaito", text: "I... I was just checking something..." },
      { id: "m238", speaker: "detective", text: "At 11:47 PM, you modified Shadow's data." },
      { id: "m239", speaker: "detective", text: "Then 3 minutes later, you logged into the game as Noctis." },
      { id: "m240", speaker: "kaito", text: "..." },
      { id: "m241", speaker: "kastor", text: "We have everything. IP match, timing, play records." },
      { id: "m242", speaker: "detective", text: "Your win rate went from 48% to 88%." },
      { id: "m243", speaker: "kaito", text: "...You have... proof?" },
    ],
    autoAdvance: { nextNode: "testimony_press", delay: 1000 },
  },

  testimony_press: {
    id: "testimony_press",
    phase: "stage4",
    messages: [
      { id: "m244", speaker: "narrator", text: "[INTERACTIVE: Press Testimony]" },
      { id: "m245", speaker: "kaito", text: "I was just doing routine maintenance." },
      { id: "m246", speaker: "kaito", text: "Lots of people play after work." },
      { id: "m247", speaker: "kaito", text: "My win rate improved because I practiced hard." },
      { id: "m248", speaker: "kaito", text: "I don't even like Shadow that much." },
    ],
    interactiveSequence: {
      type: "testimony_press",
      id: "testimony1",
      data: {
        statements: [
          {
            id: "s1",
            speaker: "kaito",
            text: "I was just doing routine maintenance.",
            pressResponse: "It was personal initiative...",
            hasContradiction: true,
            contradictionEvidence: "no_maintenance_scheduled",
            contradictionFeedback: "But no maintenance was scheduled for that night!",
          },
          {
            id: "s2",
            speaker: "kaito",
            text: "My win rate improved because I practiced hard.",
            pressResponse: "That's... coincidence...",
            hasContradiction: true,
            contradictionEvidence: "same_night_modification",
            contradictionFeedback: "But the improvement happened THE SAME NIGHT as the modification!",
          },
          {
            id: "s3",
            speaker: "kaito",
            text: "I don't even like Shadow that much.",
            pressResponse: "I play other characters too...",
            hasContradiction: true,
            contradictionEvidence: "shadow_usage_95",
            contradictionFeedback: "Your usage rate is 95%! You play Shadow almost exclusively!",
          },
        ],
      },
    },
    autoAdvance: { nextNode: "final_evidence", delay: 0 },
  },

  final_evidence: {
    id: "final_evidence",
    phase: "stage4",
    messages: [
      { id: "m249", speaker: "kastor", text: "One more thing. The log deletion attempt." },
      { id: "m250", speaker: "kastor", text: "If it was innocent, why try to hide it?" },
      { id: "m251", speaker: "kaito", text: "..." },
      { id: "m252", speaker: "narrator", text: "[Heavy breathing]" },
      { id: "m253", speaker: "kaito", text: "...I'm sorry." },
      {
        id: "m254",
        speaker: "system",
        text: "🎊 CASE SOLVED! +50 points",
        celebration: { type: "major", title: "CASE SOLVED!", points: 50 }
      },
    ],
    autoAdvance: { nextNode: "confession", delay: 1500 },
  },

  // STAGE 5: RESOLUTION
  confession: {
    id: "confession",
    phase: "stage5",
    messages: [
      { id: "m255", speaker: "detective", text: "..." },
      { id: "m256", speaker: "kaito", text: "I... I just wanted to win." },
      { id: "m257", speaker: "kaito", text: "The company tournament... I kept losing." },
      { id: "m258", speaker: "kaito", text: "First round. Every single time." },
      { id: "m259", speaker: "kaito", text: "I love Shadow. I love this game." },
      { id: "m260", speaker: "kaito", text: "But I'm not good enough..." },
      { id: "m261", speaker: "kaito", text: "I thought... if I made him just a LITTLE stronger..." },
      { id: "m262", speaker: "kaito", text: "Just a little... so I could finally win something..." },
      { id: "m263", speaker: "kaito", text: "I'm so sorry. I have no excuse." },
    ],
    autoAdvance: { nextNode: "maya_reaction", delay: 1500 },
  },

  maya_reaction: {
    id: "maya_reaction",
    phase: "stage5",
    messages: [
      { id: "m264", speaker: "maya", text: "Kaito... I'm disappointed." },
      { id: "m265", speaker: "kaito", text: "Maya... I..." },
      { id: "m266", speaker: "maya", text: "But... I understand the feeling." },
      { id: "m267", speaker: "maya", text: "Wanting to win. Wanting to prove yourself." },
      { id: "m268", speaker: "maya", text: "That's why we make games. For that feeling." },
      { id: "m269", speaker: "maya", text: "But you broke the rules. And player trust." },
      { id: "m270", speaker: "kaito", text: "I know. I'll accept any punishment." },
    ],
    autoAdvance: { nextNode: "reactions", delay: 1500 },
  },

  reactions: {
    id: "reactions",
    phase: "stage5",
    messages: [
      { id: "m271", speaker: "narrator", text: "[Later...]" },
      { id: "m272", speaker: "narrator", text: "[Call: Lukas Schmidt]" },
      { id: "m273", speaker: "lukas", text: "So... it was true?" },
      { id: "m274", speaker: "detective", text: "Yes. He confessed." },
      { id: "m275", speaker: "lukas", text: "I can't believe it... I trusted him..." },
      { id: "m276", speaker: "lukas", text: "I mentored him. Taught him everything." },
      { id: "m277", speaker: "lukas", text: "And he... behind my back..." },
      { id: "m278", speaker: "detective", text: "He regrets it." },
      { id: "m279", speaker: "lukas", text: "I'm sure he does. But the damage is done." },
      { id: "m280", speaker: "lukas", text: "Thank you for finding the truth. Even if it hurts." },
      { id: "m281", speaker: "narrator", text: "[Message from Diego Torres]" },
      { id: "m282", speaker: "diego", text: "OMG you caught him?! Thank god!" },
      { id: "m283", speaker: "diego", text: "I was SO MAD when people suspected me!" },
      { id: "m284", speaker: "diego", text: "A developer cheating? That's crazy!" },
      { id: "m285", speaker: "diego", text: "Thanks for clearing my name! You're the best!" },
    ],
    autoAdvance: { nextNode: "kastor_reflection", delay: 1500 },
  },

  kastor_reflection: {
    id: "kastor_reflection",
    phase: "stage5",
    messages: [
      { id: "m286", speaker: "kastor", text: "Everyone's reacting differently." },
      { id: "m287", speaker: "detective", text: "Maya's disappointed, Lukas feels betrayed, Diego's relieved..." },
      { id: "m288", speaker: "kastor", text: "That's people. Same truth, different feelings." },
      { id: "m289", speaker: "detective", text: "..." },
      { id: "m290", speaker: "kastor", text: "Alright! Let's wrap this up!" },
    ],
    autoAdvance: { nextNode: "case_summary", delay: 1000 },
  },

  case_summary: {
    id: "case_summary",
    phase: "stage5",
    messages: [
      { id: "m291", speaker: "kastor", text: "You do the summary!" },
      { id: "m292", speaker: "detective", text: "Me?" },
      { id: "m293", speaker: "kastor", text: "Yep! It's your first case!" },
    ],
    interactiveSequence: {
      type: "case_report_assembly",
      id: "report1",
      data: {
        fields: [
          {
            id: "who",
            label: "WHO:",
            options: ["Kaito Nakamura", "Lukas Schmidt", "Diego Torres", "Maya Zhang"],
            correct: "Kaito Nakamura",
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
              "Desperation to prove himself",
              "Testing game balance",
              "Sabotaging the company",
              "Accidental mistake",
            ],
            correct: "Desperation to prove himself",
          },
        ],
        evidenceChecklist: [
          "Shadow win rate spike (Day 28)",
          "Official patch notes: No Shadow changes",
          "Server logs: admin01 modified Shadow (23:47)",
          "IP tracking: admin01 = Noctis",
          "Play records: Noctis played immediately after modification",
          "Result: Win rate jumped 48% → 88%",
        ],
      },
    },
    autoAdvance: { nextNode: "summary_result", delay: 0 },
  },

  summary_result: {
    id: "summary_result",
    phase: "stage5",
    messages: [
      { id: "m294", speaker: "detective", text: "Here's what happened:" },
      { id: "m295", speaker: "detective", text: "On Day 28, Kaito Nakamura used his admin access..." },
      { id: "m296", speaker: "detective", text: "To illegally strengthen Shadow at 11:47 PM." },
      { id: "m297", speaker: "detective", text: "He then logged into the game as Noctis..." },
      { id: "m298", speaker: "detective", text: "And exploited the changes to win games." },
      { id: "m299", speaker: "detective", text: "His motive: Desperation to prove himself." },
      { id: "m300", speaker: "detective", text: "His method: Developer privilege abuse." },
      { id: "m301", speaker: "detective", text: "The evidence: Timeline, IP records, play data." },
      { id: "m302", speaker: "kastor", text: "Perfect summary! 100 points!" },
      { id: "m303", speaker: "detective", text: "You said 100% doesn't exist!" },
      { id: "m304", speaker: "kastor", text: "For scores, it does! For certainty, it doesn't!" },
      { id: "m305", speaker: "detective", text: "That's... confusing." },
      { id: "m306", speaker: "kastor", text: "You'll get used to it!" },
    ],
    autoAdvance: { nextNode: "case_evaluation", delay: 2000 },
  },

  // Default case evaluation - routes to appropriate rank
  case_evaluation: {
    id: "case_evaluation",
    phase: "stage5",
    messages: [
      { id: "m307", speaker: "narrator", text: "[CASE COMPLETE CELEBRATION]" },
      { id: "m308", speaker: "system", text: "Calculating final grade..." },
    ],
    autoAdvance: { nextNode: "case_evaluation_s", delay: 1000 },
  },

  // S RANK
  case_evaluation_s: {
    id: "case_evaluation_s",
    phase: "stage5",
    messages: [
      { id: "m309", speaker: "narrator", text: "[CASE EVALUATION SCREEN]" },
      { id: "m310", speaker: "system", text: "Evidence Collected: 12/12 ✓" },
      { id: "m311", speaker: "system", text: "Logic Connections: 5/5 ✓" },
      { id: "m312", speaker: "system", text: "Contradictions Found: 3/3 ✓" },
      { id: "m313", speaker: "system", text: "Time: Optimal" },
      { id: "m314", speaker: "system", text: "" },
      { id: "m315", speaker: "system", text: "FINAL GRADE: S RANK 🏆" },
    ],
    autoAdvance: { nextNode: "case_closed_s", delay: 2000 },
  },

  case_closed_s: {
    id: "case_closed_s",
    phase: "stage5",
    messages: [
      { id: "m316", speaker: "kastor", text: "First case, SOLVED!" },
      { id: "m317", speaker: "detective", text: "We did it!" },
      { id: "m318", speaker: "kastor", text: "You did great! Really!" },
      { id: "m319", speaker: "detective", text: "Thanks... What's next?" },
      { id: "m320", speaker: "kastor", text: "Rest time! 15 minutes!" },
      { id: "m321", speaker: "detective", text: "Only 15?!" },
      { id: "m322", speaker: "kastor", text: "Yep! Next case is waiting!" },
      { id: "m323", speaker: "detective", text: "Already?!" },
      { id: "m324", speaker: "kastor", text: "Detectives are busy~ You'll get used to it!" },
      { id: "m325", speaker: "detective", text: "(This is my life now...)" },
      { id: "m326", speaker: "kastor", text: "Oh! Next case has MORE numbers!" },
      { id: "m327", speaker: "detective", text: "Is that supposed to be exciting?!" },
      { id: "m328", speaker: "kastor", text: "Of course! More numbers = more fun!" },
      { id: "m329", speaker: "detective", text: "(He's weird... but kind of fun.)" },
      { id: "m330", speaker: "system", text: "[EPISODE 1 - COMPLETE]" },
      { id: "m331", speaker: "system", text: "[NEXT CASE UNLOCKED]" },
    ],
  },

  // A RANK
  case_evaluation_a: {
    id: "case_evaluation_a",
    phase: "stage5",
    messages: [
      { id: "m332", speaker: "narrator", text: "[CASE EVALUATION SCREEN]" },
      { id: "m333", speaker: "system", text: "Evidence Collected: 10/12 ✓" },
      { id: "m334", speaker: "system", text: "Logic Connections: 4/5 ✓" },
      { id: "m335", speaker: "system", text: "Contradictions Found: 3/3 ✓" },
      { id: "m336", speaker: "system", text: "Time: Good" },
      { id: "m337", speaker: "system", text: "" },
      { id: "m338", speaker: "system", text: "FINAL GRADE: A RANK ⭐" },
    ],
    autoAdvance: { nextNode: "case_closed_a", delay: 2000 },
  },

  case_closed_a: {
    id: "case_closed_a",
    phase: "stage5",
    messages: [
      { id: "m339", speaker: "kastor", text: "Not bad! Case solved!" },
      { id: "m340", speaker: "detective", text: "But I missed some evidence..." },
      { id: "m341", speaker: "kastor", text: "Yeah, but you got the important stuff!" },
      { id: "m342", speaker: "kastor", text: "For a first case, A rank is solid!" },
      { id: "m343", speaker: "detective", text: "I'll do better next time." },
      { id: "m344", speaker: "kastor", text: "That's the spirit! Ready for Case #002?" },
      { id: "m345", speaker: "system", text: "[CASE #001 COMPLETE - A RANK]" },
      { id: "m346", speaker: "system", text: "[NEXT CASE UNLOCKED]" },
    ],
  },

  // B RANK
  case_evaluation_b: {
    id: "case_evaluation_b",
    phase: "stage5",
    messages: [
      { id: "m347", speaker: "narrator", text: "[CASE EVALUATION SCREEN]" },
      { id: "m348", speaker: "system", text: "Evidence Collected: 8/12" },
      { id: "m349", speaker: "system", text: "Logic Connections: 3/5" },
      { id: "m350", speaker: "system", text: "Contradictions Found: 2/3" },
      { id: "m351", speaker: "system", text: "Time: Acceptable" },
      { id: "m352", speaker: "system", text: "" },
      { id: "m353", speaker: "system", text: "FINAL GRADE: B RANK" },
    ],
    autoAdvance: { nextNode: "case_closed_b", delay: 2000 },
  },

  case_closed_b: {
    id: "case_closed_b",
    phase: "stage5",
    messages: [
      { id: "m354", speaker: "kastor", text: "Well... case solved, but..." },
      { id: "m355", speaker: "detective", text: "But?" },
      { id: "m356", speaker: "kastor", text: "You missed quite a bit!" },
      { id: "m357", speaker: "detective", text: "I still caught the culprit though!" },
      { id: "m358", speaker: "kastor", text: "Yeah, but a good detective is thorough~" },
      { id: "m359", speaker: "detective", text: "I'll improve!" },
      { id: "m360", speaker: "kastor", text: "Good! Next case awaits!" },
      { id: "m361", speaker: "system", text: "[CASE #001 COMPLETE - B RANK]" },
      { id: "m362", speaker: "system", text: "[NEXT CASE UNLOCKED]" },
    ],
  },

  // C RANK
  case_evaluation_c: {
    id: "case_evaluation_c",
    phase: "stage5",
    messages: [
      { id: "m363", speaker: "narrator", text: "[CASE EVALUATION SCREEN]" },
      { id: "m364", speaker: "system", text: "Evidence Collected: 6/12" },
      { id: "m365", speaker: "system", text: "Logic Connections: 2/5" },
      { id: "m366", speaker: "system", text: "Contradictions Found: 1/3" },
      { id: "m367", speaker: "system", text: "Time: Slow" },
      { id: "m368", speaker: "system", text: "" },
      { id: "m369", speaker: "system", text: "FINAL GRADE: C RANK" },
    ],
    autoAdvance: { nextNode: "case_closed_c", delay: 2000 },
  },

  case_closed_c: {
    id: "case_closed_c",
    phase: "stage5",
    messages: [
      { id: "m370", speaker: "kastor", text: "Hmm... you solved it, but..." },
      { id: "m371", speaker: "detective", text: "But?" },
      { id: "m372", speaker: "kastor", text: "It was rough. Really rough." },
      { id: "m373", speaker: "detective", text: "..." },
      { id: "m374", speaker: "kastor", text: "But everyone starts somewhere!" },
      { id: "m375", speaker: "kastor", text: "Just remember: Follow the data, not your feelings!" },
      { id: "m376", speaker: "detective", text: "I'll do better next time!" },
      { id: "m377", speaker: "kastor", text: "That's all I ask! Let's go!" },
      { id: "m378", speaker: "system", text: "[CASE #001 COMPLETE - C RANK]" },
      { id: "m379", speaker: "system", text: "[NEXT CASE UNLOCKED]" },
    ],
  },
};
