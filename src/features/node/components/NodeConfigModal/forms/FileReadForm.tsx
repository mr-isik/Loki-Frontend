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

export const FileReadForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [filePath, setFilePath] = useState(nodeData.filePath || "");
  const [encoding, setEncoding] = useState(nodeData.encoding || "utf8");
  const [parseAs, setParseAs] = useState(nodeData.parseAs || "text");

  const handleSave = () => {
    onSave({
      filePath,
      encoding,
      parseAs,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="filePath">File Path</Label>
        <Input
          id="filePath"
          placeholder="/path/to/file.txt or ./data/config.json"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Absolute or relative path to the file
        </p>
      </div>

      <div>
        <Label htmlFor="parseAs">Parse As</Label>
        <Select value={parseAs} onValueChange={setParseAs}>
          <SelectTrigger id="parseAs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="binary">Binary</SelectItem>
            <SelectItem value="base64">Base64</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {parseAs === "text" && (
        <div>
          <Label htmlFor="encoding">Encoding</Label>
          <Select value={encoding} onValueChange={setEncoding}>
            <SelectTrigger id="encoding">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utf8">UTF-8</SelectItem>
              <SelectItem value="ascii">ASCII</SelectItem>
              <SelectItem value="utf16le">UTF-16 LE</SelectItem>
              <SelectItem value="latin1">Latin-1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!filePath}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
