import { apiClient } from "@/lib/api";
import { WorkspacesResponseSchema } from "../validation";

export const workspaceAPI = {
  async CreateWorkspace(request: { name: string }) {
    const { error, success } = await apiClient.post(`/workspaces`, request);

    return { error, success };
  },

  async GetMyWorkSpaces() {
    const { data, error, success } = await apiClient.get(
      `/workspaces/my`,
      {},
      WorkspacesResponseSchema
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
