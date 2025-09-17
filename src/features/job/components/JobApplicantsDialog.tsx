import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VirtualizedCandidateList } from "@/features/candidate/components/VirtualizedCandidateList";
import { useCandidates } from "@/features/candidate/hooks/useCandidates";
import { Job } from "@/types";

export function JobApplicantsDialog({ job }: { job: Job }) {
  const { data: candidates = [], isLoading } = useCandidates();
  const applied = candidates.filter((c) => c.jobId === job.id && c.stage === 'applied');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Applicants</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Applicants for {job.title}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div>Loading...</div>
        ) : applied.length === 0 ? (
          <div className="text-muted-foreground">No applied candidates yet.</div>
        ) : (
          <VirtualizedCandidateList candidates={applied} />
        )}
      </DialogContent>
    </Dialog>
  );
}
