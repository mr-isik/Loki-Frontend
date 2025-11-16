/**
 * Form Registry
 * Following Open/Closed Principle - easy to extend with new forms
 * Following Dependency Inversion Principle - depends on abstractions
 */

import { ComponentType } from "react";
import { BaseNodeFormProps } from "../components/NodeConfigModal/BaseNodeForm";
import { DefaultForm } from "../components/NodeConfigModal/forms/DefaultForm";
import { HttpRequestForm } from "../components/NodeConfigModal/forms/HttpRequestForm";
import { ShellCommandForm } from "../components/NodeConfigModal/forms/ShellCommandForm";

type NodeFormComponent = ComponentType<BaseNodeFormProps>;

/**
 * Registry mapping node types to their form components
 */
const formRegistry: Record<string, NodeFormComponent> = {
  http_request: HttpRequestForm,
  shell_command: ShellCommandForm,
  // Add more forms as needed
  // condition: ConditionForm,
  // loop: LoopForm,
  // etc...
};

/**
 * Get form component for a node type
 * Returns DefaultForm if no specific form exists
 */
export const getNodeFormComponent = (typeKey: string): NodeFormComponent => {
  return formRegistry[typeKey] || DefaultForm;
};

/**
 * Register a new form component
 * Allows runtime extension of form registry
 */
export const registerNodeForm = (
  typeKey: string,
  component: NodeFormComponent
) => {
  formRegistry[typeKey] = component;
};
