import { Button } from "@/components/ui/button";
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
    ShellCommandFormValues,
    shellCommandSchema,
} from "@/features/node/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const ShellCommandForm = ({
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
  } = useForm<ShellCommandFormValues>({
    resolver: zodResolver(shellCommandSchema),
    defaultValues: {
      command: nodeData.command || "",
      shell: nodeData.shell || "bash",
    },
  });

  const shell = watch("shell");

  const onSubmit = (data: ShellCommandFormValues) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="shell">Shell</Label>
        <Select
          value={shell}
          onValueChange={(val) =>
            setValue("shell", val as ShellCommandFormValues["shell"])
          }
        >
          <SelectTrigger id="shell">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bash">Bash</SelectItem>
            <SelectItem value="sh">Sh</SelectItem>
            <SelectItem value="powershell">PowerShell</SelectItem>
            <SelectItem value="cmd">CMD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="command">Command</Label>
        <Textarea
          id="command"
          className="font-mono"
          placeholder="echo 'Hello World'"
          rows={8}
          {...register("command")}
        />
        {errors.command && (
          <p className="text-sm text-red-500">{errors.command.message}</p>
        )}
      </div>

      <div className="bg-muted/50 p-3 rounded-md">
        <p className="text-xs text-muted-foreground">
          Commands are executed in the environment where the workflow engine is
          running. Use with caution.
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
