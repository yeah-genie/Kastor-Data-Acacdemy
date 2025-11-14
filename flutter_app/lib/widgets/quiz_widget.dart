import 'package:flutter/material.dart';
import '../models/quiz.dart';

class QuizWidget extends StatefulWidget {
  final Quiz quiz;
  final Function(bool isCorrect, int selectedIndex) onAnswer;

  const QuizWidget({
    super.key,
    required this.quiz,
    required this.onAnswer,
  });

  @override
  State<QuizWidget> createState() => _QuizWidgetState();
}

class _QuizWidgetState extends State<QuizWidget> {
  int? _selectedIndex;
  bool _hasAnswered = false;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade100,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.quiz,
                        size: 16,
                        color: Colors.blue.shade700,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '퀴즈',
                        style: TextStyle(
                          color: Colors.blue.shade700,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.amber.shade100,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.stars,
                        size: 16,
                        color: Colors.amber.shade700,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '+${widget.quiz.rewardPoints} 포인트',
                        style: TextStyle(
                          color: Colors.amber.shade700,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Text(
              widget.quiz.question,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),
            ...widget.quiz.options.asMap().entries.map((entry) {
              final index = entry.key;
              final option = entry.value;
              return _buildOption(index, option);
            }),
            if (_hasAnswered) ...[
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: _selectedIndex == widget.quiz.correctAnswerIndex
                      ? Colors.green.shade50
                      : Colors.red.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: _selectedIndex == widget.quiz.correctAnswerIndex
                        ? Colors.green
                        : Colors.red,
                    width: 2,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          _selectedIndex == widget.quiz.correctAnswerIndex
                              ? Icons.check_circle
                              : Icons.cancel,
                          color: _selectedIndex == widget.quiz.correctAnswerIndex
                              ? Colors.green
                              : Colors.red,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          _selectedIndex == widget.quiz.correctAnswerIndex
                              ? '정답입니다!'
                              : '틀렸습니다',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: _selectedIndex == widget.quiz.correctAnswerIndex
                                ? Colors.green.shade700
                                : Colors.red.shade700,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      widget.quiz.explanation,
                      style: const TextStyle(fontSize: 14),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildOption(int index, String option) {
    final isSelected = _selectedIndex == index;
    final isCorrect = index == widget.quiz.correctAnswerIndex;

    Color? backgroundColor;
    Color? borderColor;

    if (_hasAnswered) {
      if (isCorrect) {
        backgroundColor = Colors.green.shade50;
        borderColor = Colors.green;
      } else if (isSelected) {
        backgroundColor = Colors.red.shade50;
        borderColor = Colors.red;
      }
    } else if (isSelected) {
      backgroundColor = Colors.blue.shade50;
      borderColor = Colors.blue;
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: _hasAnswered
            ? null
            : () {
                setState(() {
                  _selectedIndex = index;
                  _hasAnswered = true;
                });
                final isCorrectAnswer = index == widget.quiz.correctAnswerIndex;
                widget.onAnswer(isCorrectAnswer, index);
              },
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: borderColor ?? Colors.grey.shade300,
              width: 2,
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isSelected
                      ? (borderColor ?? Colors.blue)
                      : Colors.transparent,
                  border: Border.all(
                    color: borderColor ?? Colors.grey.shade400,
                    width: 2,
                  ),
                ),
                child: isSelected
                    ? const Icon(
                        Icons.check,
                        size: 16,
                        color: Colors.white,
                      )
                    : null,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  option,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                  ),
                ),
              ),
              if (_hasAnswered && isCorrect)
                Icon(
                  Icons.check_circle,
                  color: Colors.green,
                  size: 24,
                ),
            ],
          ),
        ),
      ),
    );
  }
}
