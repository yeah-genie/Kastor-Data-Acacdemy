import 'package:json_annotation/json_annotation.dart';

part 'quiz.g.dart';

@JsonSerializable()
class Quiz {
  final String id;
  final String episodeId;
  final String question;
  final List<String> options;
  final int correctAnswerIndex;
  final String explanation;
  final int rewardPoints;
  final QuizType type;

  Quiz({
    required this.id,
    required this.episodeId,
    required this.question,
    required this.options,
    required this.correctAnswerIndex,
    required this.explanation,
    this.rewardPoints = 10,
    this.type = QuizType.multipleChoice,
  });

  factory Quiz.fromJson(Map<String, dynamic> json) => _$QuizFromJson(json);
  Map<String, dynamic> toJson() => _$QuizToJson(this);
}

enum QuizType {
  multipleChoice,
  trueFalse,
  dataAnalysis,
}

@JsonSerializable()
class QuizResult {
  final String quizId;
  final int selectedAnswerIndex;
  final bool isCorrect;
  final int pointsEarned;
  final DateTime completedAt;

  QuizResult({
    required this.quizId,
    required this.selectedAnswerIndex,
    required this.isCorrect,
    required this.pointsEarned,
    required this.completedAt,
  });

  factory QuizResult.fromJson(Map<String, dynamic> json) =>
      _$QuizResultFromJson(json);
  Map<String, dynamic> toJson() => _$QuizResultToJson(this);
}
