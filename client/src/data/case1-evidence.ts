import { Evidence } from "@/lib/stores/useDetectiveGame";
import mayaImage from "@assets/stock_images/professional_woman_g_075426e4.jpg";
import chrisImage from "@assets/stock_images/male_data_analyst_wi_e9db42d6.jpg";
import ryanImage from "@assets/stock_images/young_male_server_en_0abfcbd2.jpg";

export const case1Evidence: Record<string, Evidence> = {
  maya_profile: {
    id: "maya_profile",
    type: "CHARACTER",
    title: "Maya Chen - Game Director",
    name: "Maya Chen",
    role: "Game Director, Balance Lead",
    photo: mayaImage,
    description: "Responsible for game balance. Works late nights checking updates. Has admin01 account access.",
    suspicionLevel: 2,
    timestamp: Date.now(),
    unlockedByNode: "meet_team",
  },
  
  chris_profile: {
    id: "chris_profile",
    type: "CHARACTER",
    title: "Chris Park - Data Analyst",
    name: "Chris Park",
    role: "Data Analyst, Matchmaking Specialist",
    photo: chrisImage,
    description: "Analyzes game data and win rates. Mentioned working on a 'secret research project' using AI for matchmaking.",
    suspicionLevel: 4,
    timestamp: Date.now(),
    unlockedByNode: "meet_team",
  },
  
  ryan_profile: {
    id: "ryan_profile",
    type: "CHARACTER",
    title: "Ryan Torres - Server Engineer",
    name: "Ryan Torres",
    role: "Junior Server Engineer, Log Manager",
    photo: ryanImage,
    description: "Manages server logs. Revealed he anonymously reported the issue to the community. Frustrated with company culture.",
    suspicionLevel: 3,
    timestamp: Date.now(),
    unlockedByNode: "meet_team",
  },
  
  maya_dialogue: {
    id: "maya_dialogue",
    type: "DIALOGUE",
    title: "Interview with Maya",
    character: "Maya Chen",
    summary: "Maya claims she checked all balance values 3 times before the update. She logged in late (10:47 PM) and accessed the balance database. She seems tired and admits she might have made a mistake due to overwork.",
    keyPoints: [
      "Maya worked until midnight checking the update",
      "She triple-checked all balance numbers",
      "She's been under a lot of pressure lately",
      "Has admin01 account access"
    ],
    timestamp: Date.now(),
    unlockedByNode: "maya_interview",
  },
  
  chris_dialogue: {
    id: "chris_dialogue",
    type: "DIALOGUE",
    title: "Interview with Chris",
    character: "Chris Park",
    summary: "Chris noticed unusual win rate changes days before but was too busy with his 'research project.' When pressed, he mentioned working on an AI matchmaking experiment unrelated to the company. He seemed nervous when discussing it.",
    keyPoints: [
      "Noticed strange win rate patterns earlier",
      "Working on secret AI matchmaking research",
      "Claims it's unrelated to company work",
      "Became defensive when questioned"
    ],
    timestamp: Date.now(),
    unlockedByNode: "chris_interview",
  },
  
  ryan_dialogue: {
    id: "ryan_dialogue",
    type: "DIALOGUE",
    title: "Interview with Ryan",
    character: "Ryan Torres",
    summary: "Ryan confessed he was the anonymous whistleblower who first posted about the issue to the gaming community. He's frustrated with the company's overtime culture and felt direct reporting wouldn't help. He provided server access logs.",
    keyPoints: [
      "He was the anonymous whistleblower",
      "Frustrated with company culture",
      "Provided crucial server logs",
      "Believes 'data doesn't lie'"
    ],
    timestamp: Date.now(),
    unlockedByNode: "ryan_interview",
  },
  
  server_logs: {
    id: "server_logs",
    type: "DATA",
    title: "Server Access Logs",
    dataType: "log",
    data: {
      entries: [
        { time: "Nov 8, 10:47 PM", user: "admin01", action: "Login", status: "success", ip: "192.168.1.47" },
        { time: "Nov 8, 11:12 PM", user: "admin01", action: "Access Balance_DB", status: "success", ip: "192.168.1.47" },
        { time: "Nov 8, 11:15 PM", user: "admin01", action: "MODIFY Shadow_Reaper.attack_power: 100 → 150", status: "success", ip: "192.168.1.47" },
        { time: "Nov 8, 11:58 PM", user: "admin01", action: "Logout", status: "success", ip: "192.168.1.47" },
      ],
    },
    timestamp: Date.now(),
    unlockedByNode: "ryan_interview",
  },
  
  ip_analysis: {
    id: "ip_analysis",
    type: "DATA",
    title: "IP Address Timeline Analysis",
    dataType: "table",
    data: {
      headers: ["Time", "Event", "IP Address", "User"],
      rows: [
        ["10:47 PM", "Maya leaves office (CCTV)", "N/A", "Maya Chen"],
        ["11:12 PM", "admin01 login", "192.168.1.47", "Unknown"],
        ["11:12 PM", "Chris computer active", "192.168.1.47", "Chris Park"],
        ["11:58 PM", "admin01 logout", "192.168.1.47", "Unknown"],
      ],
    },
    timestamp: Date.now(),
    unlockedByNode: "ip_discovery",
  },
  
  winrate_chart: {
    id: "winrate_chart",
    type: "DATA",
    title: "Shadow Reaper Win Rate Trend",
    dataType: "chart",
    data: {
      labels: ["Nov 7", "Nov 8 (Pre-Update)", "Nov 8 (Post-Update)", "Nov 9"],
      datasets: [{
        label: "Win Rate %",
        data: [48.5, 49.2, 73.8, 75.1],
        color: "#ef4444",
      }],
    },
    timestamp: Date.now(),
    unlockedByNode: "analyze_data",
  },
};
