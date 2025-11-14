import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class TimelineViewer extends StatelessWidget {
  final List<TimelineEvent> events;
  final String title;

  const TimelineViewer({
    super.key,
    required this.events,
    this.title = '타임라인 분석',
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              title,
              style: Theme.of(context).textTheme.titleLarge,
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: events.length,
              itemBuilder: (context, index) {
                return _buildTimelineItem(
                  events[index],
                  isFirst: index == 0,
                  isLast: index == events.length - 1,
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineItem(
    TimelineEvent event, {
    bool isFirst = false,
    bool isLast = false,
  }) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Timeline indicator
          SizedBox(
            width: 60,
            child: Column(
              children: [
                if (!isFirst)
                  Container(
                    width: 2,
                    height: 20,
                    color: Colors.blue.shade200,
                  ),
                Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: _getEventColor(event.type),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: Colors.white,
                      width: 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.2),
                        blurRadius: 4,
                      ),
                    ],
                  ),
                ),
                if (!isLast)
                  Expanded(
                    child: Container(
                      width: 2,
                      color: Colors.blue.shade200,
                    ),
                  ),
              ],
            ),
          ),
          // Content
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _formatTime(event.timestamp),
                    style: GoogleFonts.robotoMono(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: _getEventColor(event.type).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: _getEventColor(event.type).withValues(alpha: 0.3),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              _getEventIcon(event.type),
                              size: 16,
                              color: _getEventColor(event.type),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                event.title,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          ],
                        ),
                        if (event.description != null) ...[
                          const SizedBox(height: 8),
                          Text(
                            event.description!,
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.grey.shade700,
                            ),
                          ),
                        ],
                        if (event.metadata != null &&
                            event.metadata!.isNotEmpty) ...[
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 4,
                            children: event.metadata!.entries.map((entry) {
                              return Chip(
                                label: Text(
                                  '${entry.key}: ${entry.value}',
                                  style: const TextStyle(fontSize: 11),
                                ),
                                materialTapTargetSize:
                                    MaterialTapTargetSize.shrinkWrap,
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 2,
                                ),
                              );
                            }).toList(),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(DateTime timestamp) {
    return '${timestamp.hour.toString().padLeft(2, '0')}:${timestamp.minute.toString().padLeft(2, '0')}:${timestamp.second.toString().padLeft(2, '0')}';
  }

  Color _getEventColor(TimelineEventType type) {
    switch (type) {
      case TimelineEventType.info:
        return Colors.blue;
      case TimelineEventType.warning:
        return Colors.orange;
      case TimelineEventType.error:
        return Colors.red;
      case TimelineEventType.success:
        return Colors.green;
      case TimelineEventType.critical:
        return Colors.purple;
    }
  }

  IconData _getEventIcon(TimelineEventType type) {
    switch (type) {
      case TimelineEventType.info:
        return Icons.info_outline;
      case TimelineEventType.warning:
        return Icons.warning_amber;
      case TimelineEventType.error:
        return Icons.error_outline;
      case TimelineEventType.success:
        return Icons.check_circle_outline;
      case TimelineEventType.critical:
        return Icons.priority_high;
    }
  }
}

class TimelineEvent {
  final DateTime timestamp;
  final String title;
  final String? description;
  final TimelineEventType type;
  final Map<String, String>? metadata;

  TimelineEvent({
    required this.timestamp,
    required this.title,
    this.description,
    this.type = TimelineEventType.info,
    this.metadata,
  });
}

enum TimelineEventType {
  info,
  warning,
  error,
  success,
  critical,
}
