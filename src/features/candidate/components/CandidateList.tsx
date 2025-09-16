import { useMemo, useState } from "react";
import { useCandidates } from "../hooks/useCandidates";
import { Input } from "@/components/ui/input";
import { VirtualizedCandidateList } from "./VirtualizedCandidateList";

export function CandidateList() {
  // Provide a fallback empty array for data
  const { data: candidates = [], isLoading } = useCandidates();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCandidates = useMemo(() => {
    if (!searchTerm) return candidates;
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [candidates, searchTerm]);

  if (isLoading) return <div>Loading candidates...</div>;

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <VirtualizedCandidateList candidates={filteredCandidates} />
    </div>
  );
}

export default CandidateList;
