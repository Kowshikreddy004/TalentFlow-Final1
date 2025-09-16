import { http, HttpResponse, delay } from "msw";
import { db } from "../db";
import { Job } from "@/types";

// Simulate network latency and occasional write failures
const simulateLatency = () => delay(Math.random() * 1000 + 200); // 200–1200 ms
const simulateWriteError = () => Math.random() < 0.07; // 7% chance of failure

export const handlers = [
  // ──────────────────────────────
  // JOBS
  // ──────────────────────────────
  http.get("/jobs", async () => {
    await simulateLatency();
    const jobs = await db.jobs.orderBy("order").toArray();
    return HttpResponse.json(jobs);
  }),

  http.put("/jobs/reorder", async ({ request }) => {
    await simulateLatency();
    if (simulateWriteError()) return new HttpResponse(null, { status: 500 });

    const { activeIndex, overIndex } = (await request.json()) as {
      activeIndex: number;
      overIndex: number;
    };

    const jobs = await db.jobs.orderBy("order").toArray();
    const [movedItem] = jobs.splice(activeIndex, 1);
    jobs.splice(overIndex, 0, movedItem);

    const updates = jobs.map((job, index) =>
      db.jobs.update(job.id, { order: index })
    );
    await Promise.all(updates);

    return HttpResponse.json({ success: true });
  }),

  // ──────────────────────────────
  // CANDIDATES
  // ──────────────────────────────
  http.get("/candidates", async () => {
    await simulateLatency();
    const candidates = await db.candidates.toArray();
    return HttpResponse.json(candidates);
  }),

  http.patch("/candidates/:id", async ({ request, params }) => {
    await simulateLatency();
    if (simulateWriteError()) return new HttpResponse(null, { status: 500 });

    const { id } = params;
    const updates = (await request.json()) as { stage: string; notes?: string };

    await db.transaction("rw", db.candidates, db.candidateTimeline, async () => {
      await db.candidates.update(Number(id), { stage: updates.stage });
      await db.candidateTimeline.add({
        candidateId: Number(id),
        stage: updates.stage,
        changedAt: new Date(),
        notes: updates.notes,
      } as any);
    });

    return HttpResponse.json({ success: true });
  }),

  http.get("/candidates/:id/timeline", async ({ params }) => {
    await simulateLatency();
    const { id } = params;
    const timeline = await db.candidateTimeline
      .where("candidateId")
      .equals(Number(id))
      .sortBy("changedAt");
    return HttpResponse.json(timeline.reverse());
  }),

  // ──────────────────────────────
  // ASSESSMENTS
  // ──────────────────────────────
  http.get("/assessments/:jobId", async ({ params }) => {
    await simulateLatency();
    const { jobId } = params;
    const assessment = await db.assessments
      .where("jobId")
      .equals(Number(jobId))
      .first();
    return HttpResponse.json(assessment);
  }),

  http.put("/assessments/:jobId", async ({ request, params }) => {
    await simulateLatency();
    if (simulateWriteError()) return new HttpResponse(null, { status: 500 });

    const { jobId } = params;
    const assessmentData = (await request.json()) as any;

    const existing = await db.assessments
      .where("jobId")
      .equals(Number(jobId))
      .first();

    if (existing) {
      await db.assessments.update(existing.id, assessmentData);
    } else {
      await db.assessments.add({ ...assessmentData, jobId: Number(jobId) });
    }

    return HttpResponse.json({ success: true });
  }),
];
