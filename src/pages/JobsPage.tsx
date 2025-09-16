// This file will be created in the next step under the features directory
// For now, this page component will assemble the feature components.
import { JobsBoard } from "@/features/job/components/JobsBoard";

export function JobsPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
            </div>
            <JobsBoard />
        </div>
    );
}