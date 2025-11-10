import { GraphAnalysisInteractive } from "./GraphAnalysisInteractive";
import { LogicConnectionPuzzle } from "./LogicConnectionPuzzle";
import { TimelineReconstruction } from "./TimelineReconstruction";
import { TestimonyPress } from "./TestimonyPress";
import { EvidenceChainPresentation } from "./EvidenceChainPresentation";
import { DocumentExamination } from "./DocumentExamination";
import { DatabaseSearch } from "./DatabaseSearch";
import { CaseReportAssembly } from "./CaseReportAssembly";
import { LogFilteringSequence } from "./interactive/LogFilteringSequence";
import { InteractiveSequence } from "@/data/case1-story-new";

interface InteractiveSequenceHandlerProps {
  sequence: InteractiveSequence;
  onComplete: () => void;
}

export function InteractiveSequenceHandler({ sequence, onComplete }: InteractiveSequenceHandlerProps) {
  switch (sequence.type) {
    case "graph_analysis":
      return (
        <GraphAnalysisInteractive
          series={sequence.data.series}
          question={sequence.data.question}
          correctAnswer={sequence.data.correctAnswer}
          onComplete={onComplete}
        />
      );

    case "logic_connection":
      return (
        <LogicConnectionPuzzle
          thoughts={sequence.data.thoughts}
          correctConnections={sequence.data.correctConnections}
          onComplete={onComplete}
        />
      );

    case "timeline_reconstruction":
      return (
        <TimelineReconstruction
          events={sequence.data.events}
          onComplete={onComplete}
        />
      );

    case "testimony_press":
      return (
        <TestimonyPress
          statements={sequence.data.statements}
          onComplete={onComplete}
        />
      );

    case "evidence_presentation":
      return (
        <EvidenceChainPresentation
          evidencePieces={sequence.data.evidencePieces}
          onComplete={onComplete}
        />
      );

    case "document_examination":
      return (
        <DocumentExamination
          title={sequence.data.title}
          sections={sequence.data.sections}
          onComplete={onComplete}
        />
      );

    case "database_search":
      return (
        <DatabaseSearch
          searchType={sequence.data.searchType}
          searchValue={sequence.data.searchValue}
          results={sequence.data.results}
          onComplete={onComplete}
        />
      );

    case "case_report_assembly":
      return (
        <CaseReportAssembly
          fields={sequence.data.fields}
          evidenceChecklist={sequence.data.evidenceChecklist}
          onComplete={onComplete}
        />
      );

    case "log_filtering":
      return (
        <LogFilteringSequence
          data={sequence.data}
          onComplete={(userSelections) => {
            // userSelections contains the IDs of logs the user kept
            // You can validate or store these if needed
            onComplete();
          }}
        />
      );

    default:
      return null;
  }
}
