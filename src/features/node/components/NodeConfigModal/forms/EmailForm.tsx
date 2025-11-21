import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    EmailFormValues,
    emailSchema,
} from "@/features/node/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const EmailForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      smtpHost: nodeData.smtpHost || "",
      smtpPort: nodeData.smtpPort || 587,
      smtpUser: nodeData.smtpUser || "",
      smtpPassword: nodeData.smtpPassword || "",
      from: nodeData.from || "",
      to: nodeData.to || "",
      subject: nodeData.subject || "",
      body: nodeData.body || "",
    },
  });

  const onSubmit = (data: EmailFormValues) => {
    onSave(data);
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
              {...register("smtpHost")}
            />
            {errors.smtpHost && (
              <p className="text-sm text-red-500">{errors.smtpHost.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="smtpPort">Port</Label>
            <Input
              id="smtpPort"
              placeholder="587"
              type="number"
              {...register("smtpPort", { valueAsNumber: true })}
            />
            {errors.smtpPort && (
              <p className="text-sm text-red-500">{errors.smtpPort.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="smtpUser">Username</Label>
            <Input
              id="smtpUser"
              placeholder="your@email.com"
              {...register("smtpUser")}
            />
          </div>
          <div>
            <Label htmlFor="smtpPassword">Password</Label>
            <Input
              id="smtpPassword"
              type="password"
              placeholder="••••••••"
              {...register("smtpPassword")}
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
            {...register("from")}
          />
          {errors.from && (
            <p className="text-sm text-red-500">{errors.from.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="to">To</Label>
          <Input
            id="to"
            placeholder="recipient@example.com"
            {...register("to")}
          />
          {errors.to && (
            <p className="text-sm text-red-500">{errors.to.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="Email subject"
          {...register("subject")}
        />
        {errors.subject && (
          <p className="text-sm text-red-500">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="body">Body</Label>
        <Textarea
          id="body"
          placeholder="Email content..."
          rows={6}
          {...register("body")}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
