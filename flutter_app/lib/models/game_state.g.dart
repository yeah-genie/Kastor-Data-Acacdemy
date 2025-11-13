// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'game_state.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Choice _$ChoiceFromJson(Map<String, dynamic> json) => Choice(
  choiceId: json['choiceId'] as String,
  sceneId: json['sceneId'] as String,
  timestamp: json['timestamp'] as String,
);

Map<String, dynamic> _$ChoiceToJson(Choice instance) => <String, dynamic>{
  'choiceId': instance.choiceId,
  'sceneId': instance.sceneId,
  'timestamp': instance.timestamp,
};

GameSnapshot _$GameSnapshotFromJson(Map<String, dynamic> json) => GameSnapshot(
  episodeId: json['episodeId'] as String,
  currentSceneId: json['currentSceneId'] as String,
  completedScenes: (json['completedScenes'] as List<dynamic>)
      .map((e) => e as String)
      .toList(),
  collectedEvidence: (json['collectedEvidence'] as List<dynamic>)
      .map((e) => Evidence.fromJson(e as Map<String, dynamic>))
      .toList(),
  points: (json['points'] as num).toInt(),
  savedAt: json['savedAt'] as String,
);

Map<String, dynamic> _$GameSnapshotToJson(GameSnapshot instance) =>
    <String, dynamic>{
      'episodeId': instance.episodeId,
      'currentSceneId': instance.currentSceneId,
      'completedScenes': instance.completedScenes,
      'collectedEvidence': instance.collectedEvidence,
      'points': instance.points,
      'savedAt': instance.savedAt,
    };

GameState _$GameStateFromJson(Map<String, dynamic> json) => GameState(
  currentEpisode: json['currentEpisode'] as String?,
  currentScene: json['currentScene'] as String?,
  sceneHistory: (json['sceneHistory'] as List<dynamic>)
      .map((e) => e as String)
      .toList(),
  collectedEvidence: (json['collectedEvidence'] as List<dynamic>)
      .map((e) => Evidence.fromJson(e as Map<String, dynamic>))
      .toList(),
  characterRelationships: Map<String, int>.from(
    json['characterRelationships'] as Map,
  ),
  madeChoices: (json['madeChoices'] as List<dynamic>)
      .map((e) => Choice.fromJson(e as Map<String, dynamic>))
      .toList(),
  unlockedScenes: (json['unlockedScenes'] as List<dynamic>)
      .map((e) => e as String)
      .toList(),
  gameProgress: (json['gameProgress'] as num).toDouble(),
  completedEpisodes: (json['completedEpisodes'] as List<dynamic>)
      .map((e) => e as String)
      .toList(),
  lastSavedAt: json['lastSavedAt'] as String?,
  saveSlots: (json['saveSlots'] as Map<String, dynamic>).map(
    (k, e) => MapEntry(k, GameSnapshot.fromJson(e as Map<String, dynamic>)),
  ),
);

Map<String, dynamic> _$GameStateToJson(GameState instance) => <String, dynamic>{
  'currentEpisode': instance.currentEpisode,
  'currentScene': instance.currentScene,
  'sceneHistory': instance.sceneHistory,
  'collectedEvidence': instance.collectedEvidence,
  'characterRelationships': instance.characterRelationships,
  'madeChoices': instance.madeChoices,
  'unlockedScenes': instance.unlockedScenes,
  'gameProgress': instance.gameProgress,
  'completedEpisodes': instance.completedEpisodes,
  'lastSavedAt': instance.lastSavedAt,
  'saveSlots': instance.saveSlots,
};
