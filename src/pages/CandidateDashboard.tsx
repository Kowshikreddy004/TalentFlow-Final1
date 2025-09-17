import { useAuth } from "@/providers/AuthContext";
import { useCandidates, useCandidateTimeline } from "@/features/candidate/hooks/useCandidates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const STAGES: Array<"applied" | "screen" | "tech" | "offer" | "hired" | "rejected"> = [
  "applied",
  "screen",
  "tech",
  "offer",
  "hired",
  "rejected",
];

export default function CandidateDashboard() {
  const { role, candidateId } = useAuth();
  const { data: candidates = [] } = useCandidates();
  const candidate = candidates.find((c) => c.id === candidateId!);
  const { data: timeline = [] } = useCandidateTimeline(candidateId || 0);

  if (role !== "candidate") {
    return <div className="text-muted-foreground">Login as a candidate to view your dashboard.</div>;
  }

  if (!candidate) {
    return <div className="text-muted-foreground">No candidate selected. Use Login to choose one.</div>;
  }

  const currentIndex = STAGES.indexOf(candidate.stage);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{candidate.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">{candidate.email}</p>
          <div className="w-full bg-secondary rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full"
              style={{ width: `${((currentIndex + 1) / STAGES.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-2 text-muted-foreground">
            {STAGES.map((s) => (
              <span key={s} className={s === candidate.stage ? "font-semibold text-foreground" : ""}>
                {s}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {timeline.length === 0 ? (
            <p className="text-muted-foreground">No updates yet.</p>
          ) : (
            <div className="space-y-4">
              {timeline.map((e, i) => (
                <div key={e.id}>
                  <div className="flex items-center justify-between">
                    <span>
                      Moved to <span className="capitalize font-medium">{e.stage}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{new Date(e.changedAt).toLocaleString()}</span>
                  </div>
                  {i < timeline.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
