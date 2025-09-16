import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Candidate, CandidateStage, CandidateTimelineEvent } from "@/types";
import { toast } from "sonner";

// ---------- Fetch all candidates ----------
const fetchCandidates = async (): Promise<Candidate[]> => {
  const response = await fetch("/candidates");
  if (!response.ok) throw new Error("Failed to fetch candidates");
  return response.json();
};

export const useCandidates = () =>
  useQuery<Candidate[], Error>({
    queryKey: ["candidates"],
    queryFn: fetchCandidates,
  });

// ---------- Update candidate stage ----------
const updateCandidateStage = async ({
  id,
  stage,
}: {
  id: number;
  stage: CandidateStage;
}): Promise<void> => {
  const response = await fetch(`/candidates/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stage }),
  });
  if (!response.ok) throw new Error("Failed to update candidate stage");
};

export const useUpdateCandidateStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCandidateStage,
    onSuccess: () => {
      toast.success("Candidate stage updated.");
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
    },
    onError: () => {
      toast.error("Failed to update candidate stage.");
    },
  });
};

// ---------- Fetch candidate timeline ----------
const fetchCandidateTimeline = async (
  candidateId: number
): Promise<CandidateTimelineEvent[]> => {
  const response = await fetch(`/candidates/${candidateId}/timeline`);
  if (!response.ok) throw new Error("Failed to fetch timeline");
  return response.json();
};

export const useCandidateTimeline = (candidateId: number) =>
  useQuery<CandidateTimelineEvent[], Error>({
    queryKey: ["timeline", candidateId],
    queryFn: () => fetchCandidateTimeline(candidateId),
    enabled: !!candidateId,
  });
