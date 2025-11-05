import { cn } from "@/lib/utils";
import { AutomationNode } from "@/types/node.types";
import * as React from "react";
import { NodeItem } from "./NodeItem";

/**
 * NodeList Props Interface
 * Following Interface Segregation Principle
 */
interface NodeListProps {
  nodes: AutomationNode[];
  onNodeClick?: (node: AutomationNode) => void;
  className?: string;
  emptyMessage?: string;
}

/**
 * NodeList Component
 * Single Responsibility: Render a scrollable list of nodes
 * Handles empty state and large lists efficiently
 */
export const NodeList: React.FC<NodeListProps> = ({
  nodes,
  onNodeClick,
  className,
  emptyMessage = "No nodes found",
}) => {
  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden",
        "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
        className
      )}
    >
      <div className="space-y-1 px-2 py-2">
        {nodes.map((node) => (
          <NodeItem key={node.id} node={node} onClick={onNodeClick} />
        ))}
      </div>
    </div>
  );
};

NodeList.displayName = "NodeList";
