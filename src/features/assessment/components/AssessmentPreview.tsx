import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AssessmentSection } from "@/types";

interface AssessmentPreviewProps {
  sections: AssessmentSection[];
}

export function AssessmentPreview({ sections }: AssessmentPreviewProps) {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section, index) => (
          <div key={section.id}>
            <h3 className="text-lg font-semibold">
              {section.title || `Section ${index + 1}`}
            </h3>
            <Separator className="my-2" />
            <div className="space-y-4">
              {section.questions?.map((q, qIndex) => (
                <div key={q.id}>
                  <Label>{q.text || `Question ${qIndex + 1}`}</Label>
                  <Input disabled placeholder={`Answer for ${q.type}`} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
