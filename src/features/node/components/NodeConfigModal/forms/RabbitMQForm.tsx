import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const RabbitMQForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [host, setHost] = useState(nodeData.host || "localhost");
  const [port, setPort] = useState(nodeData.port || "5672");
  const [username, setUsername] = useState(nodeData.username || "guest");
  const [password, setPassword] = useState(nodeData.password || "guest");
  const [queue, setQueue] = useState(nodeData.queue || "");
  const [exchange, setExchange] = useState(nodeData.exchange || "");
  const [routingKey, setRoutingKey] = useState(nodeData.routingKey || "");
  const [message, setMessage] = useState(nodeData.message || "");

  const handleSave = () => {
    onSave({
      host,
      port: parseInt(port),
      username,
      password,
      queue,
      exchange,
      routingKey,
      message,
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
            placeholder="5672"
            value={port}
            onChange={(e) => setPort(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="guest"
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

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="queue">Queue</Label>
          <Input
            id="queue"
            placeholder="my-queue"
            value={queue}
            onChange={(e) => setQueue(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="exchange">Exchange</Label>
          <Input
            id="exchange"
            placeholder="my-exchange"
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="routingKey">Routing Key</Label>
          <Input
            id="routingKey"
            placeholder="routing.key"
            value={routingKey}
            onChange={(e) => setRoutingKey(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          className="font-mono text-sm"
          placeholder='{"event": "data"}'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!queue || !message}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
