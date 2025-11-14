import 'package:json_annotation/json_annotation.dart';

part 'statistics.g.dart';

@JsonSerializable()
class Statistics {
  final int totalPlayTimeSeconds;
  final int episodesCompleted;
  final int totalChoicesMade;
  final int correctChoices;
  final int evidenceCollected;
  final int hintsUsed;
  final int achievementsUnlocked;
  final DateTime? firstPlayedAt;
  final DateTime? lastPlayedAt;

  Statistics({
    this.totalPlayTimeSeconds = 0,
    this.episodesCompleted = 0,
    this.totalChoicesMade = 0,
    this.correctChoices = 0,
    this.evidenceCollected = 0,
    this.hintsUsed = 0,
    this.achievementsUnlocked = 0,
    this.firstPlayedAt,
    this.lastPlayedAt,
  });

  double get accuracy {
    if (totalChoicesMade == 0) return 0.0;
    return (correctChoices / totalChoicesMade) * 100;
  }

  String get totalPlayTime {
    final hours = totalPlayTimeSeconds ~/ 3600;
    final minutes = (totalPlayTimeSeconds % 3600) ~/ 60;
    if (hours > 0) {
      return '$hours시간 $minutes분';
    }
    return '$minutes분';
  }

  Statistics copyWith({
    int? totalPlayTimeSeconds,
    int? episodesCompleted,
    int? totalChoicesMade,
    int? correctChoices,
    int? evidenceCollected,
    int? hintsUsed,
    int? achievementsUnlocked,
    DateTime? firstPlayedAt,
    DateTime? lastPlayedAt,
  }) {
    return Statistics(
      totalPlayTimeSeconds: totalPlayTimeSeconds ?? this.totalPlayTimeSeconds,
      episodesCompleted: episodesCompleted ?? this.episodesCompleted,
      totalChoicesMade: totalChoicesMade ?? this.totalChoicesMade,
      correctChoices: correctChoices ?? this.correctChoices,
      evidenceCollected: evidenceCollected ?? this.evidenceCollected,
      hintsUsed: hintsUsed ?? this.hintsUsed,
      achievementsUnlocked: achievementsUnlocked ?? this.achievementsUnlocked,
      firstPlayedAt: firstPlayedAt ?? this.firstPlayedAt,
      lastPlayedAt: lastPlayedAt ?? this.lastPlayedAt,
    );
  }

  Statistics incrementPlayTime(int seconds) {
    return copyWith(
      totalPlayTimeSeconds: totalPlayTimeSeconds + seconds,
      lastPlayedAt: DateTime.now(),
    );
  }

  Statistics recordChoice(bool isCorrect) {
    return copyWith(
      totalChoicesMade: totalChoicesMade + 1,
      correctChoices: isCorrect ? correctChoices + 1 : correctChoices,
    );
  }

  Statistics collectEvidence() {
    return copyWith(evidenceCollected: evidenceCollected + 1);
  }

  Statistics useHint() {
    return copyWith(hintsUsed: hintsUsed + 1);
  }

  Statistics completeEpisode() {
    return copyWith(episodesCompleted: episodesCompleted + 1);
  }

  Statistics unlockAchievement() {
    return copyWith(achievementsUnlocked: achievementsUnlocked + 1);
  }

  factory Statistics.fromJson(Map<String, dynamic> json) =>
      _$StatisticsFromJson(json);
  Map<String, dynamic> toJson() => _$StatisticsToJson(this);
}
