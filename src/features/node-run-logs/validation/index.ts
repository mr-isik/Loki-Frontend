import z from "zod";

// Status enum
export const nodeRunLogStatusEnum = z.enum([
  "pending",
  "running",
  "completed",
  "failed",
  "skipped",
]);

// Response schema
export const nodeRunLogResponseSchema = z.object({
  id: z.string(),
  node_id: z.string(),
  run_id: z.string(),
  status: nodeRunLogStatusEnum,
  log_output: z.string().nullable().optional(),
  error_msg: z.string().nullable().optional(),
  started_at: z.string().nullable().optional(),
  finished_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Request schemas
export const createNodeRunLogRequestSchema = z.object({
  node_id: z.string(),
  run_id: z.string(),
  status: nodeRunLogStatusEnum,
});

export const updateNodeRunLogRequestSchema = z.object({
  status: nodeRunLogStatusEnum.optional(),
  log_output: z.string().optional(),
  error_msg: z.string().optional(),
});

// Types
export type NodeRunLogStatus = z.infer<typeof nodeRunLogStatusEnum>;
export type NodeRunLogResponse = z.infer<typeof nodeRunLogResponseSchema>;
export type CreateNodeRunLogRequest = z.infer<
  typeof createNodeRunLogRequestSchema
>;
export type UpdateNodeRunLogRequest = z.infer<
  typeof updateNodeRunLogRequestSchema
>;
