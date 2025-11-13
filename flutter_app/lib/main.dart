import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'providers/game_state_provider.dart';
import 'screens/dashboard/dashboard_screen.dart';
import 'screens/episode/episode_selection_screen.dart';

void main() {
  runApp(
    const ProviderScope(
      child: KastorDataAcademyApp(),
    ),
  );
}

class KastorDataAcademyApp extends ConsumerWidget {
  const KastorDataAcademyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      title: 'Kastor Data Academy',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6366F1), // Indigo
          brightness: Brightness.dark,
        ),
        textTheme: GoogleFonts.interTextTheme(
          ThemeData.dark().textTheme,
        ),
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  @override
  void initState() {
    super.initState();
    // Load saved game state on app start
    Future.microtask(() {
      ref.read(gameStateProvider.notifier).loadGameState();
    });
  }

  @override
  Widget build(BuildContext context) {
    final gameState = ref.watch(gameStateProvider);

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
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo/Title
                Text(
                  'KASTOR',
                  style: Theme.of(context).textTheme.displayLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                        letterSpacing: 8,
                        color: Colors.white,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Data Academy',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        letterSpacing: 4,
                        color: Colors.white70,
                      ),
                ),
                const SizedBox(height: 60),

                // Menu Options
                _MenuButton(
                  text: 'New Game',
                  icon: Icons.play_arrow,
                  onPressed: () {
                    ref.read(gameStateProvider.notifier).resetGame();
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => const DashboardScreen(),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 16),
                _MenuButton(
                  text: 'Continue',
                  icon: Icons.trending_up,
                  onPressed: gameState.currentEpisode != null
                      ? () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => const DashboardScreen(),
                            ),
                          );
                        }
                      : null,
                ),
                const SizedBox(height: 16),
                _MenuButton(
                  text: 'Episodes',
                  icon: Icons.list,
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => const EpisodeSelectionScreen(),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 16),
                _MenuButton(
                  text: 'Settings',
                  icon: Icons.settings,
                  onPressed: () {
                    _showSnackBar(context, '설정');
                  },
                ),

                // Progress indicator
                if (gameState.gameProgress > 0) ...[
                  const SizedBox(height: 60),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 60),
                    child: Column(
                      children: [
                        Text(
                          '진행률: ${(gameState.gameProgress * 100).toStringAsFixed(0)}%',
                          style: const TextStyle(color: Colors.white70),
                        ),
                        const SizedBox(height: 8),
                        LinearProgressIndicator(
                          value: gameState.gameProgress,
                          backgroundColor: Colors.white24,
                          valueColor: const AlwaysStoppedAnimation<Color>(
                            Color(0xFF6366F1),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}

class _MenuButton extends StatelessWidget {
  final String text;
  final IconData icon;
  final VoidCallback? onPressed;

  const _MenuButton({
    required this.text,
    required this.icon,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 280,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 16),
          backgroundColor: onPressed != null
              ? Colors.white.withOpacity(0.1)
              : Colors.white.withOpacity(0.05),
          foregroundColor: onPressed != null ? Colors.white : Colors.white38,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: BorderSide(
              color: onPressed != null
                  ? const Color(0xFF6366F1).withOpacity(0.5)
                  : Colors.white12,
              width: 1,
            ),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 20),
            const SizedBox(width: 12),
            Text(
              text,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                letterSpacing: 1,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
