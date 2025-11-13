import 'package:json_annotation/json_annotation.dart';
import 'story_node.dart';
import 'character.dart';
import 'evidence.dart';

part 'episode.g.dart';

@JsonSerializable()
class Episode {
  final String id;
  final int number;
  final String title;
  final String description;
  final int difficulty; // 1-5
  final String estimatedTime;
  final List<StoryNode> scenes;
  final List<Character> characters;
  final List<Evidence> evidence;
  final List<String> learningObjectives;
  final String? thumbnail;
  final bool isLocked;

  Episode({
    required this.id,
    required this.number,
    required this.title,
    required this.description,
    required this.difficulty,
    required this.estimatedTime,
    required this.scenes,
    required this.characters,
    required this.evidence,
    required this.learningObjectives,
    this.thumbnail,
    required this.isLocked,
  });

  factory Episode.fromJson(Map<String, dynamic> json) =>
      _$EpisodeFromJson(json);
  Map<String, dynamic> toJson() => _$EpisodeToJson(this);
}
