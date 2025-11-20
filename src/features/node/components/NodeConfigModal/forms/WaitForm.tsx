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
import { useState } from "react";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const WaitForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [duration, setDuration] = useState(nodeData.duration || "");
  const [unit, setUnit] = useState(nodeData.unit || "seconds");

  const handleSave = () => {
    onSave({
      duration: parseInt(duration),
      unit,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            type="number"
            placeholder="e.g., 5"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
          />
        </div>
        <div>
          <Label htmlFor="unit">Unit</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger id="unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seconds">Seconds</SelectItem>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="days">Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-muted/50 p-3 rounded-md">
        <p className="text-sm text-muted-foreground">
          The workflow will pause for{" "}
          <span className="font-semibold text-foreground">
            {duration || "X"} {unit}
          </span>{" "}
          before continuing to the next node.
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!duration}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
