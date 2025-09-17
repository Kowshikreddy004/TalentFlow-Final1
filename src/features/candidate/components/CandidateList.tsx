import { useMemo, useState } from "react";
import { useCandidates } from "../hooks/useCandidates";
import { Input } from "@/components/ui/input";
import { VirtualizedCandidateList } from "./VirtualizedCandidateList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CandidateStage } from "@/types";

export function CandidateList() {
  // Provide a fallback empty array for data
  const { data: candidates = [], isLoading } = useCandidates();
  const [searchTerm, setSearchTerm] = useState("");
  const [stage, setStage] = useState<CandidateStage | "all">("all");

  const filteredCandidates = useMemo(() => {
    let result = candidates;
    if (stage !== "all") {
      result = result.filter((c) => c.stage === stage);
    }
    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return result;
  }, [candidates, searchTerm, stage]);

  if (isLoading) return <div>Loading candidates...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={stage} onValueChange={(v) => setStage(v as any)}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Stage" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="screen">Screen</SelectItem>
            <SelectItem value="tech">Tech</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <VirtualizedCandidateList candidates={filteredCandidates} />
    </div>
  );
}

export default CandidateList;
