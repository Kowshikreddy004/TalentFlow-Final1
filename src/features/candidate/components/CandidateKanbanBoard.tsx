import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useCandidates, useUpdateCandidateStage } from "../hooks/useCandidates";
import { Candidate, CandidateStage } from "@/types";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPortal } from "react-dom";

const STAGES: CandidateStage[] = [
  "applied",
  "screen",
  "tech",
  "offer",
  "hired",
  "rejected",
];

export function CandidateKanbanBoard() {
  const { data: candidates = [], isLoading } = useCandidates();
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const updateStageMutation = useUpdateCandidateStage();

  const candidatesByStage = useMemo(() => {
    const grouped: Record<CandidateStage, Candidate[]> = {
      applied: [],
      screen: [],
      tech: [],
      offer: [],
      hired: [],
      rejected: [],
    };
    candidates.forEach((c) => grouped[c.stage].push(c));
    return grouped;
  }, [candidates]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: { active: { id: string | number } }) => {
    const candidate = candidates.find((c) => c.id === event.active.id);
    if (candidate) setActiveCandidate(candidate);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCandidate(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const newStage = over.id as CandidateStage;

    const candidate = candidates.find((c) => c.id === activeId);
    if (candidate && candidate.stage !== newStage) {
      updateStageMutation.mutate({ id: activeId, stage: newStage });
    }
  };

  if (isLoading) return <div>Loading candidates...</div>;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            candidates={candidatesByStage[stage]}
          />
        ))}
      </div>

      {createPortal(
        <DragOverlay>
          {activeCandidate ? (
            <CandidateCard candidate={activeCandidate} isOverlay />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

function KanbanColumn({
  stage,
  candidates,
}: {
  stage: CandidateStage;
  candidates: Candidate[];
}) {
  return (
    <div
      id={stage}
      className="bg-secondary rounded-lg p-2 flex flex-col gap-2 min-h-[200px]"
    >
      <h3 className="font-bold p-2 capitalize">{stage}</h3>
      <div className="flex-1 space-y-2">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  );
}

function CandidateCard({
  candidate,
  isOverlay,
}: {
  candidate: Candidate;
  isOverlay?: boolean;
}) {
  return (
    <Card
      id={candidate.id.toString()}
      className={isOverlay ? "shadow-lg" : "shadow-sm"}
    >
      <CardHeader className="p-3">
        <CardTitle className="text-sm">{candidate.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-xs text-muted-foreground">
        {candidate.email}
      </CardContent>
    </Card>
  );
}
