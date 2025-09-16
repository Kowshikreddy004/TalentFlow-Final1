import { z } from 'zod';

const questionSchema = z.object({
    id: z.string(),
    type: z.enum(['single-choice', 'multi-choice', 'short-text', 'long-text', 'numeric']),
    text: z.string().min(1, "Question text is required"),
    options: z.array(z.string()).optional(),
    isRequired: z.boolean(),
    condition: z.object({
        questionId: z.string(),
        value: z.string(),
    }).optional(),
});

const sectionSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Section title is required"),
    questions: z.array(questionSchema),
});

export const assessmentSchema = z.object({
    title: z.string().min(1, "Assessment title is required"),
    sections: z.array(sectionSchema).min(1, "At least one section is required"),
}).superRefine((data, ctx) => {
    // Example of a superRefine for conditional logic validation
    const allQuestionIds = new Set(data.sections.flatMap(s => s.questions.map(q => q.id)));
    data.sections.forEach((section, sectionIndex) => {
        section.questions.forEach((question, questionIndex) => {
            if (question.condition &&!allQuestionIds.has(question.condition.questionId)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Conditional question points to a non-existent question ID.`,
                    path: ['sections', sectionIndex, 'questions', questionIndex, 'condition', 'questionId'],
                });
            }
        });
    });
});

export type AssessmentFormData = z.infer<typeof assessmentSchema>;