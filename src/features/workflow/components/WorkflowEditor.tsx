/**
 * WorkflowEditor Component
 * Following Single Responsibility Principle - Manages workflow canvas
 * Following Dependency Inversion - Depends on abstractions (hooks, adapters)
 */

"use client";

import { Button } from "@/components/ui/button";
import {
  apiEdgeToReactFlowEdge,
  apiNodeToReactFlowNode,
  reactFlowConnectionToApiEdge,
} from "@/features/node/adapters";
import CustomNode from "@/features/node/components/Node";
import { NodeTemplateSheet } from "@/features/node/components/NodeTemplateSheet";
import {
  useCreateWorkflowEdge,
  useCreateWorkflowNode,
  useDeleteWorkflowEdge,
  useDeleteWorkflowNode,
  useUpdateWorkflowNode,
  useWorkflowEdges,
  useWorkflowNodes,
} from "@/features/node/hooks/useQueries";
import { NodeTemplateResponse } from "@/features/node/validation";
import { useAutoSave } from "@/features/workflow/hooks/useAutoSave";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  EdgeChange,
  MiniMap,
  NodeChange,
  ReactFlow,
  Edge as ReactFlowEdge,
  Node as ReactFlowNode,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface WorkflowEditorProps {
  workflowId: string;
  onSaveStateChange?: (isSaving: boolean, hasUnsavedChanges: boolean) => void;
}

/**
 * WorkflowEditor - Main canvas component
 * Following Open/Closed Principle - Easy to extend with new node types
 */
const WorkflowEditor = ({
  workflowId,
  onSaveStateChange,
}: WorkflowEditorProps) => {
  const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);
  const { screenToFlowPosition } = useReactFlow();

  // Local state for nodes and edges (for immediate UI updates)
  const [localNodes, setLocalNodes] = useState<ReactFlowNode[]>([]);
  const [localEdges, setLocalEdges] = useState<ReactFlowEdge[]>([]);

  // Track pending changes for batch update
  const pendingNodeUpdates = useRef<
    Map<string, { position_x: number; position_y: number }>
  >(new Map());

  // Queries - Following Interface Segregation Principle
  const { data: apiNodes, isLoading: nodesLoading } =
    useWorkflowNodes(workflowId);
  const { data: apiEdges, isLoading: edgesLoading } =
    useWorkflowEdges(workflowId);

  // Mutations
  const { mutateAsync: createNodeAsync } = useCreateWorkflowNode();
  const { mutateAsync: updateNodeAsync } = useUpdateWorkflowNode();
  const { mutate: deleteNode } = useDeleteWorkflowNode();
  const { mutate: createEdge } = useCreateWorkflowEdge();
  const { mutate: deleteEdge } = useDeleteWorkflowEdge();

  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  // Initialize local state from API data
  const initialNodes = useMemo(() => {
    if (!apiNodes) return [];
    return apiNodes.map(apiNodeToReactFlowNode);
  }, [apiNodes]);

  const initialEdges = useMemo(() => {
    if (!apiEdges) return [];

    // Convert and validate edges - filter out any with missing/invalid IDs
    const convertedEdges = apiEdges
      .map(apiEdgeToReactFlowEdge)
      .filter((edge) => {
        // Ensure each edge has a valid unique ID
        const isValid = edge.id && edge.source && edge.target;
        if (!isValid) {
          console.warn("Invalid edge detected:", edge);
        }
        return isValid;
      });

    // Check for duplicate IDs
    const idSet = new Set<string>();
    const uniqueEdges = convertedEdges.filter((edge) => {
      if (idSet.has(edge.id)) {
        console.warn("Duplicate edge ID detected:", edge.id);
        return false;
      }
      idSet.add(edge.id);
      return true;
    });

    return uniqueEdges;
  }, [apiEdges]);

  // Sync initial data to local state
  useEffect(() => {
    setLocalNodes(initialNodes);
  }, [initialNodes]);

  useEffect(() => {
    setLocalEdges(initialEdges);
  }, [initialEdges]);

  // Batch save function - Using async mutations for proper Promise handling
  const performBatchSave = useCallback(async () => {
    const updates = Array.from(pendingNodeUpdates.current.entries());

    if (updates.length === 0) return;

    try {
      // Execute all updates in parallel using mutateAsync
      await Promise.all(
        updates.map(([nodeId, position]) =>
          updateNodeAsync({
            nodeId,
            payload: position,
            workflowId,
          })
        )
      );

      // Clear pending updates only after successful save
      pendingNodeUpdates.current.clear();
    } catch (error) {
      console.error("Batch save failed:", error);
      throw error; // Re-throw to let useAutoSave handle it
    }
  }, [updateNodeAsync, workflowId]);

  // Auto-save hook
  const { triggerAutoSave, saveNow, hasUnsavedChanges, isSaving } = useAutoSave(
    {
      onSave: performBatchSave,
      delay: 2000,
      enabled: true,
    }
  );

  // Notify parent about save state changes
  useEffect(() => {
    onSaveStateChange?.(isSaving, hasUnsavedChanges);
  }, [isSaving, hasUnsavedChanges, onSaveStateChange]);

  // Expose saveNow to parent (for manual save button)
  useEffect(() => {
    (window as any).__workflowEditorSave = saveNow;
    return () => {
      delete (window as any).__workflowEditorSave;
    };
  }, [saveNow]);

  /**
   * Handle node changes (position, deletion)
   * Following Command Pattern - Encapsulates actions
   */
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Apply changes to local state immediately for smooth UX
      setLocalNodes((nds) => applyNodeChanges(changes, nds));

      changes.forEach((change) => {
        if (change.type === "position" && change.position && !change.dragging) {
          // Add to pending updates (will be saved via auto-save)
          pendingNodeUpdates.current.set(change.id, {
            position_x: change.position.x,
            position_y: change.position.y,
          });
          triggerAutoSave();
        } else if (change.type === "remove") {
          // Delete node immediately
          deleteNode({
            nodeId: change.id,
            workflowId,
          });
        }
      });
    },
    [deleteNode, workflowId, triggerAutoSave]
  );

  /**
   * Handle edge changes (deletion)
   */
  const onEdgesChange = useCallback(
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
    [deleteEdge, workflowId]
  );

  /**
   * Handle new connection
   * Following Single Responsibility - Only creates edges
   * Using optimistic updates for better UX
   */
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      // Generate unique temporary ID for optimistic update
      const tempId = `temp-edge-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Add edge to local state immediately (optimistic update)
      const newEdge: ReactFlowEdge = {
        id: tempId,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle ?? null,
        targetHandle: params.targetHandle ?? null,
        animated: true,
      };

      console.log("🔗 Creating edge with temp ID:", tempId);
      setLocalEdges((edges) => {
        console.log("📊 Current edges before add:", edges.length);
        const newEdges = [...edges, newEdge];
        console.log("📊 Edges after add:", newEdges.length);
        // Check for duplicate IDs
        const ids = newEdges.map((e) => e.id);
        const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
        if (duplicates.length > 0) {
          console.error("❌ Duplicate edge IDs detected:", duplicates);
        }
        return newEdges;
      });

      // Create edge in API
      const edgeData = reactFlowConnectionToApiEdge(params);
      createEdge(
        {
          payload: edgeData,
          workflowId,
        },
        {
          onSuccess: (response: any) => {
            console.log(
              "✅ Edge created successfully, replacing temp ID:",
              tempId,
              "with real ID:",
              response.id
            );
            // Replace temp edge with real edge from API - remove temp first to avoid duplicates
            setLocalEdges((edges) => {
              const filtered = edges.filter((edge) => edge.id !== tempId);
              console.log("📊 Filtered edges (removed temp):", filtered.length);
              const newEdges = [
                ...filtered,
                {
                  id: response.id,
                  source: params.source,
                  target: params.target,
                  sourceHandle: params.sourceHandle ?? null,
                  targetHandle: params.targetHandle ?? null,
                  animated: true,
                },
              ];
              console.log("📊 Final edges after replacement:", newEdges.length);
              return newEdges;
            });
          },
          onError: (error) => {
            // Remove optimistic edge on error
            setLocalEdges((edges) =>
              edges.filter((edge) => edge.id !== tempId)
            );
            toast.error(error.message || "Failed to create connection");
          },
        }
      );
    },
    [createEdge, workflowId]
  );

  /**
   * Handle template selection and create new node
   * Following Single Responsibility - Creates node from template
   * Using optimistic updates for better UX
   */
  const handleTemplateSelect = useCallback(
    async (template: NodeTemplateResponse) => {
      // Calculate center position of viewport
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const position = screenToFlowPosition({ x: centerX, y: centerY });

      // Generate temporary ID for optimistic update
      const tempId = `temp-node-${Date.now()}-${Math.random()}`;

      // Create temporary node data
      const nodeData = {
        label: template.name,
        name: template.name,
        type: template.type_key,
        description: template.description,
        category: template.category,
        icon: "zap",
        ...(template.type_key === "api_call" && {
          method: "GET",
          endpoint: "",
        }),
        ...(template.type_key === "shell_command" && {
          command: "",
          shell: "bash",
        }),
        ...(template.type_key === "discord_message" && {
          webhookUrl: "",
          channelId: "",
        }),
      };

      // Add node to local state immediately (optimistic update)
      const tempNode: ReactFlowNode = {
        id: tempId,
        type: "customNode",
        position,
        data: {
          node: {
            id: tempId,
            ...nodeData,
          } as any,
          templateId: template.id,
          workflowId: workflowId,
        },
      };

      setLocalNodes((nodes) => [...nodes, tempNode]);

      // Create node in API using async mutation
      try {
        const response = await createNodeAsync({
          workflow_id: workflowId,
          template_id: template.id,
          position_x: position.x,
          position_y: position.y,
          data: nodeData,
        });

        // Replace temp node with real node from API
        setLocalNodes((nodes) =>
          nodes.map((node) =>
            node.id === tempId
              ? {
                  ...node,
                  id: (response as any).id,
                  data: {
                    ...node.data,
                    node: {
                      ...(node.data.node as any),
                      id: (response as any).id,
                    },
                  },
                }
              : node
          )
        );
        toast.success(`Added ${template.name} node`);
      } catch (error: any) {
        // Remove optimistic node on error
        setLocalNodes((nodes) => nodes.filter((node) => node.id !== tempId));
        toast.error(error.message || "Failed to add node");
      }
    },
    [createNodeAsync, workflowId, screenToFlowPosition]
  );

  // Show loading state
  if (nodesLoading || edgesLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading workflow...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      <ReactFlow
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        edgesFocusable
        defaultEdgeOptions={{
          style: { strokeWidth: 2, stroke: "hsl(var(--primary))" },
        }}
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Background gap={30} size={2} />
      </ReactFlow>

      {/* Add Node Button - Following UX best practices */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          size="lg"
          onClick={() => setIsTemplateSheetOpen(true)}
          className="shadow-lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Node
        </Button>
      </div>

      {/* Empty State - Following User-Centered Design */}
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
