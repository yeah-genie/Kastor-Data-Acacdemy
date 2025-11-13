import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/game_state.dart';
import '../models/evidence.dart';

class GameStateNotifier extends StateNotifier<GameState> {
  GameStateNotifier() : super(GameState.initial());

  Future<void> loadGameState() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedState = prefs.getString('gameState');
      if (savedState != null) {
        final json = jsonDecode(savedState);
        state = GameState.fromJson(json);
      }
    } catch (e) {
      print('Error loading game state: $e');
    }
  }

  Future<void> saveGameState() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final stateJson = jsonEncode(state.toJson());
      await prefs.setString('gameState', stateJson);

      state = state.copyWith(
        lastSavedAt: DateTime.now().toIso8601String(),
      );
    } catch (e) {
      print('Error saving game state: $e');
    }
  }

  void setCurrentEpisode(String episodeId) {
    state = state.copyWith(currentEpisode: episodeId);
    saveGameState();
  }

  void setCurrentScene(String sceneId) {
    final updatedHistory = [...state.sceneHistory, sceneId];
    state = state.copyWith(
      currentScene: sceneId,
      sceneHistory: updatedHistory,
    );
    saveGameState();
  }

  void collectEvidence(Evidence evidence) {
    final updatedEvidence = [...state.collectedEvidence, evidence];
    state = state.copyWith(collectedEvidence: updatedEvidence);
    saveGameState();
  }

  void updateCharacterRelationship(String characterId, int trustLevel) {
    final updatedRelationships = Map<String, int>.from(state.characterRelationships);
    updatedRelationships[characterId] = trustLevel;
    state = state.copyWith(characterRelationships: updatedRelationships);
    saveGameState();
  }

  void makeChoice(String choiceId, String sceneId) {
    final choice = Choice(
      choiceId: choiceId,
      sceneId: sceneId,
      timestamp: DateTime.now().toIso8601String(),
    );
    final updatedChoices = [...state.madeChoices, choice];
    state = state.copyWith(madeChoices: updatedChoices);
    saveGameState();
  }

  void unlockScene(String sceneId) {
    if (!state.unlockedScenes.contains(sceneId)) {
      final updatedScenes = [...state.unlockedScenes, sceneId];
      state = state.copyWith(unlockedScenes: updatedScenes);
      saveGameState();
    }
  }

  void completeEpisode(String episodeId) {
    if (!state.completedEpisodes.contains(episodeId)) {
      final updatedEpisodes = [...state.completedEpisodes, episodeId];
      state = state.copyWith(
        completedEpisodes: updatedEpisodes,
        gameProgress: updatedEpisodes.length / 4.0, // Assuming 4 episodes total
      );
      saveGameState();
    }
  }

  void resetGame() {
    state = GameState.initial();
    saveGameState();
  }

  void saveToSlot(String slotName) {
    final snapshot = GameSnapshot(
      episodeId: state.currentEpisode ?? '',
      currentSceneId: state.currentScene ?? '',
      completedScenes: state.sceneHistory,
      collectedEvidence: state.collectedEvidence,
      points: state.collectedEvidence.length * 10, // Simple points calculation
      savedAt: DateTime.now().toIso8601String(),
    );

    final updatedSlots = Map<String, GameSnapshot>.from(state.saveSlots);
    updatedSlots[slotName] = snapshot;
    state = state.copyWith(saveSlots: updatedSlots);
    saveGameState();
  }

  void loadFromSlot(String slotName) {
    final snapshot = state.saveSlots[slotName];
    if (snapshot != null) {
      state = state.copyWith(
        currentEpisode: snapshot.episodeId,
        currentScene: snapshot.currentSceneId,
        sceneHistory: snapshot.completedScenes,
        collectedEvidence: snapshot.collectedEvidence,
      );
      saveGameState();
    }
  }
}

// Provider for game state
final gameStateProvider = StateNotifierProvider<GameStateNotifier, GameState>(
  (ref) => GameStateNotifier(),
);
