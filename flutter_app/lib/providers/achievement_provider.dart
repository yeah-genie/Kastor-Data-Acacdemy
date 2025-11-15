import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/achievement.dart';
import '../services/notification_service.dart';
import '../services/audio_service.dart';
import 'dart:convert';

/// 성취 시스템 Provider
class AchievementNotifier extends Notifier<List<Achievement>> {
  static const String _storageKey = 'achievements';

  @override
  List<Achievement> build() {
    _loadAchievements();
    return _getDefaultAchievements();
  }

  List<Achievement> _getDefaultAchievements() {
    return [
      Achievement(
        id: 'first_case',
        title: 'First Case Solved',
        titleKo: '첫 번째 사건 해결',
        description: 'Complete your first episode',
        descriptionKo: '첫 번째 에피소드를 완료하세요',
        icon: '🏆',
        points: 50,
        isUnlocked: false,
      ),
      Achievement(
        id: 'speed_runner',
        title: 'Speed Runner',
        titleKo: '속도의 달인',
        description: 'Complete an episode in under 30 minutes',
        descriptionKo: '30분 이내에 에피소드를 완료하세요',
        icon: '⚡',
        points: 100,
        isUnlocked: false,
      ),
      Achievement(
        id: 'perfect_score',
        title: 'Perfect Score',
        titleKo: '완벽한 점수',
        description: 'Get 100 points in an episode',
        descriptionKo: '에피소드에서 100점을 획득하세요',
        icon: '💯',
        points: 150,
        isUnlocked: false,
      ),
      Achievement(
        id: 'data_detective',
        title: 'Data Detective',
        titleKo: '데이터 탐정',
        description: 'Collect all evidence in an episode',
        descriptionKo: '에피소드의 모든 증거를 수집하세요',
        icon: '🔍',
        points: 75,
        isUnlocked: false,
      ),
      Achievement(
        id: 'minigame_master',
        title: 'Minigame Master',
        titleKo: '미니게임 마스터',
        description: 'Complete all 3 minigames perfectly',
        descriptionKo: '3개의 미니게임을 모두 완벽하게 클리어하세요',
        icon: '🎮',
        points: 200,
        isUnlocked: false,
      ),
      Achievement(
        id: 'emoji_master',
        title: 'Emoji Master',
        titleKo: '이모지 마스터',
        description: 'Use 50 emoji reactions',
        descriptionKo: '이모지 리액션을 50번 사용하세요',
        icon: '😂',
        points: 30,
        isUnlocked: false,
      ),
      Achievement(
        id: 'persistent',
        title: 'Persistent',
        titleKo: '끈기 있는',
        description: 'Save and continue 10 times',
        descriptionKo: '10번 저장하고 이어하기를 하세요',
        icon: '💪',
        points: 40,
        isUnlocked: false,
      ),
      Achievement(
        id: 'early_bird',
        title: 'Early Bird',
        titleKo: '얼리버드',
        description: 'Start playing before 8 AM',
        descriptionKo: '오전 8시 전에 플레이를 시작하세요',
        icon: '🌅',
        points: 20,
        isUnlocked: false,
      ),
      Achievement(
        id: 'night_owl',
        title: 'Night Owl',
        titleKo: '올빼미',
        description: 'Play after midnight',
        descriptionKo: '자정 이후에 플레이하세요',
        icon: '🦉',
        points: 20,
        isUnlocked: false,
      ),
      Achievement(
        id: 'collector',
        title: 'Collector',
        titleKo: '수집가',
        description: 'Unlock all achievements',
        descriptionKo: '모든 업적을 해금하세요',
        icon: '🌟',
        points: 500,
        isUnlocked: false,
      ),
    ];
  }

  Future<void> _loadAchievements() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedData = prefs.getString(_storageKey);
      
      if (savedData != null) {
        final List<dynamic> decoded = jsonDecode(savedData);
        final loadedAchievements = decoded
            .map((json) => Achievement.fromJson(json))
            .toList();
        
        state = loadedAchievements;
      }
    } catch (e) {
      print('Error loading achievements: $e');
    }
  }

  Future<void> _saveAchievements() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final encoded = jsonEncode(state.map((a) => a.toJson()).toList());
      await prefs.setString(_storageKey, encoded);
    } catch (e) {
      print('Error saving achievements: $e');
    }
  }

  /// 업적 해금
  Future<void> unlockAchievement(String achievementId, {String? language}) async {
    final index = state.indexWhere((a) => a.id == achievementId);
    if (index == -1) return;

    final achievement = state[index];
    if (achievement.isUnlocked) return; // 이미 해금됨

    // 업적 해금
    final updatedAchievements = List<Achievement>.from(state);
    updatedAchievements[index] = achievement.copyWith(
      isUnlocked: true,
      unlockedAt: DateTime.now(),
    );
    state = updatedAchievements;

    // 저장
    await _saveAchievements();

    // 알림 표시
    final title = language == 'ko' ? achievement.titleKo : achievement.title;
    final description = language == 'ko' ? achievement.descriptionKo : achievement.description;
    
    await NotificationService().showAchievementNotification(
      title: title,
      description: description,
    );

    // 사운드 효과
    await AudioService().playSFX(SoundEffect.achievementUnlocked);

    print('🎉 Achievement unlocked: $achievementId (+${achievement.points} points)');

    // 모든 업적 해금 체크
    _checkCollectorAchievement(language: language);
  }

  /// "수집가" 업적 자동 체크
  void _checkCollectorAchievement({String? language}) {
    final allUnlocked = state.where((a) => a.id != 'collector').every((a) => a.isUnlocked);
    if (allUnlocked) {
      unlockAchievement('collector', language: language);
    }
  }

  /// 조건부 업적 체크
  void checkAchievements({
    bool? episodeCompleted,
    int? episodeScore,
    int? episodeDuration, // 분 단위
    int? evidenceCount,
    int? totalEvidence,
    int? minigamesCompleted,
    int? emojiReactionsUsed,
    int? saveLoadCount,
    String? language,
  }) {
    // 첫 번째 사건 해결
    if (episodeCompleted == true) {
      unlockAchievement('first_case', language: language);
    }

    // 속도의 달인 (30분 이내)
    if (episodeDuration != null && episodeDuration <= 30 && episodeCompleted == true) {
      unlockAchievement('speed_runner', language: language);
    }

    // 완벽한 점수
    if (episodeScore != null && episodeScore >= 100) {
      unlockAchievement('perfect_score', language: language);
    }

    // 데이터 탐정 (모든 증거 수집)
    if (evidenceCount != null && totalEvidence != null && evidenceCount >= totalEvidence) {
      unlockAchievement('data_detective', language: language);
    }

    // 미니게임 마스터
    if (minigamesCompleted != null && minigamesCompleted >= 3) {
      unlockAchievement('minigame_master', language: language);
    }

    // 이모지 마스터
    if (emojiReactionsUsed != null && emojiReactionsUsed >= 50) {
      unlockAchievement('emoji_master', language: language);
    }

    // 끈기 있는
    if (saveLoadCount != null && saveLoadCount >= 10) {
      unlockAchievement('persistent', language: language);
    }

    // 시간대 업적
    final hour = DateTime.now().hour;
    if (hour < 8) {
      unlockAchievement('early_bird', language: language);
    } else if (hour >= 0 && hour < 6) {
      unlockAchievement('night_owl', language: language);
    }
  }

  /// 업적 초기화 (디버그용)
  Future<void> resetAchievements() async {
    state = _getDefaultAchievements();
    await _saveAchievements();
  }

  /// 총 획득 포인트
  int get totalPoints {
    return state.where((a) => a.isUnlocked).fold(0, (sum, a) => sum + a.points);
  }

  /// 해금된 업적 개수
  int get unlockedCount {
    return state.where((a) => a.isUnlocked).length;
  }

  /// 진행률 (0.0 ~ 1.0)
  double get progress {
    return state.isEmpty ? 0.0 : unlockedCount / state.length;
  }
}

final achievementProvider = NotifierProvider<AchievementNotifier, List<Achievement>>(
  () => AchievementNotifier(),
);
