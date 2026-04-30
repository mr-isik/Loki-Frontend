import { apiClient } from "@/lib/api";
import { PaginatedResponseSchema } from "@/lib/validation";
import {
  createWorkflowRunRequestSchema,
  updateWorkflowRunStatusRequestSchema,
  UpdateWorkflowRunStatusRequest,
  workflowRunResponseSchema,
} from "../validation";

const WORKFLOW_RUNS_PATH = "/workflow-runs";

export const workflowRunsAPI = {
  /**
   * Run a workflow immediately
   * POST /workflows/{id}/run
   */
  async runWorkflow(workflowId: string) {
    const { data, error, success } = await apiClient.post(
      `/workflows/${workflowId}/run`,
      undefined,
      {
        response: workflowRunResponseSchema,
      }
    );

    return { data, error, success };
  },

  /**
   * Start a new workflow run
   * POST /workflows/{workflow_id}/runs
   */
  async createRun(workflowId: string) {
    const { data, error, success } = await apiClient.post(
      `/workflows/${workflowId}/runs`,
      { workflow_id: workflowId },
      {
        request: createWorkflowRunRequestSchema,
        response: workflowRunResponseSchema,
      }
    );

    return { data, error, success };
  },

  /**
   * List workflow runs with pagination
   * GET /workflows/{workflow_id}/runs
   */
  async getRunsByWorkflow(
    workflowId: string,
    page: number = 1,
    pageSize: number = 20
  ) {
    const { data, error, success } = await apiClient.get(
      `/workflows/${workflowId}/runs`,
      { page, page_size: pageSize },
      PaginatedResponseSchema(workflowRunResponseSchema)
    );

    return { data, error, success };
  },

  /**
   * Get a single workflow run by ID
   * GET /workflow-runs/{id}
   */
  async getRunById(runId: string) {
    const { data, error, success } = await apiClient.get(
      `${WORKFLOW_RUNS_PATH}/${runId}`,
      {},
      workflowRunResponseSchema
    );

    return { data, error, success };
  },

  /**
   * Update workflow run status
   * PATCH /workflow-runs/{id}/status
   */
  async updateRunStatus(runId: string, request: UpdateWorkflowRunStatusRequest) {
    const { error, success } = await apiClient.patch(
      `${WORKFLOW_RUNS_PATH}/${runId}/status`,
      request,
      {
        request: updateWorkflowRunStatusRequestSchema,
      }
    );

    return { error, success };
  },
};
