import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@/providers/AuthContext";
import { useCandidates } from "@/features/candidate/hooks/useCandidates";

export function FakeLogin() {
  const { role, candidateId, loginAsRecruiter, loginAsCandidate, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { data: candidates = [] } = useCandidates();
  const [selected, setSelected] = useState<string>(candidateId ? String(candidateId) : "");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {role === "guest" ? (
          <Button size="sm" variant="default">Login</Button>
        ) : (
          <Button size="sm" variant="secondary">{role === "recruiter" ? "Recruiter" : "Candidate"}</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fake Login</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => { loginAsRecruiter(); setOpen(false); }} variant="default">Login as Recruiter</Button>
            <Button onClick={() => { logout(); setOpen(false); }} variant="ghost">Logout</Button>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Or choose a candidate</p>
            <Select value={selected} onValueChange={(v) => setSelected(v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select candidate" /></SelectTrigger>
              <SelectContent>
                {candidates.slice(0, 50).map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name} — {c.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                if (selected) {
                  loginAsCandidate(Number(selected));
                  setOpen(false);
                }
              }}
            >Login as Candidate</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
