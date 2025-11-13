import 'package:json_annotation/json_annotation.dart';

part 'evidence.g.dart';

enum EvidenceType {
  @JsonValue('document')
  document,
  @JsonValue('log')
  log,
  @JsonValue('email')
  email,
  @JsonValue('image')
  image,
  @JsonValue('video')
  video,
  @JsonValue('data')
  data,
}

enum ImportanceLevel {
  @JsonValue('low')
  low,
  @JsonValue('medium')
  medium,
  @JsonValue('high')
  high,
  @JsonValue('critical')
  critical,
}

@JsonSerializable()
class Evidence {
  final String id;
  final String title;
  final String type;
  final String description;
  final String? content;
  final String? imageUrl;
  final String? fileUrl;
  final String importance;
  final List<String>? relatedCharacters;
  final List<String>? relatedEvidence;
  final String? unlockCondition;
  final bool isUnlocked;
  final Map<String, dynamic>? metadata;

  Evidence({
    required this.id,
    required this.title,
    required this.type,
    required this.description,
    this.content,
    this.imageUrl,
    this.fileUrl,
    required this.importance,
    this.relatedCharacters,
    this.relatedEvidence,
    this.unlockCondition,
    required this.isUnlocked,
    this.metadata,
  });

  factory Evidence.fromJson(Map<String, dynamic> json) =>
      _$EvidenceFromJson(json);
  Map<String, dynamic> toJson() => _$EvidenceToJson(this);
}
