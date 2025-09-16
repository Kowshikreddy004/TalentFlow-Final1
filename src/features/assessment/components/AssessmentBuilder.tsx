import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assessmentSchema, AssessmentFormData } from "../types/assessment.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { AssessmentPreview } from "./AssessmentPreview";
import { useParams } from "react-router-dom";
import { useAssessment, useSaveAssessment } from "../hooks/useAssessment";
import { useEffect } from "react";

export function AssessmentBuilder() {
  const { jobId } = useParams();
  const { data: assessment, isLoading } = useAssessment(Number(jobId));
  const saveMutation = useSaveAssessment();

  const { control, register, handleSubmit, watch, reset } = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: "",
      sections: [
        {
          id: crypto.randomUUID(),
          title: "Section 1",
          questions: [],
        },
      ],
    },
  });

  useEffect(() => {
    if (assessment) {
      reset(assessment);
    }
  }, [assessment, reset]);

  const {
    fields: sections,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  const watchedSections = watch("sections");

  const onSubmit = (data: AssessmentFormData) => {
    saveMutation.mutate({ jobId: Number(jobId), ...data });
  };

  if (isLoading) return <div>Loading assessment builder...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Assessment Builder</h2>
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : "Save Assessment"}
          </Button>
        </div>

        <div>
          <Label htmlFor="title">Assessment Title</Label>
          <Input id="title" {...register("title")} />
        </div>

        {sections.map((section, sectionIndex) => (
          <Card key={section.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <Input
                {...register(`sections.${sectionIndex}.title`)}
                className="text-lg font-bold border-none shadow-none p-0 h-auto"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSection(sectionIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <QuestionList sectionIndex={sectionIndex} control={control} register={register} />
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            appendSection({
              id: crypto.randomUUID(),
              title: `Section ${sections.length + 1}`,
              questions: [],
            })
          }
        >
          Add Section
        </Button>
      </div>

      <div>
        <AssessmentPreview sections={watchedSections} />
      </div>
    </form>
  );
}

function QuestionList({ sectionIndex, control, register }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions`,
  });

  return (
    <div className="space-y-4">
      {fields.map((question, questionIndex) => (
        <div key={question.id} className="p-4 border rounded-md space-y-3">
          <div className="flex justify-between items-center">
            <Label>Question {questionIndex + 1}</Label>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(questionIndex)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <Input
            placeholder="Question text..."
            {...register(`sections.${sectionIndex}.questions.${questionIndex}.text`)}
          />

          <Select defaultValue={(question as any).type}>
            <SelectTrigger>
              <SelectValue placeholder="Question Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short-text">Short Text</SelectItem>
              <SelectItem value="long-text">Long Text</SelectItem>
              <SelectItem value="single-choice">Single Choice</SelectItem>
              <SelectItem value="multi-choice">Multi Choice</SelectItem>
              <SelectItem value="numeric">Numeric</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          append({
            id: crypto.randomUUID(),
            text: "",
            type: "short-text",
            isRequired: false,
          })
        }
      >
        Add Question
      </Button>
    </div>
  );
}
