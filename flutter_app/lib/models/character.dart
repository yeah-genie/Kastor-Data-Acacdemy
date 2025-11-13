import 'package:json_annotation/json_annotation.dart';

part 'character.g.dart';

enum CharacterStatus {
  @JsonValue('active')
  active,
  @JsonValue('suspect')
  suspect,
  @JsonValue('cleared')
  cleared,
  @JsonValue('arrested')
  arrested,
}

@JsonSerializable()
class Character {
  final String id;
  final String name;
  final String role;
  final String avatar;
  final String status;
  final int trustLevel; // 1-5 scale
  final List<String> background;
  final List<String> suspiciousActivity;
  final List<String> relatedEvidence;

  Character({
    required this.id,
    required this.name,
    required this.role,
    required this.avatar,
    required this.status,
    required this.trustLevel,
    required this.background,
    required this.suspiciousActivity,
    required this.relatedEvidence,
  });

  factory Character.fromJson(Map<String, dynamic> json) =>
      _$CharacterFromJson(json);
  Map<String, dynamic> toJson() => _$CharacterToJson(this);
}
