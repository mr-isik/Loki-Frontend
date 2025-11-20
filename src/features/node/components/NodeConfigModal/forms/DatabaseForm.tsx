import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const DatabaseForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [host, setHost] = useState(nodeData.host || "localhost");
  const [port, setPort] = useState(nodeData.port || "5432");
  const [database, setDatabase] = useState(nodeData.database || "");
  const [username, setUsername] = useState(nodeData.username || "");
  const [password, setPassword] = useState(nodeData.password || "");
  const [query, setQuery] = useState(nodeData.query || "");

  const handleSave = () => {
    onSave({
      host,
      port: parseInt(port),
      database,
      username,
      password,
      query,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            placeholder="localhost"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            placeholder="5432"
            value={port}
            onChange={(e) => setPort(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="database">Database Name</Label>
        <Input
          id="database"
          placeholder="my_database"
          value={database}
          onChange={(e) => setDatabase(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="user"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="query">SQL Query</Label>
        <Textarea
          id="query"
          className="font-mono text-sm"
          placeholder="SELECT * FROM users WHERE id = $1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={6}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Use $1, $2, etc. for parameterized queries
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!database || !username || !query}
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
