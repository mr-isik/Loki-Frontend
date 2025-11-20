import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const CodeJsForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [code, setCode] = useState(
    nodeData.code ||
      `// Available variables:
// - input: Data from previous node
// - context: Workflow context

function execute(input, context) {
  // Your code here
  
  return {
    success: true,
    result: input
  };
}

return execute(input, context);`
  );

  const handleSave = () => {
    onSave({ code });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="code">JavaScript Code</Label>
        <Textarea
          id="code"
          className="font-mono text-sm"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={16}
        />
      </div>

      <div className="bg-muted/50 p-3 rounded-md space-y-2">
        <p className="text-sm font-medium">📝 Available Variables:</p>
        <ul className="text-xs text-muted-foreground space-y-1 ml-4">
          <li>
            <code className="bg-background px-1 rounded">input</code> - Data
            from previous node
          </li>
          <li>
            <code className="bg-background px-1 rounded">context</code> -
            Workflow context and metadata
          </li>
          <li>
            <code className="bg-background px-1 rounded">console.log()</code> -
            Write to workflow logs
          </li>
        </ul>
        <p className="text-xs text-muted-foreground pt-2">
          Return an object with your result. Use try/catch for error handling.
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
