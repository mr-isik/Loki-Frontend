import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    SlackFormValues,
    slackSchema,
} from "@/features/node/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const SlackForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SlackFormValues>({
    resolver: zodResolver(slackSchema),
    defaultValues: {
      webhookUrl: nodeData.webhookUrl || "",
      channel: nodeData.channel || "",
      username: nodeData.username || "",
      message: nodeData.message || "",
    },
  });

  const onSubmit = (data: SlackFormValues) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="webhookUrl">Webhook URL</Label>
        <Input
          id="webhookUrl"
          placeholder="https://hooks.slack.com/services/..."
          {...register("webhookUrl")}
        />
        {errors.webhookUrl && (
          <p className="text-sm text-red-500">{errors.webhookUrl.message}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Create a webhook in your Slack workspace settings
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="channel">Channel (Optional)</Label>
          <Input
            id="channel"
            placeholder="#general"
            {...register("channel")}
          />
        </div>
        <div>
          <Label htmlFor="username">Username (Optional)</Label>
          <Input
            id="username"
            placeholder="Bot Name"
            {...register("username")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Hello from Loki!"
          rows={4}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message.message}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Supports Slack markdown formatting
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} disabled={!isValid}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
