import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const SlackForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [webhookUrl, setWebhookUrl] = useState(nodeData.webhookUrl || "");
  const [channel, setChannel] = useState(nodeData.channel || "");
  const [message, setMessage] = useState(nodeData.message || "");
  const [username, setUsername] = useState(
    nodeData.username || "Workflow Bot"
  );

  const handleSave = () => {
    onSave({
      webhookUrl,
      channel,
      message,
      username,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="webhookUrl">Webhook URL</Label>
        <Input
          id="webhookUrl"
          type="password"
          placeholder="https://hooks.slack.com/services/..."
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Create a webhook in your Slack workspace settings
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="channel">Channel (Optional)</Label>
          <Input
            id="channel"
            placeholder="#general or @username"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="username">Bot Username</Label>
          <Input
            id="username"
            placeholder="Workflow Bot"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Supports Slack markdown formatting
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!webhookUrl || !message}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
