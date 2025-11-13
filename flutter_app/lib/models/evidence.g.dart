// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'evidence.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Evidence _$EvidenceFromJson(Map<String, dynamic> json) => Evidence(
  id: json['id'] as String,
  title: json['title'] as String,
  type: json['type'] as String,
  description: json['description'] as String,
  content: json['content'] as String?,
  imageUrl: json['imageUrl'] as String?,
  fileUrl: json['fileUrl'] as String?,
  importance: json['importance'] as String,
  relatedCharacters: (json['relatedCharacters'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  relatedEvidence: (json['relatedEvidence'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  unlockCondition: json['unlockCondition'] as String?,
  isUnlocked: json['isUnlocked'] as bool,
  metadata: json['metadata'] as Map<String, dynamic>?,
);

Map<String, dynamic> _$EvidenceToJson(Evidence instance) => <String, dynamic>{
  'id': instance.id,
  'title': instance.title,
  'type': instance.type,
  'description': instance.description,
  'content': instance.content,
  'imageUrl': instance.imageUrl,
  'fileUrl': instance.fileUrl,
  'importance': instance.importance,
  'relatedCharacters': instance.relatedCharacters,
  'relatedEvidence': instance.relatedEvidence,
  'unlockCondition': instance.unlockCondition,
  'isUnlocked': instance.isUnlocked,
  'metadata': instance.metadata,
};
