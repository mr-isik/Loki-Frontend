/**
 * Workflow State Management Helpers
 * Following Single Responsibility Principle
 */

import { Edge as ReactFlowEdge } from "@xyflow/react";

/**
 * Process and validate initial edges from API
 */
export const processInitialEdges = (
  edges: ReactFlowEdge[]
): ReactFlowEdge[] => {
  // Filter out invalid edges
  const validEdges = edges.filter(
    (edge) => edge.id && edge.source && edge.target
  );

  // Remove duplicates
  const idSet = new Set<string>();
  const uniqueEdges = validEdges.filter((edge) => {
    if (idSet.has(edge.id)) {
      return false;
    }
    idSet.add(edge.id);
    return true;
  });

  return uniqueEdges;
};

/**
 * Batch node position updates
 */
/**
 * Batch node updates
 */
export interface NodeUpdate {
  position_x?: number;
  position_y?: number;
  data?: Record<string, any>;
}

/**
 * Execute batch save with proper error handling
 */
export const executeBatchSave = async (
  updates: Map<string, NodeUpdate>,
  updateFn: (nodeId: string, update: NodeUpdate) => Promise<any>
): Promise<void> => {
  if (updates.size === 0) return;

  const updateArray = Array.from(updates.entries());

  try {
    await Promise.all(
      updateArray.map(([nodeId, update]) => updateFn(nodeId, update))
    );
    updates.clear();
  } catch (error) {
    console.error("Batch save failed:", error);
    throw error;
  }
};
