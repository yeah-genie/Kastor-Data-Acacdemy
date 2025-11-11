# Episode 3 — Visual Novel Flow Chart

## Navigation Overview
- **TitleSplash** → animated entry (same UI system)
- **MainMenu** → select `Episode 3`
- **EpisodeSelection** → choose `The Perfect Victory`
- **VisualNovelGame** → HUD + dialogue + interactions
- **Case Evaluation** → rank + rewards + epilogue

---

## Act 1 — The Upset

### Scene 0 `Opening`
- **Layout**: Office morning scene
- **Key Beats**: Dark Horses 3-0 sweep, urgent email from Marcus
- **Reward**: `casefile-ep3`

### Scene 1 `Legend Arena HQ`
- **Layout**: Conference room briefing
- **Key Beats**: Marcus, Maya, Ryan, Camille outline sudden collapse on Day 40

### Scene 2 `Phoenix Captain Interview`
- **Layout**: Secure call with Jake
- **Key Beats**: Input lag, “scripted” opponents, emotional plea
- **Reward**: `testimony-jake`

---

## Act 2 — Deep Dive

### Scene 3 `Match Data Outlier Scan`
- **UI**: Data lab + graph widget
- **Mini-game**: `graph-analysis` (identify finals anomaly)
- **Reward**: `evidence-final-spike`

### Scene 4 `Timeline Reconstruction`
- **UI**: Timeline board
- **Mini-game**: `timeline_reconstruction` (Harrison joins → collapse)
- **Reward**: `timeline-day40`

### Scene 5 `Betting Pattern Investigation`
- **UI**: Betting dashboard overlay
- **Mini-game**: `database_search` (flag F-prefix wallets)
- **Reward**: `ledger-f-series`

---

## Act 3 — The Web

### Scene 6 `Alex Reunion`
- **Layout**: Video call
- **Key Beats**: Alex suspects manipulation; glimpsed “F” chat
- **Reward**: `witness-alex`

### Scene 7 `Coach Harrison Interview`
- **Layout**: Dramatic interrogation lighting
- **Mini-game**: `testimony_press` (break “you see” excuses)

### Scene 8 `Encrypted Message Recovery`
- **UI**: Forensics lab + holographic viewer
- **Mini-game**: `document-viewer` (partial decrypt of F-PRIME messages)

---

## Act 4 — Exposure

### Scene 9 `Harrison Confession`
- **Layout**: Detention room
- **Key Beats**: Harrison confirms deal, mentions latency scripts, missing payout

### Scene 10 `Case Report Assembly`
- **UI**: Report room
- **Mini-game**: `case-report` (WHO/WHEN/HOW/WHY + evidence checklist)

### Scene 11 `The Fixer Revealed`
- **Layout**: Office dawn, evidence board glow
- **Mini-game**: `rank-display` (dynamic dialogue per rank)
- **Reward**: `codex-f-prime`

---

## Post-Credits `Scene X — Operation Perfect Storm`
- **Unlock**: Finish Episode 3
- **UI**: Encrypted dossier terminal
- **Content**: Full Fixer playbook, ROI, threat escalation
- **Reward**: `fixer-operation-log`

---

## HUD & State Hooks
- **GameHUD**: Hints used, evidence collected, XP
- **Rewards**: XP boosts after major discoveries (+20~100)
- **State Flags**: `ledger-f-series`, `timeline-day40`, `codex-f-prime`
- **Audio**: Suspense SFX during testimonies; revelation stingers at Rank screen

---

## Future Hooks
- **Fixer Pattern**: 03:00 AM messages, F-prefix accounts, reused Episode 2 backdoor
- **Episode 4 Tease**: “We hunt them next” → Data Heist setup
