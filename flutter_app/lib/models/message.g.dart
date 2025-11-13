// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'message.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Celebration _$CelebrationFromJson(Map<String, dynamic> json) => Celebration(
  type: json['type'] as String,
  title: json['title'] as String,
  points: (json['points'] as num?)?.toInt(),
  caseNumber: (json['caseNumber'] as num?)?.toInt(),
  caseTitle: json['caseTitle'] as String?,
);

Map<String, dynamic> _$CelebrationToJson(Celebration instance) =>
    <String, dynamic>{
      'type': instance.type,
      'title': instance.title,
      'points': instance.points,
      'caseNumber': instance.caseNumber,
      'caseTitle': instance.caseTitle,
    };

Email _$EmailFromJson(Map<String, dynamic> json) => Email(
  from: json['from'] as String,
  subject: json['subject'] as String,
  body: json['body'] as String,
);

Map<String, dynamic> _$EmailToJson(Email instance) => <String, dynamic>{
  'from': instance.from,
  'subject': instance.subject,
  'body': instance.body,
};

Voicemail _$VoicemailFromJson(Map<String, dynamic> json) => Voicemail(
  from: json['from'] as String,
  timestamp: json['timestamp'] as String,
  text: json['text'] as String,
  autoPlay: json['autoPlay'] as bool?,
);

Map<String, dynamic> _$VoicemailToJson(Voicemail instance) => <String, dynamic>{
  'from': instance.from,
  'timestamp': instance.timestamp,
  'text': instance.text,
  'autoPlay': instance.autoPlay,
};

Message _$MessageFromJson(Map<String, dynamic> json) => Message(
  id: json['id'] as String,
  speaker: json['speaker'] as String,
  text: json['text'] as String,
  avatar: json['avatar'] as String?,
  characterName: json['characterName'] as String?,
  celebration: json['celebration'] == null
      ? null
      : Celebration.fromJson(json['celebration'] as Map<String, dynamic>),
  timestamp: json['timestamp'] as String?,
  email: json['email'] == null
      ? null
      : Email.fromJson(json['email'] as Map<String, dynamic>),
  voicemail: json['voicemail'] == null
      ? null
      : Voicemail.fromJson(json['voicemail'] as Map<String, dynamic>),
  image: json['image'] as String?,
  photo: json['photo'] as String?,
  soundEffect: json['soundEffect'] as String?,
  reaction: json['reaction'] as String?,
);

Map<String, dynamic> _$MessageToJson(Message instance) => <String, dynamic>{
  'id': instance.id,
  'speaker': instance.speaker,
  'text': instance.text,
  'avatar': instance.avatar,
  'characterName': instance.characterName,
  'celebration': instance.celebration,
  'timestamp': instance.timestamp,
  'email': instance.email,
  'voicemail': instance.voicemail,
  'image': instance.image,
  'photo': instance.photo,
  'soundEffect': instance.soundEffect,
  'reaction': instance.reaction,
};
