export interface Job {
    id: number;
    title: string;
    slug: string;
    status: 'active' | 'archived';
    tags: string;
    order: number;
    createdAt: Date;
}

export type CandidateStage = "applied" | "screen" | "tech" | "offer" | "hired" | "rejected";

export interface Candidate {
    id: number;
    name: string;
    email: string;
    stage: CandidateStage;
    jobId: number;
}

export interface CandidateTimelineEvent {
    id: number;
    candidateId: number;
    stage: CandidateStage;
    changedAt: Date;
    notes?: string;
}

export type QuestionType = 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric';

export interface AssessmentQuestion {
    id: string; // Using string for client-side UUID
    type: QuestionType;
    text: string;
    options?: string; // For single/multi-choice
    isRequired: boolean;
    // For conditional logic
    condition?: {
        questionId: string;
        value: string;
    };
}

export interface AssessmentSection {
    id: string;
    title: string;
    questions: AssessmentQuestion;
}

export interface Assessment {
    id: number;
    jobId: number;
    title: string;
    sections: AssessmentSection;
}

export interface AssessmentResponse {
    id: number;
    candidateId: number;
    assessmentId: number;
    answers: Record<string, any>; // questionId -> answer
    submittedAt: Date;
}