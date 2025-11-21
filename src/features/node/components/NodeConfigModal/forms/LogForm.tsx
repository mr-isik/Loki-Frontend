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
    LogFormValues,
    logSchema,
} from "@/features/node/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const LogForm = ({
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
  } = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      level: nodeData.level || "info",
      message: nodeData.message || "",
      dataToLog: nodeData.dataToLog || "",
    },
  });

  const level = watch("level");

  const onSubmit = (data: LogFormValues) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="level">Log Level</Label>
        <Select
          value={level}
          onValueChange={(val) => setValue("level", val as LogFormValues["level"])}
        >
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
        {errors.level && (
          <p className="text-sm text-red-500">{errors.level.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Input
          id="message"
          placeholder="e.g., Processing user data..."
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="dataToLog">Data to Log (Optional)</Label>
        <Textarea
          id="dataToLog"
          placeholder="e.g., data.user or response.body"
          rows={3}
          {...register("dataToLog")}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Path to data you want to include in the log
        </p>
        {errors.dataToLog && (
          <p className="text-sm text-red-500">{errors.dataToLog.message}</p>
        )}
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
