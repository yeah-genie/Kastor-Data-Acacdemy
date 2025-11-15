import 'package:flutter/material.dart';
import '../../theme/academy_theme.dart';
import '../../services/audio_service.dart';
import 'dart:math' as math;

/// 타임라인 퍼즐 미니게임 - 이벤트를 올바른 순서로 정렬
class TimelinePuzzleGame extends StatefulWidget {
  final Function(bool success, int score) onComplete;
  final String title;
  final String description;
  
  const TimelinePuzzleGame({
    super.key,
    required this.onComplete,
    this.title = '타임라인 정렬',
    this.description = '이벤트를 시간 순서대로 정렬하세요!',
  });

  @override
  State<TimelinePuzzleGame> createState() => _TimelinePuzzleGameState();
}

class _TimelinePuzzleGameState extends State<TimelinePuzzleGame> {
  late List<TimelineEvent> _events;
  late List<TimelineEvent> _correctOrder;
  int _attempts = 0;
  final int _maxAttempts = 3;
  bool _isComplete = false;

  @override
  void initState() {
    super.initState();
    _generateTimeline();
  }

  void _generateTimeline() {
    // 정답 타임라인
    _correctOrder = [
      TimelineEvent(
        time: '09:00',
        description: '시스템 정상 작동 확인',
        icon: Icons.check_circle,
        color: Colors.green,
      ),
      TimelineEvent(
        time: '10:30',
        description: '사용자 대량 로그인 감지',
        icon: Icons.people,
        color: Colors.blue,
      ),
      TimelineEvent(
        time: '11:15',
        description: '서버 응답 시간 증가',
        icon: Icons.access_time,
        color: Colors.orange,
      ),
      TimelineEvent(
        time: '12:00',
        description: '데이터베이스 연결 오류 발생',
        icon: Icons.error,
        color: Colors.red,
      ),
      TimelineEvent(
        time: '12:45',
        description: '관리자 긴급 조치 시작',
        icon: Icons.build,
        color: Colors.amber,
      ),
      TimelineEvent(
        time: '13:30',
        description: '시스템 복구 완료',
        icon: Icons.verified,
        color: Colors.green,
      ),
    ];

    // 이벤트를 섞음
    _events = List.from(_correctOrder);
    _events.shuffle(math.Random());
  }

  void _checkAnswer() {
    _attempts++;

    bool isCorrect = true;
    for (int i = 0; i < _events.length; i++) {
      if (_events[i].time != _correctOrder[i].time) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
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
        _events = List.from(_correctOrder);
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
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
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
                      '드래그하여 순서를 변경하세요 | 남은 시도: ${_maxAttempts - _attempts}회',
                      style: TextStyle(
                        fontSize: 12,
                        color: AcademyColors.slate.withOpacity(0.8),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // 타임라인 카드
              Expanded(
                child: ReorderableListView.builder(
                  itemCount: _events.length,
                  onReorder: _isComplete ? (_, __) {} : (oldIndex, newIndex) {
                    setState(() {
                      if (newIndex > oldIndex) {
                        newIndex -= 1;
                      }
                      final item = _events.removeAt(oldIndex);
                      _events.insert(newIndex, item);
                    });
                    AudioService().playSFX(SoundEffect.buttonClick);
                  },
                  itemBuilder: (context, index) {
                    final event = _events[index];
                    final isCorrectPosition = _isComplete && 
                        event.time == _correctOrder[index].time;

                    return Container(
                      key: ValueKey(event.time),
                      margin: const EdgeInsets.only(bottom: 12),
                      child: Material(
                        elevation: 4,
                        borderRadius: BorderRadius.circular(12),
                        color: Colors.transparent,
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: isCorrectPosition
                                  ? [
                                      Colors.green.withOpacity(0.3),
                                      Colors.green.withOpacity(0.1),
                                    ]
                                  : [
                                      AcademyColors.deepAcademyPurple.withOpacity(0.6),
                                      AcademyColors.midnight.withOpacity(0.6),
                                    ],
                            ),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isCorrectPosition
                                  ? Colors.green
                                  : AcademyColors.neonCyan.withOpacity(0.3),
                              width: isCorrectPosition ? 2 : 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              // 순서 번호
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  gradient: LinearGradient(
                                    colors: [
                                      AcademyColors.neonCyan,
                                      AcademyColors.electricViolet,
                                    ],
                                  ),
                                ),
                                child: Center(
                                  child: Text(
                                    '${index + 1}',
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ),

                              const SizedBox(width: 16),

                              // 아이콘
                              Icon(
                                event.icon,
                                color: event.color,
                                size: 32,
                              ),

                              const SizedBox(width: 16),

                              // 내용
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      event.time,
                                      style: TextStyle(
                                        fontFamily: 'JetBrains Mono',
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: AcademyColors.neonCyan,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      event.description,
                                      style: const TextStyle(
                                        fontSize: 13,
                                        color: AcademyColors.creamPaper,
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                              // 드래그 핸들
                              if (!_isComplete)
                                Icon(
                                  Icons.drag_handle,
                                  color: AcademyColors.slate.withOpacity(0.5),
                                ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),

              const SizedBox(height: 20),

              // 확인 버튼
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isComplete ? null : _checkAnswer,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AcademyColors.neonCyan,
                    foregroundColor: AcademyColors.midnight,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 4,
                  ),
                  child: Text(
                    _isComplete ? '완료!' : '제출',
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
}

class TimelineEvent {
  final String time;
  final String description;
  final IconData icon;
  final Color color;

  TimelineEvent({
    required this.time,
    required this.description,
    required this.icon,
    required this.color,
  });
}
