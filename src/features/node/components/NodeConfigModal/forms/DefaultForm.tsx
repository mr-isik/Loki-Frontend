/**
 * Default Form Component
 * Used for nodes without specific forms
 */

"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const DefaultForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [data, setData] = useState(JSON.stringify(nodeData, null, 2));

  const handleSave = () => {
    try {
      onSave(JSON.parse(data));
    } catch {
      alert("Invalid JSON format");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="data">Configuration (JSON)</Label>
        <Textarea
          id="data"
          value={data}
          onChange={(e) => setData(e.target.value)}
          rows={12}
          className="font-mono"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};
