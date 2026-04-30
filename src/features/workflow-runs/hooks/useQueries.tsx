/**
 * React Query hooks for workflow run operations
 * Following Single Responsibility Principle
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workflowRunsAPI } from "../api";
import type { UpdateWorkflowRunStatusRequest } from "../validation";

// Query Keys
export const workflowRunKeys = {
  all: ["workflow-runs"] as const,
  byWorkflow: (workflowId: string) =>
    ["workflow-runs", "workflow", workflowId] as const,
  detail: (runId: string) => ["workflow-runs", "detail", runId] as const,
};

/**
 * Fetch workflow runs with pagination
 */
export const useWorkflowRuns = (
  workflowId: string,
  page: number = 1,
  pageSize: number = 20
) => {
  return useQuery({
    queryKey: [...workflowRunKeys.byWorkflow(workflowId), page, pageSize],
    queryFn: async () => {
      const { data, success, error } =
        await workflowRunsAPI.getRunsByWorkflow(workflowId, page, pageSize);
      if (!success || !data) {
        throw new Error(error?.message || "Failed to fetch workflow runs");
      }
      return data;
    },
    enabled: !!workflowId,
    staleTime: 30_000, // 30 seconds — runs change frequently
  });
};

/**
 * Fetch single workflow run by ID
 */
export const useWorkflowRun = (runId: string) => {
  return useQuery({
    queryKey: workflowRunKeys.detail(runId),
    queryFn: async () => {
      const { data, success, error } =
        await workflowRunsAPI.getRunById(runId);
      if (!success || !data) {
        throw new Error(error?.message || "Failed to fetch workflow run");
      }
      return data;
    },
    enabled: !!runId,
    staleTime: 10_000, // 10 seconds — active runs need frequent updates
  });
};

/**
 * Run a workflow immediately
 * POST /workflows/{id}/run
 */
export const useRunWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workflowId: string) => {
      const { data, success, error } =
        await workflowRunsAPI.runWorkflow(workflowId);
      if (!success || !data) {
        throw new Error(error?.message || "Failed to run workflow");
      }
      return { ...data, workflowId };
    },
    onSuccess: (data) => {
      // Invalidate runs list for this workflow
      queryClient.invalidateQueries({
        queryKey: workflowRunKeys.byWorkflow(data.workflowId),
      });
    },
  });
};

/**
 * Create a new workflow run
 * POST /workflows/{workflow_id}/runs
 */
export const useCreateWorkflowRun = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workflowId: string) => {
      const { data, success, error } =
        await workflowRunsAPI.createRun(workflowId);
      if (!success || !data) {
        throw new Error(error?.message || "Failed to create workflow run");
      }
      return { ...data, workflowId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: workflowRunKeys.byWorkflow(data.workflowId),
      });
    },
  });
};

/**
 * Update workflow run status
 * PATCH /workflow-runs/{id}/status
 */
export const useUpdateWorkflowRunStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      runId,
      status,
    }: {
      runId: string;
      workflowId: string;
      status: UpdateWorkflowRunStatusRequest;
    }) => {
      const { success, error } = await workflowRunsAPI.updateRunStatus(
        runId,
        status
      );
      if (!success) {
        throw new Error(
          error?.message || "Failed to update workflow run status"
        );
      }
      return runId;
    },
    onSuccess: (runId, variables) => {
      queryClient.invalidateQueries({
        queryKey: workflowRunKeys.detail(runId),
      });
      queryClient.invalidateQueries({
        queryKey: workflowRunKeys.byWorkflow(variables.workflowId),
      });
    },
  });
};
