/**
 * React Query hooks for workspace operations
 * Following Single Responsibility Principle
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workspaceAPI } from "../api";

// Query Keys
export const workspaceKeys = {
  all: ["workspaces"] as const,
  detail: (id: string) => ["workspaces", id] as const,
};

/**
 * Fetch all workspaces
 */
export const useWorkspaces = () => {
  return useQuery({
    queryKey: workspaceKeys.all,
    queryFn: async () => {
      const { data, success, error } = await workspaceAPI.GetMyWorkSpaces();
      if (!success || !data) {
        throw new Error(error?.message || "Failed to fetch workspaces");
      }
      return data;
    },
  });
};

/**
 * Fetch single workspace by ID
 */
export const useWorkspace = (workspaceId: string) => {
  return useQuery({
    queryKey: workspaceKeys.detail(workspaceId),
    queryFn: async () => {
      const { data, success, error } = await workspaceAPI.GetWorkspaceById(
        workspaceId
      );
      if (!success || !data) {
        throw new Error(error?.message || "Failed to fetch workspace");
      }
      return data;
    },
    enabled: !!workspaceId,
  });
};

/**
 * Create new workspace
 */
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const { error } = await workspaceAPI.CreateWorkspace(data);
      if (error) {
        throw new Error(error?.message || "Failed to create workspace");
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
};

/**
 * Update workspace
 */
export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: { name?: string };
    }) => {
      const { error } = await workspaceAPI.UpdateWorkspace(workspaceId, data);
      if (error) {
        throw new Error(error?.message || "Failed to update workspace");
      }
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.detail(variables.workspaceId),
      });
    },
  });
};

/**
 * Delete workspace
 */
export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const { error } = await workspaceAPI.DeleteWorkspace(workspaceId);
      if (error) {
        throw new Error(error?.message || "Failed to delete workspace");
      }
      return workspaceId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
};
