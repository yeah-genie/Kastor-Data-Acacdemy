import 'package:json_annotation/json_annotation.dart';

part 'story_content.g.dart';

@JsonSerializable()
class StoryScene {
  final String id;
  final String title;
  final List<StoryNode> nodes;

  StoryScene({
    required this.id,
    required this.title,
    required this.nodes,
  });

  factory StoryScene.fromJson(Map<String, dynamic> json) =>
      _$StorySceneFromJson(json);
  Map<String, dynamic> toJson() => _$StorySceneToJson(this);
}

@JsonSerializable()
class StoryNode {
  final String id;
  final StoryNodeType type;
  final String? speaker;
  final String? text;
  final List<Choice>? choices;
  final String? nextNodeId;
  final Map<String, dynamic>? data; // 추가 데이터 (그래프, 로그 등)

  StoryNode({
    required this.id,
    required this.type,
    this.speaker,
    this.text,
    this.choices,
    this.nextNodeId,
    this.data,
  });

  factory StoryNode.fromJson(Map<String, dynamic> json) =>
      _$StoryNodeFromJson(json);
  Map<String, dynamic> toJson() => _$StoryNodeToJson(this);
}

enum StoryNodeType {
  dialogue,      // 일반 대화
  choice,        // 선택지
  input,         // 사용자 입력
  narration,     // 내레이션
  celebration,   // 축하/포인트 획득
  dataView,      // 데이터 보기 (그래프, 로그 등)
  phoneCall,     // 전화 통화
  email,         // 이메일 보기
}

@JsonSerializable()
class Choice {
  final String id;
  final String text;
  final String nextNodeId;
  final int? pointsReward;
  final bool? isCorrect;

  Choice({
    required this.id,
    required this.text,
    required this.nextNodeId,
    this.pointsReward,
    this.isCorrect,
  });

  factory Choice.fromJson(Map<String, dynamic> json) =>
      _$ChoiceFromJson(json);
  Map<String, dynamic> toJson() => _$ChoiceToJson(this);
}

@JsonSerializable()
class EpisodeStory {
  final String episodeId;
  final String title;
  final String description;
  final List<StoryScene> scenes;

  EpisodeStory({
    required this.episodeId,
    required this.title,
    required this.description,
    required this.scenes,
  });

  factory EpisodeStory.fromJson(Map<String, dynamic> json) =>
      _$EpisodeStoryFromJson(json);
  Map<String, dynamic> toJson() => _$EpisodeStoryToJson(this);
}
