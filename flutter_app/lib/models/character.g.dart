// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'character.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Character _$CharacterFromJson(Map<String, dynamic> json) => Character(
  id: json['id'] as String,
  name: json['name'] as String,
  role: json['role'] as String,
  avatar: json['avatar'] as String,
  status: json['status'] as String,
  trustLevel: (json['trustLevel'] as num).toInt(),
  background: (json['background'] as List<dynamic>)
      .map((e) => e as String)
      .toList(),
  suspiciousActivity: (json['suspiciousActivity'] as List<dynamic>)
      .map((e) => e as String)
      .toList(),
  relatedEvidence: (json['relatedEvidence'] as List<dynamic>)
      .map((e) => e as String)
      .toList(),
);

Map<String, dynamic> _$CharacterToJson(Character instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'role': instance.role,
  'avatar': instance.avatar,
  'status': instance.status,
  'trustLevel': instance.trustLevel,
  'background': instance.background,
  'suspiciousActivity': instance.suspiciousActivity,
  'relatedEvidence': instance.relatedEvidence,
};
