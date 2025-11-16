/// 인물 정보 데이터 모델
class CharacterData {
  final String id;
  final String name;
  final String nameKo; // 한국어 이름
  final String role;
  final String roleKo;
  final String description;
  final String descriptionKo;
  final String avatar; // assets 경로
  final List<String> knownFacts; // 알려진 사실들
  final List<String> knownFactsKo;
  final String suspicionLevel; // low, medium, high
  final List<DialogueEntry> recentDialogues; // 최근 대화

  CharacterData({
    required this.id,
    required this.name,
    required this.nameKo,
    required this.role,
    required this.roleKo,
    required this.description,
    required this.descriptionKo,
    required this.avatar,
    required this.knownFacts,
    required this.knownFactsKo,
    this.suspicionLevel = 'low',
    this.recentDialogues = const [],
  });
}

/// 대화 항목
class DialogueEntry {
  final String speaker;
  final String speakerKo;
  final String text;
  final String textKo;
  final String time;

  DialogueEntry({
    required this.speaker,
    required this.speakerKo,
    required this.text,
    required this.textKo,
    required this.time,
  });
}

/// Episode 1 인물 데이터
final List<CharacterData> episode1Characters = [
  CharacterData(
    id: 'maya',
    name: 'Maya Zhang',
    nameKo: '마야 장',
    role: 'Game Designer',
    roleKo: '게임 디자이너',
    description: 'Lead Game Designer at Nova Games. Responsible for character balance.',
    descriptionKo: 'Nova Games의 리드 게임 디자이너. 캐릭터 밸런스를 담당합니다.',
    avatar: 'assets/characters/maya.svg',
    knownFacts: [
      'Filed the missing balance patch incident',
      'Has access to all game data',
      'Recently promoted to Lead Designer',
    ],
    knownFactsKo: [
      '밸런스 패치 분실 사건을 신고함',
      '모든 게임 데이터에 접근 가능',
      '최근 리드 디자이너로 승진',
    ],
    suspicionLevel: 'medium',
    recentDialogues: [
      DialogueEntry(
        speaker: 'Maya',
        speakerKo: '마야',
        text: 'I can\'t believe the patch notes disappeared!',
        textKo: '패치 노트가 사라졌다니 믿을 수가 없어요!',
        time: '09:30',
      ),
      DialogueEntry(
        speaker: 'Maya',
        speakerKo: '마야',
        text: 'Shadow\'s win rate is abnormally high after the update.',
        textKo: '업데이트 후 Shadow의 승률이 비정상적으로 높아요.',
        time: '10:15',
      ),
    ],
  ),
  CharacterData(
    id: 'shadow',
    name: 'Shadow',
    nameKo: '섀도우',
    role: 'Game Character',
    roleKo: '게임 캐릭터',
    description: 'A powerful assassin character in Nova Games\' flagship title.',
    descriptionKo: 'Nova Games의 주력 게임에 등장하는 강력한 암살자 캐릭터.',
    avatar: 'assets/characters/narrator.svg', // placeholder
    knownFacts: [
      'Win rate jumped from 48% to 85% after patch',
      'Most popular character among players',
      'Received mysterious buffs',
    ],
    knownFactsKo: [
      '패치 후 승률이 48%에서 85%로 급상승',
      '플레이어들 사이에서 가장 인기 있는 캐릭터',
      '알 수 없는 버프를 받음',
    ],
    suspicionLevel: 'high',
    recentDialogues: [],
  ),
  CharacterData(
    id: 'kastor',
    name: 'Kastor',
    nameKo: '캐스터',
    role: 'AI Data Analyst',
    roleKo: 'AI 데이터 분석가',
    description: 'Advanced AI assistant specialized in data analysis and investigation.',
    descriptionKo: '데이터 분석과 조사를 전문으로 하는 고급 AI 어시스턴트.',
    avatar: 'assets/characters/kastor.svg',
    knownFacts: [
      'Has access to all game analytics',
      'Can process millions of data points',
      'Assists in solving game-related mysteries',
    ],
    knownFactsKo: [
      '모든 게임 분석 데이터에 접근 가능',
      '수백만 개의 데이터 포인트 처리 가능',
      '게임 관련 미스터리 해결을 돕습니다',
    ],
    suspicionLevel: 'low',
    recentDialogues: [
      DialogueEntry(
        speaker: 'Kastor',
        speakerKo: '캐스터',
        text: 'Let me analyze the data patterns for you.',
        textKo: '데이터 패턴을 분석해 드리겠습니다.',
        time: '09:35',
      ),
    ],
  ),
];
