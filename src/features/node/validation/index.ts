import z from "zod";

export const createWorkflowNodeRequestSchema = z.object({
  position_x: z.number().min(0),
  position_y: z.number().min(0),
  template_id: z.uuid(),
  workflow_id: z.uuid(),
  data: z.record(z.any(), z.any()),
});

export const updateWorkflowNodeRequestSchema = z.object({
  position_x: z.number().min(0).optional(),
  position_y: z.number().min(0).optional(),
  data: z.record(z.any(), z.any()).optional(),
});

export const workflowNodeResponseSchema = z.object({
  id: z.uuid(),
  position_x: z.number().min(0),
  position_y: z.number().min(0),
  template_id: z.uuid(),
  workflow_id: z.uuid(),
  data: z.record(z.any(), z.any()),
});

export const nodeTemplateResponseSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  type_key: z.string().min(1),
});

export type CreateWorkflowNodeRequest = z.infer<
  typeof createWorkflowNodeRequestSchema
>;
export type UpdateWorkflowNodeRequest = z.infer<
  typeof updateWorkflowNodeRequestSchema
>;
export type WorkflowNodeResponse = z.infer<typeof workflowNodeResponseSchema>;
export type NodeTemplateResponse = z.infer<typeof nodeTemplateResponseSchema>;
