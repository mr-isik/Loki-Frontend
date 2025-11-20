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

export const CronForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [cronExpression, setCronExpression] = useState(
    nodeData.cronExpression || "0 9 * * *"
  );
  const [timezone, setTimezone] = useState(
    nodeData.timezone || "America/New_York"
  );
  const [description, setDescription] = useState(nodeData.description || "");

  const handleSave = () => {
    onSave({
      cronExpression,
      timezone,
      description,
    });
  };

  const cronPresets = [
    { label: "Every minute", value: "* * * * *" },
    { label: "Every hour", value: "0 * * * *" },
    { label: "Every day at 9 AM", value: "0 9 * * *" },
    { label: "Every Monday at 9 AM", value: "0 9 * * 1" },
    { label: "First day of month", value: "0 0 1 * *" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cronExpression">Cron Expression</Label>
        <Input
          id="cronExpression"
          placeholder="0 9 * * *"
          value={cronExpression}
          onChange={(e) => setCronExpression(e.target.value)}
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Format: minute hour day month weekday
        </p>
      </div>

      <div>
        <Label>Common Presets</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {cronPresets.map((preset) => (
            <Button
              key={preset.value}
              variant="outline"
              size="sm"
              onClick={() => setCronExpression(preset.value)}
              className="justify-start text-xs"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="timezone">Timezone</Label>
        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger id="timezone">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="America/New_York">
              America/New York (EST)
            </SelectItem>
            <SelectItem value="America/Los_Angeles">
              America/Los Angeles (PST)
            </SelectItem>
            <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
            <SelectItem value="Europe/Istanbul">
              Europe/Istanbul (TRT)
            </SelectItem>
            <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
            <SelectItem value="UTC">UTC</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="When should this run?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      <div className="bg-muted/50 p-3 rounded-md">
        <p className="text-xs text-muted-foreground">
          💡 Use{" "}
          <a
            href="https://crontab.guru"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            crontab.guru
          </a>{" "}
          to build and validate cron expressions
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!cronExpression}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
