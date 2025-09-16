import { z } from 'zod';

export const jobSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
    tags: z.string().optional(),
});

export type JobFormData = z.infer<typeof jobSchema>;