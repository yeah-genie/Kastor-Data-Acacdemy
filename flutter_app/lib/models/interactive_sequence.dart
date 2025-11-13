import 'package:json_annotation/json_annotation.dart';

part 'interactive_sequence.g.dart';

enum InteractiveType {
  @JsonValue('graph_analysis')
  graphAnalysis,
  @JsonValue('logic_connection')
  logicConnection,
  @JsonValue('timeline_reconstruction')
  timelineReconstruction,
  @JsonValue('testimony_press')
  testimonyPress,
  @JsonValue('evidence_presentation')
  evidencePresentation,
  @JsonValue('document_examination')
  documentExamination,
  @JsonValue('database_search')
  databaseSearch,
  @JsonValue('case_report_assembly')
  caseReportAssembly,
  @JsonValue('log_filtering')
  logFiltering,
  @JsonValue('ghost_account_selection')
  ghostAccountSelection,
  @JsonValue('pattern_matching')
  patternMatching,
  @JsonValue('email_filter')
  emailFilter,
  @JsonValue('code_debugging')
  codeDebugging,
  @JsonValue('graph-analysis')
  graphAnalysisHyphen,
  @JsonValue('timeline')
  timeline,
  @JsonValue('database-search')
  databaseSearchHyphen,
  @JsonValue('testimony-press')
  testimonyPressHyphen,
  @JsonValue('document-viewer')
  documentViewer,
  @JsonValue('case-report')
  caseReport,
  @JsonValue('rank-display')
  rankDisplay,
}

@JsonSerializable()
class InteractiveSequence {
  final String type;
  final String id;
  final Map<String, dynamic> data;

  InteractiveSequence({
    required this.type,
    required this.id,
    required this.data,
  });

  factory InteractiveSequence.fromJson(Map<String, dynamic> json) =>
      _$InteractiveSequenceFromJson(json);
  Map<String, dynamic> toJson() => _$InteractiveSequenceToJson(this);
}
