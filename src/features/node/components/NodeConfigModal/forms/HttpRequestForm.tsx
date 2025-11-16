/**
 * HTTP Request Form Component
 * Following Single Responsibility Principle
 */

"use client";

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

export const HttpRequestForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [method, setMethod] = useState(nodeData.method || "GET");
  const [url, setUrl] = useState(nodeData.url || "");
  const [headers, setHeaders] = useState(
    JSON.stringify(nodeData.headers || {}, null, 2)
  );
  const [body, setBody] = useState(
    JSON.stringify(nodeData.body || {}, null, 2)
  );

  const handleSave = () => {
    try {
      onSave({
        method,
        url,
        headers: headers ? JSON.parse(headers) : {},
        body: body ? JSON.parse(body) : {},
      });
    } catch {
      alert("Invalid JSON format in headers or body");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="method">HTTP Method</Label>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="headers">Headers (JSON)</Label>
        <Textarea
          id="headers"
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder='{"Content-Type": "application/json"}'
          rows={4}
        />
      </div>

      {method !== "GET" && (
        <div className="space-y-2">
          <Label htmlFor="body">Body (JSON)</Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"key": "value"}'
            rows={6}
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};
