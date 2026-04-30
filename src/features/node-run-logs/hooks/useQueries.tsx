/**
 * React Query hooks for node run log operations
 * Following Single Responsibility Principle
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { nodeRunLogsAPI } from "../api";
import type {
  CreateNodeRunLogRequest,
  UpdateNodeRunLogRequest,
} from "../validation";

// Query Keys
export const nodeRunLogKeys = {
  all: ["node-run-logs"] as const,
  byRun: (runId: string) => ["node-run-logs", "run", runId] as const,
  detail: (logId: string) => ["node-run-logs", "detail", logId] as const,
};

/**
 * Fetch node run logs by workflow run ID (paginated)
 */
export const useNodeRunLogs = (
  runId: string,
  page: number = 1,
  pageSize: number = 20
) => {
  return useQuery({
    queryKey: [...nodeRunLogKeys.byRun(runId), page, pageSize],
    queryFn: async () => {
      const { data, success, error } = await nodeRunLogsAPI.getLogsByRunId(
        runId,
        page,
        pageSize
      );
      if (!success || !data) {
        throw new Error(error?.message || "Failed to fetch node run logs");
      }
      return data;
    },
    enabled: !!runId,
    staleTime: 10_000, // 10 seconds — logs change during execution
  });
};

/**
 * Fetch single node run log by ID
 */
export const useNodeRunLog = (logId: string) => {
  return useQuery({
    queryKey: nodeRunLogKeys.detail(logId),
    queryFn: async () => {
      const { data, success, error } =
        await nodeRunLogsAPI.getLogById(logId);
      if (!success || !data) {
        throw new Error(error?.message || "Failed to fetch node run log");
      }
      return data;
    },
    enabled: !!logId,
    staleTime: 10_000,
  });
};

/**
 * Create node run log
 */
export const useCreateNodeRunLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateNodeRunLogRequest) => {
      const { success, error } = await nodeRunLogsAPI.createLog(request);
      if (!success) {
        throw new Error(error?.message || "Failed to create node run log");
      }
      return request.run_id;
    },
    onSuccess: (runId) => {
      queryClient.invalidateQueries({
        queryKey: nodeRunLogKeys.byRun(runId),
      });
    },
  });
};

/**
 * Update node run log
 */
export const useUpdateNodeRunLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      logId,
      data,
    }: {
      logId: string;
      runId: string;
      data: UpdateNodeRunLogRequest;
    }) => {
      const { success, error } = await nodeRunLogsAPI.updateLog(logId, data);
      if (!success) {
        throw new Error(error?.message || "Failed to update node run log");
      }
      return logId;
    },
    onSuccess: (logId, variables) => {
      queryClient.invalidateQueries({
        queryKey: nodeRunLogKeys.detail(logId),
      });
      queryClient.invalidateQueries({
        queryKey: nodeRunLogKeys.byRun(variables.runId),
      });
    },
  });
};
