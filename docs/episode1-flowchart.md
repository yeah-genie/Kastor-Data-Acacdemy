# Episode 1 — Visual Novel Flow Chart

## Navigation Overview
- **TitleSplash** → animated logo (`TitleSplash.tsx`)
- **MainMenu** → primary navigation (`MainMenu.tsx`)
- **EpisodeSelectionScreen** → select `EP01` card
- **SceneTransition** → fade-to-office (`SceneTransition.tsx`)
- **GameHUD + VisualNovelDialogue** → all investigative scenes
- **Case Evaluation Overlay** → rank reveal + rewards

---

## Act 0 — Briefing

### Scene 0.1 `Office Introduction`
- **Layout**: `VisualNovelDialogue` top portraits, bottom dialogue UI
- **HUD**: Minimal (hud hidden)
- **Flow**
  1. Narration sets office mood
  2. Kastor wake-up animation (idle → surprised)
  3. Player name input via `ActionBar` → triggers mini celebration (`GameHUD` toast)
  4. `SceneTransition` slide-left → Scene 0.2

### Scene 0.2 `First Case Arrives`
- **Layout**: Dialogue with animated email overlay (`ModalOverlay`)
- **Key Interaction**: `document-viewer` open email with scroll animation
- **Choice Node**: `first-hypothesis` (buttons in dialogue area)
- **Reward**: `Case accepted` mini celebration badge

### Scene 0.3 `Call with Maya`
- **Layout**: Split-screen hologram (VisualNovelDialogue with call background)
- **Audio Cue**: Phone ring via `useAudio`
- **Transition**: zoom-in to data lab

---

## Act 1 — Data Investigation

### Scene 1.1 `Graph Analysis`
- **UI**: `VisualNovelDialogue` + inline graph widget (upper-right slot)
- **Mini-game**: `graph-analysis` (interactive chart component)
- **HUD**: Displays `Evidence Slots` (Shadow spike added on success)
- **Reward**: `Pattern recognized` toast + item `clue-shadow-spike`

### Scene 1.2 `Patch Notes & Server Logs`
- **UI**: Dual panel document viewer (`SceneTransition` overlay for parchment effect)
- **Interaction**: `document-compare` drag-and-highlight tasks
- **Follow-up Call**: Inline call overlay to Maya (picture-in-picture)

---

## Act 2 — Timeline Reconstruction

### Scene 2.1 `Timeline Reconstruction`
- **UI**: Timeline board mode (full-width mini-game)
- **Mini-game**: Drag cards onto chronological rail (`timeline` component)
- **Reward**: `Timeline complete` celebration + item `timeline-evidence`

### Scene 2.2 `Lukas Interview`
- **UI**: Video call layout (portrait swap to Lukas)
- **Tone**: Dialogue only, no HUD updates
- **Transition**: Hard cut to cyber desk with scanline effect

---

## Act 3 — Player Tracing

### Scene 3.1 `IP Tracking`
- **UI**: Database terminal overlay (grid background)
- **Mini-game**: `database-search` filter; results cards animate in
- **Reward**: `Culprit identified` toast + item `evidence-ip-match`

### Scene 3.2 `Diego Interview`
- **UI**: Quick call; VisualNovel layout
- **Outcome**: clears secondary suspect, adds log entry in HUD

---

## Act 4 — Confrontation

### Scene 4.1 `Confronting Kaito`
- **UI**: Dramatic lighting, screen shake on evidence presentation
- **Transition**: `SceneTransition` → `CharacterCloseup` for Kaito

### Scene 4.2 `Testimony Press`
- **UI**: `CinematicDialogue` variant (centered statements)
- **Mini-game**: `testimony-press` with evidence wheel on right panel
- **Reward**: Major celebration `Case Solved!` + medal item

---

## Act 5 — Closure

### Scene 5.1 `Confession & Reactions`
- **UI**: Sequential dialogue with character portrait swaps
- **HUD**: Evidence checklist auto-completes

### Scene 5.2 `Case Report Assembly`
- **UI**: Full-screen `case-report` form (cards for WHO/WHEN/HOW/WHY)
- **Interaction**: Player selects answers; checklist ticks animate

### Scene 5.3 `Case Evaluation`
- **UI**: Rank screen overlay with `SceneTransition` neon sweep
- **Logic**: Displays rank-specific dialogue blocks

### Scene 5.4 `Closing Banter`
- **UI**: Back to office lobby; minimal HUD
- **Outcome**: Episode unlock banner; return to EpisodeSelection

---

## Post-Credits `Scene X — Fixer Dossier`
- **Unlock Condition**: Complete Episode 3
- **UI**: Encrypted terminal (glitch animation)
- **Content**: Classified log scroll, reveals Fixer plan
- **Reward**: `codex-fixer` entry added to Codex viewer

---

## Data & Event Hooks
- **State Tracking**
  - `partnershipFormed`, `caseAccepted`, `graphSolved`, `timelineSolved`, `ipMatched`, `testimonyCleared`, `caseReportComplete`
- **HUD Slots**
  - Evidence badges (Shadow spike, Timeline board, IP report)
  - Hint tokens consumed per mini-game
- **Audio Strategy**
  - Scene-specific SFX triggers (door, email, call, evidence reveal)
- **Transition Palette**
  - Act boundaries use `SceneTransition` (fade/slide)
  - Mini-game start uses `ScreenShake` or `EvidenceReveal` when applicable
