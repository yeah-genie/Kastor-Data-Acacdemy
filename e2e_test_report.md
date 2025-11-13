# cursor_prompts.md E2E 테스트 결과 리포트

**문서**: cursor_prompts.md
**테스트 일자**: 2025-11-13
**전체 평가**: B+ (80/100) - ✅ 충족 (일부 보완 권장)

---

## 📊 전체 요약

| # | 평가 항목 | 결과 | 점수 |
|---|----------|------|------|
| 1 | 프로젝트 개요 전달력 | ✅ 충족 | 10/10 |
| 2 | 단계별 프롬프트 완결성 | ✅ 대체로 충족 | 8.5/10 |
| 3 | 기능 요구사항의 테스트 가능성 | ✅ 충족 | 9/10 |
| 4 | 디자인·UX 지침 충실도 | ✅ 충족 (매우 우수) | 9.5/10 |
| 5 | 국제화(i18n) 및 복수 언어 고려 | ❌ 보완 필요 | 3/10 |
| 6 | 상태 관리 및 로직 명세 정확성 | ✅ 충족 (우수) | 9/10 |
| 7 | 데이터 구조 일관성 | ⚠️ 보완 필요 | 6.5/10 |
| 8 | 테스트 및 배포 지침 실효성 | ✅ 충족 | 8.5/10 |
| 9 | 문서 구조 및 내비게이션 편의성 | ✅ 충족 | 8.5/10 |
| 10 | 추가 프롬프트/캐릭터 지침 활용성 | ✅ 충족 | 7.5/10 |
| **전체 평균** | | **✅ 충족** | **80/100** |

---

## 1️⃣ 프로젝트 개요 전달력

**평가**: ✅ 충족 (10/10)
**위치**: cursor_prompts.md:6-24

### 강점
- ✅ 게임 콘셉트 명확: "educational detective game" with AI assistant Kastor
- ✅ 대상 사용자 구체적: 15-25세
- ✅ 플랫폼 명시: Web (React), PC/모바일 반응형
- ✅ 톤앤매너 정의: Modern, professional, slightly playful
- ✅ 4가지 주요 뷰(Chat, Data, Files, Team) 구조 명확

### 평가
초기 세팅을 진행하는 사람이 문서만 보고도 전체 방향을 이해할 수 있음.

---

## 2️⃣ 단계별 프롬프트 완결성 (Phase 1-12)

**평가**: ✅ 대체로 충족 (8.5/10)
**위치**: Phase 1 (28-193줄) ~ Phase 12 (1339-1422줄)

### Phase별 검토

| Phase | 독립 실행 가능 | 의존성 명시 | 경로/컴포넌트명 | 비고 |
|-------|---------------|-------------|-----------------|------|
| Phase 1 | ✅ | ✅ | ✅ | 완벽 |
| Phase 2 | ✅ | ✅ | ✅ | 완벽 |
| Phase 3 | ✅ | ✅ | ✅ | 완벽 |
| Phase 4 | ✅ | ⚠️ | ✅ | 라이브러리 선택 모호 |
| Phase 5 | ✅ | ⚠️ | ✅ | 라이브러리 선택 모호 |
| Phase 6 | ✅ | ⚠️ | ✅ | 라이브러리 선택 모호 |
| Phase 7 | ✅ | ✅ | ✅ | 완벽 |
| Phase 8 | ✅ | ✅ | ✅ | 완벽 |
| Phase 9 | ✅ | ✅ | ✅ | 완벽 |
| Phase 10 | ✅ | ✅ | ✅ | 완벽 |
| Phase 11 | ✅ | ✅ | ✅ | 완벽 |
| Phase 12 | ✅ | ✅ | ✅ | 완벽 |

### 보완 권장
1. **라이브러리 명확화**:
   - Phase 4-1 (470줄): "react-table or similar" → `@tanstack/react-table` 명시
   - Phase 5-2 (638줄): "Prism.js or Highlight.js" → `Prism.js` 기본 추천
   - Phase 6-2 (775줄): `react-force-graph-2d` 명시
2. **Phase 간 의존성 표시**: 일부 Phase는 이전 Phase 완료가 필수인데 명시되지 않음
3. **타입 임포트**: 후속 Phase에서 Phase 1-2의 타입 사용 시 임포트 경로 명시

---

## 3️⃣ 기능 요구사항의 테스트 가능성

**평가**: ✅ 충족 (9/10)

### 각 뷰별 인터랙션 검증 가능성

| 뷰 | 요구사항 구체성 | 입력-출력 명확성 | 테스트 시나리오 |
|----|----------------|------------------|-----------------|
| **Chat View** | ✅ 매우 구체적 | ✅ 명확 | 메시지 표시, 선택지 클릭, 증거 첨부 |
| **Data View** | ✅ 매우 구체적 | ✅ 명확 | 필터링, 정렬, 패턴 감지, 페이지네이션 |
| **Files View** | ✅ 매우 구체적 | ✅ 명확 | 폴더 탐색, 파일 미리보기, 검색 |
| **Team View** | ✅ 매우 구체적 | ✅ 명확 | 캐릭터 선택, 탭 전환, 관계도 인터랙션 |

### 복잡한 기능의 입력-출력 조건

✅ **퍼즐 시스템** (Phase 4-2:475-520):
- 입력: 필터 적용, 패턴 감지
- 출력: 행 하이라이트, 성공 모달, 포인트 +50, 증거 언락
- 힌트: -10 포인트

✅ **씬 전환** (Phase 7-2:835-885):
- 입력: 선택지 선택, 요구사항 확인
- 출력: 관계도 변경, 씬 언락, 상태 업데이트

✅ **증거 시스템** (Phase 3-3, Phase 5):
- 수집: Kastor 공유 → 자동 저장 → 배지 표시
- 조회: Files 뷰 접근 → 타입별 뷰어

### 보완 권장
- 엣지 케이스 명시 (빈 상태, 에러 상태)
- 타임아웃 시나리오 (선택 시간 제한)

---

## 4️⃣ 디자인·UX 지침 충실도

**평가**: ✅ 충족 (매우 우수) (9.5/10)

### 반응형 디자인

| 요소 | 모바일 | 데스크탑 | 명시 위치 |
|------|--------|----------|-----------|
| 브레이크포인트 | ✅ 768px | ✅ 1440px | Phase 1-1:86-89 |
| 네비게이션 | ✅ 하단 고정 | ✅ 사이드바 | Phase 2-1:224-233 |
| 메시지 버블 | ✅ 85% 너비 | ✅ 70% 너비 | Phase 3-1:312 |
| 데이터 테이블 | ✅ 수평 스크롤 | ✅ 전체 표시 | Phase 4-1:464-469 |
| 제스처 지원 | ✅ 스와이프/롱프레스 | - | Phase 2-2:278-281 |

### 애니메이션 세부 명세

✅ **Phase 9-1 전용 섹션** (1084-1133):
- 탭 전환: Fade (200ms) → Delay (100ms) → Fade in (300ms)
- 메시지: Fade + slide from bottom
- 마이크로 인터랙션: Hover scale (1.05x), Shadow lift
- 성능: 60fps 목표
- **Reduced motion 지원** 명시

### 접근성 지침

✅ **Phase 10-2 전용 섹션** (1238-1289):
- 키보드 네비게이션: Tab, Enter/Space, Escape, Arrow keys
- WCAG 색상 대비: 4.5:1 (일반), 3:1 (큰 텍스트)
- 스크린 리더: Semantic HTML, ARIA
- 테스트 도구: eslint-plugin-jsx-a11y, Lighthouse

### 보완 권장
1. ⚠️ **다크 모드** 지원 여부 미명시
2. ⚠️ **태블릿** (768-1024px) 동작이 일부 섹션에서 누락
3. ⚠️ 터치 타겟 최소 크기 (44px) 일관성

---

## 5️⃣ 국제화(i18n) 및 복수 언어 고려

**평가**: ❌ 보완 필요 (중요) (3/10)

### 현재 상태

| 요소 | 상태 | 위치 |
|------|------|------|
| 한글 폰트 | ✅ 포함 | Phase 1-1:83 ('Noto Sans KR') |
| i18n 시스템 | ❌ 미언급 | - |
| 번역 키 구조 | ❌ 미언급 | - |
| 언어 전환 UI | ❌ 미언급 | - |
| 문자열 관리 지침 | ❌ 미언급 | - |

### 누락된 내용

1. ❌ **i18n 라이브러리**: react-i18next, react-intl 등 미지정
2. ❌ **번역 파일 구조**: `src/locales/en.json`, `src/locales/ko.json`
3. ❌ **번역 키 네이밍**: `chat.message.sent`, `evidence.collected`
4. ❌ **언어 설정 UI**: 언어 선택 드롭다운
5. ❌ **하드코딩 방지**: 모든 UI 텍스트를 번역 키로 관리
6. ❌ **날짜/시간 형식**: 로케일별 포맷팅

### 🔴 긴급 추가 필요: Phase 1-3

```markdown
## Phase 1-3: 국제화(i18n) 설정

### Prompt 1-3: i18n 시스템 구축

REQUIREMENTS:
1. Install: npm install react-i18next i18next
2. Create translation files:
   - src/locales/en/translation.json (default)
   - src/locales/ko/translation.json
3. Configure i18next:
   - Language detection
   - Fallback language: 'en'
4. Translation key structure:
   - common.button.{action}
   - chat.message.{type}
   - evidence.collected
5. Language switcher in settings menu
6. NO hardcoded strings in components
7. Date/time localization with date-fns

Example translation.json:
{
  "common": {
    "button": {
      "submit": "Submit",
      "cancel": "Cancel"
    }
  },
  "chat": {
    "message": {
      "sent": "Message sent",
      "typing": "Kastor is typing..."
    }
  }
}
```

---

## 6️⃣ 상태 관리 및 로직 명세 정확성

**평가**: ✅ 충족 (우수) (9/10)

### Zustand 스토어 (Phase 7-1:784-833)

| 요소 | 완전성 | 위치 |
|------|--------|------|
| 상태 구조 | ✅ 9개 필드 정의 | 791-801 |
| 액션 | ✅ 9개 메서드 정의 | 802-811 |
| 헬퍼 함수 | ✅ 4개 정의 | 813-817 |
| 영속성 | ✅ 자동 저장(30초), 다중 슬롯 | 819-823 |
| 미들웨어 | ✅ Logger, Persist, DevTools | 825-828 |

### SceneManager (Phase 7-2:835-885)

✅ **씬 로딩**: loadScene, 요구사항 검증, 프리로드
✅ **씬 전환**: 4가지 전환 타입
✅ **조건부 로직**: 증거, 선택, 캐릭터 신뢰도
✅ **분기 처리**: getNextScene → 관계도 업데이트 → 씬 언락
✅ **자동 저장**: 씬 전환 전, 선택 후, 증거 수집 시

### AchievementManager (Phase 7-3:887-942)

✅ **진행도 계산**: 0-100%
✅ **포인트 시스템**: +10~+100, -10/-30
✅ **통계 추적**: 시간, 힌트, 증거, 선택, 정확도

### 보완 권장
1. ⚠️ SceneManager 구조: 클래스 vs 유틸리티 함수 명확화
2. ⚠️ 에러 처리: "Handle edge cases" → 구체적 시나리오
3. ⚠️ 성능: 대규모 상태 업데이트 시 배칭 전략

---

## 7️⃣ 데이터 구조 일관성

**평가**: ⚠️ 보완 필요 (6.5/10)

### TypeScript vs JSON 불일치

| 요소 | TypeScript 정의 | JSON 예시 | 일관성 |
|------|----------------|-----------|--------|
| **Scene.type** | 'chat' \| 'data' \| ... | 'cinematic' (974줄) | ❌ |
| **Message.type** | 'text' \| 'system' \| ... | 'alert' (997줄) | ❌ |
| **Episode** | learningObjectives | achievements (1067줄) | ❌ |
| **Episode** | - | thumbnail (961줄) | ❌ |
| **Scene** | - | autoPlay (978줄) | ❌ |
| **Scene vs Message** | choices in Message | choices in Scene (1013줄) | ⚠️ |
| **Evidence** | isNew: boolean | - | ❌ |
| **Evidence** | - | unlockedBy (1061줄) | ❌ |
| **Choice** | relationshipChange: number | +1 (1020줄) | ❌ JSON 문법 오류 |

### 🔴 긴급 수정 필요

#### 1. TypeScript 타입 정의 업데이트 (cursor_prompts.md:154, 133, 166)

```typescript
interface Scene {
  id: string;
  type: 'chat' | 'data' | 'files' | 'team' | 'interactive' | 'cinematic'; // + cinematic
  title: string;
  autoPlay?: boolean; // 새 필드
  messages?: Message[];
  dataContent?: any;
  interactiveContent?: any;
  nextScene?: string;
  requirements?: {
    evidence?: string[];
    choices?: string[];
  };
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'evidence' | 'system' | 'choice' | 'alert'; // + alert
  attachments?: Evidence[];
  choices?: Choice[];
}

interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: string;
  thumbnail?: string; // 새 필드
  scenes: Scene[];
  characters: string[];
  evidence: Evidence[];
  learningObjectives?: string[];
  achievements?: Achievement[]; // 통일 필요
}

interface Evidence {
  id: string;
  type: 'document' | 'log' | 'email' | 'image' | 'video';
  title: string;
  content: any;
  dateCollected: string;
  relatedTo: string[];
  importance: 'low' | 'medium' | 'high' | 'critical';
  isNew: boolean;
  unlockedBy?: string; // 새 필드
}
```

#### 2. JSON 문법 오류 수정 (cursor_prompts.md:1020)

```json
// 잘못됨
"relationshipChange": { "camille": +1 }

// 올바름
"relationshipChange": { "camille": 1 }
```

---

## 8️⃣ 테스트 및 배포 지침 실효성

**평가**: ✅ 충족 (8.5/10)

### 개발/디버깅 도구 (Phase 11-1:1294-1337)

| 도구 | 구체성 | 실행 가능성 |
|------|--------|-------------|
| 씬 디버거 | ✅ UI, 단축키 | ✅ 구현 가능 |
| 콘솔 커맨드 | ✅ 5개 정의 | ✅ 즉시 사용 |
| 에러 바운더리 | ✅ React 패턴 | ✅ 구현 가능 |
| 로깅 | ✅ 4가지 이벤트 | ✅ 구현 가능 |
| 성능 모니터링 | ✅ React Profiler | ✅ DevTools |

### 최종 체크리스트 (1426-1483)

✅ **기능** (7항목): 씬, 선택지, 증거, 퍼즐, 캐릭터, 저장, 네비게이션
✅ **비주얼** (7항목): 60fps, 반응형, 로딩/빈/에러 상태
✅ **성능** (5항목): 로딩 < 3초, 스크롤, 메모리, 이미지, 코드 분할
✅ **접근성** (5항목): 키보드, 스크린 리더, WCAG AA
✅ **브라우저** (7항목): Chrome, Firefox, Safari, Mobile

### 배포 옵션 (1384-1422)

| 플랫폼 | 구체성 | 실행 가능성 |
|--------|--------|-------------|
| Vercel | ✅ CLI + 명령어 | ✅ 즉시 배포 |
| Netlify | ✅ 빌드 설정 | ✅ 즉시 배포 |
| GitHub Pages | ✅ 언급 | ⚠️ 단계 미제공 |
| Cloudflare Pages | ✅ 언급 | ⚠️ 단계 미제공 |

### 보완 권장

1. ❌ **단위/통합 테스트**: Jest, Vitest, React Testing Library 미언급
2. ❌ **E2E 테스트**: Playwright, Cypress 미언급
3. ⚠️ **CI/CD**: GitHub Actions YAML 예시 미제공
4. ⚠️ **환경 변수**: .env.example 구조 미제공

---

## 9️⃣ 문서 구조 및 내비게이션 편의성

**평가**: ✅ 충족 (8.5/10)

### 문서 구조

```
cursor_prompts.md (1566줄)
├── 프로젝트 개요 (6-24) 🎯
├── Phase 1-12 (28-1422) 📋
│   ├── Phase 1: 초기 설정 → Phase 12: 배포
├── 최종 체크리스트 (1426-1483) 🎯
├── 추가 프롬프트 (1487-1518) 📝
├── 사용 방법 (1522-1541) 🚀
└── 참고 자료 (1545-1562) 📚
```

**논리적 순서**: ✅ 초기화 → UI → 로직 → 데이터 → 폴리시 → 테스트/배포

### 일관성 검토

| 요소 | 일관성 | 예시 |
|------|--------|------|
| 헤더 레벨 | ✅ | `##` Phase, `###` Prompt |
| 코드 블록 | ✅ | 모든 프롬프트 ``` 감싸기 |
| 이모지 | ✅ | 🎯📋📝🚀📚, 💬📊🗂️👥 |
| 프롬프트 번호 | ✅ | `Prompt X-Y: 제목` |

### 보완 권장

1. ❌ **목차(TOC)**: 문서 상단에 링크 가능한 목차 추가
2. ⚠️ **예상 시간**: 각 Phase 완료 예상 시간
3. ⚠️ **의존성 표시**: Phase 간 의존성 명시

---

## 🔟 추가 프롬프트/캐릭터 지침 활용성

**평가**: ✅ 충족 (7.5/10)

### Kastor 캐릭터 지침 (1488-1518)

**성격 특성** (7가지):
1. ✅ Enthusiastic but oblivious
2. ✅ Dad jokes
3. ✅ Smart but awkward
4. ✅ Genuinely helpful
5. ✅ Misses social cues
6. ✅ Numbers/data obsessed
7. ✅ Celebrates loudly

**대사 예시** (4개): ✅ 각 특성을 잘 보여줌
**작성 지침** (5가지): ✅ 명확
**톤 가이드**: ✅ "Endearing, not annoying"

**실제 적용 가능성**: ✅ 높음

### 🟡 중요 보완 사항

**다른 캐릭터 지침 부재**:

Episode 4에 등장하는 6명 중 5명 성격 지침 없음:
- ❌ Marcus Chen
- ❌ Maya Zhang
- ❌ Camille Beaumont
- ❌ Isabella Torres
- ❌ Alex Reeves
- ❌ Olivia Brennan

### 권장 추가 섹션

```markdown
## 📝 추가 프롬프트: 기타 캐릭터 성격

### Marcus Chen (CTO)
TRAITS:
- 냉정하고 논리적
- 압박 상황에서도 침착
- 기술 용어 자주 사용
- 팀 책임감 강함

DIALOGUE EXAMPLES:
- "Let's focus on the facts, not speculation."
- "I need concrete evidence, not theories."

### Maya Zhang (Security Analyst)
TRAITS:
- 빠른 사고, 직관적
- 약간 경쟁적
- 보안 집착
- 과잉 반응

DIALOGUE EXAMPLES:
- "I KNEW something was off!"
- "We need to lock this down NOW."

(Camille, Isabella, Alex, Olivia 동일 형식)
```

---

## 🎯 종합 결론 및 개선 로드맵

### 전체 평가

**B+ (80/100) - ✅ 충족 (일부 보완 권장)**

cursor_prompts.md는 **전반적으로 매우 우수한 품질**이며, 대부분의 E2E 테스트 평가 항목을 충족합니다.

### 주요 강점

1. ✅ **명확한 프로젝트 비전**: 게임 콘셉트, 대상, 플랫폼 명확
2. ✅ **체계적 Phase 구조**: 12단계 논리적 구성
3. ✅ **디테일한 UX 지침**: 반응형, 애니메이션, 접근성 상세
4. ✅ **실행 가능한 코드**: TypeScript, JSON, theme 즉시 사용
5. ✅ **포괄적 체크리스트**: 기능, 성능, 접근성 모두 포함

### 핵심 보완 사항 우선순위

#### 🔴 긴급 (즉시 수정 권장)

1. **데이터 구조 일관성** (항목 7):
   - TypeScript 타입 정의 업데이트
   - JSON 문법 오류 수정 (`+1` → `1`)
   - Scene type에 'cinematic', 'alert' 추가
   - 필드 누락 보완 (thumbnail, autoPlay, unlockedBy)

2. **i18n 시스템 추가** (항목 5):
   - Phase 1-3: 국제화 설정 프롬프트 추가
   - react-i18next 설치 및 설정
   - 번역 파일 구조 정의
   - 언어 전환 UI 지침

#### 🟡 중요 (단기 개선)

3. **캐릭터 지침 확장** (항목 10):
   - 5명 캐릭터 성격, 말투, 대사 예시 추가
   - 상황별 대사 가이드

4. **테스트 프레임워크** (항목 8):
   - Phase 11-2: 자동화 테스트 프롬프트 추가
   - Jest/Vitest, Playwright/Cypress 설정

5. **라이브러리 명확화** (항목 2):
   - Phase 4, 5, 6에서 기본 추천 라이브러리 명시

#### 🟢 선택 (중장기 개선)

6. **문서 개선** (항목 9):
   - 상단에 목차(TOC) 추가
   - Phase별 예상 소요 시간
   - 의존성 다이어그램

7. **CI/CD 구체화** (항목 8):
   - GitHub Actions YAML 예시
   - .env.example 파일 구조

8. **다크 모드** (항목 4):
   - theme에 다크 모드 색상
   - 테마 전환 UI

### 개선 후 예상 점수

위 핵심 보완 사항(1-5)을 완료하면:
**A+ (95/100)** 수준의 완벽한 문서

---

## 📝 즉시 적용 가능한 수정사항

### 1. Phase 1-2 타입 정의 수정 (cursor_prompts.md:98-193)

**수정 위치**: 154줄, 133줄, 166줄

```typescript
// Scene 타입 수정
interface Scene {
  id: string;
  type: 'chat' | 'data' | 'files' | 'team' | 'interactive' | 'cinematic'; // + cinematic
  title: string;
  autoPlay?: boolean; // 추가
  messages?: Message[];
  dataContent?: any;
  interactiveContent?: any;
  nextScene?: string;
  requirements?: {
    evidence?: string[];
    choices?: string[];
  };
}

// Message 타입 수정
interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'evidence' | 'system' | 'choice' | 'alert'; // + alert
  attachments?: Evidence[];
  choices?: Choice[];
}

// Episode 타입 수정
interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: string;
  thumbnail?: string; // 추가
  scenes: Scene[];
  characters: string[];
  evidence: Evidence[];
  learningObjectives: string[];
  achievements?: Achievement[]; // 선택적 추가
}

// Evidence 타입 수정
interface Evidence {
  id: string;
  type: 'document' | 'log' | 'email' | 'image' | 'video';
  title: string;
  content: any;
  dateCollected: string;
  relatedTo: string[];
  importance: 'low' | 'medium' | 'high' | 'critical';
  isNew: boolean;
  unlockedBy?: string; // 추가
}
```

### 2. Phase 8-1 JSON 수정 (cursor_prompts.md:1020)

**수정 전**:
```json
"consequence": {
  "relationshipChange": {
    "camille": +1
  }
}
```

**수정 후**:
```json
"consequence": {
  "relationshipChange": {
    "camille": 1
  }
}
```

### 3. Phase 1 다음에 추가: Phase 1-3 국제화 설정

**삽입 위치**: cursor_prompts.md:194줄 직전

```markdown
### Prompt 1-3: 국제화(i18n) 시스템 설정

REQUIREMENTS:

1. INSTALL DEPENDENCIES:
   - npm install react-i18next i18next i18next-browser-languagedetector

2. CREATE TRANSLATION FILES:
   src/locales/
   ├── en/
   │   └── translation.json
   └── ko/
       └── translation.json

3. TRANSLATION FILE STRUCTURE (src/locales/en/translation.json):
{
  "common": {
    "button": {
      "submit": "Submit",
      "cancel": "Cancel",
      "next": "Next",
      "back": "Back"
    },
    "loading": "Loading...",
    "error": "An error occurred"
  },
  "chat": {
    "message": {
      "sent": "Message sent",
      "typing": "{{name}} is typing..."
    },
    "input": {
      "placeholder": "Type your message...",
      "send": "Send"
    }
  },
  "evidence": {
    "collected": "Evidence collected",
    "new": "New Evidence",
    "types": {
      "document": "Document",
      "log": "Log",
      "email": "Email",
      "image": "Image",
      "video": "Video"
    }
  },
  "team": {
    "trustLevel": "Trust Level",
    "suspect": "Suspect",
    "cleared": "Cleared"
  },
  "achievements": {
    "earned": "Achievement Earned!",
    "points": "{{points}} points"
  }
}

4. I18N CONFIGURATION (src/i18n/config.ts):
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../locales/en/translation.json';
import koTranslation from '../locales/ko/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ko: { translation: koTranslation }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

5. USAGE IN COMPONENTS:
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <button>{t('common.button.submit')}</button>;
};

6. LANGUAGE SWITCHER (add to Settings):
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="ko">한국어</option>
    </select>
  );
};

7. IMPORTANT RULES:
   - NEVER hardcode strings in components
   - Always use t() function for all user-facing text
   - Add new keys to translation files immediately
   - Use date-fns for date/time localization

8. DATE/TIME LOCALIZATION:
import { format } from 'date-fns';
import { enUS, ko } from 'date-fns/locale';

const locale = i18n.language === 'ko' ? ko : enUS;
const formattedDate = format(new Date(), 'PPP', { locale });
```

---

## 📊 최종 권장사항

### 즉시 실행 (이번 주)

1. ✅ TypeScript 타입 정의 수정 (30분)
2. ✅ JSON 문법 오류 수정 (5분)
3. ✅ Phase 1-3 i18n 프롬프트 추가 (1시간)

### 단기 (1-2주)

4. ✅ 5명 캐릭터 성격 지침 작성 (2시간)
5. ✅ Phase 11-2 자동화 테스트 프롬프트 추가 (1시간)
6. ✅ 라이브러리 명시 (Phase 4, 5, 6) (30분)

### 중기 (1개월)

7. ✅ 문서 TOC 추가 (30분)
8. ✅ GitHub Actions YAML 예시 (1시간)
9. ✅ 다크 모드 theme 추가 (1시간)

---

**리포트 종료**
