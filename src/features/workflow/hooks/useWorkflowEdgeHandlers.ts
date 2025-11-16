/**
 * Custom hook for workflow edges management
 * Following Single Responsibility Principle
 */

import { reactFlowConnectionToApiEdge } from "@/features/node/adapters";
import {
  useCreateWorkflowEdge,
  useDeleteWorkflowEdge,
} from "@/features/node/hooks/useQueries";
import { Connection, EdgeChange, Edge as ReactFlowEdge } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";
import { apiEdgeToReactFlowEdge, edgeExists } from "../utils/edgeHelpers";

interface UseWorkflowEdgesParams {
  workflowId: string;
  setLocalEdges: React.Dispatch<React.SetStateAction<ReactFlowEdge[]>>;
  applyEdgeChanges: (
    changes: EdgeChange[],
    edges: ReactFlowEdge[]
  ) => ReactFlowEdge[];
}

export const useWorkflowEdgeHandlers = ({
  workflowId,
  setLocalEdges,
  applyEdgeChanges,
}: UseWorkflowEdgesParams) => {
  const { mutate: createEdge } = useCreateWorkflowEdge();
  const { mutate: deleteEdge } = useDeleteWorkflowEdge();

  /**
   * Handle edge changes (deletion)
   */
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      // Apply changes to local state immediately
      setLocalEdges((eds) => applyEdgeChanges(changes, eds));

      changes.forEach((change) => {
        if (change.type === "remove") {
          deleteEdge({
            edgeId: change.id,
            workflowId,
          });
        }
      });
    },
    [deleteEdge, workflowId, setLocalEdges, applyEdgeChanges]
  );

  /**
   * Handle new connection with duplicate prevention
   * Backend now returns the created edge, so no need for optimistic updates
   */
  const handleConnect = useCallback(
    (params: Connection, edges: ReactFlowEdge[]) => {
      if (!params.source || !params.target) return;

      // Check for duplicates including handle IDs
      if (
        edgeExists(
          edges,
          params.source,
          params.target,
          params.sourceHandle,
          params.targetHandle
        )
      ) {
        toast.error("Connection already exists between these handles");
        return;
      }

      // Proceed with API call
      const edgeData = reactFlowConnectionToApiEdge(params);
      createEdge(
        {
          payload: {
            ...edgeData,
            workflow_id: workflowId,
          },
        },
        {
          onSuccess: (response: any) => {
            const newEdge = apiEdgeToReactFlowEdge(response);
            setLocalEdges((prevEdges) => [...prevEdges, newEdge]);
          },
          onError: (error) => {
            toast.error(error.message || "Failed to create connection");
          },
        }
      );
    },
    [createEdge, workflowId, setLocalEdges]
  );

  return {
    handleEdgesChange,
    handleConnect,
  };
};
