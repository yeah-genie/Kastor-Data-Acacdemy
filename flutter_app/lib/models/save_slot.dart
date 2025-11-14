import 'package:json_annotation/json_annotation.dart';
import 'game_state.dart';

part 'save_slot.g.dart';

@JsonSerializable()
class SaveSlot {
  final int slotNumber;
  final String? playerName;
  final GameState? gameState;
  final DateTime? lastSaved;
  final bool isEmpty;

  SaveSlot({
    required this.slotNumber,
    this.playerName,
    this.gameState,
    this.lastSaved,
    this.isEmpty = true,
  });

  SaveSlot copyWith({
    int? slotNumber,
    String? playerName,
    GameState? gameState,
    DateTime? lastSaved,
    bool? isEmpty,
  }) {
    return SaveSlot(
      slotNumber: slotNumber ?? this.slotNumber,
      playerName: playerName ?? this.playerName,
      gameState: gameState ?? this.gameState,
      lastSaved: lastSaved ?? this.lastSaved,
      isEmpty: isEmpty ?? this.isEmpty,
    );
  }

  factory SaveSlot.fromJson(Map<String, dynamic> json) =>
      _$SaveSlotFromJson(json);
  Map<String, dynamic> toJson() => _$SaveSlotToJson(this);

  static SaveSlot empty(int slotNumber) {
    return SaveSlot(
      slotNumber: slotNumber,
      isEmpty: true,
    );
  }
}
