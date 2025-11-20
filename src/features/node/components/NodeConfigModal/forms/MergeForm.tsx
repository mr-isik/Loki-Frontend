import { Button } from "@/components/ui/button";
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

export const MergeForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [mergeMode, setMergeMode] = useState(nodeData.mergeMode || "wait_all");
  const [description, setDescription] = useState(nodeData.description || "");

  const handleSave = () => {
    onSave({
      mergeMode,
      description,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="mergeMode">Merge Mode</Label>
        <Select value={mergeMode} onValueChange={setMergeMode}>
          <SelectTrigger id="mergeMode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wait_all">Wait for All Branches</SelectItem>
            <SelectItem value="first_complete">First to Complete</SelectItem>
            <SelectItem value="combine_data">Combine All Data</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          {mergeMode === "wait_all" &&
            "Wait until all branches complete before continuing"}
          {mergeMode === "first_complete" &&
            "Continue as soon as any branch completes"}
          {mergeMode === "combine_data" &&
            "Wait for all and merge their data into one object"}
        </p>
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="What are you merging?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      <div className="bg-muted/50 p-3 rounded-md">
        <p className="text-sm text-muted-foreground">
          This node will receive data from multiple branches and merge them
          according to the selected mode.
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
