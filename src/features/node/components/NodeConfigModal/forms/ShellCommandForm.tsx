/**
 * Shell Command Form Component
 */

"use client";

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

export const ShellCommandForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [command, setCommand] = useState(nodeData.command || "");
  const [shell, setShell] = useState(nodeData.shell || "bash");

  const handleSave = () => {
    onSave({
      command,
      shell,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="shell">Shell</Label>
        <Select value={shell} onValueChange={setShell}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bash">Bash</SelectItem>
            <SelectItem value="sh">SH</SelectItem>
            <SelectItem value="powershell">PowerShell</SelectItem>
            <SelectItem value="cmd">CMD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="command">Command</Label>
        <Textarea
          id="command"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="echo 'Hello World'"
          rows={8}
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
