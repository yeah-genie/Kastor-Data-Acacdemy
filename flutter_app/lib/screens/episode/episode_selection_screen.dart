import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'episode_gameplay_screen.dart';

class EpisodeSelectionScreen extends ConsumerWidget {
  const EpisodeSelectionScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final episodes = _getEpisodes();

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF1E1B4B), // Dark indigo
              Color(0xFF312E81), // Indigo
              Color(0xFF4C1D95), // Purple
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(24),
                child: Row(
                  children: [
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.arrow_back, color: Colors.white),
                    ),
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Episodes',
                          style: Theme.of(context)
                              .textTheme
                              .headlineMedium
                              ?.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Select a case to investigate',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.7),
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // Episode Cards
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  itemCount: episodes.length,
                  itemBuilder: (context, index) {
                    return _EpisodeCard(
                      episode: episodes[index],
                      index: index,
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  List<_Episode> _getEpisodes() {
    return [
      _Episode(
        number: 1,
        title: 'The Missing Balance Patch',
        description:
            'Shadow\'s win rate jumped from 50% to 85% overnight! Help Maya Zhang investigate this mysterious balance shift.',
        difficulty: 'Beginner',
        duration: '30-40 min',
        isLocked: false,
        tags: ['Game Balance', 'Data Analysis'],
        characters: ['Maya Zhang', 'Ryan Nakamura', 'Marcus Chen'],
      ),
      _Episode(
        number: 2,
        title: 'The Ghost User\'s Ranking Manipulation',
        description:
            'A mysterious ghost user is climbing the leaderboards impossibly fast. Uncover the truth behind this ranking anomaly.',
        difficulty: 'Intermediate',
        duration: '45-60 min',
        isLocked: false,
        tags: ['Security', 'Ranking System'],
        characters: ['Elena Petrova', 'Marcus Chen', 'Maya Zhang'],
      ),
      _Episode(
        number: 3,
        title: 'The Perfect Victory',
        description:
            'Match-fixing at the highest level? Investigate suspicious patterns in professional tournament matches.',
        difficulty: 'Advanced',
        duration: '50-70 min',
        isLocked: false,
        tags: ['Match-Fixing', 'Forensics'],
        characters: ['Nina Volkov', 'Alex Turner', 'Marcus Chen'],
      ),
    ];
  }
}

class _EpisodeCard extends StatelessWidget {
  final _Episode episode;
  final int index;

  const _EpisodeCard({
    required this.episode,
    required this.index,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      child: Card(
        elevation: 8,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        color: Colors.transparent,
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: episode.isLocked
                  ? [
                      Colors.grey.shade800.withOpacity(0.5),
                      Colors.grey.shade900.withOpacity(0.5),
                    ]
                  : [
                      const Color(0xFF6366F1).withOpacity(0.2),
                      const Color(0xFF8B5CF6).withOpacity(0.2),
                    ],
            ),
            border: Border.all(
              color: episode.isLocked
                  ? Colors.grey.withOpacity(0.3)
                  : const Color(0xFF6366F1).withOpacity(0.5),
              width: 2,
            ),
          ),
          child: InkWell(
            onTap: episode.isLocked
                ? null
                : () {
                    _startEpisode(context, episode);
                  },
            borderRadius: BorderRadius.circular(20),
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header Row
                  Row(
                    children: [
                      // Episode Number
                      Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: episode.isLocked
                              ? LinearGradient(
                                  colors: [
                                    Colors.grey.shade700,
                                    Colors.grey.shade800,
                                  ],
                                )
                              : const LinearGradient(
                                  colors: [
                                    Color(0xFF6366F1),
                                    Color(0xFF8B5CF6),
                                  ],
                                ),
                          boxShadow: episode.isLocked
                              ? null
                              : [
                                  BoxShadow(
                                    color: const Color(0xFF6366F1)
                                        .withOpacity(0.5),
                                    blurRadius: 16,
                                    spreadRadius: 2,
                                  ),
                                ],
                        ),
                        child: Center(
                          child: episode.isLocked
                              ? const Icon(Icons.lock,
                                  color: Colors.white54, size: 28)
                              : Text(
                                  '${episode.number}',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 28,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      // Title & Meta
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Episode ${episode.number}',
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.7),
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                letterSpacing: 1,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              episode.title,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                height: 1.2,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Status Badge
                      if (!episode.isLocked)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: _getDifficultyColor(episode.difficulty)
                                .withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: _getDifficultyColor(episode.difficulty),
                              width: 1,
                            ),
                          ),
                          child: Text(
                            episode.difficulty,
                            style: TextStyle(
                              color: _getDifficultyColor(episode.difficulty),
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Description
                  Text(
                    episode.description,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
                      fontSize: 14,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Tags
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: episode.tags.map((tag) {
                      return Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          tag,
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.9),
                            fontSize: 12,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),

                  // Bottom Info
                  Row(
                    children: [
                      Icon(
                        Icons.access_time,
                        size: 16,
                        color: Colors.white.withOpacity(0.6),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        episode.duration,
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.6),
                          fontSize: 13,
                        ),
                      ),
                      const Spacer(),
                      if (!episode.isLocked)
                        Row(
                          children: [
                            Text(
                              'Start Case',
                              style: TextStyle(
                                color: const Color(0xFF6366F1),
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(width: 4),
                            const Icon(
                              Icons.arrow_forward,
                              color: Color(0xFF6366F1),
                              size: 18,
                            ),
                          ],
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Color _getDifficultyColor(String difficulty) {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return const Color(0xFF10B981); // Green
      case 'intermediate':
        return const Color(0xFFF59E0B); // Orange
      case 'advanced':
        return const Color(0xFFEF4444); // Red
      default:
        return Colors.grey;
    }
  }

  void _startEpisode(BuildContext context, _Episode episode) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => EpisodeGameplayScreen(
          episodeNumber: episode.number,
        ),
      ),
    );
  }
}

class _Episode {
  final int number;
  final String title;
  final String description;
  final String difficulty;
  final String duration;
  final bool isLocked;
  final List<String> tags;
  final List<String> characters;

  _Episode({
    required this.number,
    required this.title,
    required this.description,
    required this.difficulty,
    required this.duration,
    required this.isLocked,
    required this.tags,
    required this.characters,
  });
}
