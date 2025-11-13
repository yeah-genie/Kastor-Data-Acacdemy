// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'story_node.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Hint _$HintFromJson(Map<String, dynamic> json) => Hint(
  level: (json['level'] as num).toInt(),
  title: json['title'] as String,
  content: json['content'] as String,
  cost: (json['cost'] as num?)?.toInt(),
);

Map<String, dynamic> _$HintToJson(Hint instance) => <String, dynamic>{
  'level': instance.level,
  'title': instance.title,
  'content': instance.content,
  'cost': instance.cost,
};

QuestionChoice _$QuestionChoiceFromJson(Map<String, dynamic> json) =>
    QuestionChoice(
      id: json['id'] as String,
      text: json['text'] as String,
      isCorrect: json['isCorrect'] as bool,
      nextNode: json['nextNode'] as String,
      feedback: json['feedback'] as String,
      pointsAwarded: (json['pointsAwarded'] as num?)?.toInt(),
    );

Map<String, dynamic> _$QuestionChoiceToJson(QuestionChoice instance) =>
    <String, dynamic>{
      'id': instance.id,
      'text': instance.text,
      'isCorrect': instance.isCorrect,
      'nextNode': instance.nextNode,
      'feedback': instance.feedback,
      'pointsAwarded': instance.pointsAwarded,
    };

Question _$QuestionFromJson(Map<String, dynamic> json) => Question(
  id: json['id'] as String,
  text: json['text'] as String,
  choices: (json['choices'] as List<dynamic>)
      .map((e) => QuestionChoice.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$QuestionToJson(Question instance) => <String, dynamic>{
  'id': instance.id,
  'text': instance.text,
  'choices': instance.choices,
};

AutoAdvance _$AutoAdvanceFromJson(Map<String, dynamic> json) => AutoAdvance(
  nextNode: json['nextNode'] as String,
  delay: (json['delay'] as num).toInt(),
);

Map<String, dynamic> _$AutoAdvanceToJson(AutoAdvance instance) =>
    <String, dynamic>{'nextNode': instance.nextNode, 'delay': instance.delay};

StoryNode _$StoryNodeFromJson(Map<String, dynamic> json) => StoryNode(
  id: json['id'] as String,
  phase: json['phase'] as String,
  messages: (json['messages'] as List<dynamic>)
      .map((e) => Message.fromJson(e as Map<String, dynamic>))
      .toList(),
  interactiveSequence: json['interactiveSequence'] == null
      ? null
      : InteractiveSequence.fromJson(
          json['interactiveSequence'] as Map<String, dynamic>,
        ),
  hints: (json['hints'] as List<dynamic>?)
      ?.map((e) => Hint.fromJson(e as Map<String, dynamic>))
      .toList(),
  question: json['question'] == null
      ? null
      : Question.fromJson(json['question'] as Map<String, dynamic>),
  autoAdvance: json['autoAdvance'] == null
      ? null
      : AutoAdvance.fromJson(json['autoAdvance'] as Map<String, dynamic>),
);

Map<String, dynamic> _$StoryNodeToJson(StoryNode instance) => <String, dynamic>{
  'id': instance.id,
  'phase': instance.phase,
  'messages': instance.messages,
  'interactiveSequence': instance.interactiveSequence,
  'hints': instance.hints,
  'question': instance.question,
  'autoAdvance': instance.autoAdvance,
};
