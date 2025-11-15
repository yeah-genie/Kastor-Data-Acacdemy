import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

/// 게임 진행 상황 저장/불러오기 서비스
class SaveLoadService {
  static const String _keyCurrentEpisode = 'current_episode';
  static const String _keyCurrentScene = 'current_scene';
  static const String _keyCurrentNode = 'current_node';
  static const String _keyDetectiveName = 'detective_name';
  static const String _keyInvestigationPoints = 'investigation_points';
  static const String _keyChoicesMade = 'choices_made';
  static const String _keyMessages = 'messages';
  static const String _keyLastSaved = 'last_saved';
  static const String _keyTotalScore = 'total_score';
  static const String _keyEvidenceCollected = 'evidence_collected';

  /// 현재 진행 상황 저장
  static Future<void> saveProgress({
    required String episodeId,
    required String sceneId,
    required int nodeIndex,
    String? detectiveName,
    int investigationPoints = 0,
    List<String> choicesMade = const [],
    List<Map<String, dynamic>> messages = const [],
    int totalScore = 0,
    List<String> evidenceCollected = const [],
  }) async {
    final prefs = await SharedPreferences.getInstance();

    await Future.wait([
      prefs.setString(_keyCurrentEpisode, episodeId),
      prefs.setString(_keyCurrentScene, sceneId),
      prefs.setInt(_keyCurrentNode, nodeIndex),
      prefs.setString(_keyDetectiveName, detectiveName ?? ''),
      prefs.setInt(_keyInvestigationPoints, investigationPoints),
      prefs.setStringList(_keyChoicesMade, choicesMade),
      prefs.setString(_keyMessages, jsonEncode(messages)),
      prefs.setString(_keyLastSaved, DateTime.now().toIso8601String()),
      prefs.setInt(_keyTotalScore, totalScore),
      prefs.setStringList(_keyEvidenceCollected, evidenceCollected),
    ]);

    print('✅ Progress saved: $episodeId - Scene $sceneId - Node $nodeIndex');
  }

  /// 저장된 진행 상황 불러오기
  static Future<SavedProgress?> loadProgress() async {
    final prefs = await SharedPreferences.getInstance();

    final episodeId = prefs.getString(_keyCurrentEpisode);
    if (episodeId == null || episodeId.isEmpty) {
      print('❌ No saved progress found');
      return null;
    }

    final messagesJson = prefs.getString(_keyMessages);
    List<Map<String, dynamic>> messages = [];
    if (messagesJson != null && messagesJson.isNotEmpty) {
      try {
        final decoded = jsonDecode(messagesJson) as List;
        messages = decoded.map((e) => e as Map<String, dynamic>).toList();
      } catch (e) {
        print('⚠️ Error decoding messages: $e');
      }
    }

    final progress = SavedProgress(
      episodeId: episodeId,
      sceneId: prefs.getString(_keyCurrentScene) ?? 'intro',
      nodeIndex: prefs.getInt(_keyCurrentNode) ?? 0,
      detectiveName: prefs.getString(_keyDetectiveName),
      investigationPoints: prefs.getInt(_keyInvestigationPoints) ?? 0,
      choicesMade: prefs.getStringList(_keyChoicesMade) ?? [],
      messages: messages,
      lastSaved: prefs.getString(_keyLastSaved),
      totalScore: prefs.getInt(_keyTotalScore) ?? 0,
      evidenceCollected: prefs.getStringList(_keyEvidenceCollected) ?? [],
    );

    print('✅ Progress loaded: ${progress.episodeId} - Scene ${progress.sceneId} - Node ${progress.nodeIndex}');
    return progress;
  }

  /// 저장된 진행 상황 삭제
  static Future<void> clearProgress() async {
    final prefs = await SharedPreferences.getInstance();

    await Future.wait([
      prefs.remove(_keyCurrentEpisode),
      prefs.remove(_keyCurrentScene),
      prefs.remove(_keyCurrentNode),
      prefs.remove(_keyDetectiveName),
      prefs.remove(_keyInvestigationPoints),
      prefs.remove(_keyChoicesMade),
      prefs.remove(_keyMessages),
      prefs.remove(_keyLastSaved),
      prefs.remove(_keyTotalScore),
      prefs.remove(_keyEvidenceCollected),
    ]);

    print('✅ Progress cleared');
  }

  /// 저장된 진행 상황이 있는지 확인
  static Future<bool> hasSavedProgress() async {
    final prefs = await SharedPreferences.getInstance();
    final episodeId = prefs.getString(_keyCurrentEpisode);
    return episodeId != null && episodeId.isNotEmpty;
  }

  /// 마지막 저장 시간 가져오기
  static Future<DateTime?> getLastSavedTime() async {
    final prefs = await SharedPreferences.getInstance();
    final lastSaved = prefs.getString(_keyLastSaved);
    if (lastSaved == null) return null;
    
    try {
      return DateTime.parse(lastSaved);
    } catch (e) {
      return null;
    }
  }

  /// 증거 수집 저장
  static Future<void> saveEvidence(String evidenceId) async {
    final prefs = await SharedPreferences.getInstance();
    final current = prefs.getStringList(_keyEvidenceCollected) ?? [];
    if (!current.contains(evidenceId)) {
      current.add(evidenceId);
      await prefs.setStringList(_keyEvidenceCollected, current);
      print('✅ Evidence saved: $evidenceId');
    }
  }

  /// 수집한 증거 목록 가져오기
  static Future<List<String>> getCollectedEvidence() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_keyEvidenceCollected) ?? [];
  }
}

/// 저장된 진행 상황 데이터 클래스
class SavedProgress {
  final String episodeId;
  final String sceneId;
  final int nodeIndex;
  final String? detectiveName;
  final int investigationPoints;
  final List<String> choicesMade;
  final List<Map<String, dynamic>> messages;
  final String? lastSaved;
  final int totalScore;
  final List<String> evidenceCollected;

  SavedProgress({
    required this.episodeId,
    required this.sceneId,
    required this.nodeIndex,
    this.detectiveName,
    this.investigationPoints = 0,
    this.choicesMade = const [],
    this.messages = const [],
    this.lastSaved,
    this.totalScore = 0,
    this.evidenceCollected = const [],
  });

  Map<String, dynamic> toJson() => {
        'episodeId': episodeId,
        'sceneId': sceneId,
        'nodeIndex': nodeIndex,
        'detectiveName': detectiveName,
        'investigationPoints': investigationPoints,
        'choicesMade': choicesMade,
        'messages': messages,
        'lastSaved': lastSaved,
        'totalScore': totalScore,
        'evidenceCollected': evidenceCollected,
      };

  @override
  String toString() {
    return 'SavedProgress(episode: $episodeId, scene: $sceneId, node: $nodeIndex, points: $investigationPoints)';
  }
}
