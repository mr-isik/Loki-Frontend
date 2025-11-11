/**
 * React Query hooks for workspace operations
 * Following Single Responsibility Principle
 */

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { workspaceAPI } from "../api";

// Query Keys
export const workspaceKeys = {
  all: ["workspaces"] as const,
  detail: (id: string) => ["workspaces", id] as const,
};

/**
 * Fetch all workspaces
 * Returns paginated response with workspaces data
 * For simple list usage - use this for backwards compatibility
 */
export const useWorkspaces = (page: number = 1, pageSize: number = 100) => {
  return useQuery({
    queryKey: [...workspaceKeys.all, page, pageSize],
    queryFn: async () => {
      const { data, success, error } = await workspaceAPI.GetMyWorkSpaces(
        page,
        pageSize
      );
      if (!success || !data) {
        throw new Error(error?.message || "Failed to fetch workspaces");
      }
      // Extract workspaces array from paginated response
      return data.data;
    },
  });
};

/**
 * Fetch all workspaces with pagination metadata
 * Use this when you need total count, page info, etc.
 */
export const useWorkspacesPaginated = (
  page: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: [...workspaceKeys.all, "paginated", page, pageSize],
    queryFn: async () => {
      const { data, success, error } = await workspaceAPI.GetMyWorkSpaces(
        page,
        pageSize
      );
      if (!success || !data) {
        throw new Error(error?.message || "Failed to fetch workspaces");
      }
      // Return full paginated response
      return data;
    },
  });
};

/**
 * Fetch workspaces with infinite scroll support
 * Use this for workspace switcher and lists with load more functionality
 */
export const useWorkspacesInfinite = (pageSize: number = 10) => {
  return useInfiniteQuery({
    queryKey: [...workspaceKeys.all, "infinite", pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      const { data, success, error } = await workspaceAPI.GetMyWorkSpaces(
        pageParam,
        pageSize
      );
      if (!success || !data) {
        throw new Error(error?.message || "Failed to fetch workspaces");
      }
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
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
