/**
 * NodeFormRegistry
 * Following Registry Pattern - Maps node types to their forms
 * Following Open/Closed Principle - Easy to add new forms without modifying existing code
 */

import { ComponentType } from "react";
import { BaseNodeFormProps } from "./BaseNodeForm";
import { DefaultForm } from "./forms/DefaultForm";
import { HttpRequestForm } from "./forms/HttpRequestForm";
import { ShellCommandForm } from "./forms/ShellCommandForm";

type NodeFormComponent = ComponentType<BaseNodeFormProps>;

// Registry: Maps type_key to form component
const formRegistry: Record<string, NodeFormComponent> = {
  http_request: HttpRequestForm,
  shell_command: ShellCommandForm,
  // Add more as they are implemented
};

/**
 * Get form component for a node type
 * Returns DefaultForm as fallback for unmapped types
 */
export const getNodeForm = (typeKey: string): NodeFormComponent => {
  return formRegistry[typeKey] || DefaultForm;
};
