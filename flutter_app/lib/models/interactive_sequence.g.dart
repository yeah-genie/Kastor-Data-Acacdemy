// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'interactive_sequence.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InteractiveSequence _$InteractiveSequenceFromJson(Map<String, dynamic> json) =>
    InteractiveSequence(
      type: json['type'] as String,
      id: json['id'] as String,
      data: json['data'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$InteractiveSequenceToJson(
  InteractiveSequence instance,
) => <String, dynamic>{
  'type': instance.type,
  'id': instance.id,
  'data': instance.data,
};
