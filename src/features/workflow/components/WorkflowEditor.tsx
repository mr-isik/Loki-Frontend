"use client";

import { Button } from "@/components/ui/button";
import {
  apiEdgeToReactFlowEdge,
  apiNodeToReactFlowNode,
} from "@/features/node/adapters";
import CustomNode from "@/features/node/components/Node";
import { NodeTemplateSheet } from "@/features/node/components/NodeTemplateSheet";
import {
  useNodeTemplates,
  useUpdateWorkflowNode,
  useWorkflowEdges,
  useWorkflowNodes,
} from "@/features/node/hooks/useQueries";
import { useAutoSave } from "@/features/workflow/hooks/useAutoSave";
import { useWorkflowEdgeHandlers } from "@/features/workflow/hooks/useWorkflowEdgeHandlers";
import { useWorkflowNodeHandlers } from "@/features/workflow/hooks/useWorkflowNodeHandlers";
import {
  executeBatchSave,
  processInitialEdges,
} from "@/features/workflow/utils/workflowHelpers";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  Edge as ReactFlowEdge,
  Node as ReactFlowNode,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface WorkflowEditorProps {
  workflowId: string;
  onSaveStateChange?: (isSaving: boolean, hasUnsavedChanges: boolean) => void;
}

const WorkflowEditor = ({
  workflowId,
  onSaveStateChange,
}: WorkflowEditorProps) => {
  // UI State
  const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);
  const { screenToFlowPosition } = useReactFlow();

  // Local state for optimistic updates
  const [localNodes, setLocalNodes] = useState<ReactFlowNode[]>([]);
  const [localEdges, setLocalEdges] = useState<ReactFlowEdge[]>([]);

  // Track pending changes for batch update
  const pendingNodeUpdates = useRef<
    Map<
      string,
      { position_x?: number; position_y?: number; data?: Record<string, any> }
    >
  >(new Map());

  // Data fetching
  const { data: apiNodes, isLoading: nodesLoading } =
    useWorkflowNodes(workflowId);
  const { data: apiEdges, isLoading: edgesLoading } =
    useWorkflowEdges(workflowId);
  const { data: templatesData, isLoading: templatesLoading } =
    useNodeTemplates();

  // Mutations
  const { mutateAsync: updateNodeAsync } = useUpdateWorkflowNode();

  // Node types configuration
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  // Create template lookup map
  const templateMap = useMemo(() => {
    if (!templatesData?.templates) return new Map();
    return new Map(
      templatesData.templates.map((template) => [template.id, template])
    );
  }, [templatesData]);

  // Initialize and validate data from API
  const initialNodes = useMemo(() => {
    if (!apiNodes) return [];
    return apiNodes.map((node) =>
      apiNodeToReactFlowNode(node, templateMap.get(node.template_id))
    );
  }, [apiNodes, templateMap]);

  const initialEdges = useMemo(() => {
    if (!apiEdges) return [];
    return processInitialEdges(apiEdges.map(apiEdgeToReactFlowEdge));
  }, [apiEdges]);

  // Sync initial data to local state
  useEffect(() => {
    setLocalNodes(initialNodes);
  }, [initialNodes]);

  useEffect(() => {
    setLocalEdges(initialEdges);
  }, [initialEdges]);

  // Batch save function
  const performBatchSave = useCallback(async () => {
    await executeBatchSave(
      pendingNodeUpdates.current,
      async (nodeId, updates) => {
        return updateNodeAsync({
          nodeId,
          payload: updates,
          workflowId,
        });
      }
    );
  }, [updateNodeAsync, workflowId]);

  // Auto-save hook
  const { triggerAutoSave, hasUnsavedChanges, isSaving } = useAutoSave({
    onSave: performBatchSave,
    delay: 2000,
    enabled: true,
  });

  // Notify parent about save state changes
  useEffect(() => {
    onSaveStateChange?.(isSaving, hasUnsavedChanges);
  }, [isSaving, hasUnsavedChanges, onSaveStateChange]);

  const { handleNodesChange, handleTemplateSelect, handleUpdateNodeData } =
    useWorkflowNodeHandlers({
      workflowId,
      screenToFlowPosition,
      setLocalNodes,
      setLocalEdges,
      applyNodeChanges,
      pendingNodeUpdates,
      triggerAutoSave,
    });

  const { handleEdgesChange, handleConnect } = useWorkflowEdgeHandlers({
    workflowId,
    setLocalEdges,
    applyEdgeChanges,
  });

  // Wrapper for handleConnect to pass current edges
  const onConnect = useCallback(
    (params: any) => handleConnect(params, localEdges),
    [handleConnect, localEdges]
  );

  // Add onUpdateNode callback to all nodes
  const nodesWithCallbacks = useMemo(() => {
    return localNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onUpdateNode: handleUpdateNodeData,
      },
    }));
  }, [localNodes, handleUpdateNodeData]);

  // Loading state
  if (nodesLoading || edgesLoading || templatesLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading workflow...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      <ReactFlow
        nodes={nodesWithCallbacks}
        edges={localEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        edgesFocusable
        deleteKeyCode="Delete"
        defaultEdgeOptions={{
          type: "default",
          animated: true,
          style: { strokeWidth: 3, stroke: "#644a40" },
        }}
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Background gap={30} size={2} />
      </ReactFlow>

      {/* Add Node Button */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          size="lg"
          onClick={() => setIsTemplateSheetOpen(true)}
          className="shadow-lg"
        >
          <Plus className=" h-5 w-5" />
          Add Node
        </Button>
      </div>

      {/* Empty State */}
      {localNodes.length === 0 && !nodesLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-4">
            <div className="text-muted-foreground">
              <p className="text-lg font-medium">Your workflow is empty</p>
              <p className="text-sm">
                Click &quot;Add Node&quot; to get started
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Node Template Sheet */}
      <NodeTemplateSheet
        open={isTemplateSheetOpen}
        onOpenChange={setIsTemplateSheetOpen}
        onSelectTemplate={handleTemplateSelect}
      />
    </div>
  );
};

export default WorkflowEditor;
