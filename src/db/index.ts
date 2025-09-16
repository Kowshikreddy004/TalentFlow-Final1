import Dexie, { type Table } from 'dexie';
import { Job, Candidate, CandidateTimelineEvent, Assessment, AssessmentResponse } from '@/types';

export class TalentFlowDB extends Dexie {
    jobs!: Table<Job, number>;
    candidates!: Table<Candidate, number>;
    candidateTimeline!: Table<CandidateTimelineEvent, number>;
    assessments!: Table<Assessment, number>;
    assessmentResponses!: Table<AssessmentResponse, number>;

    constructor() {
        super('talentflowDB');
        this.version(1).stores({
            jobs: '++id, title, status, order',
            candidates: '++id, name, email, stage, jobId',
            candidateTimeline: '++id, candidateId, changedAt',
            assessments: '++id, jobId',
            assessmentResponses: '++id, candidateId, assessmentId',
        });
    }
}

export const db = new TalentFlowDB();