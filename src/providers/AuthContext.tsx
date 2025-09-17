import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "guest" | "recruiter" | "candidate";

interface AuthState {
  role: Role;
  candidateId: number | null;
  loginAsRecruiter: () => void;
  loginAsCandidate: (candidateId: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("guest");
  const [candidateId, setCandidateId] = useState<number | null>(null);

  // Persist in localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("authState");
      if (raw) {
        const parsed = JSON.parse(raw);
        setRole(parsed.role ?? "guest");
        setCandidateId(parsed.candidateId ?? null);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "authState",
        JSON.stringify({ role, candidateId })
      );
    } catch {}
  }, [role, candidateId]);

  const value = useMemo<AuthState>(
    () => ({
      role,
      candidateId,
      loginAsRecruiter: () => {
        setRole("recruiter");
        setCandidateId(null);
      },
      loginAsCandidate: (id: number) => {
        setRole("candidate");
        setCandidateId(id);
      },
      logout: () => {
        setRole("guest");
        setCandidateId(null);
      },
    }),
    [role, candidateId]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
