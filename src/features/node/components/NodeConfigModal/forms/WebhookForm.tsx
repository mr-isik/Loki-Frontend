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

export const WebhookForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [path, setPath] = useState(nodeData.path || "");
  const [method, setMethod] = useState(nodeData.method || "POST");
  const [description, setDescription] = useState(nodeData.description || "");

  const handleSave = () => {
    onSave({
      path,
      method,
      description,
    });
  };

  const webhookUrl = `https://your-domain.com/webhook/${path || "{path}"}`;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="path">Webhook Path</Label>
        <Input
          id="path"
          placeholder="my-workflow-trigger"
          value={path}
          onChange={(e) => setPath(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Unique path for this webhook endpoint
        </p>
      </div>

      <div>
        <Label htmlFor="method">HTTP Method</Label>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger id="method">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="What triggers this webhook?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      {path && (
        <div className="bg-muted/50 p-3 rounded-md">
          <p className="text-xs font-medium mb-1">Your Webhook URL:</p>
          <code className="text-xs bg-background px-2 py-1 rounded block break-all">
            {webhookUrl}
          </code>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!path}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
