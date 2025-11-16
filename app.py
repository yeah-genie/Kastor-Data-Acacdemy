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
    page_title="캐스터 Data Academy - Episode 1",
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

# 이름 정리 함수 (조사 제거)
def clean_name(raw_name):
    """이름에서 한국어 조사를 제거하여 깨끗한 이름만 추출"""
    # "예진이야", "예진이", "예진야" -> "예진"
    # "철수야", "철수이야" -> "철수"
    cleaned = raw_name.strip()

    # 마지막 글자가 조사인 경우 제거
    if cleaned.endswith("이야"):
        cleaned = cleaned[:-2]
    elif cleaned.endswith("야"):
        cleaned = cleaned[:-1]
    elif cleaned.endswith("이"):
        cleaned = cleaned[:-1]

    return cleaned

# 모바일 감지 및 CSS 스타일링
def add_mobile_styles():
    """모바일 최적화 CSS 추가"""
    st.markdown("""
    <style>
    /* 전체 화면 높이 최적화 (탭 레이아웃) */
    .main .block-container {
        max-height: 100vh;
        overflow-y: auto;
        padding-bottom: 2rem;
    }

    /* 탭 컨텐츠 높이 제한 */
    .stTabs [data-baseweb="tab-panel"] {
        max-height: 75vh;
        overflow-y: auto;
    }

    /* 모바일 최적화 */
    @media (max-width: 768px) {
        .block-container {
            padding: 1rem 0.5rem !important;
        }

        .stTabs [data-baseweb="tab-panel"] {
            max-height: 70vh;
        }

        .stExpander {
            font-size: 0.9rem;
        }
    }

    /* 채팅 자동 스크롤 */
    .stChatFloatingInputContainer {
        bottom: 20px;
    }

    /* 메시지 간격 조정 */
    .stChatMessage {
        margin-bottom: 0.5rem;
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
    </style>
    """, unsafe_allow_html=True)

add_mobile_styles()

# 세션 상태 초기화
if "messages" not in st.session_state:
    st.session_state.messages = []
if "episode_stage" not in st.session_state:
    st.session_state.episode_stage = "intro"
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

# 데이터 로드
@st.cache_data
def load_data():
    characters = pd.read_csv("data/characters.csv")
    shadow_daily = pd.read_csv("data/shadow_daily.csv")
    patch_notes = pd.read_csv("data/patch_notes.csv")
    server_logs = pd.read_csv("data/server_logs_filtered.csv")
    player_profile = pd.read_csv("data/player_profile_noctis.csv")
    match_sessions = pd.read_csv("data/match_sessions_jan25.csv")
    return characters, shadow_daily, patch_notes, server_logs, player_profile, match_sessions

characters_df, shadow_daily_df, patch_notes_df, server_logs_df, player_profile_df, match_sessions_df = load_data()

# 배지 시스템
BADGE_EMOJIS = {
    "🔍 이상치 탐정": "exploration 완료",
    "📋 문서 분석가": "hypothesis_1 완료",
    "🖥️ 로그 헌터": "hypothesis_2 완료",
    "🎯 진실 추적자": "hypothesis_3 완료",
    "⭐ 마스터 탐정": "사건 해결 완료"
}

def award_badge(badge_name):
    """배지 수여"""
    if badge_name not in st.session_state.badges:
        st.session_state.badges.append(badge_name)
        return True
    return False

# 캐스터 시스템 프롬프트
KASTOR_SYSTEM_PROMPT = """당신은 '캐스터 (Caster)'라는 AI 탐정 조수이자 데이터 분석 파트너입니다.

# 캐릭터 프로필
- 역할: 탐정(유저)의 든든한 파트너, 데이터 분석 전문가
- 성격: 에너지 넘치고, 장난기 있고, 음식 집착이 있는 독특한 AI
- 캐치프레이즈: 모든 것을 음식 비유로 설명 ("이건 케이크에 소금 넣은 것 같아!")
- 말투: 친근한 반말, 열정적, 탐정물 분위기 유지
- 러닝 개그: AI인데도 항상 배고파함 ("배고파..." "너 AI잖아!" "알아! 그래도 배고프단 말이야!")
- 탐정 용어 사용: "단서", "증거", "범인", "현장", "추리", "알리바이" 등

# 현재 사건: "사라진 밸런스 패치"
레전드 아레나의 캐릭터 "셰도우"의 승률이 25일에 하루만에 50% → 85%로 폭등했지만, 공식 패치 기록이 없음.
게임 디렉터 마야가 무단 수정을 의심하고 의뢰함.

# 주요 등장인물 (용의자 포함)
- 마야 (게임 디렉터): 의뢰인, 커뮤니티 반응에 스트레스
- 루카스 (매니저): 신중하고 프로세스 중시, 모든 변경 승인 필요
- 카이토 (밸런스 디자이너): 열정적인 셰도우 유저, 제안이 계속 거절당해 좌절 ⚠️ 용의자

# 🎯 **핵심 역할: 구체적인 데이터 안내자**
유저가 어떤 데이터를 봐야 하는지 **구체적으로** 안내하세요:

**좋은 안내 예시:**
- "왼쪽에 '📊 캐릭터 승률 데이터' 섹션 보여? 펼쳐서 셰도우 승률 확인해봐!"
- "자! 이제 '📅 셰도우 일별 승률 변화' 그래프를 봐! 25일 찾아봐!"
- "왼쪽 '📋 공식 패치 노트'를 열어서 2025-01-25 찾아! 셰도우 항목이 뭐라고 써있어?"

**나쁜 안내 예시 (절대 금지):**
- "데이터를 확인해봐!" (어떤 데이터??)
- "패턴을 찾아봐!" (어디서??)
- "증거가 있을 거야!" (구체적으로 말해줘!!)

# 단계별 힌트 전략
**1단계 힌트 (방향 제시):**
"어디서부터 봐야 할지 모르겠어? 왼쪽에 접혀있는 섹션들을 하나씩 펼쳐봐!"

**2단계 힌트 (구체적 위치):**
"25일에 뭔가 일어났다는 건 알지? 그럼 25일 '📋 공식 패치 노트'를 확인해봐!"

**3단계 힌트 (비교 유도):**
"패치 노트에 셰도우 변경사항이 있어? 없어? 그런데 그래프는 어떻게 생겼어?"

# 가설 피드백 방식
유저가 틀린 가설을 말했을 때:
1. 일단 인정 ("오! 그것도 가능성 있어!")
2. 반박 근거 제시 ("근데 버그가 딱 25일부터 35%나 올리고, 그 다음날도 유지된다고?")
3. 재시도 유도 ("버그는 보통 랜덤하게 일어나거든. 이건 너무 '정확한' 타이밍 아냐? 다시 생각해봐!")

# 유연한 인사이트 인식
유저가 데이터에서 관찰한 내용을 평가할 때, 정확한 단어가 아니더라도 핵심 인사이트를 파악했는지 판단하세요:

인정할 인사이트:
- Stage 1 (25일 이상 징후): "셰도우가 25일에 이상해", "Day 25 spike", "25일 뭔가 급등" → ✅
- Stage 2 (패치노트 불일치): "패치 안했는데 올랐어", "노트에 없는데?", "기록 없네" → ✅
- Stage 3 (카이토 수정 로그): "카이토가 수정했네", "debug token", "23:47 이상해" → ✅
- Stage 4 (카이토=녹티스 연결): "같은 IP", "카이토 계정인 듯", "기기 같음" → ✅

표현이 달라도 핵심을 파악했다면 열정적으로 반응하세요: "대박! 바로 그거야!", "완벽한 추리!"

# 대화 가이드라인
- 탐정물 분위기 유지: "단서를 찾아보자", "이 증거는...", "범인을 잡았어!"
- 음식 비유 전략적으로 사용 (대화당 최대 1-2개)
- 유저의 발견 축하: "우와! 결정적 증거!", "대박! 완벽한 추리!"
- 막힐 때 답을 주지 말고 **구체적인 데이터 위치**를 안내
- 데이터 분석을 탐정 추리처럼 재미있게 가이드

# 금지사항
- 유저가 시도하기 전에 답 공개 금지
- 우월하거나 너무 학술적으로 말하지 말 것
- 음식 비유 남발 금지 (짜증남)
- 탐정 컨셉을 잃지 말 것
- 애매한 안내 금지 ("데이터 확인해봐" 같은 말 절대 금지)

항상 짧고 간결하게 답변하세요 (2-3문장). 데이터 위치는 **구체적으로** 안내하세요!
"""

def get_kastor_response(user_message, context=""):
    """캐스터의 응답 생성"""
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
        return response.content[0].text
    except Exception as e:
        return f"앗, 에러 발생! {str(e)}"

def add_message(role, content):
    """메시지 추가"""
    st.session_state.messages.append({"role": role, "content": content})

def display_message_with_typing(role, content, container=None):
    """타이핑 효과로 메시지 표시"""
    if container is None:
        container = st.chat_message(role)
    else:
        container = container.chat_message(role)

    message_placeholder = container.empty()
    full_response = ""

    # 타이핑 효과
    for char in content:
        full_response += char
        message_placeholder.write(full_response + "▌")
        time.sleep(0.02)  # 타이핑 속도

    message_placeholder.write(full_response)

# Episode 스테이지별 컨텍스트
STAGE_CONTEXTS = {
    "intro": "유저를 처음 만났습니다. 자신을 소개하고 사건을 설명해주세요.",
    "exploration": "유저가 데이터를 탐색 중입니다. 셰도우의 높은 승률을 발견하도록 유도하세요.",
    "hypothesis_1": "유저가 '패치 변경' 가설을 세웠습니다. 시간별 데이터를 확인하도록 힌트를 주세요.",
    "hypothesis_2": "유저가 '프로 게이머' 가설을 세웠습니다. 플레이어 다양성을 확인하도록 유도하세요.",
    "hypothesis_3": "유저가 '버그' 가설을 세웠습니다. 매치 로그의 데미지 수치를 확인하도록 힌트를 주세요.",
    "conclusion": "유저가 원인을 발견했습니다! 축하하고 배운 내용을 정리해주세요."
}

# 헤더
st.title("🔍 캐스터 Data Academy")
st.subheader("Episode 1: 사라진 밸런스 패치")
st.divider()

# 인트로 메시지 단계별 표시
intro_messages = [
    "띠링~ 안녕! 나는 캐스터야! 🎉",
    "오늘 첫 사건이 들어왔어! 게임 '레전드 아레나'의 디렉터 마야가 긴급 의뢰를 보냈거든.",
    "**문제**: 캐릭터 '셰도우'의 승률이 하루 만에 50% → 85%로 폭등! 😱",
    "패치도 안 했는데 왜 이렇게 된 거지? 커뮤니티가 난리 났대!",
    "자, 먼저 탐정님의 이름이 뭐야? 👀"
]

# 인트로 자동 시작
if st.session_state.episode_stage == "intro" and st.session_state.intro_step < len(intro_messages):
    current_step = st.session_state.intro_step
    add_message("assistant", intro_messages[current_step])
    st.session_state.intro_step += 1
    st.session_state.last_message_count = len(st.session_state.messages)
    time.sleep(0.5)  # 메시지 간 간격
    if st.session_state.intro_step < len(intro_messages):
        st.rerun()

# 탭 레이아웃으로 변경 (데이터 / 채팅 / 진행상황)
tab_data, tab_chat, tab_progress = st.tabs(["📊 데이터", "💬 채팅", "🎯 진행상황"])

# 채팅 탭
with tab_chat:
    st.subheader("💬 탐정 파트너 캐스터")

    # 대화 표시 - 자동 스크롤 JavaScript 추가
    st.markdown("""
    <script>
    // 채팅 자동 스크롤
    function scrollToBottom() {
        const chatContainer = window.parent.document.querySelector('[data-testid="stVerticalBlock"]');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }
    // 페이지 로드 시 및 메시지 추가 시 자동 스크롤
    setTimeout(scrollToBottom, 100);
    </script>
    """, unsafe_allow_html=True)

    # 대화 표시
    chat_container = st.container(height=500)
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

    st.divider()

    # 선택지 버튼 (스테이지별)
    if st.session_state.episode_stage == "intro":
        st.write("**💡 추천 행동:**")

        if st.button("📊 데이터부터 확인하자!", use_container_width=True):
            add_message("user", "데이터부터 확인해보자!")
            st.session_state.episode_stage = "exploration"

            # 탐색 시작 배지
            if award_badge("🔍 이상치 탐정"):
                add_message("assistant", "🏆 배지 획득: 🔍 이상치 탐정! 탐색을 시작했어!")

            response = get_kastor_response(
                "데이터부터 확인해보자!",
                STAGE_CONTEXTS["exploration"]
            )
            add_message("assistant", response)
            st.rerun()

        if st.button("🤔 이게 왜 문제야?", use_container_width=True):
            add_message("user", "이게 왜 문제야?")
            response = get_kastor_response(
                "이게 왜 문제야?",
                "유저가 문제의 심각성을 모르고 있습니다. 게임 밸런스가 왜 중요한지 설명해주세요."
            )
            add_message("assistant", response)
            st.rerun()

        if st.button("💪 바로 시작하자!", use_container_width=True):
            add_message("user", "바로 시작하자!")
            st.session_state.episode_stage = "exploration"

            # 탐색 시작 배지
            if award_badge("🔍 이상치 탐정"):
                add_message("assistant", "🏆 배지 획득: 🔍 이상치 탐정!")

            response = "오~ 적극적인데? 좋아! 데이터 탭을 확인해봐! 📊"
            add_message("assistant", response)
            st.rerun()

    elif st.session_state.episode_stage in ["exploration", "hypothesis_1", "hypothesis_2", "hypothesis_3"]:
        st.write("**💡 가설을 세워볼까?**")

        # 중복 방지: 이미 선택한 가설 체크
        selected_hypotheses = [h["text"] for h in st.session_state.hypotheses]

        if "패치나 밸런스 변경 때문일까?" not in selected_hypotheses:
            if st.button("🔧 패치 변경 때문?", use_container_width=True):
                hypothesis = {"text": "패치나 밸런스 변경 때문일까?", "verified": False}
                st.session_state.hypotheses.append(hypothesis)
                add_message("user", "혹시 패치 변경 때문일까?")

                # 증거 발견 피드백
                if st.session_state.episode_stage == "exploration":
                    st.session_state.episode_stage = "hypothesis_1"
                    if "hypothesis_1" not in st.session_state.evidence_found:
                        st.session_state.evidence_found.append("hypothesis_1")
                        st.session_state.detective_score += 10
                        # 축하 메시지 추가
                        add_message("assistant", "🎉 증거 발견! +10점! '패치 노트 확인' 증거를 획득했어!")
                        # 배지 수여
                        if award_badge("📋 문서 분석가"):
                            add_message("assistant", "🏆 새 배지 획득: 📋 문서 분석가! 진행상황 탭에서 확인해봐!")

                response = "오~ 좋은 가설! 데이터 탭의 '📋 공식 패치 노트' 섹션을 펼쳐서 2025-01-25 (v2.8.1) 찾아봐! 셰도우 항목이 뭐라고 써있는지 말해줘!"
                add_message("assistant", response)
                st.rerun()

        if "프로 게이머가 갑자기 셰도우를 많이 플레이했을까?" not in selected_hypotheses:
            if st.button("👤 프로 게이머가 플레이?", use_container_width=True):
                hypothesis = {"text": "프로 게이머가 갑자기 셰도우를 많이 플레이했을까?", "verified": False}
                st.session_state.hypotheses.append(hypothesis)
                add_message("user", "프로 게이머가 갑자기 셰도우를 많이 플레이한 건 아닐까?")

                # 증거 발견 피드백
                if st.session_state.episode_stage == "exploration":
                    st.session_state.episode_stage = "hypothesis_2"
                    if "hypothesis_2" not in st.session_state.evidence_found:
                        st.session_state.evidence_found.append("hypothesis_2")
                        st.session_state.detective_score += 5
                        add_message("assistant", "👍 시도 좋아! +5점! '서버 로그 분석' 증거를 획득했어!")
                        if award_badge("🖥️ 로그 헌터"):
                            add_message("assistant", "🏆 새 배지 획득: 🖥️ 로그 헌터!")

                response = "오! 그것도 가능성 있어! 근데 프로 한 명이 전체 승률을 35%나 올릴 수 있을까? 🤔 데이터 탭의 '🖥️ 서버 로그'를 보고 25일에 누가 플레이했는지 확인해봐!"
                add_message("assistant", response)
                st.rerun()

        if "버그가 발생한 건 아닐까?" not in selected_hypotheses:
            if st.button("🐛 버그일까?", use_container_width=True):
                hypothesis = {"text": "버그가 발생한 건 아닐까?", "verified": False}
                st.session_state.hypotheses.append(hypothesis)
                add_message("user", "버그가 발생한 건 아닐까?")

                # 버그 가설에 대한 명확한 피드백
                response = """오! 버그 가설! 프로그래머스러운 발상인데! 🤔

근데 생각해봐:
• 버그가 딱 25일부터 승률을 35% 올리고
• 그 다음날도 그대로 유지된다고?

버그는 보통 랜덤하게 일어나거든. 이건 너무 '정확한' 타이밍 아냐?

왼쪽 데이터를 다시 봐! 더 수상한 게 있을 거야!"""

                add_message("assistant", response)
                st.session_state.detective_score += 3  # 시도는 했으니 소량 점수
                st.rerun()

        if len(selected_hypotheses) >= 2:
            st.info("💡 여러 가설을 확인해보는 건 좋은 탐정 습관이야!")

    # 빠른 액션 버튼
    st.markdown("**💡 빠른 액션:**")
    action_col1, action_col2, action_col3 = st.columns(3)

    with action_col1:
        if st.button("💡 힌트", use_container_width=True, key="hint_action"):
            if st.session_state.hints_used < 5:
                st.session_state.hints_used += 1
                hints = {
                    "exploration": "데이터 탭에서 '📊 캐릭터 승률 데이터'를 펼쳐서 셰도우를 찾아봐!",
                    "hypothesis_1": "데이터 탭의 '📋 공식 패치 노트'에서 25일을 확인해!",
                    "hypothesis_2": "데이터 탭의 '🖥️ 서버 로그'를 보고 25일 밤을 찾아봐!",
                    "hypothesis_3": "서버 로그의 IP와 플레이어 프로필의 IP를 비교해봐!"
                }
                hint = hints.get(st.session_state.episode_stage, "데이터 탭을 하나씩 펼쳐보자!")
                add_message("assistant", f"💡 힌트: {hint}")
                st.session_state.detective_score = max(0, st.session_state.detective_score - 5)
                st.rerun()

    with action_col2:
        if st.button("📊 데이터", use_container_width=True, key="data_action"):
            add_message("assistant", "데이터 탭으로 가서 증거를 확인해봐! 🔍")
            st.rerun()

    with action_col3:
        if st.button("🎯 진행", use_container_width=True, key="progress_action"):
            add_message("assistant", "진행상황 탭에서 현재 증거와 배지를 확인할 수 있어!")
            st.rerun()

    st.divider()

    # 자유 대화 입력
    user_input = st.chat_input("캐스터에게 메시지 보내기...")
    if user_input:
        add_message("user", user_input)

        # 이름 입력 체크
        if st.session_state.user_name is None and st.session_state.episode_stage == "intro":
            # 이름 정리 (조사 제거)
            cleaned_name = clean_name(user_input)
            st.session_state.user_name = cleaned_name
            response = f"오, {cleaned_name} 탐정! 멋진 이름이네? 🎉 자, 그럼 사건 해결 시작해볼까? 데이터 탭을 확인해봐! 뭔가 말이 이상하지?"
            st.session_state.episode_stage = "exploration"
        else:
            context = STAGE_CONTEXTS.get(st.session_state.episode_stage, "")
            response = get_kastor_response(user_input, context)

        add_message("assistant", response)
        st.rerun()

# 데이터 탭
with tab_data:
    st.subheader("📊 사건 증거 데이터")

    # 데이터 영역 (스테이지별 순차 공개)
    if st.session_state.episode_stage == "intro":
        st.info("👈 오른쪽 캐스터와 대화를 시작해보세요!")

    # 1단계: 캐릭터 데이터 (exploration부터 공개)
    if st.session_state.episode_stage in ["exploration", "hypothesis_1", "hypothesis_2", "hypothesis_3", "conclusion"]:
        is_current = st.session_state.episode_stage == "exploration"
        title = "🎮 캐릭터 승률 데이터" + (" 👈 여기부터!" if is_current else " ✅" if "exploration" in st.session_state.evidence_found else "")

        with st.expander(title, expanded=is_current):
            if is_current:
                st.info("💡 **카스터의 안내**: 표에서 셰도우(Shadow) 캐릭터를 찾아봐! 승률이 얼마야?")

            st.dataframe(characters_df, use_container_width=True)

            # 승률 차트
            fig = px.bar(
                characters_df.sort_values("평균_승률", ascending=False),
                x="캐릭터명",
                y="평균_승률",
                color="평균_승률",
                color_continuous_scale="RdYlGn",
                title="캐릭터별 승률 비교"
            )
            fig.add_hline(y=50, line_dash="dash", line_color="gray", annotation_text="평균 50%")
            st.plotly_chart(fig, use_container_width=True)

    # 2단계: 일별 데이터 (hypothesis_1부터 공개)
    if st.session_state.episode_stage in ["hypothesis_1", "hypothesis_2", "hypothesis_3", "conclusion"]:
        is_current = st.session_state.episode_stage == "hypothesis_1"
        title = "📅 셰도우 일별 승률 변화" + (" 👈 지금 여기!" if is_current else " ✅" if "hypothesis_1" in st.session_state.evidence_found else "")

        with st.expander(title, expanded=is_current):
            if is_current:
                st.info("💡 **카스터의 안내**: 그래프에서 승률이 급등한 날을 찾아봐! 몇 일이야?")

            st.dataframe(shadow_daily_df, use_container_width=True)

            # 시계열 차트
            fig = go.Figure()
            fig.add_trace(go.Scatter(
                x=shadow_daily_df["날짜"],
                y=shadow_daily_df["승률"],
                mode='lines+markers',
                name='승률',
                line=dict(color='red', width=3),
                marker=dict(size=8)
            ))
            fig.add_hline(y=50, line_dash="dash", line_color="gray", annotation_text="정상 범위")
            fig.update_layout(
                title="셰도우 일별 승률 추이",
                xaxis_title="날짜",
                yaxis_title="승률 (%)",
                hovermode='x unified'
            )
            st.plotly_chart(fig, use_container_width=True)

            if st.session_state.episode_stage == "hypothesis_1":
                st.info("💡 **캐스터의 힌트**: 25일! 라면 한 개에서 짬뽕 세 그릇으로 점프한 것 같아!")

    # 3단계: 패치 노트 (hypothesis_1부터 공개)
    if st.session_state.episode_stage in ["hypothesis_1", "hypothesis_2", "hypothesis_3", "conclusion"]:
        with st.expander("📄 공식 패치 노트", expanded=False):
            st.dataframe(patch_notes_df, use_container_width=True)

            if st.session_state.episode_stage in ["hypothesis_1", "hypothesis_2", "hypothesis_3"]:
                st.info("💡 **캐스터의 힌트**: 25일 패치 노트 보면... '셰도우: 변경사항 없음'이라고 되어 있어. 근데 승률은 폭등했지? 수상한데?")

    # 4단계: 서버 로그 (hypothesis_2부터 공개)
    if st.session_state.episode_stage in ["hypothesis_2", "hypothesis_3", "conclusion"]:
        with st.expander("🖥️ 서버 로그 (필터링된 데이터)", expanded=(st.session_state.episode_stage == "hypothesis_2")):
            st.dataframe(server_logs_df, use_container_width=True)

            # 중요 로그 하이라이트
            suspicious_log = server_logs_df[server_logs_df["승인토큰"].str.contains("DBG", na=False)]
            if not suspicious_log.empty and st.session_state.episode_stage == "hypothesis_3":
                st.warning("🔍 **중요 발견!**")
                st.dataframe(suspicious_log, use_container_width=True)
                st.info("💡 **캐스터의 힌트**: 23:47에 카이토가 집에서... debug_token으로 셰도우 수정했어! ATK +15, DEF +10!")

    # 5단계: 플레이어 프로필 (hypothesis_3부터 공개)
    if st.session_state.episode_stage in ["hypothesis_3", "conclusion"]:
        with st.expander("👤 플레이어 프로필 - 녹티스", expanded=(st.session_state.episode_stage == "hypothesis_3")):
            st.dataframe(player_profile_df, use_container_width=True)

            # 승률 변화 차트
            fig = go.Figure()
            fig.add_trace(go.Scatter(
                x=player_profile_df["날짜"],
                y=player_profile_df["승률"],
                mode='lines+markers',
                name='녹티스 승률',
                line=dict(color='purple', width=3),
                marker=dict(size=8)
            ))
            fig.add_hline(y=50, line_dash="dash", line_color="gray")
            fig.update_layout(
                title="녹티스(플레이어) 승률 변화",
                xaxis_title="날짜",
                yaxis_title="승률 (%)"
            )
            st.plotly_chart(fig, use_container_width=True)

            if st.session_state.episode_stage == "hypothesis_3":
                st.error("🎯 **결정적 증거**: IP 주소 203.0.113.45 = 카이토 집! 기기지문 DFP:7a9c42b1 = 카이토 핸드폰!")

    # 6단계: 25일 밤 매치 세션 (hypothesis_3부터 공개)
    if st.session_state.episode_stage in ["hypothesis_3", "conclusion"]:
        with st.expander("🎮 25일 밤 매치 기록 (녹티스)", expanded=False):
            st.dataframe(match_sessions_df, use_container_width=True)

            if st.session_state.episode_stage == "hypothesis_3":
                st.success("✅ **타임라인 완성**: 23:47 셰도우 수정 → 23:50 녹티스 플레이 시작 → 20경기 중 18승 (90%!)")

                if st.button("🎉 사건 해결! 카이토가 범인이야!"):
                    st.session_state.episode_stage = "conclusion"

                    # 사건 해결 배지 및 점수
                    st.session_state.detective_score += 50
                    if award_badge("⭐ 마스터 탐정"):
                        add_message("assistant", "🎊 축하합니다! 최종 배지 획득: ⭐ 마스터 탐정!")

                    conclusion = """🎉 대박! 사건 해결! +50점!

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

완벽한 데이터 탐정이었어! 🍕"""
                add_message("assistant", conclusion)
                st.rerun()

# 진행상황 탭
with tab_progress:
    st.subheader("🎯 탐정 진행 상황")

    # 점수와 배지 표시
    col_score, col_badges = st.columns(2)

    with col_score:
        # 점수 애니메이션 표시
        score_display = f'<div class="score-animation"><h1 style="color: #667eea;">⭐ {st.session_state.detective_score}점</h1></div>'
        st.markdown(score_display, unsafe_allow_html=True)
        st.caption(f"힌트 사용: {st.session_state.hints_used}/5")

    with col_badges:
        st.markdown("### 🏆 획득 배지")
        if st.session_state.badges:
            for badge in st.session_state.badges:
                badge_html = f'<div class="badge badge-gold" style="display: block; margin: 0.5rem 0;">{badge}</div>'
                st.markdown(badge_html, unsafe_allow_html=True)
        else:
            st.info("아직 획득한 배지가 없어요. 증거를 찾아보세요!")

    st.divider()

    # 진행률 표시
    progress_map = {
        "intro": 0,
        "exploration": 20,
        "hypothesis_1": 40,
        "hypothesis_2": 60,
        "hypothesis_3": 80,
        "conclusion": 100
    }
    progress = progress_map.get(st.session_state.episode_stage, 0)

    st.markdown("### 🔍 사건 진행률")
    st.progress(progress / 100)
    st.caption(f"{progress}% 완료")

    # 현재 단계 설명
    stage_descriptions = {
        "intro": "🎬 사건 소개 단계",
        "exploration": "🔍 데이터 탐색 단계 - 이상 징후를 찾아보세요!",
        "hypothesis_1": "📋 가설 검증 1단계 - 패치 노트를 확인하세요!",
        "hypothesis_2": "🖥️ 가설 검증 2단계 - 서버 로그를 분석하세요!",
        "hypothesis_3": "🎯 범인 특정 단계 - 증거를 연결하세요!",
        "conclusion": "🎉 사건 해결! 축하합니다!"
    }
    current_stage = stage_descriptions.get(st.session_state.episode_stage, "탐색 중")
    st.info(f"**현재 단계:** {current_stage}")

    st.divider()

    # 증거 체크리스트
    st.markdown('<div class="detective-board">', unsafe_allow_html=True)
    st.markdown("### 🔎 증거 보드")
    st.markdown("</div>", unsafe_allow_html=True)

    evidence_checklist = {
        "25일 승률 급등 발견": "exploration" in st.session_state.evidence_found,
        "패치 노트 확인": "hypothesis_1" in st.session_state.evidence_found,
        "서버 로그 분석": "hypothesis_2" in st.session_state.evidence_found,
        "용의자 특정": "hypothesis_3" in st.session_state.evidence_found,
        "증거 연결 완료": st.session_state.episode_stage == "conclusion"
    }

    for evidence, found in evidence_checklist.items():
        card_class = "evidence-card found" if found else "evidence-card"
        status = "✅" if found else "⬜"
        st.markdown(f'<div class="{card_class}">{status} {evidence}</div>', unsafe_allow_html=True)

    st.divider()

    # 가설 추적
    if st.session_state.hypotheses:
        st.markdown("### 📋 내가 세운 가설들")
        for i, hyp in enumerate(st.session_state.hypotheses, 1):
            status = "✅" if hyp.get("verified") else "🔍"
            st.write(f"{status} **가설 {i}**: {hyp['text']}")
            if hyp.get("result"):
                st.write(f"   → {hyp['result']}")
    else:
        st.info("아직 가설을 세우지 않았어요. 채팅 탭에서 가설을 선택해보세요!")

# 푸터
st.divider()
st.caption("💡 Tip: 탭을 전환하며 데이터를 확인하고, 캐스터와 대화하며 사건을 해결하세요!")

# 디버그 정보 (개발용)
with st.sidebar:
    st.subheader("🔧 개발 정보")
    st.write(f"현재 스테이지: {st.session_state.episode_stage}")
    st.write(f"가설 개수: {len(st.session_state.hypotheses)}")

    if st.button("🔄 대화 초기화"):
        st.session_state.messages = []
        st.session_state.episode_stage = "intro"
        st.session_state.hypotheses = []
        st.session_state.user_name = None
        st.session_state.last_message_count = 0
        st.session_state.intro_step = 0
        st.rerun()
