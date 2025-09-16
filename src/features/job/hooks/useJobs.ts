import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Job } from "@/types";
import { toast } from "sonner";
import { arrayMove } from "@dnd-kit/sortable";

// --- API helpers -------------------------------------------------------------

const fetchJobs = async (params: { status: string; title: string }): Promise<Job[]> => {
  const response = await fetch(`/jobs?status=${params.status}&title=${params.title}`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

const createJob = async (
  jobData: Omit<Job, "id" | "order" | "createdAt">
): Promise<Job> => {
  const response = await fetch("/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) throw new Error("Failed to create job");
  return response.json();
};

const updateJob = async (jobData: Partial<Job> & { id: number }): Promise<void> => {
  const { id, ...updates } = jobData;
  const response = await fetch(`/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update job");
};

const reorderJobsAPI = async ({
  activeId,
  overId,
}: {
  activeId: number;
  overId: number;
}) => {
  const response = await fetch("/jobs/reorder", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ activeId, overId }),
  });
  if (!response.ok) throw new Error("Failed to reorder jobs");
};

// --- Hooks -------------------------------------------------------------------

export const useJobs = (params: { status: string; title: string }) =>
  useQuery<Job[], Error>({
    queryKey: ["jobs", params],
    queryFn: () => fetchJobs(params),
  });

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      toast.success("Job created successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => toast.error("Failed to create job."),
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateJob,
    onSuccess: () => {
      toast.success("Job updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => toast.error("Failed to update job."),
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: number; status: "active" | "archived" }) =>
      updateJob(data),
    onSuccess: () => {
      toast.success("Job status updated!");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => toast.error("Failed to update job status."),
  });
};

export const useReorderJobs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderJobsAPI,
    onMutate: async ({ activeId, overId }) => {
      await queryClient.cancelQueries({ queryKey: ["jobs"] });

      const previousJobs =
        queryClient.getQueryData<Job[]>(["jobs", { status: "active", title: "" }]) ?? [];

      queryClient.setQueryData<Job[]>(
        ["jobs", { status: "active", title: "" }],
        (old = []) => {
          const oldIndex = old.findIndex((j) => j.id === activeId);
          const newIndex = old.findIndex((j) => j.id === overId);
          if (oldIndex === -1 || newIndex === -1) return old;
          return arrayMove(old, oldIndex, newIndex);
        }
      );

      return { previousJobs };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(
        ["jobs", { status: "active", title: "" }],
        ctx?.previousJobs
      );
      toast.error("Failed to reorder jobs. Reverting changes.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};
