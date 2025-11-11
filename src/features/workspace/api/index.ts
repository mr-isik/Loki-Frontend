import { apiClient } from "@/lib/api";
import { PaginatedResponseSchema } from "@/lib/validation";
import { WorkspaceResponseSchema } from "../validation";

export const workspaceAPI = {
  async CreateWorkspace(request: { name: string }) {
    const { error, success } = await apiClient.post(`/workspaces`, request);

    return { error, success };
  },

  async GetMyWorkSpaces(page: number = 1, pageSize: number = 100) {
    const { data, error, success } = await apiClient.get(
      `/workspaces/my`,
      { page, page_size: pageSize },
      PaginatedResponseSchema(WorkspaceResponseSchema)
    );

    return { data, error, success };
  },

  async GetWorkspaceById(workspaceId: string) {
    const { data, error, success } = await apiClient.get(
      `/workspaces/${workspaceId}`,
      {}
    );

    return { data, error, success };
  },

  async UpdateWorkspace(workspaceId: string, request: { name?: string }) {
    const { error, success } = await apiClient.put(
      `/workspaces/${workspaceId}`,
      request
    );

    return { error, success };
  },

  async DeleteWorkspace(workspaceId: string) {
    const { error, success } = await apiClient.delete(
      `/workspaces/${workspaceId}`
    );

    return { error, success };
  },
};
