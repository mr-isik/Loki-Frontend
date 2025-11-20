import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const SetDataForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [data, setData] = useState(
    JSON.stringify(nodeData.data || {}, null, 2)
  );

  const handleSave = () => {
    try {
      onSave({
        data: JSON.parse(data),
      });
    } catch {
      alert("Invalid JSON format");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="data">Data Object (JSON)</Label>
        <Textarea
          id="data"
          className="font-mono text-sm"
          placeholder={`{
  "key": "value",
  "status": "active",
  "count": 42
}`}
          value={data}
          onChange={(e) => setData(e.target.value)}
          rows={12}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Define the data you want to set. Use JSON format.
        </p>
      </div>

      <div className="bg-muted/50 p-3 rounded-md">
        <p className="text-sm font-medium mb-1">💡 Tip:</p>
        <p className="text-xs text-muted-foreground">
          You can reference previous node data using paths like{" "}
          <code className="bg-background px-1 rounded">
            {"{{previousNode.output}}"}
          </code>
        </p>
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
