import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class LogViewer extends StatefulWidget {
  final List<LogEntry> logs;
  final String title;

  const LogViewer({
    super.key,
    required this.logs,
    this.title = '서버 로그',
  });

  @override
  State<LogViewer> createState() => _LogViewerState();
}

class _LogViewerState extends State<LogViewer> {
  String? _filterLevel;
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final filteredLogs = _getFilteredLogs();

    return Card(
      margin: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.title,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        decoration: const InputDecoration(
                          hintText: '검색...',
                          prefixIcon: Icon(Icons.search),
                          border: OutlineInputBorder(),
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                        ),
                        onChanged: (value) {
                          setState(() {
                            _searchQuery = value;
                          });
                        },
                      ),
                    ),
                    const SizedBox(width: 8),
                    DropdownButton<String?>(
                      value: _filterLevel,
                      hint: const Text('레벨'),
                      items: [
                        const DropdownMenuItem(
                          value: null,
                          child: Text('전체'),
                        ),
                        ...LogLevel.values.map((level) {
                          return DropdownMenuItem(
                            value: level.name,
                            child: Text(level.name.toUpperCase()),
                          );
                        }),
                      ],
                      onChanged: (value) {
                        setState(() {
                          _filterLevel = value;
                        });
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: ListView.builder(
              itemCount: filteredLogs.length,
              itemBuilder: (context, index) {
                final log = filteredLogs[index];
                return _buildLogEntry(log);
              },
            ),
          ),
        ],
      ),
    );
  }

  List<LogEntry> _getFilteredLogs() {
    var logs = widget.logs;

    if (_filterLevel != null) {
      logs = logs.where((log) => log.level.name == _filterLevel).toList();
    }

    if (_searchQuery.isNotEmpty) {
      logs = logs
          .where((log) =>
              log.message.toLowerCase().contains(_searchQuery.toLowerCase()))
          .toList();
    }

    return logs;
  }

  Widget _buildLogEntry(LogEntry log) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: Colors.grey.shade200),
        ),
        color: _getLogColor(log.level).withValues(alpha: 0.1),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: _getLogColor(log.level),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              log.level.name.toUpperCase(),
              style: GoogleFonts.robotoMono(
                fontSize: 10,
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  log.timestamp.toString().substring(0, 19),
                  style: GoogleFonts.robotoMono(
                    fontSize: 11,
                    color: Colors.grey.shade600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  log.message,
                  style: GoogleFonts.robotoMono(fontSize: 13),
                ),
                if (log.details != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    log.details!,
                    style: GoogleFonts.robotoMono(
                      fontSize: 11,
                      color: Colors.grey.shade700,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Color _getLogColor(LogLevel level) {
    switch (level) {
      case LogLevel.info:
        return Colors.blue;
      case LogLevel.warning:
        return Colors.orange;
      case LogLevel.error:
        return Colors.red;
      case LogLevel.debug:
        return Colors.grey;
    }
  }
}

class LogEntry {
  final DateTime timestamp;
  final LogLevel level;
  final String message;
  final String? details;

  LogEntry({
    required this.timestamp,
    required this.level,
    required this.message,
    this.details,
  });
}

enum LogLevel {
  info,
  warning,
  error,
  debug,
}
