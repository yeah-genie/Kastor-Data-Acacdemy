# Data Detective Academy – Visual Novel UI

## Overview
This repository contains the **Data Detective Academy** prototype, rebuilt as a visual-novel style experience.  
The project blends branching narrative, interactive data puzzles, and cinematic UI transitions to deliver each episode.

Key UI pillars:
- **Visual Novel Scenes** with portrait layouts, animated backgrounds, and choice-driven dialogue.
- **Game HUD Overlay** that tracks hints, evidence, and score without interrupting the story.
- **Scene Transitions & Effects** (fade, slide, screen shake, evidence reveal) for dramatic pacing.
- **Modular Mini-games** mapped to story `interactions` (graph analysis, timeline reconstruction, testimony press, etc.).

## Current Episode Coverage
| Episode | Title | Notes |
|---------|-------|-------|
| EP01 | The Missing Balance Patch | JSON-driven flow, full UI + puzzle integration |
| EP02 | The Ghost User's Ranking Manipulation | Legacy script (TypeScript) pending migration |
| EP03 | The Perfect Victory | JSON conversion in progress, mirrors EP01 pipeline |

Future work: migrate Episode 2 to the new JSON schema and continue expanding the Fixer storyline teased in EP03.

## Getting Started
```bash
npm install
npm run dev      # launches Vite + React dev server
npm run build    # builds client and server bundles
```

The development server runs on Vite; API endpoints (TTS, persistence) live under the `server/` directory.

## Repository Structure
```
client/                 # React + Vite front-end
  src/components/       # UI components (visual novel, HUD, puzzles)
  src/data/             # Episode graphs, metadata, unlock data
server/                 # Express server (TTS, storage)
docs/                   # Design notes (flowcharts, planning)
shared/                 # Shared types / schemas
attached_assets/        # Reference UI mocks & art exports
```

### Data Files of Interest
- `client/src/data/episode1.json` – Episode 1 story, scenes, and interaction mapping.
- `client/src/data/episode3.json` – Episode 3 story (new schema).
- `client/src/data/stories.ts` – Story registry and metadata.

## Content Update Workflow
1. **Script Source**: Export the Notion episode document to Markdown and drop it into the repo (for traceability).
2. **JSON Conversion**: Mirror the EP01 schema—acts → scenes → dialogue + `interactions`—and place it in `client/src/data/`.
3. **Register Episode**: Update `stories.ts` to reference the new JSON.
4. **UI Hooks**: Ensure `VisualNovelGame` handles any new interaction types or rewards.
5. **Documentation**: Add a flowchart or update this README with new episode milestones.

> Tip: keep reward IDs unique (`codex-*`, `ledger-*`) and define new mini-games in `visual-novel` components if required.

## Release Notes (to be updated regularly)
- **2025-11-11**: Episode 1 migrated to JSON story graph + new visual novel UI.
- **2025-11-11**: Episode 3 script ingested, initial JSON structure created (pending full integration).
- **TODO**: Convert Episode 2, implement cross-episode save/resume, expand Fixer codex.

---
For questions, bug reports, or design prompts, open an issue describing the requested UI/mini-game so it can be translated into `interactions` data and companion components.
