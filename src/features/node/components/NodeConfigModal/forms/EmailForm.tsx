import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const EmailForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const [smtpHost, setSmtpHost] = useState(nodeData.smtpHost || "");
  const [smtpPort, setSmtpPort] = useState(nodeData.smtpPort || "587");
  const [smtpUser, setSmtpUser] = useState(nodeData.smtpUser || "");
  const [smtpPassword, setSmtpPassword] = useState(nodeData.smtpPassword || "");
  const [from, setFrom] = useState(nodeData.from || "");
  const [to, setTo] = useState(nodeData.to || "");
  const [subject, setSubject] = useState(nodeData.subject || "");
  const [body, setBody] = useState(nodeData.body || "");

  const handleSave = () => {
    onSave({
      smtpHost,
      smtpPort: parseInt(smtpPort),
      smtpUser,
      smtpPassword,
      from,
      to,
      subject,
      body,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3 p-3 border rounded-md">
        <h4 className="text-sm font-medium">SMTP Configuration</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input
              id="smtpHost"
              placeholder="smtp.gmail.com"
              value={smtpHost}
              onChange={(e) => setSmtpHost(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="smtpPort">Port</Label>
            <Input
              id="smtpPort"
              placeholder="587"
              value={smtpPort}
              onChange={(e) => setSmtpPort(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="smtpUser">Username</Label>
            <Input
              id="smtpUser"
              placeholder="your@email.com"
              value={smtpUser}
              onChange={(e) => setSmtpUser(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="smtpPassword">Password</Label>
            <Input
              id="smtpPassword"
              type="password"
              placeholder="••••••••"
              value={smtpPassword}
              onChange={(e) => setSmtpPassword(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="from">From</Label>
          <Input
            id="from"
            placeholder="sender@example.com"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="to">To</Label>
          <Input
            id="to"
            placeholder="recipient@example.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="Email subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="body">Body</Label>
        <Textarea
          id="body"
          placeholder="Email content..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!smtpHost || !from || !to || !subject}
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
