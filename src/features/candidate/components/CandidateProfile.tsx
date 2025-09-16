import { useParams } from "react-router-dom";
import { useCandidateTimeline, useCandidates } from "../hooks/useCandidates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function CandidateProfile() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { data: candidates = [], isLoading: isLoadingCandidates } = useCandidates();
  const { data: timeline = [], isLoading: isLoadingTimeline } =
    useCandidateTimeline(Number(candidateId));

  const candidate = candidates.find((c) => c.id === Number(candidateId));

  if (isLoadingCandidates || isLoadingTimeline) {
    return <div>Loading profile...</div>;
  }

  if (!candidate) {
    return <div>Candidate not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{candidate.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Email:</strong> {candidate.email}
          </p>
          <p>
            <strong>Current Stage:</strong>{" "}
            <span className="capitalize">{candidate.stage}</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeline.length === 0 ? (
              <p className="text-muted-foreground">No timeline events yet.</p>
            ) : (
              timeline.map((event, index) => (
                <div key={event.id}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">
                        Stage changed to{" "}
                        <span className="capitalize">{event.stage}</span>
                      </p>
                      {event.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.notes}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.changedAt).toLocaleString()}
                    </p>
                  </div>
                  {index < timeline.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
