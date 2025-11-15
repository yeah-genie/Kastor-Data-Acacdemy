import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../theme/academy_theme.dart';
import '../../services/audio_service.dart';
import 'dart:math' as math;

/// 이상치 찾기 미니게임 - 차트에서 비정상 데이터 포인트 찾기
class AnomalyFinderGame extends StatefulWidget {
  final Function(bool success, int score) onComplete;
  final String title;
  final String description;
  
  const AnomalyFinderGame({
    super.key,
    required this.onComplete,
    this.title = '이상치 탐지',
    this.description = '차트에서 비정상적인 데이터 포인트를 찾으세요!',
  });

  @override
  State<AnomalyFinderGame> createState() => _AnomalyFinderGameState();
}

class _AnomalyFinderGameState extends State<AnomalyFinderGame> {
  late List<DataPoint> _dataPoints;
  late Set<int> _anomalyIndices;
  Set<int> _selectedIndices = {};
  int _attempts = 0;
  final int _maxAttempts = 3;
  bool _isComplete = false;

  @override
  void initState() {
    super.initState();
    _generateData();
  }

  void _generateData() {
    final random = math.Random();
    _dataPoints = [];
    _anomalyIndices = {};

    // 정상 패턴 생성 (증가 추세)
    for (int i = 0; i < 15; i++) {
      double value = 50 + (i * 5) + random.nextDouble() * 10;
      _dataPoints.add(DataPoint(i.toDouble(), value, false));
    }

    // 이상치 3개 추가
    final anomalyPositions = [3, 8, 12];
    for (final pos in anomalyPositions) {
      _anomalyIndices.add(pos);
      // 이상치는 패턴에서 크게 벗어남
      _dataPoints[pos] = DataPoint(
        pos.toDouble(),
        random.nextBool() ? 30.0 : 120.0, // 너무 낮거나 높음
        true,
      );
    }
  }

  void _onPointTapped(int index) {
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

    final correctSelections = _selectedIndices.intersection(_anomalyIndices);
    final isSuccess = correctSelections.length == _anomalyIndices.length;

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
        // 정답 표시
        _selectedIndices = _anomalyIndices;
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
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // 설명
              Container(
                padding: const EdgeInsets.all(16),
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
                        fontSize: 16,
                        color: AcademyColors.creamPaper,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '남은 시도: ${_maxAttempts - _attempts}회',
                      style: TextStyle(
                        fontSize: 14,
                        color: AcademyColors.slate.withOpacity(0.8),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // 차트
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AcademyColors.midnight.withOpacity(0.6),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: AcademyColors.neonCyan.withOpacity(0.2),
                    ),
                  ),
                  child: LineChart(
                    LineChartData(
                      gridData: FlGridData(
                        show: true,
                        getDrawingHorizontalLine: (value) => FlLine(
                          color: AcademyColors.slate.withOpacity(0.2),
                          strokeWidth: 1,
                        ),
                        getDrawingVerticalLine: (value) => FlLine(
                          color: AcademyColors.slate.withOpacity(0.2),
                          strokeWidth: 1,
                        ),
                      ),
                      titlesData: FlTitlesData(
                        show: true,
                        bottomTitles: AxisTitles(
                          sideTitles: SideTitles(
                            showTitles: true,
                            getTitlesWidget: (value, meta) {
                              return Text(
                                value.toInt().toString(),
                                style: TextStyle(
                                  color: AcademyColors.slate,
                                  fontSize: 10,
                                ),
                              );
                            },
                          ),
                        ),
                        leftTitles: AxisTitles(
                          sideTitles: SideTitles(showTitles: true),
                        ),
                        rightTitles: AxisTitles(
                          sideTitles: SideTitles(showTitles: false),
                        ),
                        topTitles: AxisTitles(
                          sideTitles: SideTitles(showTitles: false),
                        ),
                      ),
                      borderData: FlBorderData(show: false),
                      lineBarsData: [
                        LineChartBarData(
                          spots: _dataPoints
                              .map((p) => FlSpot(p.x, p.y))
                              .toList(),
                          isCurved: false,
                          color: AcademyColors.neonCyan,
                          barWidth: 2,
                          dotData: FlDotData(
                            show: true,
                            getDotPainter: (spot, percent, barData, index) {
                              final isSelected = _selectedIndices.contains(index);
                              final isAnomaly = _anomalyIndices.contains(index);
                              final showCorrect = _isComplete && isAnomaly;

                              return FlDotCirclePainter(
                                radius: isSelected ? 8 : 5,
                                color: showCorrect
                                    ? Colors.red
                                    : (isSelected
                                        ? AcademyColors.electricViolet
                                        : AcademyColors.neonCyan),
                                strokeWidth: 2,
                                strokeColor: Colors.white,
                              );
                            },
                          ),
                        ),
                      ],
                      lineTouchData: LineTouchData(
                        touchCallback: (FlTouchEvent event, LineTouchResponse? response) {
                          if (event is FlTapUpEvent && response != null) {
                            final touchedSpot = response.lineBarSpots?.first;
                            if (touchedSpot != null) {
                              _onPointTapped(touchedSpot.spotIndex);
                            }
                          }
                        },
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // 버튼
              SizedBox(
                width: double.infinity,
                height: 56,
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
                    _isComplete ? '완료!' : '확인 (${_selectedIndices.length}/3)',
                    style: const TextStyle(
                      fontSize: 18,
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

class DataPoint {
  final double x;
  final double y;
  final bool isAnomaly;

  DataPoint(this.x, this.y, this.isAnomaly);
}
