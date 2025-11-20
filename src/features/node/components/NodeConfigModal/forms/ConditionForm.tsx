import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const ConditionForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [field, setField] = useState(nodeData.field || "");
  const [operator, setOperator] = useState(nodeData.operator || "equals");
  const [value, setValue] = useState(nodeData.value || "");
  const [description, setDescription] = useState(nodeData.description || "");

  const handleSave = () => {
    onSave({
      field,
      operator,
      value,
      description,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="field">Field Path</Label>
        <Input
          id="field"
          placeholder="e.g., data.status or response.code"
          value={field}
          onChange={(e) => setField(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Path to the field you want to check
        </p>
      </div>

      <div>
        <Label htmlFor="operator">Operator</Label>
        <Select value={operator} onValueChange={setOperator}>
          <SelectTrigger id="operator">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">Equals (==)</SelectItem>
            <SelectItem value="not_equals">Not Equals (!=)</SelectItem>
            <SelectItem value="greater_than">Greater Than (&gt;)</SelectItem>
            <SelectItem value="less_than">Less Than (&lt;)</SelectItem>
            <SelectItem value="contains">Contains</SelectItem>
            <SelectItem value="starts_with">Starts With</SelectItem>
            <SelectItem value="ends_with">Ends With</SelectItem>
            <SelectItem value="is_empty">Is Empty</SelectItem>
            <SelectItem value="is_not_empty">Is Not Empty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {operator !== "is_empty" && operator !== "is_not_empty" && (
        <div>
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            placeholder="Value to compare"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      )}

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="What does this condition check?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Configuration</Button>
      </div>
    </div>
  );
};
