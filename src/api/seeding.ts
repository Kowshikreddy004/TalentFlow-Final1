import { db } from "@/db";
import { faker } from "@faker-js/faker";
import { CandidateStage } from "@/types";

const STAGES: CandidateStage[] = [
  "applied",
  "screen",
  "tech",
  "offer",
  "hired",
  "rejected",
];

export async function seedDatabase() {
  const jobCount = await db.jobs.count();
  if (jobCount > 0) {
    console.log("Database already seeded.");
    return;
  }

  console.log("Seeding database...");

  // ---------- Jobs ----------
  const jobs: any[] = [];
  for (let i = 0; i < 25; i++) {
    jobs.push({
      title: faker.person.jobTitle(),
      slug: faker.helpers
        .slugify(faker.person.jobTitle())
        .toLowerCase(),
      status: i % 5 === 0 ? "archived" : "active",
      tags: [faker.hacker.adjective(), faker.hacker.noun()],
      order: i,
      createdAt: faker.date.past(),
    });
  }
  const jobIds = await db.jobs.bulkAdd(jobs, { allKeys: true });

  // ---------- Candidates ----------
  const candidates: any[] = [];
  for (let i = 0; i < 1000; i++) {
    candidates.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      stage: faker.helpers.arrayElement(STAGES),
      jobId: faker.helpers.arrayElement(jobIds as number[]),
    });
  }
  await db.candidates.bulkAdd(candidates);

  // ---------- Assessments ----------
  const assessments: any[] = [];
  for (let i = 0; i < 3; i++) {
    assessments.push({
      jobId: jobIds[i] as number,
      title: `Assessment for ${jobs[i].title}`,
      sections: [
        {
          title: "Section 1",
          questions: Array.from({ length: 3 }).map(() => ({
            text: faker.lorem.sentence(),
            isRequired: true,
          })),
        },
      ],
    });
  }
  await db.assessments.bulkAdd(assessments);

  console.log("Database seeding complete.");
}
