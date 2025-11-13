import 'package:json_annotation/json_annotation.dart';

part 'message.g.dart';

enum Speaker {
  detective,
  kastor,
  maya,
  kaito,
  lukas,
  diego,
  system,
  narrator,
  chris,
  ryan,
  client,
  marcus,
  elena,
  nina,
  camille,
  jake,
  alex,
  harrison,
  luna,
  fixer
}

@JsonSerializable()
class Celebration {
  final String type; // "mini" | "major"
  final String title;
  final int? points;
  final int? caseNumber;
  final String? caseTitle;

  Celebration({
    required this.type,
    required this.title,
    this.points,
    this.caseNumber,
    this.caseTitle,
  });

  factory Celebration.fromJson(Map<String, dynamic> json) =>
      _$CelebrationFromJson(json);
  Map<String, dynamic> toJson() => _$CelebrationToJson(this);
}

@JsonSerializable()
class Email {
  final String from;
  final String subject;
  final String body;

  Email({
    required this.from,
    required this.subject,
    required this.body,
  });

  factory Email.fromJson(Map<String, dynamic> json) => _$EmailFromJson(json);
  Map<String, dynamic> toJson() => _$EmailToJson(this);
}

@JsonSerializable()
class Voicemail {
  final String from;
  final String timestamp;
  final String text;
  final bool? autoPlay;

  Voicemail({
    required this.from,
    required this.timestamp,
    required this.text,
    this.autoPlay,
  });

  factory Voicemail.fromJson(Map<String, dynamic> json) =>
      _$VoicemailFromJson(json);
  Map<String, dynamic> toJson() => _$VoicemailToJson(this);
}

@JsonSerializable()
class Message {
  final String id;
  final String speaker;
  final String text;
  final String? avatar;
  final String? characterName;
  final Celebration? celebration;
  final String? timestamp;
  final Email? email;
  final Voicemail? voicemail;
  final String? image;
  final String? photo;
  final String? soundEffect;
  final String? reaction;

  Message({
    required this.id,
    required this.speaker,
    required this.text,
    this.avatar,
    this.characterName,
    this.celebration,
    this.timestamp,
    this.email,
    this.voicemail,
    this.image,
    this.photo,
    this.soundEffect,
    this.reaction,
  });

  factory Message.fromJson(Map<String, dynamic> json) =>
      _$MessageFromJson(json);
  Map<String, dynamic> toJson() => _$MessageToJson(this);
}
