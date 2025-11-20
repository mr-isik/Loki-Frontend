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

export const LogForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [message, setMessage] = useState(nodeData.message || "");
  const [level, setLevel] = useState(nodeData.level || "info");
  const [dataToLog, setDataToLog] = useState(nodeData.dataToLog || "");

  const handleSave = () => {
    onSave({
      message,
      level,
      dataToLog,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="level">Log Level</Label>
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger id="level">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="debug">🔍 Debug</SelectItem>
            <SelectItem value="info">ℹ️ Info</SelectItem>
            <SelectItem value="warn">⚠️ Warning</SelectItem>
            <SelectItem value="error">❌ Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Input
          id="message"
          placeholder="e.g., Processing user data..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="dataToLog">Data to Log (Optional)</Label>
        <Textarea
          id="dataToLog"
          placeholder="e.g., data.user or response.body"
          value={dataToLog}
          onChange={(e) => setDataToLog(e.target.value)}
          rows={3}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Path to data you want to include in the log
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!message}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
