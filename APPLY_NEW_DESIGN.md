# 🎨 새로운 UI 디자인 적용 가이드

## 📋 개요

기존 `app.py`의 로직은 그대로 유지하면서 **새로운 Tailwind 스타일** 디자인을 적용하는 방법입니다.

---

## 🚀 빠른 시작

### 방법 1: 기존 app.py 수정 (권장)

기존 `app.py` 파일의 **맨 위**에 다음 코드를 추가하세요:

```python
# 기존 import 아래에 추가
from styles_new_design import apply_new_design_styles, render_progress_cards, render_badge_icons

# add_mobile_styles() 함수 호출 대신 사용
apply_new_design_styles()
```

#### 변경 전:
```python
# app.py 기존 코드 (62번째 줄 근처)
def add_mobile_styles():
    st.markdown("""<style>...</style>""", unsafe_allow_html=True)

# ... 메인 코드에서
add_mobile_styles()  # 이 부분을 변경
```

#### 변경 후:
```python
# app.py 상단에 import 추가
from styles_new_design import apply_new_design_styles

# ... 메인 코드에서
apply_new_design_styles()  # 새 스타일 적용
```

---

### 방법 2: 데모 앱으로 테스트

새로운 스타일만 적용한 데모 버전을 실행:

```bash
streamlit run app_new_design_demo.py
```

---

## 🎯 주요 변경사항

### 1. 색상 테마

#### 데스크톱 (클린 그레이 테마)
- Primary: `#7C3AED` (보라색)
- Background: `#F9FAFB` (밝은 회색)
- 카드: `#E5E7EB` (그레이)

#### 모바일 (아카데미 다크 테마)
- Primary: `#4C2AFF` (로열 퍼플)
- Background: `#2D1B4E` (딥 퍼플)
- Accent: `#00F6FF` (네온 시안)

### 2. 폰트

- **제목**: Playfair Display, Cinzel
- **본문**: Roboto, Space Grotesk
- **데이터/코드**: JetBrains Mono

### 3. 레이아웃

- 2열 레이아웃 (40% 증거, 60% 채팅)
- 카드 스타일 증거 섹션
- 그리드 기반 진행 상황 표시

---

## 📦 새로운 컴포넌트 사용법

### 1. 진행 상황 카드

기존 코드를 다음과 같이 교체:

```python
# 기존
st.metric("포인트", detective_score)

# 새 디자인
from styles_new_design import render_progress_cards

render_progress_cards(
    stage=5,
    points=st.session_state.detective_score,
    badges_count=len(st.session_state.badges)
)
```

### 2. 배지 아이콘

```python
# 기존
for badge in st.session_state.badges:
    st.write(f"🏆 {badge}")

# 새 디자인
from styles_new_design import render_badge_icons

render_badge_icons(st.session_state.badges, total=7)
```

### 3. 증거 섹션

```python
# 기존
with st.expander("📊 캐릭터 데이터"):
    st.dataframe(df_characters)

# 새 디자인 (자동 적용됨 - 스타일만 변경)
with st.expander("📊 캐릭터 데이터"):
    st.dataframe(df_characters)  # 스타일이 자동으로 적용됩니다
```

---

## 🔧 커스터마이징

### 색상 변경

`styles_new_design.py` 파일의 `:root` 섹션 수정:

```css
:root {
    --primary: #7C3AED;  /* 원하는 색상으로 변경 */
    --neon-cyan: #00F6FF;
    /* ... */
}
```

### 폰트 변경

Google Fonts 링크 수정:

```python
st.markdown("""
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet"/>
""", unsafe_allow_html=True)
```

---

## 📱 반응형 디자인

### 자동 감지

- **데스크톱 (> 768px)**: 클린 그레이 테마
- **모바일 (< 768px)**: 아카데미 다크 테마

### 수동 설정

특정 테마를 강제하려면:

```python
# 항상 다크 테마
st.markdown("""
<style>
@media (min-width: 769px) {
    /* 데스크톱에서도 다크 테마 사용 */
    [data-testid="column"] {
        background: var(--midnight) !important;
    }
}
</style>
""", unsafe_allow_html=True)
```

---

## ✅ 체크리스트

기존 `app.py`에 새 디자인을 적용하기 전 확인사항:

- [ ] `styles_new_design.py` 파일이 프로젝트 루트에 있음
- [ ] `app.py` 상단에 `from styles_new_design import ...` 추가
- [ ] `add_mobile_styles()` → `apply_new_design_styles()` 변경
- [ ] 진행 상황 표시를 `render_progress_cards()` 사용으로 변경 (선택사항)
- [ ] 로컬에서 테스트: `streamlit run app.py`

---

## 🐛 문제 해결

### Q: 스타일이 적용되지 않아요

**A**: 브라우저 캐시를 지우고 페이지를 새로고침하세요:
- Chrome/Edge: `Ctrl + Shift + R` (Windows) 또는 `Cmd + Shift + R` (Mac)
- Firefox: `Ctrl + F5`

### Q: 모바일에서 데스크톱 스타일이 보여요

**A**: 브라우저 개발자 도구에서 모바일 모드로 전환:
- `F12` → 모바일 아이콘 클릭

### Q: 폰트가 로드되지 않아요

**A**: 인터넷 연결 확인 (Google Fonts CDN 필요)

---

## 📊 Before & After 비교

### 기존 디자인
- 기본 Streamlit 컴포넌트
- 단순한 색상
- 제한적인 커스터마이징

### 새 디자인
- ✅ Tailwind 스타일 적용
- ✅ 전문적인 색상 팔레트
- ✅ 커스텀 폰트 (Google Fonts)
- ✅ 반응형 레이아웃
- ✅ 부드러운 애니메이션
- ✅ 카드 기반 UI
- ✅ 커스텀 스크롤바

---

## 🎬 다음 단계

1. **테스트**: 로컬에서 새 디자인 확인
2. **커스터마이징**: 색상/폰트를 브랜드에 맞게 조정
3. **피드백**: 사용자 테스트 진행
4. **배포**: Streamlit Cloud에 푸시

---

## 📝 참고 자료

- **Tailwind CSS**: https://tailwindcss.com/docs/customization
- **Google Fonts**: https://fonts.google.com/
- **Material Symbols**: https://fonts.google.com/icons
- **Streamlit Theming**: https://docs.streamlit.io/library/advanced-features/theming

---

**Made with ❤️ for Kastor Data Academy**
