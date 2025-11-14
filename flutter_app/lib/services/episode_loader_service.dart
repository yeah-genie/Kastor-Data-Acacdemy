import 'dart:convert';
import 'package:flutter/services.dart';

/// Service to load episode data from JSON files based on language
class EpisodeLoaderService {
  /// Load episode data for a specific episode and language
  Future<Map<String, dynamic>> loadEpisode(String episodeId, String language) async {
    try {
      // Determine file path based on episode and language
      final filePath = 'assets/episodes/${episodeId}_$language.json';

      // Load the JSON file
      final String jsonString = await rootBundle.loadString(filePath);

      // Parse JSON
      final Map<String, dynamic> episodeData = json.decode(jsonString);

      return episodeData;
    } catch (e) {
      print('Error loading episode $episodeId ($language): $e');

      // Fallback to English version if Korean fails
      if (language == 'ko') {
        print('Falling back to English version...');
        return loadEpisode(episodeId, 'en');
      }

      // Return empty episode if all fails
      return {
        'episodeId': episodeId,
        'title': 'Episode not found',
        'description': 'Could not load episode data',
        'language': language,
        'scenes': [],
      };
    }
  }

  /// Load episode scene by scene ID
  Map<String, dynamic>? getScene(Map<String, dynamic> episodeData, String sceneId) {
    try {
      final scenes = episodeData['scenes'] as List<dynamic>;
      return scenes.firstWhere(
        (scene) => scene['id'] == sceneId,
        orElse: () => null,
      );
    } catch (e) {
      print('Error getting scene $sceneId: $e');
      return null;
    }
  }

  /// Get all nodes from a scene
  List<Map<String, dynamic>> getSceneNodes(Map<String, dynamic> scene) {
    try {
      return (scene['nodes'] as List<dynamic>)
          .map((node) => node as Map<String, dynamic>)
          .toList();
    } catch (e) {
      print('Error getting scene nodes: $e');
      return [];
    }
  }
}
