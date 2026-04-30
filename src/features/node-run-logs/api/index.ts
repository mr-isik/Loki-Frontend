import { apiClient } from "@/lib/api";
import { PaginatedResponseSchema } from "@/lib/validation";
import {
  CreateNodeRunLogRequest,
  createNodeRunLogRequestSchema,
  nodeRunLogResponseSchema,
  UpdateNodeRunLogRequest,
  updateNodeRunLogRequestSchema,
} from "../validation";

const NODE_RUN_LOGS_PATH = "/node-run-logs";

export const nodeRunLogsAPI = {
  /**
   * Create a new node run log
   * POST /node-run-logs
   */
  async createLog(request: CreateNodeRunLogRequest) {
    const { error, success } = await apiClient.post(
      NODE_RUN_LOGS_PATH,
      request,
      {
        request: createNodeRunLogRequestSchema,
      }
    );

    return { error, success };
  },

  /**
   * Get node run log by ID
   * GET /node-run-logs/{id}
   */
  async getLogById(logId: string) {
    const { data, error, success } = await apiClient.get(
      `${NODE_RUN_LOGS_PATH}/${logId}`,
      {},
      nodeRunLogResponseSchema
    );

    return { data, error, success };
  },

  /**
   * Update node run log
   * PATCH /node-run-logs/{id}
   */
  async updateLog(logId: string, request: UpdateNodeRunLogRequest) {
    const { error, success } = await apiClient.patch(
      `${NODE_RUN_LOGS_PATH}/${logId}`,
      request,
      {
        request: updateNodeRunLogRequestSchema,
      }
    );

    return { error, success };
  },

  /**
   * Get node run logs by workflow run ID (paginated)
   * GET /workflow-runs/{run_id}/logs
   */
  async getLogsByRunId(
    runId: string,
    page: number = 1,
    pageSize: number = 20
  ) {
    const { data, error, success } = await apiClient.get(
      `/workflow-runs/${runId}/logs`,
      { page, page_size: pageSize },
      PaginatedResponseSchema(nodeRunLogResponseSchema)
    );

    return { data, error, success };
  },
};
