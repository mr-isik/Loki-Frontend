import z from "zod";

// Status enum
export const workflowRunStatusEnum = z.enum([
  "pending",
  "running",
  "completed",
  "failed",
  "cancelled",
]);

// Response schema
export const workflowRunResponseSchema = z.object({
  id: z.string(),
  workflow_id: z.string(),
  status: workflowRunStatusEnum,
  started_at: z.string().nullable().optional(),
  finished_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Request schemas
export const createWorkflowRunRequestSchema = z.object({
  workflow_id: z.string(),
});

export const updateWorkflowRunStatusRequestSchema = z.object({
  status: workflowRunStatusEnum,
});

// Types
export type WorkflowRunStatus = z.infer<typeof workflowRunStatusEnum>;
export type WorkflowRunResponse = z.infer<typeof workflowRunResponseSchema>;
export type CreateWorkflowRunRequest = z.infer<
  typeof createWorkflowRunRequestSchema
>;
export type UpdateWorkflowRunStatusRequest = z.infer<
  typeof updateWorkflowRunStatusRequestSchema
>;
