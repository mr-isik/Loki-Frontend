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
import { useNodeRunLogs } from "@/features/node-run-logs/hooks/useQueries";
import { useWorkflowRuns } from "@/features/workflow-runs/hooks/useQueries";
import { useWorkflows } from "@/features/workflow/hooks/useQueries";
import { FileText } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type LogStatus = "pending" | "running" | "completed" | "failed" | "skipped";

const logStatusVariant: Record<
  LogStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  completed: "default",
  running: "secondary",
  failed: "destructive",
  skipped: "outline",
  pending: "outline",
};

export default function LogsPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const [selectedWorkflowId, setSelectedWorkflowId] = useState("");
  const [selectedRunId, setSelectedRunId] = useState("");

  const { data: workflows, isLoading: loadingWorkflows } =
    useWorkflows(workspaceId);
  const { data: runsData, isLoading: loadingRuns } = useWorkflowRuns(
    selectedWorkflowId,
    1,
    50,
  );
  const { data: logsData, isLoading: loadingLogs } = useNodeRunLogs(
    selectedRunId,
    1,
    100,
  );

  const runs = runsData?.data ?? [];
  const logs = logsData?.data ?? [];

  useEffect(() => {
    if (workflows && workflows.length > 0 && !selectedWorkflowId) {
      setSelectedWorkflowId(workflows[0].id);
    }
  }, [workflows, selectedWorkflowId]);

  useEffect(() => {
    if (runs && runs.length > 0 && !selectedRunId) {
      setSelectedRunId(runs[0].id);
    }
  }, [runs, selectedRunId]);

  const handleWorkflowChange = (value: string) => {
    setSelectedWorkflowId(value);
    setSelectedRunId("");
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Node Logs</h1>
          <p className="text-muted-foreground mt-1">
            Detailed execution logs for workflow runs
          </p>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Workflow</label>
            {loadingWorkflows ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={selectedWorkflowId}
                onValueChange={handleWorkflowChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select workflow" />
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

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Run</label>
            <Select
              value={selectedRunId}
              onValueChange={setSelectedRunId}
              disabled={!selectedWorkflowId || loadingRuns}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !selectedWorkflowId ? "Select workflow first" : "Select run"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {runs.map((run) => (
                  <SelectItem key={run.id} value={run.id}>
                    {new Date(run.created_at).toLocaleString()} — {run.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Logs Table */}
        {selectedRunId ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Node ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Output</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingLogs ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {log.node_id}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            logStatusVariant[log.status as LogStatus] ??
                            "outline"
                          }
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm">
                        {log.log_output || "-"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-destructive">
                        {log.error_msg || "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No logs found for this run.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed rounded-md">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Select a Workflow and Run</h3>
            <p className="text-sm text-muted-foreground">
              Choose a workflow and run above to view node logs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
