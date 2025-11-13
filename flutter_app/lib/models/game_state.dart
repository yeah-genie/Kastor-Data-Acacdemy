import 'package:json_annotation/json_annotation.dart';
import 'evidence.dart';

part 'game_state.g.dart';

@JsonSerializable()
class Choice {
  final String choiceId;
  final String sceneId;
  final String timestamp;

  Choice({
    required this.choiceId,
    required this.sceneId,
    required this.timestamp,
  });

  factory Choice.fromJson(Map<String, dynamic> json) => _$ChoiceFromJson(json);
  Map<String, dynamic> toJson() => _$ChoiceToJson(this);
}

@JsonSerializable()
class GameSnapshot {
  final String episodeId;
  final String currentSceneId;
  final List<String> completedScenes;
  final List<Evidence> collectedEvidence;
  final int points;
  final String savedAt;

  GameSnapshot({
    required this.episodeId,
    required this.currentSceneId,
    required this.completedScenes,
    required this.collectedEvidence,
    required this.points,
    required this.savedAt,
  });

  factory GameSnapshot.fromJson(Map<String, dynamic> json) =>
      _$GameSnapshotFromJson(json);
  Map<String, dynamic> toJson() => _$GameSnapshotToJson(this);
}

@JsonSerializable()
class GameState {
  final String? currentEpisode;
  final String? currentScene;
  final List<String> sceneHistory;
  final List<Evidence> collectedEvidence;
  final Map<String, int> characterRelationships;
  final List<Choice> madeChoices;
  final List<String> unlockedScenes;
  final double gameProgress;
  final List<String> completedEpisodes;
  final String? lastSavedAt;
  final Map<String, GameSnapshot> saveSlots;

  GameState({
    this.currentEpisode,
    this.currentScene,
    required this.sceneHistory,
    required this.collectedEvidence,
    required this.characterRelationships,
    required this.madeChoices,
    required this.unlockedScenes,
    required this.gameProgress,
    required this.completedEpisodes,
    this.lastSavedAt,
    required this.saveSlots,
  });

  factory GameState.initial() => GameState(
        currentEpisode: null,
        currentScene: null,
        sceneHistory: [],
        collectedEvidence: [],
        characterRelationships: {},
        madeChoices: [],
        unlockedScenes: [],
        gameProgress: 0.0,
        completedEpisodes: [],
        lastSavedAt: null,
        saveSlots: {},
      );

  factory GameState.fromJson(Map<String, dynamic> json) =>
      _$GameStateFromJson(json);
  Map<String, dynamic> toJson() => _$GameStateToJson(this);

  GameState copyWith({
    String? currentEpisode,
    String? currentScene,
    List<String>? sceneHistory,
    List<Evidence>? collectedEvidence,
    Map<String, int>? characterRelationships,
    List<Choice>? madeChoices,
    List<String>? unlockedScenes,
    double? gameProgress,
    List<String>? completedEpisodes,
    String? lastSavedAt,
    Map<String, GameSnapshot>? saveSlots,
  }) {
    return GameState(
      currentEpisode: currentEpisode ?? this.currentEpisode,
      currentScene: currentScene ?? this.currentScene,
      sceneHistory: sceneHistory ?? this.sceneHistory,
      collectedEvidence: collectedEvidence ?? this.collectedEvidence,
      characterRelationships:
          characterRelationships ?? this.characterRelationships,
      madeChoices: madeChoices ?? this.madeChoices,
      unlockedScenes: unlockedScenes ?? this.unlockedScenes,
      gameProgress: gameProgress ?? this.gameProgress,
      completedEpisodes: completedEpisodes ?? this.completedEpisodes,
      lastSavedAt: lastSavedAt ?? this.lastSavedAt,
      saveSlots: saveSlots ?? this.saveSlots,
    );
  }
}
