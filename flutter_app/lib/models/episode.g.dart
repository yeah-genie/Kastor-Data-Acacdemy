// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'episode.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Episode _$EpisodeFromJson(Map<String, dynamic> json) => Episode(
  id: json['id'] as String,
  number: (json['number'] as num).toInt(),
  title: json['title'] as String,
  description: json['description'] as String,
  difficulty: (json['difficulty'] as num).toInt(),
  estimatedTime: json['estimatedTime'] as String,
  scenes: (json['scenes'] as List<dynamic>)
      .map((e) => StoryNode.fromJson(e as Map<String, dynamic>))
      .toList(),
  characters: (json['characters'] as List<dynamic>)
      .map((e) => Character.fromJson(e as Map<String, dynamic>))
      .toList(),
  evidence: (json['evidence'] as List<dynamic>)
      .map((e) => Evidence.fromJson(e as Map<String, dynamic>))
      .toList(),
  learningObjectives: (json['learningObjectives'] as List<dynamic>)
      .map((e) => e as String)
      .toList(),
  thumbnail: json['thumbnail'] as String?,
  isLocked: json['isLocked'] as bool,
);

Map<String, dynamic> _$EpisodeToJson(Episode instance) => <String, dynamic>{
  'id': instance.id,
  'number': instance.number,
  'title': instance.title,
  'description': instance.description,
  'difficulty': instance.difficulty,
  'estimatedTime': instance.estimatedTime,
  'scenes': instance.scenes,
  'characters': instance.characters,
  'evidence': instance.evidence,
  'learningObjectives': instance.learningObjectives,
  'thumbnail': instance.thumbnail,
  'isLocked': instance.isLocked,
};
