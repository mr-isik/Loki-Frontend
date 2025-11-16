/**
 * BaseNodeForm Component
 * Following Interface Segregation Principle - common props for all forms
 */

export interface BaseNodeFormProps {
  nodeId: string;
  nodeData: Record<string, any>;
  onSave: (data: Record<string, any>) => void;
  onCancel: () => void;
}
