"use client";

import { NodeTemplateResponse } from "@/features/node/validation";
import { AutomationNode } from "@/types/node.types";
import { Handle, Position } from "@xyflow/react";
import { createElement, memo, useMemo, useState } from "react";
import { getNodeColor, getNodeIcon } from "../utils/nodeStyles";
import { NodeConfigModal } from "./NodeConfigModal";
import { cn } from "@/lib/utils";

interface CustomNodeProps {
  data: {
    node: AutomationNode;
    template?: NodeTemplateResponse;
    selected?: boolean;
    onUpdateNode?: (nodeId: string, data: Record<string, any>) => void;
  };
  selected?: boolean;
  id: string;
}

const CustomNode = memo(({ data, selected, id }: CustomNodeProps) => {
  const { node, template, onUpdateNode } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nodeTypeKey =
    template?.type_key || (node as any).template_id || node.type;
  const colors = useMemo(() => getNodeColor(nodeTypeKey), [nodeTypeKey]);
  const IconComponent = useMemo(() => getNodeIcon(nodeTypeKey), [nodeTypeKey]);

  const inputs = template?.inputs || [];
  const outputs = template?.outputs || [];

  const inputSpacing = inputs.length > 1 ? 100 / (inputs.length + 1) : 50;
  const outputSpacing = outputs.length > 1 ? 100 / (outputs.length + 1) : 50;

  const handleDoubleClick = () => {
    setIsModalOpen(true);
  };

  const handleSaveConfig = (newData: Record<string, any>) => {
    if (onUpdateNode) {
      onUpdateNode(id, newData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="relative group">
      {/* Input Handles */}
      {inputs.length > 0 &&
        inputs.map((input, index) => (
          <Handle
            key={input.id}
            type="target"
            position={Position.Left}
            id={input.id}
            className="!w-3 !h-3 !border-2 !border-background !bg-zinc-500 hover:!bg-zinc-300 transition-colors"
            style={{
              top: `${inputSpacing * (index + 1)}%`,
            }}
            title={input.label}
          />
        ))}

      {/* Premium Canvas Node */}
      <div
        onDoubleClick={handleDoubleClick}
        className={cn(
          "w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300",
          "bg-card/80 backdrop-blur-md border",
          selected 
            ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105" 
            : "border-border group-hover:border-muted-foreground/30 shadow-xl",
          "cursor-pointer"
        )}
        style={{
          boxShadow: selected ? `0 0 20px -5px ${colors.main}66` : undefined,
          borderColor: selected ? colors.main : undefined
        }}
      >
        <div 
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
            "border border-border/50 bg-muted/30"
          )}
          style={{
            color: colors.main
          }}
        >
          {createElement(IconComponent, {
            className: "w-5 h-5",
          })}
        </div>
        
        {/* Connection status indicator (glow) */}
        {selected && (
          <div 
            className="absolute -inset-0.5 rounded-xl blur-sm -z-10 animate-pulse"
            style={{ backgroundColor: `${colors.main}33` }}
          />
        )}
      </div>

      {/* Output Handles */}
      {outputs.length > 0 ? (
        outputs.map((output, index) => (
          <Handle
            key={output.id}
            type="source"
            position={Position.Right}
            id={output.id}
            className="!w-3 !h-3 !border-2 !border-background !bg-muted-foreground/50 hover:!bg-primary transition-colors"
            style={{
              top: `${outputSpacing * (index + 1)}%`,
            }}
            title={output.label}
          />
        ))
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          id="source"
          className="!w-3 !h-3 !border-2 !border-background !bg-muted-foreground/50 hover:!bg-primary transition-colors"
        />
      )}

      {/* Node Content Label */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-[120px] text-center">
        <h4 className={cn(
          "text-[11px] font-semibold tracking-wide uppercase transition-colors duration-300",
          selected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
        )}>
          {node.name}
        </h4>
      </div>

      {/* Configuration Modal */}
      {template && (
        <NodeConfigModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          nodeId={id}
          nodeName={node.name}
          template={template}
          nodeData={node}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
});

CustomNode.displayName = "CustomNode";

export default CustomNode;
