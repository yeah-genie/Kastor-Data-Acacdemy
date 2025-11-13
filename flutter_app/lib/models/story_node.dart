import 'package:json_annotation/json_annotation.dart';
import 'message.dart';
import 'interactive_sequence.dart';

part 'story_node.g.dart';

enum Phase {
  @JsonValue('stage1')
  stage1,
  @JsonValue('stage2')
  stage2,
  @JsonValue('stage3')
  stage3,
  @JsonValue('stage4')
  stage4,
  @JsonValue('stage5')
  stage5,
}

@JsonSerializable()
class Hint {
  final int level; // 1, 2, or 3
  final String title;
  final String content;
  final int? cost;

  Hint({
    required this.level,
    required this.title,
    required this.content,
    this.cost,
  });

  factory Hint.fromJson(Map<String, dynamic> json) => _$HintFromJson(json);
  Map<String, dynamic> toJson() => _$HintToJson(this);
}

@JsonSerializable()
class QuestionChoice {
  final String id;
  final String text;
  final bool isCorrect;
  final String nextNode;
  final String feedback;
  final int? pointsAwarded;

  QuestionChoice({
    required this.id,
    required this.text,
    required this.isCorrect,
    required this.nextNode,
    required this.feedback,
    this.pointsAwarded,
  });

  factory QuestionChoice.fromJson(Map<String, dynamic> json) =>
      _$QuestionChoiceFromJson(json);
  Map<String, dynamic> toJson() => _$QuestionChoiceToJson(this);
}

@JsonSerializable()
class Question {
  final String id;
  final String text;
  final List<QuestionChoice> choices;

  Question({
    required this.id,
    required this.text,
    required this.choices,
  });

  factory Question.fromJson(Map<String, dynamic> json) =>
      _$QuestionFromJson(json);
  Map<String, dynamic> toJson() => _$QuestionToJson(this);
}

@JsonSerializable()
class AutoAdvance {
  final String nextNode;
  final int delay;

  AutoAdvance({
    required this.nextNode,
    required this.delay,
  });

  factory AutoAdvance.fromJson(Map<String, dynamic> json) =>
      _$AutoAdvanceFromJson(json);
  Map<String, dynamic> toJson() => _$AutoAdvanceToJson(this);
}

@JsonSerializable()
class StoryNode {
  final String id;
  final String phase;
  final List<Message> messages;
  final InteractiveSequence? interactiveSequence;
  final List<Hint>? hints;
  final Question? question;
  final AutoAdvance? autoAdvance;

  StoryNode({
    required this.id,
    required this.phase,
    required this.messages,
    this.interactiveSequence,
    this.hints,
    this.question,
    this.autoAdvance,
  });

  factory StoryNode.fromJson(Map<String, dynamic> json) =>
      _$StoryNodeFromJson(json);
  Map<String, dynamic> toJson() => _$StoryNodeToJson(this);
}
