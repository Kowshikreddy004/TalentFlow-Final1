import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useJobs, useReorderJobs } from "../hooks/useJobs";
import { JobCard } from "./JobCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobFormDialog } from "./JobFormDialog";

export function JobsBoard() {
  // ✅ State
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "archived">("active");
  const [titleFilter, setTitleFilter] = useState("");

  // ✅ Load jobs
  const { data: jobs = [], isLoading } = useJobs({
    status: statusFilter,
    title: titleFilter,
  });

  const reorderMutation = useReorderJobs();

  // ✅ DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ✅ Filter jobs by title
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) =>
      job.title.toLowerCase().includes(titleFilter.toLowerCase())
    );
  }, [jobs, titleFilter]);

  const jobIds = useMemo(() => filteredJobs.map((j) => j.id), [filteredJobs]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderMutation.mutate({
        activeId: active.id as number,
        overId: over.id as number,
      });
    }
  }

  if (isLoading) return <div>Loading jobs...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Filter by title..."
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <JobFormDialog />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={jobIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
