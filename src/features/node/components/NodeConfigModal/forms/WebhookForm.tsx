
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
import {
    WebhookFormValues,
    webhookSchema,
} from "@/features/node/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const WebhookForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      path: nodeData.path || "/webhook",
      method: nodeData.method || "POST",
      description: nodeData.description || "",
    },
  });

  const method = watch("method");

  const onSubmit = (data: WebhookFormValues) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
          <Label htmlFor="method">Method</Label>
          <Select
            value={method}
            onValueChange={(val) =>
              setValue("method", val as WebhookFormValues["method"])
            }
          >
            <SelectTrigger id="method">
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
        <div className="col-span-2">
          <Label htmlFor="path">Path</Label>
          <Input
            id="path"
            placeholder="/my-webhook"
            {...register("path")}
          />
          {errors.path && (
            <p className="text-sm text-red-500">{errors.path.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Webhook description"
          rows={3}
          {...register("description")}
        />
      </div>

      <div className="bg-muted/50 p-3 rounded-md">
        <p className="text-sm font-medium mb-1">Webhook URL:</p>
        <code className="text-xs bg-background p-1 rounded block break-all">
          {`https://api.loki.com/webhooks${watch("path") || "..."}`}
        </code>
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
