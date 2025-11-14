import 'package:json_annotation/json_annotation.dart';

part 'hint_system.g.dart';

@JsonSerializable()
class HintSystem {
  final int totalPoints;
  final int usedPoints;
  final List<String> unlockedHints;

  HintSystem({
    this.totalPoints = 100,
    this.usedPoints = 0,
    this.unlockedHints = const [],
  });

  int get remainingPoints => totalPoints - usedPoints;

  bool canUseHint(int cost) => remainingPoints >= cost;

  HintSystem useHint(String hintId, int cost) {
    return HintSystem(
      totalPoints: totalPoints,
      usedPoints: usedPoints + cost,
      unlockedHints: [...unlockedHints, hintId],
    );
  }

  HintSystem addPoints(int points) {
    return HintSystem(
      totalPoints: totalPoints + points,
      usedPoints: usedPoints,
      unlockedHints: unlockedHints,
    );
  }

  factory HintSystem.fromJson(Map<String, dynamic> json) =>
      _$HintSystemFromJson(json);
  Map<String, dynamic> toJson() => _$HintSystemToJson(this);
}

@JsonSerializable()
class Hint {
  final String id;
  final String episodeId;
  final String sceneId;
  final String text;
  final int cost;
  final HintLevel level;

  Hint({
    required this.id,
    required this.episodeId,
    required this.sceneId,
    required this.text,
    required this.cost,
    required this.level,
  });

  factory Hint.fromJson(Map<String, dynamic> json) => _$HintFromJson(json);
  Map<String, dynamic> toJson() => _$HintToJson(this);
}

enum HintLevel {
  subtle, // 10 포인트
  helpful, // 20 포인트
  direct, // 30 포인트
}
