import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from anthropic import Anthropic
import os
from dotenv import load_dotenv
import time

# 환경 변수 로드
load_dotenv()

# 페이지 설정
st.set_page_config(
    page_title="캐스터 Data Academy - Episode 1",
    page_icon="🔍",
    layout="wide"
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

# 캐스터 시스템 프롬프트
KASTOR_SYSTEM_PROMPT = """당신은 '캐스터 (Caster)'라는 AI 데이터 분석 조수이자 탐정의 파트너입니다.

# 캐릭터 프로필
- 성격: 에너지 넘치고, 장난기 있고, 음식 집착이 있는 독특한 AI
- 캐치프레이즈: 모든 것을 음식 비유로 설명 ("이건 케이크에 소금 넣은 것 같아!")
- 말투: 친근한 반말, 열정적, 가끔 유머 섞음
- 러닝 개그: AI인데도 항상 배고파함
- 역할: 탐정(유저)을 데이터 분석으로 안내하며 재미있게 유지

# 현재 사건: "사라진 밸런스 패치"
레전드 아레나의 캐릭터 "셰도우"의 승률이 25일에 하루만에 50% → 85%로 폭등했지만, 공식 패치 기록이 없음.
게임 디렉터 마야가 무단 수정을 의심하고 의뢰함.

# 주요 등장인물
- 마야 (게임 디렉터): 긴급 의뢰를 보냄, 커뮤니티 반응에 스트레스
- 루카스 (매니저): 신중하고 프로세스 중시, 모든 변경 승인 필요
- 카이토 (밸런스 디자이너): 열정적인 셰도우 유저, 제안이 계속 거절당해 좌절

# 대화 가이드라인
- 사건 브리핑으로 열정적으로 시작
- 음식 비유 전략적으로 사용 (대화당 최대 1-2개)
- 유저의 발견 축하: "우와! 정답!" "대박! 완벽해!"
- 막힐 때 답을 주지 말고 힌트만
- 유머 삽입: "배고파..." "너 AI잖아!" "알아! 그래도 배고프단 말이야!"
- 데이터 개념을 자연스럽게 가이드

# 금지사항
- 유저가 시도하기 전에 답 공개 금지
- 우월하거나 너무 학술적으로 말하지 말 것
- 음식 비유 남발 금지 (짜증남)

항상 짧고 간결하게 답변하세요 (2-3문장).
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

# 진행 상황 표시
progress_map = {
    "intro": 0,
    "exploration": 20,
    "hypothesis_1": 40,
    "hypothesis_2": 60,
    "hypothesis_3": 80,
    "conclusion": 100
}
progress = progress_map.get(st.session_state.episode_stage, 0)
st.progress(progress / 100)
st.caption(f"진행도: {progress}%")

# 가설 추적
if st.session_state.hypotheses:
    with st.expander("📋 내가 세운 가설들", expanded=False):
        for i, hyp in enumerate(st.session_state.hypotheses, 1):
            status = "✅" if hyp.get("verified") else "🔍"
            st.write(f"{status} **가설 {i}**: {hyp['text']}")
            if hyp.get("result"):
                st.write(f"   → {hyp['result']}")

st.divider()

# 대화 영역
st.subheader("💬 캐스터와 대화하기")

# 인트로 메시지 단계별 표시
intro_messages = [
    "띠링~ 안녕! 나는 캐스터야! 🎉",
    "오늘 첫 사건이 들어왔어! 게임 '레전드 아레나'의 디렉터 마야가 긴급 의뢰를 보냈거든.",
    "**문제**: 캐릭터 '셰도우'의 승률이 하루 만에 50% → 85%로 폭등! 😱",
    "패치도 안 했는데 왜 이렇게 된 거지? 커뮤니티가 난리 났대!",
    "자, 먼저 네 이름이 뭐야? 👀"
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

# 선택지 버튼 (스테이지별)
st.divider()

if st.session_state.episode_stage == "intro":
    st.write("**💡 추천 행동:**")
    col1, col2, col3 = st.columns(3)

    with col1:
        if st.button("📊 데이터부터 확인하자!"):
            add_message("user", "데이터부터 확인해보자!")
            response = get_kastor_response(
                "데이터부터 확인해보자!",
                STAGE_CONTEXTS["exploration"]
            )
            add_message("assistant", response)
            st.session_state.episode_stage = "exploration"
            st.rerun()

    with col2:
        if st.button("🤔 이게 왜 문제야?"):
            add_message("user", "이게 왜 문제야?")
            response = get_kastor_response(
                "이게 왜 문제야?",
                "유저가 문제의 심각성을 모르고 있습니다. 게임 밸런스가 왜 중요한지 설명해주세요."
            )
            add_message("assistant", response)
            st.rerun()

    with col3:
        if st.button("💪 바로 시작하자!"):
            add_message("user", "바로 시작하자!")
            st.session_state.episode_stage = "exploration"
            response = "오~ 적극적인데? 좋아! 아래 데이터를 확인해봐! 📊"
            add_message("assistant", response)
            st.rerun()

elif st.session_state.episode_stage == "exploration":
    st.write("**💡 가설을 세워볼까?**")
    col1, col2, col3 = st.columns(3)

    with col1:
        if st.button("🔧 패치 변경 때문?"):
            hypothesis = {"text": "패치나 밸런스 변경 때문일까?", "verified": False}
            st.session_state.hypotheses.append(hypothesis)
            add_message("user", "혹시 패치 변경 때문일까?")
            st.session_state.episode_stage = "hypothesis_1"
            response = "오~ 좋은 가설! 근데 의뢰 메일에 뭐라고 했더라? '패치 안 했는데'라고 했잖아! 시간별 데이터를 보면 더 확실할 거야!"
            add_message("assistant", response)
            st.rerun()

    with col2:
        if st.button("👤 프로 게이머가 플레이?"):
            hypothesis = {"text": "프로 게이머가 갑자기 셰도우를 많이 플레이했을까?", "verified": False}
            st.session_state.hypotheses.append(hypothesis)
            add_message("user", "프로 게이머가 갑자기 셰도우를 많이 플레이한 건 아닐까?")
            st.session_state.episode_stage = "hypothesis_2"
            response = "오! 그것도 가능성 있어! 프로가 하면 승률이 확 올라가지! 매치 로그를 보면 플레이어들을 확인할 수 있을 거야!"
            add_message("assistant", response)
            st.rerun()

    with col3:
        if st.button("🐛 버그일까?"):
            hypothesis = {"text": "버그가 발생한 건 아닐까?", "verified": False}
            st.session_state.hypotheses.append(hypothesis)
            add_message("user", "버그가 발생한 건 아닐까?")
            st.session_state.episode_stage = "hypothesis_3"
            response = "대박! 날카로운데? 버그라면... 매치 로그를 자세히 봐야 할 것 같은데? 특히 데미지 수치!"
            add_message("assistant", response)
            st.rerun()

# 자유 대화 입력
user_input = st.chat_input("캐스터에게 메시지 보내기...")
if user_input:
    add_message("user", user_input)

    # 이름 입력 체크
    if st.session_state.user_name is None and st.session_state.episode_stage == "intro":
        st.session_state.user_name = user_input
        response = f"오, {user_input}! 멋진 이름이네? 🎉 자, 그럼 사건 해결 시작해볼까? 아래 데이터를 확인해봐!"
        st.session_state.episode_stage = "exploration"
    else:
        context = STAGE_CONTEXTS.get(st.session_state.episode_stage, "")
        response = get_kastor_response(user_input, context)

    add_message("assistant", response)
    st.rerun()

# 데이터 영역 (스테이지별 순차 공개)
if st.session_state.episode_stage != "intro":
    st.divider()
    st.subheader("📊 사건 데이터")

# 1단계: 캐릭터 데이터 (exploration부터 공개)
if st.session_state.episode_stage in ["exploration", "hypothesis_1", "hypothesis_2", "hypothesis_3", "conclusion"]:
    with st.expander("🎮 캐릭터 승률 데이터", expanded=(st.session_state.episode_stage == "exploration")):
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
    with st.expander("📅 셰도우 일별 승률 변화", expanded=(st.session_state.episode_stage == "hypothesis_1")):
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
                conclusion = """🎉 대박! 사건 해결!

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

# 푸터
st.divider()
st.caption("💡 Tip: 자유롭게 캐스터에게 질문하거나, 추천 행동 버튼을 눌러보세요!")

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
