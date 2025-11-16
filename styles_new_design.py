"""
새로운 UI 디자인 스타일 (Tailwind 스타일 적용)
기존 app.py에서 import해서 사용
"""

import streamlit as st

def apply_new_design_styles():
    """
    Tailwind CSS 기반 새로운 디자인 스타일 적용
    - 데스크톱: 클린한 그레이 테마
    - 모바일: 아카데미 다크 테마
    """

    # Google Fonts 로드
    st.markdown("""
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;700&family=Playfair+Display:wght@700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>
    """, unsafe_allow_html=True)

    st.markdown("""
    <style>
    /* ========================================
       글로벌 설정
    ======================================== */

    :root {
        /* 데스크톱 색상 (클린 그레이) */
        --primary: #7C3AED;
        --bg-light: #F9FAFB;
        --bg-dark: #111827;
        --gray-50: #F9FAFB;
        --gray-100: #F3F4F6;
        --gray-200: #E5E7EB;
        --gray-300: #D1D5DB;
        --gray-700: #374151;
        --gray-800: #1F2937;
        --gray-900: #111827;

        /* 모바일 색상 (아카데미 테마) */
        --academy-purple: #4C2AFF;
        --deep-purple: #2D1B4E;
        --midnight: #1A1625;
        --neon-cyan: #00F6FF;
        --electric-violet: #B458FF;
        --hologram-green: #39FF14;
        --ghost-white: #F7F5FF;
        --ai-bubble: #7C3AED;
        --player-bubble: #E5E5EA;
    }

    /* 기본 폰트 */
    body, html, * {
        font-family: 'Roboto', 'Space Grotesk', sans-serif !important;
    }

    /* 제목 폰트 */
    h1, h2, h3 {
        font-family: 'Playfair Display', 'Cinzel', serif !important;
        font-weight: 700 !important;
    }

    /* 데이터/코드 폰트 */
    code, pre, .stCodeBlock {
        font-family: 'JetBrains Mono', monospace !important;
    }

    /* ========================================
       레이아웃 최적화
    ======================================== */

    /* 전체 화면 설정 */
    .main .block-container {
        max-width: 1400px !important;
        padding: 1rem 2rem !important;
    }

    /* 2열 레이아웃 */
    [data-testid="column"] {
        background: var(--gray-50);
        border-radius: 0.5rem;
        padding: 1.5rem !important;
        min-height: 80vh;
    }

    [data-testid="column"]:first-child {
        background: var(--gray-100);
    }

    /* ========================================
       증거 섹션 (Expander) 스타일
    ======================================== */

    .streamlit-expanderHeader {
        background: var(--gray-200) !important;
        border-radius: 0.5rem !important;
        border: 1px solid var(--gray-300) !important;
        padding: 1rem 1.5rem !important;
        font-weight: 700 !important;
        font-size: 1.1rem !important;
        color: var(--gray-700) !important;
        transition: all 0.2s ease !important;
    }

    .streamlit-expanderHeader:hover {
        background: var(--gray-300) !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .streamlit-expanderContent {
        background: var(--gray-50) !important;
        border: 1px solid var(--gray-200) !important;
        border-top: none !important;
        border-radius: 0 0 0.5rem 0.5rem !important;
        padding: 1.5rem !important;
    }

    /* 확장/축소 아이콘 색상 */
    .streamlit-expanderHeader svg {
        fill: var(--primary) !important;
    }

    /* ========================================
       진행 상황 카드
    ======================================== */

    .progress-card {
        background: var(--gray-200) !important;
        border-radius: 0.75rem !important;
        padding: 1.5rem !important;
        border: 1px solid var(--gray-300) !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .progress-label {
        font-size: 0.875rem !important;
        color: var(--gray-700) !important;
        font-weight: 500 !important;
        margin-bottom: 0.5rem;
    }

    .progress-value {
        font-size: 1.875rem !important;
        font-weight: 700 !important;
        font-family: 'JetBrains Mono', monospace !important;
    }

    .progress-value-cyan {
        color: var(--neon-cyan) !important;
    }

    .progress-value-green {
        color: var(--hologram-green) !important;
    }

    .progress-value-purple {
        color: var(--primary) !important;
    }

    /* ========================================
       채팅 메시지 스타일
    ======================================== */

    /* AI 메시지 (Kastor) */
    .stChatMessage[data-testid="assistant-message"] {
        background: var(--ai-bubble) !important;
        border-radius: 1rem !important;
        border-top-left-radius: 0 !important;
        padding: 0.75rem 1rem !important;
        color: white !important;
        max-width: 65% !important;
        margin-left: 3rem !important;
        box-shadow: 0 2px 4px rgba(124, 58, 237, 0.2) !important;
    }

    /* 사용자 메시지 */
    .stChatMessage[data-testid="user-message"] {
        background: var(--player-bubble) !important;
        border-radius: 1rem !important;
        border-top-right-radius: 0 !important;
        padding: 0.75rem 1rem !important;
        color: var(--gray-900) !important;
        max-width: 65% !important;
        margin-right: 3rem !important;
        margin-left: auto !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    }

    /* 채팅 아바타 */
    .stChatMessage .st-emotion-cache-1v0mbdj img {
        border-radius: 50% !important;
        border: 2px solid var(--primary) !important;
        width: 40px !important;
        height: 40px !important;
    }

    /* ========================================
       버튼 스타일
    ======================================== */

    .stButton > button {
        background: var(--gray-200) !important;
        color: var(--gray-800) !important;
        border-radius: 0.5rem !important;
        border: 1px solid var(--gray-300) !important;
        padding: 0.75rem 1.5rem !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;
    }

    .stButton > button:hover {
        background: var(--gray-300) !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* 주요 버튼 (Primary) */
    .stButton > button[kind="primary"] {
        background: var(--primary) !important;
        color: white !important;
        border: none !important;
    }

    .stButton > button[kind="primary"]:hover {
        background: var(--electric-violet) !important;
    }

    /* ========================================
       배지 스타일
    ======================================== */

    .badge {
        display: inline-block;
        background: var(--primary);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 600;
        margin: 0.25rem;
        box-shadow: 0 2px 4px rgba(124, 58, 237, 0.3);
    }

    .badge-icon {
        font-size: 1.25rem;
        margin-right: 0.5rem;
    }

    /* ========================================
       데이터프레임 & 차트
    ======================================== */

    .stDataFrame {
        border: 1px solid var(--gray-300) !important;
        border-radius: 0.5rem !important;
        overflow: hidden;
    }

    .stPlotlyChart {
        background: var(--gray-50) !important;
        border-radius: 0.5rem !important;
        padding: 1rem !important;
    }

    /* ========================================
       스크롤바 커스텀
    ======================================== */

    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: var(--gray-700);
        border-radius: 3px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--gray-800);
    }

    /* ========================================
       모바일 최적화
    ======================================== */

    @media (max-width: 768px) {
        /* 모바일에서 아카데미 다크 테마 적용 */
        [data-testid="column"] {
            background: var(--midnight) !important;
        }

        .streamlit-expanderHeader {
            background: var(--deep-purple) !important;
            color: var(--ghost-white) !important;
            border-color: rgba(255, 255, 255, 0.2) !important;
        }

        .streamlit-expanderContent {
            background: var(--midnight) !important;
            color: var(--ghost-white) !important;
        }

        body {
            background: var(--deep-purple) !important;
        }

        .main {
            background: var(--deep-purple) !important;
        }

        /* 모바일 채팅 메시지 크기 조정 */
        .stChatMessage {
            max-width: 85% !important;
            font-size: 0.95rem !important;
        }

        /* 모바일 버튼 터치 최적화 */
        .stButton > button {
            min-height: 44px !important;
            font-size: 1rem !important;
        }
    }

    /* ========================================
       다크 모드 지원 (브라우저 설정)
    ======================================== */

    @media (prefers-color-scheme: dark) {
        :root {
            --bg-light: var(--bg-dark);
            --gray-50: var(--gray-900);
            --gray-100: var(--gray-800);
            --gray-200: var(--gray-700);
        }

        body {
            background: var(--bg-dark) !important;
            color: var(--ghost-white) !important;
        }

        [data-testid="column"] {
            background: var(--gray-900) !important;
        }

        .streamlit-expanderHeader {
            background: var(--gray-800) !important;
            color: var(--ghost-white) !important;
        }
    }

    /* ========================================
       애니메이션
    ======================================== */

    @keyframes badgePop {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    .badge-new {
        animation: badgePop 0.5s ease-out;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    .typing-indicator {
        animation: pulse 1.5s ease-in-out infinite;
    }

    /* ========================================
       유틸리티 클래스
    ======================================== */

    .text-cyan {
        color: var(--neon-cyan) !important;
    }

    .text-green {
        color: var(--hologram-green) !important;
    }

    .text-purple {
        color: var(--primary) !important;
    }

    .text-gray {
        color: var(--gray-700) !important;
    }

    .bg-midnight {
        background: var(--midnight) !important;
    }

    .bg-gray-light {
        background: var(--gray-100) !important;
    }

    .rounded-lg {
        border-radius: 0.5rem !important;
    }

    .shadow-md {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
    }

    </style>
    """, unsafe_allow_html=True)


def render_progress_cards(stage, points, badges_count, total_badges=7):
    """
    진행 상황 카드 렌더링 (HTML 스타일)
    """
    st.markdown(f"""
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
        <!-- Current Stage Card -->
        <div class="progress-card">
            <p class="progress-label">Current Stage</p>
            <p class="progress-value progress-value-cyan">{stage} <span class="text-gray">/ 13</span></p>
        </div>

        <!-- Accumulated Points Card -->
        <div class="progress-card">
            <p class="progress-label">Accumulated Points</p>
            <p class="progress-value progress-value-green">{points:,}</p>
        </div>

        <!-- Badges Card -->
        <div class="progress-card">
            <p class="progress-label">Acquired Badges</p>
            <p class="progress-value progress-value-purple">{badges_count} <span class="text-gray">/ {total_badges}</span></p>
        </div>
    </div>
    """, unsafe_allow_html=True)


def render_badge_icons(badges_list, total=7):
    """
    배지 아이콘 시각화
    """
    filled = len(badges_list)
    empty = total - filled

    icons_html = ""
    for _ in range(filled):
        icons_html += '<span class="material-symbols-outlined text-purple" style="font-size: 1.5rem; margin: 0 0.25rem; font-variation-settings: \'FILL\' 1;">verified</span>'
    for _ in range(empty):
        icons_html += '<span class="material-symbols-outlined text-gray" style="font-size: 1.5rem; margin: 0 0.25rem; opacity: 0.3;">verified</span>'

    st.markdown(f"""
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;">
        {icons_html}
    </div>
    """, unsafe_allow_html=True)


def create_evidence_section(title, content_html, icon="📊", expanded=False):
    """
    증거 섹션을 HTML 스타일로 생성
    """
    with st.expander(f"{icon} {title}", expanded=expanded):
        st.markdown(content_html, unsafe_allow_html=True)
