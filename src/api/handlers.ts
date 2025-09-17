import { http, HttpResponse, delay } from "msw";
import { db } from "../db";
import { Job } from "@/types";

// Simulate network latency and occasional write failures
const simulateLatency = () => delay(Math.random() * 1000 + 200); // 200–1200 ms
const simulateWriteError = () => false;

async function handleReorder({ request }: { request: Request }) {
  await simulateLatency();
  if (simulateWriteError()) return new HttpResponse(null, { status: 500 });

  const body = (await request.json()) as any;

  const jobs = await db.jobs.orderBy("order").toArray();

  let activeIndex: number | undefined;
  let overIndex: number | undefined;

  if (typeof body.activeIndex === "number" && typeof body.overIndex === "number") {
    activeIndex = body.activeIndex;
    overIndex = body.overIndex;
  } else if (typeof body.activeId === "number" && typeof body.overId === "number") {
    activeIndex = jobs.findIndex((j) => j.id === body.activeId);
    overIndex = jobs.findIndex((j) => j.id === body.overId);
  }

  if (activeIndex === undefined || overIndex === undefined || activeIndex < 0 || overIndex < 0) {
    return new HttpResponse(JSON.stringify({ error: "Invalid reorder payload" }), { status: 400 });
  }

  const [movedItem] = jobs.splice(activeIndex, 1);
  jobs.splice(overIndex, 0, movedItem);

  const updates = jobs.map((job, index) => db.jobs.update(job.id, { order: index }));
  await Promise.all(updates);

  return HttpResponse.json({ success: true });
}

export const handlers = [
  // ──────────────────────────────
  // JOBS
  // ──────────────────────────────
  http.post("/jobs", async ({ request }) => {
    await simulateLatency();
    if (simulateWriteError()) return new HttpResponse(null, { status: 500 });

    const body = (await request.json()) as Partial<Job> & { title: string; slug: string; tags?: string[] };
    const existing = await db.jobs.orderBy("order").toArray();
    const order = existing.length;
    const job: any = {
      title: body.title,
      slug: body.slug,
      status: (body as any).status ?? "active",
      tags: body.tags ?? [],
      order,
      createdAt: new Date(),
    };
    const id = await db.jobs.add(job);
    return HttpResponse.json({ id, ...job });
  }),

  http.patch("/jobs/:id", async ({ request, params }) => {
    await simulateLatency();
    if (simulateWriteError()) return new HttpResponse(null, { status: 500 });

    const { id } = params;
    const updates = (await request.json()) as Partial<Job>;
    await db.jobs.update(Number(id), updates as any);
    return HttpResponse.json({ success: true });
  }),

  http.delete("/jobs/:id", async ({ params }) => {
    await simulateLatency();
    if (simulateWriteError()) return new HttpResponse(null, { status: 500 });
    const { id } = params;
    await db.jobs.delete(Number(id));
    return HttpResponse.json({ success: true });
  }),

  http.get("/jobs", async ({ request }) => {
    await simulateLatency();
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "all";
    const title = (url.searchParams.get("title") || "").toLowerCase();

    let jobs = await db.jobs.orderBy("order").toArray();

    if (status !== "all") {
      jobs = jobs.filter((j) => j.status === status);
    }

    if (title) {
      jobs = jobs.filter((j) => j.title.toLowerCase().includes(title));
    }

    return HttpResponse.json(jobs);
  }),

  // Backward-compatible: support both index-based and id-based reorders and both PUT/PATCH
  http.put("/jobs/reorder", async (ctx) => handleReorder(ctx)),
  http.patch("/jobs/reorder", async (ctx) => handleReorder(ctx)),

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
