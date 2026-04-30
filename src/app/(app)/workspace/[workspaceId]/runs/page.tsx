"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWorkflowRuns } from "@/features/workflow-runs/hooks/useQueries";
import { useWorkflows } from "@/features/workflow/hooks/useQueries";
import { PlayCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

type RunStatus = "pending" | "running" | "completed" | "failed" | "cancelled";

const statusVariant: Record<RunStatus, "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  running: "secondary",
  failed: "destructive",
  cancelled: "outline",
  pending: "outline",
};

export default function RunsPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const [selectedWorkflowId, setSelectedWorkflowId] = useState("");

  const { data: workflows, isLoading: loadingWorkflows } = useWorkflows(workspaceId);
  const { data: runsData, isLoading: loadingRuns } = useWorkflowRuns(selectedWorkflowId, 1, 50);

  useEffect(() => {
    if (workflows && workflows.length > 0 && !selectedWorkflowId) {
      setSelectedWorkflowId(workflows[0].id);
    }
  }, [workflows, selectedWorkflowId]);

  const runs = runsData?.data ?? [];

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Workflow Runs</h1>
          <p className="text-muted-foreground mt-1">View execution history for your workflows</p>
        </div>

        <div className="max-w-sm">
          {loadingWorkflows ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={selectedWorkflowId} onValueChange={setSelectedWorkflowId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a workflow to view runs" />
              </SelectTrigger>
              <SelectContent>
                {workflows?.map((wf) => (
                  <SelectItem key={wf.id} value={wf.id}>
                    {wf.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {selectedWorkflowId ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Run ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Started At</TableHead>
                  <TableHead>Finished At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingRuns ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 4 }).map((__, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : runs.length > 0 ? (
                  runs.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell className="font-mono text-xs">{run.id}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[run.status as RunStatus] ?? "outline"}>
                          {run.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{run.started_at ? new Date(run.started_at).toLocaleString() : "-"}</TableCell>
                      <TableCell>{run.finished_at ? new Date(run.finished_at).toLocaleString() : "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No runs found for this workflow.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed rounded-md">
            <PlayCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Select a Workflow</h3>
            <p className="text-sm text-muted-foreground">Choose a workflow above to view its execution history.</p>
          </div>
        )}
      </div>
    </div>
  );
}
