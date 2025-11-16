"use client";

import { NodeTemplateResponse } from "@/features/node/validation";
import { AutomationNode } from "@/types/node.types";
import { Handle, Position } from "@xyflow/react";
import { createElement, memo, useMemo } from "react";
import { getNodeColor, getNodeIcon } from "../utils/nodeStyles";

interface CustomNodeProps {
  data: {
    node: AutomationNode;
    template?: NodeTemplateResponse;
    selected?: boolean;
  };
  selected?: boolean;
}

const CustomNode = memo(({ data, selected }: CustomNodeProps) => {
  const { node, template } = data;
  const nodeTypeKey =
    template?.type_key || (node as any).template_id || node.type;
  const colors = useMemo(() => getNodeColor(nodeTypeKey), [nodeTypeKey]);
  const IconComponent = useMemo(() => getNodeIcon(nodeTypeKey), [nodeTypeKey]);

  const inputs = template?.inputs || [];
  const outputs = template?.outputs || [];

  const inputSpacing = inputs.length > 1 ? 100 / (inputs.length + 1) : 50;
  const outputSpacing = outputs.length > 1 ? 100 / (outputs.length + 1) : 50;

  return (
    <div className="relative">
      {/* Input Handles */}
      {inputs.length > 0 &&
        inputs.map((input, index) => (
          <Handle
            key={input.id}
            type="target"
            position={Position.Left}
            id={input.id}
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#6B7280",
              border: "2px solid white",
              top: `${inputSpacing * (index + 1)}%`,
            }}
            title={input.label}
          />
        ))}

      {/* n8n Minimal Style Node */}
      <div
        className={`
          bg-white dark:bg-gray-900 w-16 h-16 flex items-center justify-center
          border-2
          border-b-4
          rounded-lg
          transition-all duration-200
          ${selected ? "ring-2 ring-offset-2 ring-primary" : ""}
        `}
      >
        {/* Header - Minimal */}
        <div className="px-3 py-2 flex items-center gap-2.5">
          {/* Icon Circle */}
          <div
            className={`w-7! h-7! rounded-full ${colors.iconBg} flex items-center justify-center shrink-0`}
          >
            {createElement(IconComponent, {
              className: `w-4 h-4 ${colors.icon}`,
            })}
          </div>
        </div>
      </div>

      {/* Output Handles */}
      {outputs.length > 0 ? (
        outputs.map((output, index) => (
          <Handle
            key={output.id}
            type="source"
            position={Position.Right}
            id={output.id}
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#6B7280",
              border: "2px solid white",
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
          style={{
            width: 12,
            height: 12,
            backgroundColor: "#6B7280",
            border: "2px solid white",
          }}
        />
      )}

      {/* Node Content */}
      <div className="p-2 absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-max max-w-xs text-center">
        <h4 className="text-sm font-medium">{node.name}</h4>
        <p className="text-xs text-gray-500">{node.description}</p>
      </div>
    </div>
  );
});

CustomNode.displayName = "CustomNode";

export default CustomNode;
