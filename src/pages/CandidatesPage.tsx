import { CandidateKanbanBoard } from "@/features/candidate/components/CandidateKanbanBoard";
import { CandidateList } from "@/features/candidate/components/CandidateList";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid } from "lucide-react";

export function CandidatesPage() {
    const [view, setView] = useState<'list' | 'kanban'>('list');

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Candidates</h2>
                <div className="flex items-center gap-2">
                    <Button variant={view === 'list'? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')}>
                        <List className="h-4 w-4" />
                    </Button>
                    <Button variant={view === 'kanban'? 'secondary' : 'ghost'} size="icon" onClick={() => setView('kanban')}>
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {view === 'list'? <CandidateList /> : <CandidateKanbanBoard />}
        </div>
    );
}