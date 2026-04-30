"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNodeRunLogs } from "@/features/node-run-logs/hooks/useQueries";
import { NodeRunLogResponse } from "@/features/node-run-logs/validation";
import { useWorkflowRun } from "@/features/workflow-runs/hooks/useQueries";
import { ArrowLeft, CheckCircle2, Clock, PlayCircle, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function RunDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  const workflowId = params.workflowId as string;
  const runId = params.runId as string;

  const { data: run, isLoading: isRunLoading } = useWorkflowRun(runId);
  const { data: logsData, isLoading: isLogsLoading } = useNodeRunLogs(runId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "running":
        return <PlayCircle className="h-5 w-5 text-blue-500 animate-pulse" />;
      case "skipped":
        return <CheckCircle2 className="h-5 w-5 text-gray-400" />;
      case "pending":
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "failed":
        return "destructive";
      case "running":
        return "secondary";
      case "skipped":
        return "outline";
      case "pending":
      default:
        return "outline";
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (start?: string | null, end?: string | null) => {
    if (!start || !end) return "-";
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationMs = endTime - startTime;
    return `${(durationMs / 1000).toFixed(2)}s`;
  };

  const handleBackToRuns = () => {
    router.push(`/workspace/${workspaceId}/workflow/${workflowId}/runs`);
  };

  if (isRunLoading || isLogsLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-40 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const logs = logsData?.data || [];

  return (
    <div className="flex-1 p-6 bg-muted/20 min-h-full">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 border-b pb-4">
          <Button variant="ghost" size="icon" onClick={handleBackToRuns}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Run Details
            </h1>
            <p className="text-sm text-muted-foreground font-mono mt-1">
              {runId}
            </p>
          </div>
        </div>

        {/* Run Summary Card */}
        {run && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {getStatusIcon(run.status)}
                Execution Summary
                <Badge variant={getStatusBadgeVariant(run.status) as any} className="ml-auto">
                  {run.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Started At</p>
                  <p className="font-medium">{formatDate(run.started_at)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Finished At</p>
                  <p className="font-medium">{formatDate(run.finished_at)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Total Duration</p>
                  <p className="font-medium">{formatDuration(run.started_at, run.finished_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Node Logs List */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
            Node Execution Logs
            <Badge variant="outline" className="font-normal text-muted-foreground">
              {logs.length} Nodes
            </Badge>
          </h2>
          
          {logs.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <p className="text-muted-foreground text-sm">
                No node logs available for this run.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {logs.map((log: NodeRunLogResponse) => (
                <Card key={log.id} className="overflow-hidden">
                  <div className={`h-1 w-full ${log.status === 'failed' ? 'bg-red-500' : log.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <CardContent className="p-0">
                    <div className="p-4 sm:p-6 border-b border-border/50 bg-muted/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(log.status)}
                        <div>
                          <div className="font-medium text-sm">Node ID</div>
                          <div className="text-xs text-muted-foreground font-mono">{log.node_id}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div className="hidden sm:block">
                          <div className="text-xs text-muted-foreground">Duration</div>
                          <div className="text-sm font-medium">{formatDuration(log.started_at, log.finished_at)}</div>
                        </div>
                        <Badge variant={getStatusBadgeVariant(log.status) as any}>
                          {log.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Log Outputs Section */}
                    {(log.log_output || log.error_msg) && (
                      <div className="p-4 sm:p-6 bg-background space-y-4">
                        {log.error_msg && (
                          <div className="space-y-2">
                            <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Error</span>
                            <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm font-mono whitespace-pre-wrap border border-red-200 dark:border-red-900/50">
                              {log.error_msg}
                            </div>
                          </div>
                        )}
                        
                        {log.log_output && (
                          <div className="space-y-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Output</span>
                            <div className="bg-muted text-muted-foreground p-3 rounded-md text-sm font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                              {log.log_output}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
