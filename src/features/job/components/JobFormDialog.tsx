import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@/types";
import { jobSchema, JobFormData } from "../types/job.schema";
import { useCreateJob, useUpdateJob } from "../hooks/useJobs";

interface JobFormDialogProps {
  job?: Job;
}

export function JobFormDialog({ job }: JobFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: job
      ? { title: job.title, slug: job.slug, tags: job.tags.join(", ") }
      : { title: "", slug: "", tags: "" },
  });

  const onSubmit = (data: JobFormData) => {
    const mutation = job ? updateJobMutation : createJobMutation;
    const payload = {
      ...data,
      tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
      ...(job ? { id: job.id } : { status: "active" as const }),
    };

    mutation.mutate(payload as any, {
      onSuccess: () => {
        setIsOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={job ? "outline" : "default"}>
          {job ? "Edit Job" : "Create Job"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{job ? "Edit Job" : "Create New Job"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register("slug")} />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" {...register("tags")} />
          </div>

          <Button
            type="submit"
            disabled={
              createJobMutation.isPending || updateJobMutation.isPending
            }
          >
            {job ? "Save Changes" : "Create Job"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
