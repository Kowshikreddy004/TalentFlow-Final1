import React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Candidate } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface VirtualizedCandidateListProps {
  candidates: Candidate[]; // <-- should be an array
}

export function VirtualizedCandidateList({
  candidates,
}: VirtualizedCandidateListProps) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: candidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72, // Height of each card
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[70vh] overflow-auto border rounded-md">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const candidate = candidates[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
                padding: "0.5rem",
              }}
            >
              <Link to={`/candidates/${candidate.id}`}>
                <Card className="h-full hover:bg-secondary transition-colors">
                  <CardHeader className="p-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {candidate.email}
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VirtualizedCandidateList;
