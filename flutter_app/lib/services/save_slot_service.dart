import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/save_slot.dart';
import '../models/game_state.dart';

class SaveSlotService {
  static const int maxSlots = 3;
  static const String _keyPrefix = 'save_slot_';

  // 특정 슬롯 저장
  Future<void> saveToSlot(
    int slotNumber,
    GameState gameState,
    String playerName,
  ) async {
    if (slotNumber < 0 || slotNumber >= maxSlots) {
      throw ArgumentError('Invalid slot number: $slotNumber');
    }

    final prefs = await SharedPreferences.getInstance();
    final saveSlot = SaveSlot(
      slotNumber: slotNumber,
      playerName: playerName,
      gameState: gameState,
      lastSaved: DateTime.now(),
      isEmpty: false,
    );

    await prefs.setString(
      '$_keyPrefix$slotNumber',
      json.encode(saveSlot.toJson()),
    );
  }

  // 특정 슬롯 불러오기
  Future<SaveSlot> loadFromSlot(int slotNumber) async {
    if (slotNumber < 0 || slotNumber >= maxSlots) {
      throw ArgumentError('Invalid slot number: $slotNumber');
    }

    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString('$_keyPrefix$slotNumber');

    if (data == null) {
      return SaveSlot.empty(slotNumber);
    }

    try {
      return SaveSlot.fromJson(json.decode(data));
    } catch (e) {
      // 파싱 실패 시 빈 슬롯 반환
      return SaveSlot.empty(slotNumber);
    }
  }

  // 모든 슬롯 목록
  Future<List<SaveSlot>> getAllSlots() async {
    final List<SaveSlot> slots = [];

    for (int i = 0; i < maxSlots; i++) {
      slots.add(await loadFromSlot(i));
    }

    return slots;
  }

  // 슬롯 삭제
  Future<void> deleteSlot(int slotNumber) async {
    if (slotNumber < 0 || slotNumber >= maxSlots) {
      throw ArgumentError('Invalid slot number: $slotNumber');
    }

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('$_keyPrefix$slotNumber');
  }

  // 자동 저장 (슬롯 0에 저장)
  Future<void> autoSave(GameState gameState, String playerName) async {
    await saveToSlot(0, gameState, playerName);
  }

  // 자동 저장 불러오기
  Future<SaveSlot> loadAutoSave() async {
    return await loadFromSlot(0);
  }
}
