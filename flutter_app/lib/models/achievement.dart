import 'package:json_annotation/json_annotation.dart';

part 'achievement.g.dart';

@JsonSerializable()
class Achievement {
  final String id;
  final String title;
  final String description;
  final String iconName;
  final int points;
  final AchievementType type;
  final bool isUnlocked;
  final DateTime? unlockedAt;

  Achievement({
    required this.id,
    required this.title,
    required this.description,
    required this.iconName,
    required this.points,
    required this.type,
    this.isUnlocked = false,
    this.unlockedAt,
  });

  Achievement copyWith({
    String? id,
    String? title,
    String? description,
    String? iconName,
    int? points,
    AchievementType? type,
    bool? isUnlocked,
    DateTime? unlockedAt,
  }) {
    return Achievement(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      iconName: iconName ?? this.iconName,
      points: points ?? this.points,
      type: type ?? this.type,
      isUnlocked: isUnlocked ?? this.isUnlocked,
      unlockedAt: unlockedAt ?? this.unlockedAt,
    );
  }

  factory Achievement.fromJson(Map<String, dynamic> json) =>
      _$AchievementFromJson(json);
  Map<String, dynamic> toJson() => _$AchievementToJson(this);
}

enum AchievementType {
  firstCase,
  perfectDeduction,
  allEvidence,
  speedRun,
  noHints,
  allEpisodes,
  masterDetective,
}

// 기본 업적 목록
final List<Achievement> defaultAchievements = [
  Achievement(
    id: 'first_case',
    title: '첫 사건 해결',
    description: '첫 번째 에피소드를 완료하세요',
    iconName: 'first_case',
    points: 100,
    type: AchievementType.firstCase,
  ),
  Achievement(
    id: 'perfect_deduction',
    title: '완벽한 추리',
    description: '단서를 놓치지 않고 사건을 해결하세요',
    iconName: 'perfect',
    points: 150,
    type: AchievementType.perfectDeduction,
  ),
  Achievement(
    id: 'all_evidence',
    title: '증거 수집가',
    description: '모든 증거를 수집하세요',
    iconName: 'evidence',
    points: 200,
    type: AchievementType.allEvidence,
  ),
  Achievement(
    id: 'speed_run',
    title: '스피드 러너',
    description: '30분 안에 사건을 해결하세요',
    iconName: 'speed',
    points: 250,
    type: AchievementType.speedRun,
  ),
  Achievement(
    id: 'no_hints',
    title: '진정한 탐정',
    description: '힌트 없이 사건을 해결하세요',
    iconName: 'detective',
    points: 300,
    type: AchievementType.noHints,
  ),
  Achievement(
    id: 'all_episodes',
    title: '사건 해결사',
    description: '모든 에피소드를 완료하세요',
    iconName: 'all_cases',
    points: 500,
    type: AchievementType.allEpisodes,
  ),
  Achievement(
    id: 'master_detective',
    title: '마스터 탐정',
    description: '모든 업적을 달성하세요',
    iconName: 'master',
    points: 1000,
    type: AchievementType.masterDetective,
  ),
];
