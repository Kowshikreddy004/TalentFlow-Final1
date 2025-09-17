import { CandidateKanbanBoard } from "@/features/candidate/components/CandidateKanbanBoard";
import { CandidateList } from "@/features/candidate/components/CandidateList";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid } from "lucide-react";

export function CandidatesPage() {
    const [view, setView] = useState<'list' | 'kanban'>('list');
    const allStages = ["applied","screen","tech","offer","hired","rejected"] as const;
    const [visibleStages, setVisibleStages] = useState<Array<typeof allStages[number]>>([...allStages]);

    const toggleStage = (s: typeof allStages[number]) => {
        setVisibleStages((prev) => prev.includes(s) ? prev.filter(x => x!==s) : [...prev, s]);
    };

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

            {view === 'kanban' && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    {allStages.map((s) => (
                        <Button key={s} size="sm" variant={visibleStages.includes(s) ? 'secondary' : 'outline'} onClick={() => toggleStage(s)} className="capitalize">
                            {s}
                        </Button>
                    ))}
                    <Button size="sm" variant="ghost" onClick={() => setVisibleStages([...allStages])}>Show all</Button>
                </div>
            )}

            {view === 'list'? <CandidateList /> : <CandidateKanbanBoard visibleStages={visibleStages as any} />}
        </div>
    );
}
