"""
Kastor Data Academy - 새로운 UI 디자인 데모
기존 로직 + Tailwind 스타일 적용
"""

import streamlit as st
import pandas as pd
import plotly.express as px
from styles_new_design import apply_new_design_styles, render_progress_cards, render_badge_icons

# 페이지 설정
st.set_page_config(
    page_title="Kastor Data Academy - 새 디자인",
    page_icon="🔍",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# 새로운 디자인 스타일 적용
apply_new_design_styles()

# 세션 상태 초기화
if 'detective_score' not in st.session_state:
    st.session_state.detective_score = 145
if 'badges' not in st.session_state:
    st.session_state.badges = ['🔍 이상치 탐정', '📋 문서 분석가', '🖥️ 로그 헌터']
if 'current_stage' not in st.session_state:
    st.session_state.current_stage = 5

# 타이틀
st.markdown("""
<h1 style='text-align: center; font-family: "Playfair Display", serif; color: var(--primary); margin-bottom: 2rem;'>
🔍 Kastor Data Academy
</h1>
<p style='text-align: center; color: var(--gray-700); margin-bottom: 3rem;'>
데이터 탐정이 되어 사건을 해결하세요
</p>
""", unsafe_allow_html=True)

# 진행 상황 카드 (새 디자인)
render_progress_cards(
    stage=st.session_state.current_stage,
    points=st.session_state.detective_score,
    badges_count=len(st.session_state.badges)
)

# 2열 레이아웃
col1, col2 = st.columns([0.4, 0.6])

# 왼쪽: 증거 자료
with col1:
    st.markdown("### 📊 Evidence Data")

    # 증거 섹션 1: 캐릭터 통계
    with st.expander("📊 CHARACTER STATS", expanded=True):
        st.markdown("""
        <p class="progress-label">Total Engagements</p>
        <p class="progress-value text-cyan">7,820</p>
        <p style="font-size: 0.875rem; color: var(--gray-700);">
            Last 30 Days <span class="text-green">+12.5%</span>
        </p>
        """, unsafe_allow_html=True)

        # 샘플 차트
        df_sample = pd.DataFrame({
            '스탯': ['STR', 'DEX', 'INT', 'CON'],
            '값': [90, 45, 50, 40]
        })
        fig = px.bar(df_sample, x='스탯', y='값', color='값', color_continuous_scale='RdYlGn')
        st.plotly_chart(fig, use_container_width=True)

    # 증거 섹션 2: 일일 트렌드
    with st.expander("📈 DAILY TRENDS"):
        df_trend = pd.DataFrame({
            '날짜': pd.date_range('2025-01-20', periods=10),
            '승률': [50, 52, 49, 51, 85, 86, 84, 83, 82, 81]
        })
        fig2 = px.line(df_trend, x='날짜', y='승률', markers=True)
        fig2.update_traces(line_color='#00F6FF', line_width=3)
        st.plotly_chart(fig2, use_container_width=True)

    # 증거 섹션 3-6
    with st.expander("📄 PATCH NOTES"):
        st.markdown("""
        <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.875rem;">
        v2.45.1 - Balance adjustments to character STR.<br/>
        v2.45.0 - New map 'Cyberia' introduced.
        </p>
        """, unsafe_allow_html=True)

    with st.expander("🖥️ SERVER LOGS"):
        st.code("[2025-01-25 23:51:10] IP: 192.168.1.101 LOGIN_SUCCESS")

    with st.expander("👤 PLAYER PROFILE"):
        st.markdown("""
        **USER**: 'Nyx'<br/>
        **Device ID**: <span class="text-cyan">a4-3f-8c-b1-d5-e9</span><br/>
        **Status**: Suspicious Activity Flagged
        """, unsafe_allow_html=True)

    with st.expander("🎮 MATCH HISTORY"):
        st.markdown("Match #7781: Anomaly detected - unusual packet loss.")

    # 배지 표시
    st.markdown("### 🏆 Acquired Badges")
    render_badge_icons(st.session_state.badges, total=7)

# 오른쪽: 채팅
with col2:
    st.markdown("### 💬 Conversation with Kastor")

    # 샘플 채팅 메시지
    with st.chat_message("assistant"):
        st.markdown("""
        It appears there's an anomaly in the server logs from yesterday.
        Take a closer look at the **📅 Shadow Daily** section!
        """)

    with st.chat_message("user"):
        st.markdown("I'm on it. Filtering for suspicious IP addresses now.")

    with st.chat_message("assistant"):
        st.markdown("""
        Excellent! Cross-reference the flagged IP with the player profile data.
        Do you see a connection?
        """)

    # 타이핑 인디케이터
    with st.chat_message("assistant"):
        st.markdown('<div class="typing-indicator">Kastor is typing...</div>', unsafe_allow_html=True)

    # 응답 옵션
    st.markdown("---")
    col_a, col_b = st.columns(2)
    with col_a:
        if st.button("✅ I see a match with user 'Nyx'.", use_container_width=True):
            st.success("정답입니다! +50 포인트")
    with col_b:
        if st.button("❌ No connection found.", use_container_width=True):
            st.warning("다시 확인해보세요!")

# 푸터
st.markdown("""
---
<div style="text-align: center; color: var(--gray-700); font-size: 0.875rem; margin-top: 2rem;">
    <p>🎨 <b>새로운 디자인 적용됨</b> - Tailwind CSS 스타일</p>
    <p>Made with ❤️ for Kastor Data Academy</p>
</div>
""", unsafe_allow_html=True)
