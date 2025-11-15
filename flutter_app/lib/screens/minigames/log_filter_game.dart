import 'package:flutter/material.dart';
import '../../theme/academy_theme.dart';
import '../../services/audio_service.dart';
import 'dart:math' as math;

/// 로그 필터링 미니게임 - 의심스러운 로그 엔트리 찾기
class LogFilterGame extends StatefulWidget {
  final Function(bool success, int score) onComplete;
  final String title;
  final String description;
  
  const LogFilterGame({
    super.key,
    required this.onComplete,
    this.title = '로그 분석',
    this.description = '의심스러운 로그 엔트리를 모두 찾으세요!',
  });

  @override
  State<LogFilterGame> createState() => _LogFilterGameState();
}

class _LogFilterGameState extends State<LogFilterGame> {
  late List<LogEntry> _logs;
  Set<int> _selectedIndices = {};
  late Set<int> _suspiciousIndices;
  int _attempts = 0;
  final int _maxAttempts = 3;
  bool _isComplete = false;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _generateLogs();
  }

  void _generateLogs() {
    final random = math.Random();
    _logs = [];
    _suspiciousIndices = {};

    // 정상 로그
    final normalActions = [
      'User login successful',
      'File accessed: report.pdf',
      'API call: GET /api/users',
      'Database query executed',
      'Session created',
      'Email sent to user@example.com',
      'Cache cleared',
      'Settings updated',
    ];

    // 의심스러운 로그
    final suspiciousActions = [
      'Multiple failed login attempts (10x)',
      'File deleted: sensitive_data.db',
      'Unauthorized access attempt to /admin',
      'SQL injection detected in query',
      'Unusual data transfer: 500GB',
    ];

    // 정상 로그 추가
    for (int i = 0; i < 12; i++) {
      _logs.add(LogEntry(
        timestamp: DateTime.now().subtract(Duration(minutes: random.nextInt(120))),
        action: normalActions[random.nextInt(normalActions.length)],
        user: 'user_${random.nextInt(100)}',
        isSuspicious: false,
      ));
    }

    // 의심스러운 로그 3개 추가 (랜덤 위치에)
    final suspiciousPositions = [2, 6, 10];
    for (final pos in suspiciousPositions) {
      _suspiciousIndices.add(pos);
      _logs[pos] = LogEntry(
        timestamp: DateTime.now().subtract(Duration(minutes: random.nextInt(120))),
        action: suspiciousActions[random.nextInt(suspiciousActions.length)],
        user: 'user_${random.nextInt(100)}',
        isSuspicious: true,
      );
    }
  }

  void _onLogTapped(int index) {
    if (_isComplete) return;

    setState(() {
      if (_selectedIndices.contains(index)) {
        _selectedIndices.remove(index);
      } else {
        _selectedIndices.add(index);
      }
    });

    AudioService().playSFX(SoundEffect.buttonClick);
  }

  void _checkAnswer() {
    _attempts++;

    final correctSelections = _selectedIndices.intersection(_suspiciousIndices);
    final isSuccess = correctSelections.length == _suspiciousIndices.length &&
        _selectedIndices.length == _suspiciousIndices.length;

    if (isSuccess) {
      AudioService().playSFX(SoundEffect.correct);
      final score = (100 - (_attempts - 1) * 20).clamp(0, 100);
      
      setState(() {
        _isComplete = true;
      });

      Future.delayed(const Duration(seconds: 1), () {
        widget.onComplete(true, score);
      });
    } else if (_attempts >= _maxAttempts) {
      AudioService().playSFX(SoundEffect.wrong);
      
      setState(() {
        _isComplete = true;
        _selectedIndices = _suspiciousIndices;
      });

      Future.delayed(const Duration(seconds: 2), () {
        widget.onComplete(false, 0);
      });
    } else {
      AudioService().playSFX(SoundEffect.wrong);
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('틀렸습니다! ${_maxAttempts - _attempts}번의 기회가 남았습니다.'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  List<LogEntry> get _filteredLogs {
    if (_searchQuery.isEmpty) return _logs;
    return _logs.where((log) =>
        log.action.toLowerCase().contains(_searchQuery.toLowerCase()) ||
        log.user.toLowerCase().contains(_searchQuery.toLowerCase())).toList();
  }

  @override
  Widget build(BuildContext context) {
    final filteredLogs = _filteredLogs;

    return Container(
      decoration: const BoxDecoration(
        gradient: AcademyColors.academicGradient,
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          backgroundColor: AcademyColors.midnight.withOpacity(0.9),
          title: Text(widget.title),
          centerTitle: true,
        ),
        body: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              // 설명
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AcademyColors.deepAcademyPurple.withOpacity(0.5),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: AcademyColors.neonCyan.withOpacity(0.3),
                  ),
                ),
                child: Column(
                  children: [
                    Text(
                      widget.description,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AcademyColors.creamPaper,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '남은 시도: ${_maxAttempts - _attempts}회',
                      style: TextStyle(
                        fontSize: 12,
                        color: AcademyColors.slate.withOpacity(0.8),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 12),

              // 검색 필터
              TextField(
                onChanged: (value) {
                  setState(() {
                    _searchQuery = value;
                  });
                },
                style: const TextStyle(color: AcademyColors.creamPaper),
                decoration: InputDecoration(
                  hintText: '로그 검색...',
                  hintStyle: TextStyle(color: AcademyColors.slate),
                  prefixIcon: Icon(Icons.search, color: AcademyColors.neonCyan),
                  filled: true,
                  fillColor: AcademyColors.midnight.withOpacity(0.6),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: AcademyColors.neonCyan.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: AcademyColors.slate.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: AcademyColors.neonCyan, width: 2),
                  ),
                ),
              ),

              const SizedBox(height: 12),

              // 로그 리스트
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AcademyColors.midnight.withOpacity(0.4),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: AcademyColors.slate.withOpacity(0.2),
                    ),
                  ),
                  child: ListView.builder(
                    itemCount: filteredLogs.length,
                    itemBuilder: (context, index) {
                      final originalIndex = _logs.indexOf(filteredLogs[index]);
                      final log = filteredLogs[index];
                      final isSelected = _selectedIndices.contains(originalIndex);
                      final isSuspicious = _suspiciousIndices.contains(originalIndex);
                      final showCorrect = _isComplete && isSuspicious;

                      return GestureDetector(
                        onTap: () => _onLogTapped(originalIndex),
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: showCorrect
                                ? Colors.red.withOpacity(0.3)
                                : (isSelected
                                    ? AcademyColors.electricViolet.withOpacity(0.2)
                                    : AcademyColors.deepAcademyPurple.withOpacity(0.3)),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: showCorrect
                                  ? Colors.red
                                  : (isSelected
                                      ? AcademyColors.electricViolet
                                      : AcademyColors.slate.withOpacity(0.3)),
                              width: isSelected ? 2 : 1,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    showCorrect ? Icons.warning : Icons.circle,
                                    size: 12,
                                    color: showCorrect
                                        ? Colors.red
                                        : (isSelected
                                            ? AcademyColors.electricViolet
                                            : AcademyColors.slate),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    _formatTimestamp(log.timestamp),
                                    style: TextStyle(
                                      fontFamily: 'JetBrains Mono',
                                      fontSize: 10,
                                      color: AcademyColors.slate.withOpacity(0.8),
                                    ),
                                  ),
                                  const Spacer(),
                                  Text(
                                    log.user,
                                    style: TextStyle(
                                      fontFamily: 'JetBrains Mono',
                                      fontSize: 10,
                                      color: AcademyColors.neonCyan.withOpacity(0.7),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Text(
                                log.action,
                                style: TextStyle(
                                  fontSize: 13,
                                  color: showCorrect
                                      ? Colors.red[300]
                                      : AcademyColors.creamPaper,
                                  fontWeight: showCorrect ? FontWeight.bold : FontWeight.normal,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),

              const SizedBox(height: 12),

              // 확인 버튼
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isComplete || _selectedIndices.isEmpty
                      ? null
                      : _checkAnswer,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AcademyColors.neonCyan,
                    foregroundColor: AcademyColors.midnight,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 4,
                  ),
                  child: Text(
                    _isComplete ? '완료!' : '제출 (${_selectedIndices.length}/3)',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatTimestamp(DateTime time) {
    return '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}:${time.second.toString().padLeft(2, '0')}';
  }
}

class LogEntry {
  final DateTime timestamp;
  final String action;
  final String user;
  final bool isSuspicious;

  LogEntry({
    required this.timestamp,
    required this.action,
    required this.user,
    required this.isSuspicious,
  });
}
