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

export const FileWriteForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [filePath, setFilePath] = useState(nodeData.filePath || "");
  const [content, setContent] = useState(nodeData.content || "");
  const [encoding, setEncoding] = useState(nodeData.encoding || "utf8");
  const [mode, setMode] = useState(nodeData.mode || "overwrite");

  const handleSave = () => {
    onSave({
      filePath,
      content,
      encoding,
      mode,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="filePath">File Path</Label>
        <Input
          id="filePath"
          placeholder="/path/to/output.txt or ./data/result.json"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="mode">Write Mode</Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger id="mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overwrite">Overwrite</SelectItem>
              <SelectItem value="append">Append</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="encoding">Encoding</Label>
          <Select value={encoding} onValueChange={setEncoding}>
            <SelectTrigger id="encoding">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utf8">UTF-8</SelectItem>
              <SelectItem value="ascii">ASCII</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          className="font-mono text-sm"
          placeholder="Content to write or data path (e.g., data.output)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!filePath || !content}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
