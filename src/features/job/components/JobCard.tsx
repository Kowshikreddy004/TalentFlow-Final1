import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Job } from "@/types";
import { GripVertical } from "lucide-react";
import { JobFormDialog } from './JobFormDialog';
import { JobApplicantsDialog } from './JobApplicantsDialog';
import { useUpdateJobStatus } from '../hooks/useJobs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function JobCard({ job }: { job: Job }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: job.id });
    const updateStatusMutation = useUpdateJobStatus();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleToggleArchive = () => {
        const newStatus = job.status === 'active'? 'archived' : 'active';
        updateStatusMutation.mutate({ id: job.id, status: newStatus });
    };

    return (
        <Card ref={setNodeRef} style={style} className="flex items-center">
            <div {...attributes} {...listeners} className="p-4 cursor-grab text-muted-foreground">
                <GripVertical />
            </div>
            <CardHeader className="flex-1 p-4">
                <div className="flex items-center justify-between">
                  <CardTitle>{job.title}</CardTitle>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{job.status}</span>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex items-center gap-4">
                <Button variant="outline" asChild>
                    <Link to={`/jobs/${job.id}/assessment`}>Assessment</Link>
                </Button>
                <JobApplicantsDialog job={job} />
                <Button variant="outline" onClick={handleToggleArchive}>
                    {job.status === 'active'? 'Archive' : 'Unarchive'}
                </Button>
                <JobFormDialog job={job} />
            </CardContent>
        </Card>
    );
}
