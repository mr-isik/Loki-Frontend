/**
 * NodeConfigModal Component
 * Single Responsibility: Display node configuration modal
 * Open/Closed: Extensible for new node types via form registry
 */

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NodeTemplateResponse } from "@/features/node/validation";
import { createElement, memo, useMemo } from "react";
import { getNodeForm } from "./NodeFormRegistry";

interface NodeConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeId: string;
  nodeName: string;
  template?: NodeTemplateResponse;
  nodeData: Record<string, any>;
  onSave: (data: Record<string, any>) => void;
}

export const NodeConfigModal = memo(
  ({
    open,
    onOpenChange,
    nodeId,
    nodeName,
    template,
    nodeData,
    onSave,
  }: NodeConfigModalProps) => {
    const FormComponent = useMemo(
      () => (template ? getNodeForm(template.type_key) : null),
      [template]
    );

    if (!template || !FormComponent) return null;

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{nodeName} Configuration</DialogTitle>
            <DialogDescription>
              Configure settings for this {template.name} node
            </DialogDescription>
          </DialogHeader>
          {createElement(FormComponent, {
            nodeId,
            nodeData,
            onSave: (data: Record<string, any>) => {
              onSave(data);
              onOpenChange(false);
            },
            onCancel: () => onOpenChange(false),
          })}
        </DialogContent>
      </Dialog>
    );
  }
);

NodeConfigModal.displayName = "NodeConfigModal";
