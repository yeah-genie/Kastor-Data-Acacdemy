import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import '../models/game_state.dart';
import '../models/statistics.dart';

class FirebaseService {
  static final FirebaseService _instance = FirebaseService._internal();
  factory FirebaseService() => _instance;
  FirebaseService._internal();

  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  String? _userId;

  void setUserId(String userId) {
    _userId = userId;
  }

  // 게임 상태 저장
  Future<void> saveGameState(GameState gameState, int slotNumber) async {
    if (_userId == null) {
      debugPrint('User ID가 설정되지 않았습니다');
      return;
    }

    try {
      await _firestore
          .collection('users')
          .doc(_userId)
          .collection('saves')
          .doc('slot_$slotNumber')
          .set({
        'gameState': gameState.toJson(),
        'lastSaved': FieldValue.serverTimestamp(),
        'slotNumber': slotNumber,
      });
    } catch (e) {
      debugPrint('게임 상태 저장 실패: $e');
      rethrow;
    }
  }

  // 게임 상태 불러오기
  Future<GameState?> loadGameState(int slotNumber) async {
    if (_userId == null) {
      debugPrint('User ID가 설정되지 않았습니다');
      return null;
    }

    try {
      final doc = await _firestore
          .collection('users')
          .doc(_userId)
          .collection('saves')
          .doc('slot_$slotNumber')
          .get();

      if (!doc.exists) {
        return null;
      }

      final data = doc.data();
      if (data == null || !data.containsKey('gameState')) {
        return null;
      }

      return GameState.fromJson(data['gameState'] as Map<String, dynamic>);
    } catch (e) {
      debugPrint('게임 상태 불러오기 실패: $e');
      return null;
    }
  }

  // 모든 저장 슬롯 목록
  Future<Map<int, DateTime?>> getAllSaveSlots() async {
    if (_userId == null) {
      return {};
    }

    try {
      final querySnapshot = await _firestore
          .collection('users')
          .doc(_userId)
          .collection('saves')
          .get();

      final Map<int, DateTime?> slots = {};
      for (final doc in querySnapshot.docs) {
        final data = doc.data();
        final slotNumber = data['slotNumber'] as int;
        final timestamp = data['lastSaved'] as Timestamp?;
        slots[slotNumber] = timestamp?.toDate();
      }

      return slots;
    } catch (e) {
      debugPrint('저장 슬롯 목록 가져오기 실패: $e');
      return {};
    }
  }

  // 저장 슬롯 삭제
  Future<void> deleteSaveSlot(int slotNumber) async {
    if (_userId == null) {
      return;
    }

    try {
      await _firestore
          .collection('users')
          .doc(_userId)
          .collection('saves')
          .doc('slot_$slotNumber')
          .delete();
    } catch (e) {
      debugPrint('저장 슬롯 삭제 실패: $e');
      rethrow;
    }
  }

  // 통계 저장
  Future<void> saveStatistics(Statistics statistics) async {
    if (_userId == null) {
      return;
    }

    try {
      await _firestore
          .collection('users')
          .doc(_userId)
          .collection('data')
          .doc('statistics')
          .set(statistics.toJson());
    } catch (e) {
      debugPrint('통계 저장 실패: $e');
      rethrow;
    }
  }

  // 통계 불러오기
  Future<Statistics?> loadStatistics() async {
    if (_userId == null) {
      return null;
    }

    try {
      final doc = await _firestore
          .collection('users')
          .doc(_userId)
          .collection('data')
          .doc('statistics')
          .get();

      if (!doc.exists) {
        return null;
      }

      final data = doc.data();
      if (data == null) {
        return null;
      }

      return Statistics.fromJson(data);
    } catch (e) {
      debugPrint('통계 불러오기 실패: $e');
      return null;
    }
  }
}
