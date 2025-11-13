# Kastor Data Academy

**Kastor Data Academy** is an immersive cyber-investigation game that blends interactive storytelling with data analysis challenges.  
The project provides a React + Vite dashboard experience where players chat with an AI partner, inspect evidence, and hunt for patterns in complex datasets.

## Project Overview
- **Genre**: Interactive narrative + data mystery
- **Platform**: Web (React, Vite)
- **Core Concept**: Solve cyber incidents with the AI assistant `Kastor` inside a detective dashboard
- **Primary Views**: Chat, Data Analysis, Evidence Files, Team Network, Episode Progress
- **Episode Structure**: JSON scene graph with branching choices, puzzles, and unlockable evidence

### 프로젝트 개요
- **장르**: 인터랙티브 스토리 + 데이터 추리 게임
- **플랫폼**: 웹(React, Vite)
- **핵심 콘셉트**: AI 어시스턴트 `Kastor`와 함께 사이버 범죄를 수사하는 탐정 대시보드
- **주요 뷰**: Chat, Data Analysis, Evidence Files, Team Network, Episode Progress
- **에피소드 구조**: JSON 기반 장면 그래프 + 선택지 브랜칭 + 퍼즐·증거 해금

## Installation & Scripts
```bash
npm install        # install dependencies
npm run dev        # launch Vite dev server
npm run build      # create production bundle
npm run preview    # inspect production build locally
```
- Default dev server port: `5173`
- Express utility server entry point: `server/index.ts`

### 설치 및 실행
```bash
npm install        # 의존성 설치
npm run dev        # Vite 개발 서버 실행
npm run build      # 프로덕션 번들 빌드
npm run preview    # 빌드 결과 미리보기
```
- 기본 개발 서버 포트: `5173`
- Express 유틸 서버 진입점: `server/index.ts`

## Tech Stack / 기술 스택
- **Frontend / 프런트엔드**: React 18, TypeScript, Vite
- **Styling / 스타일링**: styled-components 기반 테마 & 글로벌 스타일
- **Animation / 애니메이션**: Framer Motion
- **State / 상태 관리**: Zustand stores (`useGame`, `useDetectiveGame`)
- **Routing / 라우팅**: react-router-dom
- **Data Layer / 데이터 레이어**: JSON episode payloads + SceneManager
- **Backend / 백엔드**: Express + Vite middleware (TTS, persistence APIs)
- **Key Libraries / 주요 라이브러리**: `@tanstack/react-query`, `lucide-react`, `react-force-graph`, `react-table`, Playwright (E2E), Web Audio helpers

## Project Structure
```
client/
  src/
    components/       # layout, chat/data/files/team views
    data/             # episode JSON, character & evidence metadata
    lib/              # persistence, TTS, shared utilities
    store/            # Zustand game state
    utils/            # scene manager, progress tracker, audio, etc.
    styles/           # theme and global CSS
server/
  index.ts            # Express entry point
  routes.ts           # REST endpoints (TTS, storage)
docs/                 # flowcharts, design notes
shared/               # shared schemas between client/server
```

### 프로젝트 구조
```
client/
  src/
    components/       # 레이아웃, Chat/Data/Files/Team 뷰
    data/             # 에피소드 JSON, 캐릭터·증거 메타데이터
    lib/              # 상태 저장, TTS, 공통 유틸
    store/            # Zustand 게임 상태
    utils/            # SceneManager, ProgressTracker, 사운드 등
    styles/           # 테마 및 전역 스타일
server/
  index.ts            # Express 진입점
  routes.ts           # TTS·저장소 등 REST 엔드포인트
docs/                 # 플로우차트, 설계 노트
shared/               # 클라이언트-서버 공용 스키마
```

## Development Workflow
1. Author episode specs → export to JSON (`client/src/data/episodes/`)
2. Extend shared types in `client/src/types/index.ts` and related helpers
3. Wire gameplay logic via `store/gameStore.ts` and `utils/sceneManager.ts`
4. Implement UI modules inside `client/src/components/`
5. Validate with Playwright E2E tests and developer tooling
6. Ship production build (`npm run build`) and deploy (see `DEPLOYMENT_GUIDE.md`)

### 개발 워크플로 개요
1. 에피소드 스펙 작성 후 JSON으로 변환 (`client/src/data/episodes/`)
2. 공통 타입 확장 (`client/src/types/index.ts` 등)
3. `store/gameStore.ts`, `utils/sceneManager.ts`로 게임 로직 연결
4. `client/src/components/`에 UI 모듈 구현
5. Playwright E2E 테스트 및 개발용 도구로 검증
6. `npm run build` 후 `DEPLOYMENT_GUIDE.md`를 참고해 배포

## Phase Roadmap
| Phase | Focus | Key Outputs / References |
|-------|-------|--------------------------|
| Phase 1 – Setup | Vite + React + TS scaffolding, theming, base types | `vite.config.ts`, `tsconfig.json`, `client/src/styles/theme.ts`, `client/src/types/index.ts` |
| Phase 2 – Layout | Dashboard layout, tab routing, responsive shell | `components/layout/Dashboard.tsx`, `pages/Dashboard.tsx`, `context/TabContext.tsx` |
| Phase 3 – Chat | Messaging UI, branching choices, evidence sharing | `components/chat/ChatView.tsx`, `components/chat/ChoiceButton.tsx`, `components/chat/EvidenceCard.tsx` |
| Phase 4 – Data | Analysis table, pattern puzzle, filters & alerts | `components/data/DataView.tsx`, `components/data/PuzzleContainer.tsx` |
| Phase 5 – Files | Evidence browser, detailed viewers, search/filter | `components/files/FilesView.tsx`, `components/files/viewers/*` |
| Phase 6 – Team | Character profiles, timelines, relationship graph | `components/team/TeamView.tsx`, `components/team/RelationshipGraph.tsx` |
| Phase 7 – State | Zustand store, SceneManager, progress tracking | `store/gameStore.ts`, `utils/sceneManager.ts`, `utils/progressTracker.ts` |
| Phase 8 – Data Assets | Episode 4 JSON, character & evidence datasets | `data/episodes/episode4.json`, `data/characters.json` |
| Phase 9 – Polish | Motion variants, micro-interactions, audio | `utils/animations.ts`, `utils/soundManager.ts` |
| Phase 10 – Responsive & A11y | Mobile UX, accessibility, reduced motion | global styles, component-level accessibility work |
| Phase 11 – Testing | Dev tooling, console commands, error boundaries | `tests/dashboard.e2e.spec.ts`, `test-results/`, dev utilities |
| Phase 12 – Build & Deploy | Production optimization, deployment workflows | `DEPLOYMENT_GUIDE.md`, `package.json` scripts, hosting configs |

### 단계별 로드맵
| Phase | 초점 | 주요 산출물 / 참고 파일 |
|-------|------|-------------------------|
| Phase 1 – 초기 설정 | Vite + React + TS 스캐폴딩, 테마, 기본 타입 | `vite.config.ts`, `tsconfig.json`, `client/src/styles/theme.ts`, `client/src/types/index.ts` |
| Phase 2 – 레이아웃 | 대시보드 레이아웃, 탭 라우팅, 반응형 셸 | `components/layout/Dashboard.tsx`, `pages/Dashboard.tsx`, `context/TabContext.tsx` |
| Phase 3 – Chat | 메시지 UI, 브랜칭 선택지, 증거 공유 | `components/chat/ChatView.tsx`, `components/chat/ChoiceButton.tsx`, `components/chat/EvidenceCard.tsx` |
| Phase 4 – Data | 분석 테이블, 패턴 퍼즐, 필터·알림 | `components/data/DataView.tsx`, `components/data/PuzzleContainer.tsx` |
| Phase 5 – Files | 증거 브라우저, 상세 뷰어, 검색/필터 | `components/files/FilesView.tsx`, `components/files/viewers/*` |
| Phase 6 – Team | 캐릭터 프로필, 타임라인, 관계도 그래프 | `components/team/TeamView.tsx`, `components/team/RelationshipGraph.tsx` |
| Phase 7 – 상태 관리 | Zustand 스토어, SceneManager, 진행도 추적 | `store/gameStore.ts`, `utils/sceneManager.ts`, `utils/progressTracker.ts` |
| Phase 8 – 데이터 자산 | Episode 4 JSON, 캐릭터·증거 데이터셋 | `data/episodes/episode4.json`, `data/characters.json` |
| Phase 9 – 폴리시 | 모션 변형, 마이크로 인터랙션, 사운드 | `utils/animations.ts`, `utils/soundManager.ts` |
| Phase 10 – 반응형 & 접근성 | 모바일 UX, 접근성, 모션 감소 대응 | 전역 스타일 및 컴포넌트 접근성 작업 |
| Phase 11 – 테스트 | 개발 도구, 콘솔 커맨드, 에러 바운더리 | `tests/dashboard.e2e.spec.ts`, `test-results/`, 개발 유틸 |
| Phase 12 – 빌드 & 배포 | 프로덕션 최적화, 배포 워크플로 | `DEPLOYMENT_GUIDE.md`, `package.json` scripts, 호스팅 설정 |

## Additional Documentation
- `cursor_prompts.md`: detailed development prompts covering Phase 1–12
- `DEPLOYMENT_GUIDE.md`: environment setup, build, and deployment procedures
- `docs/episode*-flowchart.md`: episode progression flowcharts
- `TTS_SETUP_GUIDE.md`: text-to-speech configuration guide

### 추가 문서
- `cursor_prompts.md`: Phase 1~12 개발 프롬프트 및 요구사항
- `DEPLOYMENT_GUIDE.md`: 환경 구성, 빌드, 배포 절차
- `docs/episode*-flowchart.md`: 에피소드 진행 플로우차트
- `TTS_SETUP_GUIDE.md`: 음성 합성 설정 가이드

---
For questions or feedback, open an issue in this repository.  
문의나 피드백은 이슈로 남겨 주세요.
