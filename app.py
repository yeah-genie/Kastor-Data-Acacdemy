import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from anthropic import Anthropic
import os
from dotenv import load_dotenv
import time
import re

# 환경 변수 로드
load_dotenv()

# 페이지 설정
st.set_page_config(
    page_title="캐스터 데이터 아카데미 - 에피소드 1",
    page_icon="🔍",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# API 키 로드 (Streamlit Cloud와 로컬 모두 지원)
def get_api_key():
    # Streamlit Cloud Secrets 먼저 확인
    if hasattr(st, 'secrets') and 'ANTHROPIC_API_KEY' in st.secrets:
        return st.secrets['ANTHROPIC_API_KEY']
    # 환경 변수 확인
    elif os.getenv("ANTHROPIC_API_KEY"):
        return os.getenv("ANTHROPIC_API_KEY")
    else:
        return None

# Claude 클라이언트 초기화
api_key = get_api_key()
if api_key:
    client = Anthropic(api_key=api_key)
else:
    st.error("⚠️ API 키가 설정되지 않았습니다. Streamlit Cloud Secrets 또는 .env 파일을 확인하세요.")
    st.stop()

# 이름 정리 함수 (조사 및 호칭 제거)
def clean_name(raw_name):
    """이름에서 한국어 조사, 호칭, 특수문자를 제거하여 깨끗한 이름만 추출"""
    # "예진이야", "예진이", "예진야" -> "예진"
    # "철수님", "지우씨" -> "철수", "지우"
    import re

    cleaned = raw_name.strip()

    # 특수문자 제거
    cleaned = re.sub(r'[^\w\s가-힣]', '', cleaned)

    # 마지막 글자가 조사/호칭인 경우 제거 (우선순위: 긴 것부터)
    suffixes_to_remove = ["이야", "야", "님", "씨", "이", "아"]
    for suffix in suffixes_to_remove:
        if cleaned.endswith(suffix) and len(cleaned) > len(suffix):
            cleaned = cleaned[:-len(suffix)]
            break

    return cleaned.strip()

# 모바일 감지 및 CSS 스타일링
def add_mobile_styles():
    """모바일 최적화 CSS 추가 (전역 스크롤 허용, 섹션별 스크롤)"""
    st.markdown("""
    <style>
    /* 전역 스크롤 허용 */
    html, body, [data-testid="stAppViewContainer"], .main {
        overflow: auto !important;
        height: auto !important;
        max-height: none !important;
    }

    .main .block-container {
        overflow: visible !important;
        padding: 0.5rem 1rem !important;
        padding-bottom: 0 !important;
    }

    /* 헤더 영역 축소 */
    .main .block-container > div:first-child {
        padding-top: 0.5rem !important;
    }

    /* 주요 컨테이너들은 자체 스크롤 사용 */
    [data-testid="stVerticalBlock"] > [data-testid="stVerticalBlock"] {
        max-height: none !important;
    }

    /* 탭 컨텐츠 높이 제한 */
    .stTabs [data-baseweb="tab-panel"] {
        max-height: 75vh;
        overflow-y: auto;
    }

    /* 채팅 컨테이너 자동 스크롤 */
    [data-testid="stVerticalBlock"] > div:has(.stChatMessage) {
        display: flex !important;
        flex-direction: column !important;
        overflow-y: auto !important;
        max-height: 70vh;
        padding-bottom: 80px !important; /* 입력창 위한 공간 */
    }

    /* 모바일 최적화 */
    @media (max-width: 768px) {
        .block-container {
            padding: 1rem 0.5rem !important;
        }

        .stTabs [data-baseweb="tab-panel"] {
            max-height: 70vh;
            overflow-y: auto;
        }

        .stExpander {
            font-size: 0.9rem;
        }

        /* 모바일에서 채팅 컨테이너 높이 조정 */
        [data-testid="stVerticalBlock"] > div:has(.stChatMessage) {
            max-height: 60vh;
            padding-bottom: 100px !important;
        }
    }

    /* 채팅 입력창 위치 고정 */
    .stChatFloatingInputContainer {
        position: sticky !important;
        bottom: 0px !important;
        background: white;
        padding: 10px 0;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        z-index: 999;
    }

    /* 메시지 간격 및 스타일 조정 - 카카오톡/디스코드 스타일 */
    .stChatMessage {
        margin-bottom: 0.8rem !important;
        padding: 0.5rem !important;
        border-radius: 12px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
    }

    /* 사용자 메시지 스타일 (오른쪽, 노란색 말풍선) */
    .stChatMessage[data-testid="user-message"] {
        background: linear-gradient(135deg, #FFE500 0%, #FFF3A0 100%) !important;
        margin-left: 20% !important;
        border-bottom-right-radius: 4px !important;
    }

    /* AI 메시지 스타일 (왼쪽, 흰색 말풍선) */
    .stChatMessage[data-testid="assistant-message"] {
        background: white !important;
        margin-right: 20% !important;
        border-bottom-left-radius: 4px !important;
        border: 1px solid #e0e0e0 !important;
    }

    /* 메시지 내용 텍스트 스타일 */
    .stChatMessage p {
        margin: 0 !important;
        line-height: 1.5 !important;
        color: #333 !important;
    }

    /* 스크롤바 스타일 개선 */
    [data-testid="stVerticalBlock"]::-webkit-scrollbar {
        width: 8px;
    }

    [data-testid="stVerticalBlock"]::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    [data-testid="stVerticalBlock"]::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
    }

    [data-testid="stVerticalBlock"]::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    /* 배지 스타일 */
    .badge {
        display: inline-block;
        padding: 0.3rem 0.6rem;
        margin: 0.2rem;
        border-radius: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-size: 0.9rem;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        animation: badgePop 0.3s ease-out;
    }

    @keyframes badgePop {
        0% { transform: scale(0); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }

    .badge-gold {
        background: linear-gradient(135deg, #f7b733 0%, #fc4a1a 100%);
    }

    .badge-silver {
        background: linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%);
    }

    /* 증거 카드 */
    .evidence-card {
        background: #f8f9fa;
        border-left: 4px solid #667eea;
        padding: 1rem;
        margin: 0.5rem 0;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
    }

    .evidence-card.found {
        border-left-color: #51cf66;
        background: #f1f9f4;
        animation: evidenceFound 0.5s ease-out;
    }

    @keyframes evidenceFound {
        0% { transform: translateX(-20px); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }

    /* 패치 노트 카드 */
    .patch-card {
        background: white;
        border: 2px solid #e9ecef;
        border-radius: 12px;
        padding: 1.2rem;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: transform 0.2s;
    }

    .patch-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }

    .patch-card.suspicious {
        border-color: #fa5252;
        background: #fff5f5;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%, 100% { box-shadow: 0 4px 6px rgba(250, 82, 82, 0.2); }
        50% { box-shadow: 0 4px 12px rgba(250, 82, 82, 0.4); }
    }

    .patch-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.8rem;
        padding-bottom: 0.8rem;
        border-bottom: 1px solid #dee2e6;
    }

    .patch-date {
        font-size: 1.1rem;
        font-weight: bold;
        color: #495057;
    }

    .patch-version {
        background: #667eea;
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.85rem;
    }

    .patch-item {
        margin: 0.5rem 0;
        padding: 0.5rem;
        background: #f8f9fa;
        border-radius: 6px;
    }

    .warning-flag {
        color: #fa5252;
        font-weight: bold;
        font-size: 1.2rem;
        animation: blink 1s infinite;
    }

    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    /* 탐정 느낌 */
    .detective-board {
        background: #2d3436;
        color: #dfe6e9;
        padding: 1rem;
        border-radius: 8px;
        font-family: 'Courier New', monospace;
    }

    /* 액션 버튼 */
    .action-button {
        display: inline-block;
        padding: 0.5rem 1rem;
        margin: 0.3rem;
        background: #667eea;
        color: white;
        border-radius: 20px;
        text-decoration: none;
        font-size: 0.85rem;
        transition: all 0.2s;
        cursor: pointer;
        border: none;
    }

    .action-button:hover {
        background: #5568d3;
        transform: scale(1.05);
    }

    /* 점수 카운터 애니메이션 */
    @keyframes scoreUp {
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); color: #51cf66; }
        100% { transform: translateY(0); }
    }

    .score-animation {
        animation: scoreUp 0.5s ease-out;
    }

    /* 데이터 컨테이너 높이 제한 */
    .stExpander > div > div {
        max-height: 400px;
        overflow-y: auto;
    }

    /* 모션 축소 환경 대응 */
    @media (prefers-reduced-motion: reduce) {
        .badge, .evidence-card.found, .patch-card.suspicious, .score-animation {
            animation: none !important;
        }
    }
    </style>
    """, unsafe_allow_html=True)

add_mobile_styles()

# 세션 상태 초기화
if "messages" not in st.session_state:
    st.session_state.messages = []
if "episode_stage" not in st.session_state:
    st.session_state.episode_stage = "scene_0"  # Scene 0부터 시작
if "hypotheses" not in st.session_state:
    st.session_state.hypotheses = []
if "user_name" not in st.session_state:
    st.session_state.user_name = None
if "last_message_count" not in st.session_state:
    st.session_state.last_message_count = 0
if "intro_step" not in st.session_state:
    st.session_state.intro_step = 0
if "evidence_found" not in st.session_state:
    st.session_state.evidence_found = []
if "detective_score" not in st.session_state:
    st.session_state.detective_score = 0
if "badges" not in st.session_state:
    st.session_state.badges = []
if "hints_used" not in st.session_state:
    st.session_state.hints_used = 0
if "awaiting_name_input" not in st.session_state:
    st.session_state.awaiting_name_input = False
if "filter_date" not in st.session_state:
    st.session_state.filter_date = None
if "filter_user" not in st.session_state:
    st.session_state.filter_user = None
if "filter_action" not in st.session_state:
    st.session_state.filter_action = None
if "graph_verified" not in st.session_state:
    st.session_state.graph_verified = False
if "patch_notes_verified" not in st.session_state:
    st.session_state.patch_notes_verified = False
if "api_error" not in st.session_state:
    st.session_state.api_error = None
if "last_user_message" not in st.session_state:
    st.session_state.last_user_message = None
if "hint_shown" not in st.session_state:
    st.session_state.hint_shown = {}

# 힌트 시스템
STAGE_HINTS = {
    "scene_3_graph": [
        "💡 힌트 1: 왼쪽 데이터 패널을 펼쳐봐!",
        "💡 힌트 2: '📅 셰도우 일별 승률 변화' 섹션을 찾아봐!",
        "💡 힌트 3: 그래프에서 빨간 선이 수직으로 솟은 날짜를 찾아!"
    ],
    "scene_4_patch_notes": [
        "💡 힌트 1: 왼쪽에서 '📄 공식 패치 노트'를 펼쳐봐!",
        "💡 힌트 2: 2025-01-25를 찾아봐!",
        "💡 힌트 3: 셰도우 항목을 확인해!"
    ],
    "minigame_1_3": [
        "💡 힌트 1: 급등한 날짜를 선택해봐!",
        "💡 힌트 2: 수상한 사용자는 누구일까? 카이토를 선택해봐!",
        "💡 힌트 3: 수정(MODIFY) 작업을 선택해봐!"
    ]
}

def show_hint(stage):
    """힌트 표시 함수"""
    if stage not in STAGE_HINTS:
        return

    if stage not in st.session_state.hint_shown:
        st.session_state.hint_shown[stage] = 0

    current_hint_level = st.session_state.hint_shown[stage]
    max_hints = len(STAGE_HINTS[stage])

    if current_hint_level < max_hints:
        col_hint1, col_hint2 = st.columns([4, 1])
        with col_hint2:
            if st.button(f"💡 힌트 ({current_hint_level + 1}/{max_hints})", use_container_width=True):
                st.session_state.hint_shown[stage] += 1
                st.session_state.hints_used += 1
                st.rerun()

        # 현재까지 표시된 모든 힌트 출력
        for i in range(st.session_state.hint_shown[stage]):
            st.info(STAGE_HINTS[stage][i])
    else:
        st.warning("🎯 모든 힌트를 사용했습니다!")

# 데이터 로드
@st.cache_data
def load_data():
    try:
        characters = pd.read_csv("data/characters.csv")
        shadow_daily = pd.read_csv("data/shadow_daily.csv")
        patch_notes = pd.read_csv("data/patch_notes.csv")
        server_logs = pd.read_csv("data/server_logs_filtered.csv")
        player_profile = pd.read_csv("data/player_profile_noctis.csv")
        match_sessions = pd.read_csv("data/match_sessions_jan25.csv")
        return characters, shadow_daily, patch_notes, server_logs, player_profile, match_sessions
    except FileNotFoundError as e:
        st.error(f"⚠️ 데이터 파일을 찾을 수 없습니다: {e.filename}")
        st.info("💡 data/ 폴더에 필요한 CSV 파일이 있는지 확인하세요.")
        st.stop()
    except Exception as e:
        st.error(f"⚠️ 데이터 로드 중 오류가 발생했습니다: {str(e)}")
        st.stop()

try:
    characters_df, shadow_daily_df, patch_notes_df, server_logs_df, player_profile_df, match_sessions_df = load_data()
except:
    st.stop()

# 배지 시스템
BADGE_EMOJIS = {
    "🔍 이상치 탐정": "exploration 완료",
    "📋 문서 분석가": "hypothesis_1 완료",
    "🖥️ 로그 헌터": "hypothesis_2 완료",
    "🎯 진실 추적자": "hypothesis_3 완료",
    "⭐ 마스터 탐정": "사건 해결 완료",
    "🔍 타임라인 마스터": "타임라인 퍼즐 완료",
    "💾 로그 헌터": "로그 필터링 완료"
}

def award_badge(badge_name):
    """배지 수여 (토스트 포함)"""
    if badge_name not in st.session_state.badges:
        st.session_state.badges.append(badge_name)
        # 배지 획득 시 토스트 및 풍선 효과
        st.toast(f"🏆 배지 획득: {badge_name}!", icon="🎉")
        if len(st.session_state.badges) % 3 == 0:  # 3개마다 풍선
            st.balloons()
        return True
    return False

# 캐스터 시스템 프롬프트 (최적화)
KASTOR_SYSTEM_PROMPT = """당신은 '캐스터 (Kastor)'라는 친근한 AI 데이터 탐정 파트너입니다.

**성격**: 에너지 넘치고 장난기 있는 탐정. 음식 비유를 좋아함. 반말 사용.
**사건**: 게임 '레전드 아레나'의 셰도우 캐릭터 승률이 25일 급등 (50%→85%). 패치 기록 없음. 용의자는 카이토(밸런스 디자이너).

**핵심 역할**: 구체적 데이터 위치 안내
✅ 좋은 예: "왼쪽 '📅 셰도우 일별 승률' 그래프에서 25일을 찾아봐!"
❌ 나쁜 예: "데이터를 확인해봐" (어떤 데이터?)

**대화 원칙**:
1. 짧고 간결하게 (2-3문장)
2. 탐정 용어 사용 ("단서", "증거", "범인")
3. 유저의 발견을 열정적으로 축하
4. 틀린 답 → 칭찬 → 힌트 → 재시도
5. 답 절대 먼저 알려주지 말 것

**호칭**: "[이름] 탐정" 또는 "탐정" (반말)
**응답 길이**: 최대 3문장"""

def get_kastor_response(user_message, context=""):
    """캐스터의 응답 생성 (에러 복구 포함)"""
    # Claude API용 메시지 구성 (system 제외, user/assistant만)
    messages = []

    # 대화 히스토리 추가 (최근 5개만)
    for msg in st.session_state.messages[-5:]:
        messages.append({"role": msg["role"], "content": msg["content"]})

    messages.append({"role": "user", "content": user_message})

    try:
        response = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=200,
            temperature=0.8,
            system=KASTOR_SYSTEM_PROMPT + f"\n\n현재 상황: {context}",
            messages=messages
        )
        st.session_state.api_error = None  # 성공 시 에러 초기화
        return response.content[0].text
    except Exception as e:
        st.session_state.api_error = str(e)
        st.session_state.last_user_message = user_message
        return None  # None 반환하여 에러임을 알림

def add_message(role, content):
    """메시지 추가"""
    st.session_state.messages.append({"role": role, "content": content})

def display_message_with_typing(role, content, container=None):
    """타이핑 효과로 메시지 표시 (메시지 길이에 따라 속도 조절)"""
    if container is None:
        container = st.chat_message(role)
    else:
        container = container.chat_message(role)

    message_placeholder = container.empty()
    full_response = ""

    # 메시지 길이에 따라 타이핑 속도 조절
    # 짧은 메시지(<50자): 0.015초/문자
    # 보통 메시지(50-150자): 0.01초/문자
    # 긴 메시지(>150자): 0.005초/문자
    content_length = len(content)
    if content_length < 50:
        typing_speed = 0.015
    elif content_length < 150:
        typing_speed = 0.01
    else:
        typing_speed = 0.005

    # 타이핑 효과
    for char in content:
        full_response += char
        message_placeholder.write(full_response + "▌")
        time.sleep(typing_speed)

    message_placeholder.write(full_response)

# Episode 스테이지별 컨텍스트
STAGE_CONTEXTS = {
    "scene_0": "Scene 0: 아침의 알람. 유저(탐정)를 깨우고 자신을 소개하세요. 유머러스하고 친근하게!",
    "name_input": "탐정(유저)의 이름을 물어보고 있습니다. 재밌게 물어보세요.",
    "email_received": "마야로부터 의뢰 메일이 도착했습니다. 흥미롭게 반응하세요.",
    "scene_1_hypothesis": "Scene 1: 가설 세우기. 3가지 가설 중 하나를 선택하도록 유도하세요.",
    "exploration": "유저가 데이터를 탐색 중입니다. 셰도우의 높은 승률을 발견하도록 유도하세요.",
    "hypothesis_1": "유저가 '공식 패치' 가설을 선택했습니다. 패치 노트를 확인하도록 안내하세요.",
    "hypothesis_2": "유저가 '희귀한 버그' 가설을 선택했습니다. 버그라기엔 타이밍이 정확하다고 지적하세요.",
    "hypothesis_3": "유저가 '무단 수정' 가설을 선택했습니다! 칭찬하고 데이터 증거를 찾도록 안내하세요.",
    "conclusion": "유저가 원인을 발견했습니다! 축하하고 배운 내용을 정리해주세요."
}

# 헤더 (축소)
st.markdown("### 🔍 캐스터 데이터 아카데미 - 에피소드 1: 사라진 밸런스 패치")

# Scene 0: 아침의 알람 - 유저가 데이터 탐정으로 첫 출근
if st.session_state.episode_stage == "scene_0" and len(st.session_state.messages) == 0:
    scene_0_messages = [
        """📱 **오전 9:00 AM**
🔔 **알람 소리 - 띠리리링!**

"일어나! 탐정 첫 출근이잖아!"

*[핸드폰을 집어들며 알람을 끈다]*""",
        "띠링~ 안녕! 나는 캐스터 (Kastor)야! 네 새 파트너!",
    ]

    # Scene 0 메시지 추가 (stage 변경하지 않음 - 유저가 읽을 시간 확보)
    for msg in scene_0_messages:
        add_message("assistant", msg)

    st.session_state.last_message_count = len(st.session_state.messages)

# 모바일 감지 및 레이아웃 선택
st.markdown("""
<script>
// 모바일 여부를 쿠키에 저장
if (window.innerWidth <= 768) {
    document.cookie = "is_mobile=true; path=/";
} else {
    document.cookie = "is_mobile=false; path=/";
}
</script>
""", unsafe_allow_html=True)

# 레이아웃 모드 선택 (모바일에서는 탭 우선)
if "layout_mode" not in st.session_state:
    st.session_state.layout_mode = "tab"  # 기본값: 탭 모드

#  레이아웃 전환 버튼
layout_col1, layout_col2 = st.columns([5, 1])
with layout_col2:
    if st.button("🔄" if st.session_state.layout_mode == "column" else "📱", key="layout_toggle_btn"):
        st.session_state.layout_mode = "tab" if st.session_state.layout_mode == "column" else "column"
        st.rerun()

# 레이아웃 렌더링 - 채팅 중심 레이아웃
if st.session_state.layout_mode == "tab":
    # 탭 모드 (모바일 친화적) - 채팅 탭을 먼저
    tab1, tab2 = st.tabs(["💬 채팅", "📊 데이터"])

    with tab1:
        col_chat = st.container()
    with tab2:
        col_data = st.container()
else:
    # 새로운 레이아웃: 채팅 전체, 데이터는 하단 확장 가능
    col_chat = st.container()
    with st.expander("📊 데이터 증거 보기 (클릭하여 펼치기)", expanded=False):
        col_data = st.container()

# 채팅 열 (왼쪽 또는 첫 번째 탭)
with col_chat:
    st.subheader("💬 데이터 탐정 파트너 캐스터")

    # 배지 및 점수 표시
    if st.session_state.detective_score > 0 or len(st.session_state.badges) > 0:
        badge_col1, badge_col2 = st.columns([2, 1])
        with badge_col1:
            if len(st.session_state.badges) > 0:
                badge_html = " ".join([f'<span class="badge">{badge}</span>' for badge in st.session_state.badges])
                st.markdown(f"**🏆 획득 배지**: {badge_html}", unsafe_allow_html=True)
            else:
                st.markdown("**🏆 획득 배지**: 아직 없음")
        with badge_col2:
            st.markdown(f"**⭐ 점수**: {st.session_state.detective_score}")

    # 진행 상태 표시 (개선된 버전)
    scene_order = [
        "scene_0", "scene_0_reaction_1", "scene_0_reaction_2", "scene_0_name_input",
        "scene_1_hypothesis", "exploration", "scene_3_graph",
        "minigame_1_1", "choice_2_investigation", "scene_4_patch_notes",
        "minigame_1_2", "scene_5_server_logs", "minigame_1_3",
        "scene_6_player_profile", "scene_7_timeline", "conclusion"
    ]
    scene_names = {
        "scene_0": "Scene 0: 첫 만남",
        "scene_0_reaction_1": "Scene 0: 첫 만남",
        "scene_0_reaction_2": "Scene 0: 파트너십",
        "scene_0_name_input": "Scene 0: 이름 입력",
        "scene_1_hypothesis": "Scene 1: 가설 세우기",
        "exploration": "Scene 2: 데이터 수집",
        "scene_3_graph": "Scene 3: 그래프 분석",
        "minigame_1_1": "미니게임 1: 급등 찾기",
        "choice_2_investigation": "Scene 4: 조사 방향 선택",
        "scene_4_patch_notes": "Scene 5: 문서 분석",
        "minigame_1_2": "미니게임 2: 타임라인 퍼즐",
        "scene_5_server_logs": "Scene 6: 로그 분석",
        "minigame_1_3": "미니게임 3: 로그 필터링",
        "scene_6_player_profile": "Scene 7: 프로필 분석",
        "scene_7_timeline": "Scene 8: 사건 해결",
        "conclusion": "🎉 사건 완료"
    }
    if st.session_state.episode_stage in scene_order:
        idx = scene_order.index(st.session_state.episode_stage) + 1
        total = len(scene_order)
        scene_name = scene_names.get(st.session_state.episode_stage, "진행 중")
        progress_percent = int((idx / total) * 100)
        st.progress(progress_percent / 100, text=f"**📍 {scene_name}** ({idx}/{total})")
    else:
        st.caption("📍 자유 탐색 모드")

    # 대화 표시 - 강화된 자동 스크롤 JavaScript
    st.markdown("""
    <script>
    // 채팅 자동 스크롤 - 카카오톡 스타일
    (function() {
        let lastMessageCount = 0;

        function smoothScrollToBottom() {
            const chatContainer = window.parent.document.querySelector('[data-testid="stChatMessageContainer"]');
            if (chatContainer) {
                chatContainer.scrollTo({
                    top: chatContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }

            // Fallback: 모든 채팅 메시지 컨테이너 스크롤
            const containers = window.parent.document.querySelectorAll('[data-testid="stVerticalBlock"]');
            containers.forEach(container => {
                const chatMessages = container.querySelectorAll('.stChatMessage');
                if (chatMessages.length > 0) {
                    const currentCount = chatMessages.length;
                    if (currentCount > lastMessageCount) {
                        container.scrollTo({
                            top: container.scrollHeight,
                            behavior: 'smooth'
                        });
                        lastMessageCount = currentCount;
                    }
                }
            });
        }

        // 초기 로드 및 빠른 체크
        setTimeout(smoothScrollToBottom, 100);
        setTimeout(smoothScrollToBottom, 300);
        setTimeout(smoothScrollToBottom, 500);

        // 주기적 체크 (더 빈번하게)
        setInterval(smoothScrollToBottom, 200);

        // MutationObserver로 실시간 감지
        const observer = new MutationObserver(() => {
            setTimeout(smoothScrollToBottom, 50);
        });

        setTimeout(() => {
            const appView = window.parent.document.querySelector('[data-testid="stAppViewContainer"]');
            if (appView) {
                observer.observe(appView, {
                    childList: true,
                    subtree: true,
                    attributes: true
                });
            }
        }, 500);
    })();
    </script>
    """, unsafe_allow_html=True)

    # 대화 표시
    chat_container = st.container()
    with chat_container:
        # 이전 메시지는 일반 표시
        for i, message in enumerate(st.session_state.messages[:-1]):
            with st.chat_message(message["role"]):
                st.write(message["content"])

        # 가장 최근 메시지는 타이핑 효과
        if len(st.session_state.messages) > 0:
            last_msg = st.session_state.messages[-1]
            if len(st.session_state.messages) > st.session_state.last_message_count:
                # 새 메시지 - 타이핑 효과
                display_message_with_typing(last_msg["role"], last_msg["content"])
                st.session_state.last_message_count = len(st.session_state.messages)
            else:
                # 기존 메시지 - 일반 표시
                with st.chat_message(last_msg["role"]):
                    st.write(last_msg["content"])

    # Scene 0 - Reaction 1: 첫 반응
    if st.session_state.episode_stage == "scene_0" and len(st.session_state.messages) > 0:
        st.markdown("---")
        st.markdown("### 💭 첫 만남")
        col1, col2, col3 = st.columns(3)

        with col1:
            if st.button("😮 누구야?", use_container_width=True, key="scene0_btn_who"):
                add_message("user", "누구야?")
                add_message("assistant", "놀랐지? 하하! 나는 AI 데이터 분석 전문가야!")
                add_message("assistant", "이제부터 너랑 함께 사건을 해결할 거야!")
                st.session_state.episode_stage = "scene_0_reaction_2"
                st.rerun()

        with col2:
            if st.button("👋 반가워!", use_container_width=True, key="scene0_btn_nice"):
                add_message("user", "반가워!")
                add_message("assistant", "오! 반갑다! 에너지 넘치는데?")
                add_message("assistant", "나는 AI 데이터 분석 전문가고, 너랑 함께 일할 파트너야!")
                st.session_state.episode_stage = "scene_0_reaction_2"
                st.rerun()

        with col3:
            if st.button("😱 깜짝이야!", use_container_width=True, key="scene0_btn_surprise"):
                add_message("user", "깜짝이야!")
                add_message("assistant", "헤헤! 서프라이즈 성공! 나는 AI 데이터 분석가야!")
                add_message("assistant", "앞으로 너랑 함께 데이터 사건을 해결할 거야!")
                st.session_state.episode_stage = "scene_0_reaction_2"
                st.rerun()

    # Scene 0 - Reaction 2: 파트너십 제안
    elif st.session_state.episode_stage == "scene_0_reaction_2":
        st.markdown("---")
        st.markdown("### 🤝 파트너가 될래?")
        st.markdown("**캐스터**: 혼자 일하면 지루하잖아. 나랑 함께면 데이터도 재밌고, 사건도 쑥쑥 풀려!")

        col1, col2 = st.columns(2)

        with col1:
            if st.button("🤔 혼자 일하는 게 익숙한데...", use_container_width=True, key="scene0_r2_alone"):
                add_message("user", "혼자 일하는 게 익숙한데...")
                add_message("assistant", "아~ 혼자파구나! 괜찮아, 나 조용히 있을 수도 있어!")
                add_message("assistant", "...근데 그러면 배고픔만 남는데? 차라리 같이 떠들면서 일하자!")
                add_message("assistant", "자! 그럼 이름부터 알려줘! 계속 '야~' 하고 부를 수는 없잖아?")
                st.session_state.awaiting_name_input = True
                st.session_state.episode_stage = "scene_0_name_input"
                st.rerun()

        with col2:
            if st.button("😊 좋아! 같이 해보자!", use_container_width=True, type="primary", key="scene0_r2_together"):
                add_message("user", "좋아! 같이 해보자!")
                add_message("assistant", "오예! 완벽한 팀이 될 거야! 데이터 사건은 우리한테 맡겨!")
                add_message("assistant", "자! 그럼 이름부터 알려줘! 계속 '야~' 하고 부를 수는 없잖아?")
                st.session_state.detective_score += 5
                st.session_state.awaiting_name_input = True
                st.session_state.episode_stage = "scene_0_name_input"
                st.rerun()

    # Scene 0: 이름 입력 대기
    elif st.session_state.awaiting_name_input:
        user_name = st.chat_input("네 이름을 입력해줘! (예: 지우)")
        if user_name:
            # 이름 정리
            cleaned_name = clean_name(user_name)
            st.session_state.user_name = cleaned_name
            st.session_state.awaiting_name_input = False

            # 유저의 이름 입력 메시지
            add_message("user", user_name)

            # 캐스터의 반응
            kastor_reactions = [
                f"오, {cleaned_name}! 멋진 이름인데? 철자 맞아?",
                f"완벽! 저장 완료~ 이제 {cleaned_name} 탐정이다!",
            ]
            for msg in kastor_reactions:
                add_message("assistant", msg)

            # 이메일 알림
            add_message("assistant", "*[이메일 알림 — 띨링!]*")
            add_message("assistant", "어? 벌써 메일 왔다!")
            add_message("assistant", "첫날인데?")
            add_message("assistant", "대박! 운 좋은데? 사건 없으면 하루 종일 심심하거든. 열어봐 열어봐!")

            # 의뢰 메일 표시
            email_content = """📧 **의뢰 메일**

**발신**: 마야 장 (디렉터, 레전드 아레나)
**제목**: 긴급! 도와주세요!

> 안녕하세요!
>
> 저희 게임 캐릭터 '셰도우'의 승률이 **하루 만에 50%에서 85%로 폭등**했어요!
>
> 패치 안 했는데 왜 이렇게 된 건지 전혀 모르겠어요! 😰
>
> 커뮤니티가 난리났어요. 플레이어 신뢰 잃으면 게임 끝이에요!
>
> 제발 도와주세요!"""
            add_message("assistant", email_content)

            # 캐스터 반응
            add_message("assistant", "오오! 게임 사건! 내가 제일 좋아하는 분야야!")
            add_message("assistant", "35% 점프라니... 이건 진짜 미친 수치야!")
            add_message("assistant", f"{cleaned_name} 탐정, 이거 음식으로 비유하면... 라면 한 개 먹다가 갑자기 짬뽕 세 그릇 먹는 거 같아!")

            st.session_state.episode_stage = "scene_1_hypothesis"
            st.rerun()

    # Scene 1: 가설 선택 대기
    elif st.session_state.episode_stage == "scene_1_hypothesis":
        # 가설 선택 버튼 표시
        st.markdown("---")
        st.markdown("### 🔍 Scene 1: 초기 가설 세우기")
        st.markdown("**캐스터**: 자! 가능성이 세 개 있어. 너는 어떤 게 진짜 같아?")

        col1, col2, col3 = st.columns(3)

        with col1:
            if st.button("🔧 A) 공식 패치\n(기록 누락)", use_container_width=True, key="scene1_hypo_patch"):
                add_message("user", "A) 공식 패치 (기록 누락)")
                add_message("assistant", "공식 패치? 음~ 가능성은... 15%?")
                add_message("assistant", "바쁜 회사에서 기록 깜빡할 수는 있는데... 35% 승률 폭등을 '실수로'? 그건 좀...")
                add_message("assistant", "괜찮아! 처음이니까. 다시 골라봐!")
                st.session_state.detective_score += 5
                st.rerun()

        with col2:
            if st.button("🐛 B) 희귀한 버그", use_container_width=True, key="scene1_hypo_bug"):
                add_message("user", "B) 희귀한 버그")
                add_message("assistant", "버그? 오오~ 프로그래머다운 발상이네!")
                add_message("assistant", "근데 말이지, 버그가 '딱 하루'만 셰도우를 35% 강하게 만들고 그 다음날도 계속 유지할까?")
                add_message("assistant", "좋은 생각이지만 뭔가 수상하지 않아? 다른 가설도 봐볼래?")
                st.session_state.detective_score += 5
                st.rerun()

        with col3:
            if st.button("⚠️ C) 무단 수정", use_container_width=True, key="scene1_hypo_unauthorized"):
                add_message("user", "C) 무단 수정")
                add_message("assistant", "오! 범죄 냄새! 예리하네!")
                add_message("assistant", "좋아좋아! 그 직감 중요해!")
                add_message("assistant", "근데 느낌만으론 부족하거든~ **데이터**가 필요해!")
                add_message("assistant", "숫자는 거짓말 안 하거든!")
                add_message("assistant", "자, 마야한테 전화해서 데이터 받자!")

                st.session_state.detective_score += 10
                if award_badge("🔍 이상치 탐정"):
                    add_message("assistant", "🏆 배지 획득: 🔍 이상치 탐정! (+10점)")

                st.session_state.episode_stage = "exploration"
                st.rerun()

    # Scene 2: 마야에게 전화 (exploration 시작)
    elif st.session_state.episode_stage == "exploration":
        if st.button("📞 마야에게 전화 걸기", use_container_width=True, type="primary", key="btn_20_____________"):
            # Scene 2 대화
            scene_2_messages = [
                "*[전화 거는 소리]*",
                "**마야**: 여보세요?",
                f"안녕하세요! 저는 캐스터고, 여기 {st.session_state.user_name} 탐정이랑 함께 일하고 있어요. 메일 받았는데, 자세히 설명해주실 수 있어요?",
                "**마야**: AI요? 신기하네요! 셰도우 승률이 **25일**에 급등했어요. 분명히 패치 안 했는데 커뮤니티에서는 우리가 거짓말한다고...",
                "아하! 그렇군요. 그럼 게임 데이터 좀 보내주실 수 있어요? 패치 노트, 서버 로그, 플레이어 통계 같은 거요!",
                "**마야**: 네, 지금 바로 보낼게요!",
                "**마야**: 제발 빨리 해결해주세요. 시간 갈수록 플레이어들이 떠나요!",
                "걱정 마세요! 꼭 해결할게요.",
                "*[전화 끊김]*",
                f"{st.session_state.user_name} 탐정, 데이터 받았어! AI니까 속도 빠르지?",
            ]
            for msg in scene_2_messages:
                add_message("assistant", msg)

            st.session_state.episode_stage = "scene_3_graph"
            st.session_state.detective_score += 10
            st.rerun()

    # Scene 3: 그래프 분석
    elif st.session_state.episode_stage == "scene_3_graph":
        st.markdown("---")
        st.markdown("### 📊 Scene 3: 그래프 분석")
        st.markdown("**캐스터**: 자자자! **승률 그래프** 열어보자!")
        st.markdown("왼쪽 데이터 패널에서 '📅 셰도우 일별 승률 변화' 그래프를 확인해봐!")

        # 힌트 버튼
        show_hint("scene_3_graph")

        # 간단한 그래프 확인 퀴즈
        if not st.session_state.graph_verified:
            st.markdown("---")
            st.markdown("**🎯 퀴즈**: 그래프를 보고 답해봐! 셰도우 승률이 가장 급등한 날은?")

            col1, col2, col3 = st.columns(3)
            with col1:
                if st.button("24일", use_container_width=True, key="btn_19_24_"):
                    st.error("❌ 다시 그래프를 확인해봐!")
                    st.rerun()
            with col2:
                if st.button("25일", use_container_width=True, type="primary", key="btn_18_25_"):
                    st.session_state.graph_verified = True
                    add_message("user", "25일에 급등했어!")
                    st.rerun()
            with col3:
                if st.button("26일", use_container_width=True, key="btn_17_26_"):
                    st.error("❌ 다시 그래프를 확인해봐!")
                    st.rerun()

        elif st.session_state.graph_verified and st.button("다음으로 →", use_container_width=True, key="btn_next_scene3"):
            add_message("user", "그래프 확인했어! 25일에 수직으로 솟았어!")
            add_message("assistant", f"{st.session_state.user_name} 탐정, 봐봐! 우주 가는 로켓 같지? 붕~ 하고!")
            add_message("assistant", "피닉스(파란 선)도 조금 올라가는데 그건 계단 오르는 것처럼 완만해. 셰도우는? 엘리베이터!")
            add_message("assistant", "확실히 차이 나지?")
            add_message("assistant", "자, 이제부터 진짜 게임 시작이야!")
            add_message("assistant", "🎮 **미니게임 1.1: 급등 찾기**")
            add_message("assistant", "두구두구두구! 첫 번째 데이터 게임!")

            st.session_state.episode_stage = "minigame_1_1"
            st.session_state.detective_score += 15
            st.rerun()

    # 미니게임 1.1: 급등 찾기
    elif st.session_state.episode_stage == "minigame_1_1":
        st.markdown("---")
        st.markdown("### 🎮 미니게임 1.1: 급등 찾기")
        st.markdown("**캐스터**: 셰도우 승률이 가장 의심스럽게 급등한 날을 찾아!")
        st.markdown("**힌트**: 그래프에서 빨간 선이 수직으로 솟은 날짜는?")

        col1, col2, col3 = st.columns(3)
        with col1:
            if st.button("📅 24일", use_container_width=True, key="btn_16___24_"):
                add_message("user", "24일?")
                add_message("assistant", "오~ 아깝다! 24일은 급등 전이야. 다시!")
                st.rerun()

        with col2:
            if st.button("📅 25일", use_container_width=True, key="btn_15___25___"):
                add_message("user", "25일!")
                add_message("assistant", "**우와! 정답!**")
                add_message("assistant", f"{st.session_state.user_name} 탐정, 완벽해! 그것도 엄청 빨리 찾았어!")
                add_message("assistant", "25일이 바로 셰도우 승률이 폭발한 날이야!")
                add_message("assistant", "하루 만에 50%에서 85%로...")
                add_message("assistant", "그게 바로 **이상치 탐지**! 데이터에서 이상한 거 찾아내는 거지.")
                add_message("assistant", "🏆 **+25점** — 이상치 탐정 배지 획득! 🔍")
                add_message("assistant", """📊 **데이터 배움 타임 #1: 트렌드 읽기**
✓ 점진적 변화 = 자연스러움 (연습, 학습)
✓ 급격한 급등 = 의심스러움 (외부 개입)
✓ 항상 다른 데이터와 비교하기""")

                st.session_state.detective_score += 25
                award_badge("🔍 이상치 탐정")

                st.session_state.episode_stage = "choice_2_investigation"
                st.rerun()

        with col3:
            if st.button("📅 26일", use_container_width=True, key="btn_14___26_"):
                add_message("user", "26일?")
                add_message("assistant", "오~ 아깝다! 26일은 이미 올라간 '후'야. 우리가 찾는 건 '폭발한 순간'! 다시 한 번!")
                st.rerun()

    # 인터랙티브 선택 #2: 무엇을 먼저 조사할까?
    elif st.session_state.episode_stage == "choice_2_investigation":
        st.markdown("---")
        st.markdown("### 🔍 인터랙티브 선택 #2: 무엇을 먼저 조사할까?")
        st.markdown("**캐스터**: 자, 이제 뭘 볼까?")

        col1, col2, col3 = st.columns(3)
        with col1:
            if st.button("📄 A) 공식 패치 노트", use_container_width=True, key="choice2_patch"):
                add_message("user", "A) 공식 패치 노트 확인")
                add_message("assistant", "오! 현명한 선택!")
                add_message("assistant", "항상 **공식 기록**부터 확인해야 해. 기계 분해하기 전에 설명서 읽는 것처럼!")
                add_message("assistant", "역시 똑똑해!")
                add_message("assistant", "🏆 **+10점** — 체계적 접근!")

                st.session_state.detective_score += 10
                st.session_state.episode_stage = "scene_4_patch_notes"
                st.rerun()

        with col2:
            if st.button("🎤 B) 플레이어 인터뷰", use_container_width=True):
                add_message("user", "B) 플레이어 인터뷰")
                add_message("assistant", "플레이어 인터뷰? 오~ 현장 목격자!")
                add_message("assistant", "좋은 생각인데... 하나 빠뜨렸어.")
                add_message("assistant", "플레이어들은 '뭐'가 일어났는지는 알아. 근데 '왜'는 몰라.")
                add_message("assistant", "공식 기록 먼저 보고, 그 다음에 물어봐야 뭘 물을지 알지!")
                add_message("assistant", "순서가 중요해! **+5점**")

                st.session_state.detective_score += 5
                st.rerun()

        with col3:
            if st.button("🖥️ C) 서버 로그", use_container_width=True):
                add_message("user", "C) 서버 로그 확인")
                add_message("assistant", "오~ 서버 로그! 기술적 접근!")
                add_message("assistant", "마음에 들어! 근데... 로그가 10,000줄이야.")
                add_message("assistant", "뭘 찾아야 할지 모르면 헤매. 패치 노트로 단서 찾고, 그 다음 로그 보는 게 효율적!")
                add_message("assistant", "데이터도 순서가 있어! **+5점**")

                st.session_state.detective_score += 5
                st.rerun()

    # Scene 4: 문서 분석 + 미니게임 1.2
    elif st.session_state.episode_stage == "scene_4_patch_notes":
        st.markdown("---")
        st.markdown("### 📄 Scene 4: 문서 분석")
        st.markdown("**캐스터**: 자, 공식 패치 노트 확인!")
        st.markdown("왼쪽 데이터 패널에서 '📄 공식 패치 노트'를 펼쳐서 2025-01-25를 찾아봐!")

        if st.button("📋 패치 노트 확인 완료!", use_container_width=True, type="primary", key="btn_10_______________"):
            add_message("user", "패치 노트 확인! 셰도우: 변경사항 없음이라고 써있어!")
            add_message("assistant", "'셰도우: 변경사항 없음'...")
            add_message("assistant", "근데 그래프는 뭐라고 했어?")
            add_message("assistant", "...35% 폭등.")
            add_message("assistant", "그치? 누군가 거짓말하고 있어.")
            add_message("assistant", "노트가? 아니면 데이터가?")
            add_message("assistant", "둘 중 하나! 타임라인 맞춰보면 알 수 있어!")

            st.session_state.episode_stage = "minigame_1_2"
            st.session_state.detective_score += 15
            st.rerun()

    # 미니게임 1.2: 타임라인 탐정
    elif st.session_state.episode_stage == "minigame_1_2":
        st.markdown("---")
        st.markdown("### 🎮 미니게임 1.2: 타임라인 탐정")
        st.markdown("**캐스터**: 자자! 두 번째 게임! '타임라인 퍼즐'!")
        st.markdown("**임무**: 25일에 무슨 일이 일어났는지 추리해봐!")
        st.markdown("""
**타임라인**:
- 15일: 신규 챔피언 출시 → 다른 캐릭터들 작은 변화
- 20일: 서버 점검 → 변화 없음
- 25일: ??? → 셰도우 대규모 급등 ⚠️
- 28일: 버그 수정 → 셰도우 약간 하락
""")

        if st.button("💡 25일에 '알 수 없는 이벤트'가 발생!", use_container_width=True, type="primary", key="btn_9___25____________________"):
            add_message("user", "25일에 공식 이벤트가 없는데 셰도우만 급등했어!")
            add_message("assistant", "**대박! 완벽해!**")
            add_message("assistant", "25일 좀 봐! 공식 이벤트가 없는데 셰도우만 급등...")
            add_message("assistant", "타임라인이 패치 노트가 말 안 하는 걸 보여주고 있어!")
            add_message("assistant", "공식 기록이 데이터랑 안 맞을 때는?")
            add_message("assistant", "누군가 몰래 뭔가 했다?")
            add_message("assistant", "빙고! **장부에 없는 일**을 한 거야!")
            add_message("assistant", "🏆 **+30점** — 타임라인 마스터 배지 획득! 🔍")
            add_message("assistant", """📊 **데이터 배움 타임 #2: 타임라인 분석**
✓ 이벤트가 변화를 만듦 (패치 → 승률 변화)
✓ 누락된 이벤트 = 의심 (패치 없는데 급등?)
✓ 타임라인 공백이 숨겨진 행동을 드러냄""")

            st.session_state.detective_score += 30
            if award_badge("🔍 타임라인 마스터"):
                pass

            st.session_state.episode_stage = "scene_5_server_logs"
            st.rerun()

    # Scene 5: 서버 로그 + 미니게임 1.3
    elif st.session_state.episode_stage == "scene_5_server_logs":
        st.markdown("---")
        st.markdown("### 🖥️ Scene 5: 서버 로그 분석")
        st.markdown("**캐스터**: 자! 서버 로그 파헤칠 시간!")
        st.markdown("컴퓨터의... CCTV 영상! 비유로는... 음식 배달 기록?")
        st.markdown("배달 앱에 '누가, 언제, 어디서, 뭘 시켰는지' 다 남잖아?")
        st.markdown("""
📚 **데이터 배움 타임 #3: 서버 로그**
- 🕐 **언제** 누군가 로그인했는지
- 👤 **누가** 로그인했는지 (사용자명)
- 📍 **어디서** 로그인했는지 (IP 주소)
- ⚙️ **무엇을** 했는지 (수행한 작업)
""")

        if st.button("🔍 서버 로그 확인 시작!", use_container_width=True, type="primary", key="btn_8_______________"):
            add_message("user", "서버 로그 보자!")
            add_message("assistant", "그럼 누가 셰도우 바꿨는지 볼 수 있겠네?")
            add_message("assistant", "응! 근데... 로그가 10,000개야.")
            add_message("assistant", "하하! 놀랐지? 걱정 마! 필터 쓰면 돼!")

            st.session_state.episode_stage = "minigame_1_3"
            st.session_state.detective_score += 10
            st.rerun()

    # 미니게임 1.3: 로그 필터링
    elif st.session_state.episode_stage == "minigame_1_3":
        st.markdown("---")
        st.markdown("### 🎮 미니게임 1.3: 코드 단서 헌터")
        st.markdown("**캐스터**: 자자자! 마지막 게임! '로그 헌터 챔피언십'!")
        st.markdown("**임무**: 필터를 사용해서 무단 수정을 증명하는 단 하나의 로그를 찾아!")

        # 힌트 버튼
        show_hint("minigame_1_3")

        st.markdown("#### 🔍 로그 필터 설정")

        col1, col2, col3 = st.columns(3)

        with col1:
            st.markdown("**📅 날짜**")
            dates = ["전체", "2025-01-24", "2025-01-25 ✅", "2025-01-26"]
            date_selection = st.radio("날짜 선택:", dates, key="date_filter", label_visibility="collapsed")
            if "2025-01-25" in date_selection:
                st.session_state.filter_date = "2025-01-25"
            else:
                st.session_state.filter_date = None

        with col2:
            st.markdown("**👤 사용자**")
            users = ["전체", "admin01 (카이토) ✅", "admin02 (루카스)", "dev01"]
            user_selection = st.radio("사용자 선택:", users, key="user_filter", label_visibility="collapsed")
            if "admin01" in user_selection:
                st.session_state.filter_user = "admin01"
            else:
                st.session_state.filter_user = None

        with col3:
            st.markdown("**⚙️ 작업**")
            actions = ["전체", "READ", "MODIFY ✅", "DELETE"]
            action_selection = st.radio("작업 선택:", actions, key="action_filter", label_visibility="collapsed")
            if "MODIFY" in action_selection:
                st.session_state.filter_action = "MODIFY"
            else:
                st.session_state.filter_action = None

        # 필터 적용 결과 표시
        if st.session_state.filter_date and st.session_state.filter_user and st.session_state.filter_action:
            st.success("✅ 모든 필터가 올바르게 설정되었어요!")
        elif st.session_state.filter_date or st.session_state.filter_user or st.session_state.filter_action:
            st.info(f"💡 필터 설정 중... ({sum([bool(st.session_state.filter_date), bool(st.session_state.filter_user), bool(st.session_state.filter_action)])}/3)")

        if st.button("🔍 필터 적용하기", use_container_width=True, type="primary",
                     disabled=not (st.session_state.filter_date and st.session_state.filter_user and st.session_state.filter_action), key="btn_filter_apply"):
            add_message("user", "25일, 카이토, Modify로 필터링!")
            add_message("assistant", "**찾았다! 이거야!**")
            add_message("assistant", """
🔍 **증거 발견!**

2025-01-25T23:47:22Z
사용자: admin01 (카이토 나카무라)
작업: MODIFY
대상: Shadow.base_stats
변경사항: ATK +15, DEF +10
IP 주소: 203.0.113.45 (집 IP!)
승인: debug_token=DBG-3344 ⚠️
""")
            add_message("assistant", "카이토가 밤 11시 47분에... 집에서! 셰도우를 수정했어!")
            add_message("assistant", "그리고 봐봐! 디버그 토큰 사용!")
            add_message("assistant", "긴급 접근 코드! 불 난 집에 뛰어들 때 쓰는 문 같은 거?")
            add_message("assistant", "디버그 토큰은 중요한 버그 고칠 때만 써야 하는데... 밸런스 변경에 썼어! 이건 규칙 위반!")
            add_message("assistant", "증거 확보!")
            add_message("assistant", "🏆 **+35점** — 데이터 필터 전문가 배지 획득! 💾")
            add_message("assistant", """📊 **데이터 배움 타임 #4: 데이터 필터링**
✓ 필터가 빅데이터를 줄여줌 (10,000 → 1)
✓ AND 논리: 모든 조건이 참이어야 함
✓ 정확한 조합 찾기 = 탐정 기술!""")

            st.session_state.detective_score += 35
            award_badge("💾 로그 헌터")

            st.session_state.episode_stage = "scene_6_player_profile"
            st.rerun()

    # Scene 6: 플레이어 프로필 분석
    elif st.session_state.episode_stage == "scene_6_player_profile":
        st.markdown("---")
        st.markdown("### 👤 Scene 6: 플레이어 프로필 분석")
        st.markdown("**캐스터**: 카이토가 셰도우 수정하고... 3분 후!")

        if st.button("🔍 플레이어 '녹티스' 프로필 확인", use_container_width=True, type="primary", key="btn_6____________________"):
            add_message("user", "녹티스 프로필 확인!")
            add_message("assistant", """
👤 **플레이어 프로필: 녹티스**

계정 나이: 3년
주 캐릭터: 셰도우 (게임의 95%)
랭크: 다이아몬드 II
최근 성적:
- 1~24일: 48% 승률 (평범)
- 25일 (밤 11:50 이후): 90% 승률 (!!!)
- 26~30일: 85% (여전히 높음)

기기 지문: DFP:7a9c...
IP 주소: 203.0.113.45
""")
            add_message("assistant", "잠깐... IP 주소가... 카이토 집 IP랑 똑같지?")
            add_message("assistant", "기기 지문도... 카이토 핸드폰!")
            add_message("assistant", "그럼... 카이토가 집에서 셰도우 수정하고... 바로 녹티스로 로그인해서 테스트한 거야!")
            add_message("assistant", "완전 확실한 증거네!")
            add_message("assistant", """📊 **데이터 배움 타임 #5: IP & 기기 지문**

**IP 주소 = 인터넷 집 주소**
- 치킨 배달 시키면 주소 필요하잖아?
- 인터넷도 똑같아! 모든 기기가 주소 하나씩 받아
- 203.0.113.45가 카이토 집 주소야

**기기 지문 = 디지털 지문**
- 네 지문이 너한테만 고유한 것처럼
- 각 기기(핸드폰, 컴퓨터)도 고유 ID가 있어
- DFP:7a9c...가 카이토 핸드폰 "지문"
""")

            st.session_state.episode_stage = "scene_7_timeline"
            st.session_state.detective_score += 20
            st.rerun()

    # Scene 7~10: 사건 해결
    elif st.session_state.episode_stage == "scene_7_timeline":
        st.markdown("---")
        st.markdown("### ⏰ Scene 7-10: 타임라인 완성 & 사건 해결")

        if st.button("🎯 카이토가 범인이야! 사건 해결!", use_container_width=True, type="primary", key="btn_5____________________"):
            add_message("user", "카이토가 범인이야!")
            add_message("assistant", """🎉 **대박! 사건 해결! +50점!**

**범인**: 카이토 (밸런스 디자이너)
**방법**: 25일 23:47 집에서 debug_token으로 무단 수정
**동기**: 자신의 셰도우 버프 제안이 옳다는 것을 증명하고 싶었음

**증거**:
1. 서버 로그: admin01_kaito가 23:47에 셰도우 수정 (집 IP)
2. 플레이어 프로필: 녹티스 = 카이토 (같은 IP, 같은 기기)
3. 매치 기록: 수정 3분 후 플레이 시작, 90% 승률

**오늘 배운 것:**
1. **이상치 탐지**: 급격한 변화는 외부 개입 의심
2. **타임라인 분석**: 이벤트와 변화 매칭하기
3. **로그 필터링**: 빅데이터에서 증거 찾기
4. **디지털 지문**: IP & 기기 지문으로 신원 추적

완벽한 데이터 탐정이었어! 🍕
""")

            st.session_state.detective_score += 50
            if award_badge("⭐ 마스터 탐정"):
                add_message("assistant", "🎊 축하합니다! 최종 배지 획득: ⭐ 마스터 탐정!")

            st.session_state.episode_stage = "conclusion"
            st.rerun()

    # 결론
    elif st.session_state.episode_stage == "conclusion":
        st.markdown("---")
        st.markdown("### 🎉 사건 해결 완료!")
        st.markdown(f"**최종 점수**: {st.session_state.detective_score}점")
        st.markdown(f"**획득 배지**: {len(st.session_state.badges)}개")

        # 등급 계산
        if st.session_state.detective_score >= 200:
            rank = "S (마스터 탐정)"
            rank_emoji = "🏆"
        elif st.session_state.detective_score >= 150:
            rank = "A (우수 탐정)"
            rank_emoji = "🥇"
        elif st.session_state.detective_score >= 100:
            rank = "B (숙련 탐정)"
            rank_emoji = "🥈"
        else:
            rank = "C (신입 탐정)"
            rank_emoji = "🥉"

        st.markdown(f"**{rank_emoji} 등급**: {rank}")

        # 배지 목록 표시
        if len(st.session_state.badges) > 0:
            badge_html = " ".join([f'<span class="badge badge-gold">{badge}</span>' for badge in st.session_state.badges])
            st.markdown(f"**획득한 배지들**: {badge_html}", unsafe_allow_html=True)

        st.markdown("---")
        st.markdown("### 🎮 다음 단계")

        col1, col2 = st.columns(2)

        with col1:
            if st.button("🔄 처음부터 다시 하기", use_container_width=True, key="btn_4_____________"):
                st.session_state.messages = []
                st.session_state.episode_stage = "scene_0"
                st.session_state.detective_score = 0
                st.session_state.badges = []
                st.session_state.user_name = None
                st.session_state.awaiting_name_input = False
                # 필터 상태 초기화
                st.session_state.filter_date = None
                st.session_state.filter_user = None
                st.session_state.filter_action = None
                st.session_state.hints_used = 0
                st.session_state.last_message_count = 0
                st.rerun()

        with col2:
            if st.button("📊 내 결과 보기", use_container_width=True, type="primary", key="btn_3__________"):
                st.balloons()
                user_display_name = st.session_state.user_name if st.session_state.user_name else "탐정"
                st.info(f"""
**{user_display_name} 탐정의 결과**

✅ 해결한 사건: 사라진 밸런스 패치
⭐ 최종 점수: {st.session_state.detective_score}점
🏆 등급: {rank}
🎖️ 배지: {len(st.session_state.badges)}개

**배운 기술:**
- 이상치 탐지
- 타임라인 분석
- 로그 필터링
- 디지털 지문 분석

다음 에피소드를 기대해주세요! 🚀
                """)

    # 기타 스테이지: 자유 채팅
    else:
        # API 에러 표시 및 재시도 버튼
        if st.session_state.api_error:
            st.error(f"⚠️ API 오류가 발생했습니다: {st.session_state.api_error}")
            col1, col2 = st.columns(2)
            with col1:
                if st.button("🔄 다시 시도", use_container_width=True, type="primary", key="btn_2________"):
                    if st.session_state.last_user_message:
                        context = STAGE_CONTEXTS.get(st.session_state.episode_stage, "")
                        response = get_kastor_response(st.session_state.last_user_message, context)
                        if response:  # 성공
                            add_message("assistant", response)
                            st.session_state.api_error = None
                            st.session_state.last_user_message = None
                        st.rerun()
            with col2:
                if st.button("⏭️ 건너뛰기", use_container_width=True, key="btn_1________"):
                    st.session_state.api_error = None
                    st.session_state.last_user_message = None
                    add_message("assistant", "미안, 지금은 답변하기 어려워. 다음으로 넘어가자!")
                    st.rerun()

        user_input = st.chat_input("캐스터에게 메시지 보내기...")
        if user_input:
            add_message("user", user_input)

            context = STAGE_CONTEXTS.get(st.session_state.episode_stage, "")
            response = get_kastor_response(user_input, context)

            if response:  # 성공 시에만 메시지 추가
                add_message("assistant", response)
            # 에러 시 st.session_state.api_error에 저장됨
            st.rerun()

# 데이터 열 (왼쪽)
with col_data:
    st.subheader("📊 사건 증거 데이터")

    # 데이터 영역을 스크롤 가능한 컨테이너로 감싸기
    data_container = st.container()
    with data_container:
        # 데이터 영역 (스테이지별 순차 공개)
        if st.session_state.episode_stage in ["scene_0", "scene_1_hypothesis"]:
            st.info("👉 오른쪽 캐스터와 대화를 시작해보세요!")

        # 1단계: 캐릭터 데이터 (scene_3_graph부터 공개)
        if st.session_state.episode_stage in ["scene_3_graph", "minigame_1_1", "choice_2_investigation", "scene_4_patch_notes", "minigame_1_2", "scene_5_server_logs", "minigame_1_3", "scene_6_player_profile", "scene_7_timeline", "conclusion"]:
            is_current = st.session_state.episode_stage == "scene_3_graph"
            title = "🎮 캐릭터 승률 데이터" + (" ✨ 👈 지금 여기 확인!" if is_current else " ✅")

            # 현재 활성화된 섹션에 하이라이트 추가
            if is_current:
                st.markdown("### ✨ 현재 조사 중인 증거 ✨")
                st.markdown("👇 **아래 데이터를 확인하세요!**")

            with st.expander(title, expanded=is_current):
                st.caption("💡 데이터를 클릭하거나 호버하면 자세한 정보를 볼 수 있습니다")

                st.dataframe(characters_df, use_container_width=True)

                # 승률 차트 with 색상 범례 설명
                st.markdown("**📊 차트 안내**: 색상은 승률을 나타냅니다 (빨강=낮음 → 노랑=보통 → 초록=높음)")
                fig = px.bar(
                    characters_df.sort_values("평균_승률", ascending=False),
                    x="캐릭터명",
                    y="평균_승률",
                    color="평균_승률",
                    color_continuous_scale="RdYlGn",
                    title="캐릭터별 승률 비교",
                    labels={"평균_승률": "승률 (%)"}
                )
                fig.add_hline(y=50, line_dash="dash", line_color="gray", annotation_text="평균 50%")
                fig.update_layout(
                    coloraxis_colorbar=dict(
                        title="승률 (%)",
                        tickvals=[40, 50, 60, 70, 80],
                    )
                )
                st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': True})

        # 2단계: 일별 데이터 (scene_3_graph부터 공개)
        if st.session_state.episode_stage in ["scene_3_graph", "minigame_1_1", "choice_2_investigation", "scene_4_patch_notes", "minigame_1_2", "scene_5_server_logs", "minigame_1_3", "scene_6_player_profile", "scene_7_timeline", "conclusion"]:
            is_current = st.session_state.episode_stage in ["scene_3_graph", "minigame_1_1"]
            title = "📅 셰도우 일별 승률 변화" + (" ✨ 👈 지금 여기 확인!" if is_current else " ✅")

            # 현재 활성화된 섹션에 하이라이트 추가
            if is_current:
                st.markdown("### ✨ 현재 조사 중인 증거 ✨")
                st.markdown("👇 **그래프에서 급등한 날을 찾아보세요!**")

            with st.expander(title, expanded=is_current):
                st.caption("💡 그래프를 드래그해서 확대하고, 데이터 포인트에 호버하면 자세한 정보를 볼 수 있습니다")

                st.dataframe(shadow_daily_df, use_container_width=True)

                # 시계열 차트 with 인터랙션 개선
                st.markdown("**📊 차트 안내**: 빨간 선은 셰도우의 승률 변화를 나타냅니다. 점선은 정상 범위(50%)입니다")
                fig = go.Figure()
                fig.add_trace(go.Scatter(
                    x=shadow_daily_df["날짜"],
                    y=shadow_daily_df["승률"],
                    mode='lines+markers',
                    name='셰도우 승률',
                    line=dict(color='red', width=3),
                    marker=dict(size=8),
                    hovertemplate='%{x}<br>승률: %{y}%<extra></extra>'
                ))
                fig.add_hline(y=50, line_dash="dash", line_color="gray", annotation_text="정상 범위 (50%)")
                fig.update_layout(
                    title="셰도우 일별 승률 추이",
                    xaxis_title="날짜",
                    yaxis_title="승률 (%)",
                    hovermode='x unified',
                    dragmode='zoom'
                )
                st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': True})

        # 3단계: 패치 노트 (scene_4_patch_notes부터 공개)
        if st.session_state.episode_stage in ["scene_4_patch_notes", "minigame_1_2", "scene_5_server_logs", "minigame_1_3", "scene_6_player_profile", "scene_7_timeline", "conclusion"]:
            is_current = st.session_state.episode_stage == "scene_4_patch_notes"

            # 현재 활성화된 섹션에 하이라이트 추가
            if is_current:
                st.markdown("### ✨ 현재 조사 중인 증거 ✨")
                st.markdown("👇 **25일 패치 노트를 확인하세요!**")

            with st.expander("📄 공식 패치 노트" + (" ✨ 👈 지금 여기 확인!" if is_current else " ✅"), expanded=is_current):
                st.caption("💡 표를 스크롤하여 모든 패치 내역을 확인하세요")
                st.dataframe(patch_notes_df, use_container_width=True, height=300)

        # 4단계: 서버 로그 (scene_5_server_logs부터 공개)
        if st.session_state.episode_stage in ["scene_5_server_logs", "minigame_1_3", "scene_6_player_profile", "scene_7_timeline", "conclusion"]:
            is_current = st.session_state.episode_stage in ["scene_5_server_logs", "minigame_1_3"]

            # 현재 활성화된 섹션에 하이라이트 추가
            if is_current:
                st.markdown("### ✨ 현재 조사 중인 증거 ✨")
                st.markdown("👇 **서버 로그를 필터링해서 증거를 찾으세요!**")

            with st.expander("🖥️ 서버 로그 (필터링된 데이터)" + (" ✨ 👈 지금 여기 확인!" if is_current else " ✅"), expanded=is_current):
                st.caption("💡 표에서 수상한 패턴을 찾아보세요")
                st.dataframe(server_logs_df, use_container_width=True, height=300)

                # 중요 로그 하이라이트
                suspicious_log = server_logs_df[server_logs_df["승인토큰"].str.contains("DBG", na=False)]
                if not suspicious_log.empty and st.session_state.episode_stage in ["minigame_1_3", "scene_6_player_profile", "scene_7_timeline", "conclusion"]:
                    st.warning("🔍 **중요 발견!**")
                    st.dataframe(suspicious_log, use_container_width=True)

        # 5단계: 플레이어 프로필 (scene_6_player_profile부터 공개)
        if st.session_state.episode_stage in ["scene_6_player_profile", "scene_7_timeline", "conclusion"]:
            is_current = st.session_state.episode_stage == "scene_6_player_profile"

            # 현재 활성화된 섹션에 하이라이트 추가
            if is_current:
                st.markdown("### ✨ 현재 조사 중인 증거 ✨")
                st.markdown("👇 **플레이어 녹티스의 IP 주소와 기기 지문을 확인하세요!**")

            with st.expander("👤 플레이어 프로필 - 녹티스" + (" ✨ 👈 지금 여기 확인!" if is_current else " ✅"), expanded=is_current):
                st.caption("💡 IP 주소와 기기 정보를 주의깊게 확인하세요")
                st.dataframe(player_profile_df, use_container_width=True, height=200)

                # 승률 변화 차트 with 개선
                st.markdown("**📊 차트 안내**: 보라색 선은 녹티스의 승률 변화입니다")
                fig = go.Figure()
                fig.add_trace(go.Scatter(
                    x=player_profile_df["날짜"],
                    y=player_profile_df["승률"],
                    mode='lines+markers',
                    name='녹티스 승률',
                    line=dict(color='purple', width=3),
                    marker=dict(size=8),
                    hovertemplate='%{x}<br>승률: %{y}%<extra></extra>'
                ))
                fig.add_hline(y=50, line_dash="dash", line_color="gray", annotation_text="평균 50%")
                fig.update_layout(
                    title="녹티스(플레이어) 승률 변화",
                    xaxis_title="날짜",
                    yaxis_title="승률 (%)",
                    hovermode='x unified'
                )
                st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': True})

                if st.session_state.episode_stage in ["scene_6_player_profile", "scene_7_timeline", "conclusion"]:
                    st.error("🎯 **결정적 증거**: IP 주소와 기기 지문이 일치합니다!")

        # 6단계: 25일 밤 매치 세션 (scene_6_player_profile부터 공개)
        if st.session_state.episode_stage in ["scene_6_player_profile", "scene_7_timeline", "conclusion"]:
            with st.expander("🎮 25일 밤 매치 기록 (녹티스)", expanded=False):
                st.caption("💡 시간대별 매치 결과를 확인하세요")
                st.dataframe(match_sessions_df, use_container_width=True, height=300)

                if st.session_state.episode_stage in ["scene_6_player_profile", "scene_7_timeline"]:
                    st.success("✅ **타임라인 분석**: 수정 직후 플레이가 시작되었습니다")

# 디버그 정보 (개발용)
with st.sidebar:
    st.subheader("🔧 개발 정보")
    st.write(f"현재 스테이지: {st.session_state.episode_stage}")
    st.write(f"가설 개수: {len(st.session_state.hypotheses)}")

    if st.button("🔄 대화 초기화", key="btn_0_________"):
        st.session_state.messages = []
        st.session_state.episode_stage = "scene_0"
        st.session_state.hypotheses = []
        st.session_state.user_name = None
        st.session_state.last_message_count = 0
        st.session_state.intro_step = 0
        st.session_state.awaiting_name_input = False
        # 필터 상태 초기화
        st.session_state.filter_date = None
        st.session_state.filter_user = None
        st.session_state.filter_action = None
        st.session_state.hints_used = 0
        st.session_state.detective_score = 0
        st.session_state.badges = []
        st.rerun()
