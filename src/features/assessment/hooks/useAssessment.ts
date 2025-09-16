import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Assessment } from "@/types";
import { toast } from "sonner";
import { AssessmentFormData } from "../types/assessment.schema";

// -------------------- Fetch assessment --------------------
const fetchAssessment = async (jobId: number): Promise<Assessment | null> => {
  const response = await fetch(`/assessments/${jobId}`);
  if (!response.ok) throw new Error("Failed to fetch assessment");

  // Return null for empty/204 responses
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return null;
  }

  return response.json();
};

export const useAssessment = (jobId: number) =>
  useQuery<Assessment | null, Error>({
    queryKey: ["assessment", jobId],
    queryFn: () => fetchAssessment(jobId),
    enabled: !!jobId,
  });

// -------------------- Save assessment --------------------
const saveAssessment = async (
  data: AssessmentFormData & { jobId: number }
): Promise<void> => {
  const { jobId, ...payload } = data;

  const response = await fetch(`/assessments/${jobId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to save assessment");
};

export const useSaveAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveAssessment,
    onSuccess: (_, variables) => {
      toast.success("Assessment saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["assessment", variables.jobId] });
    },
    onError: () => {
      toast.error("Failed to save assessment.");
    },
  });
};
