/**
 * Edge Helper Functions
 * Following Single Responsibility Principle
 */

import { Edge as ReactFlowEdge } from "@xyflow/react";

/**
 * Convert API edge response to ReactFlow edge format
 */
export const apiEdgeToReactFlowEdge = (apiEdge: any): ReactFlowEdge => {
  return {
    id: apiEdge.id,
    source: apiEdge.source_node_id,
    target: apiEdge.target_node_id,
    sourceHandle: apiEdge.source_handle || undefined,
    targetHandle: apiEdge.target_handle || undefined,
    type: "default",
    animated: true,
  };
};

/**
 * Check if an edge already exists between two nodes with same handles
 */
export const edgeExists = (
  edges: ReactFlowEdge[],
  source: string,
  target: string,
  sourceHandle?: string | null,
  targetHandle?: string | null
): boolean => {
  return edges.some(
    (edge) =>
      edge.source === source &&
      edge.target === target &&
      edge.sourceHandle === (sourceHandle || undefined) &&
      edge.targetHandle === (targetHandle || undefined)
  );
};
