import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    SetDataFormValues,
    setDataSchema,
} from "@/features/node/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const SetDataForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SetDataFormValues>({
    resolver: zodResolver(setDataSchema),
    defaultValues: {
      data: nodeData.data || "{}",
    },
  });

  const onSubmit = (data: SetDataFormValues) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="data">JSON Data</Label>
        <Textarea
          id="data"
          className="font-mono text-sm"
          placeholder='{"key": "value"}'
          rows={10}
          {...register("data")}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Enter a valid JSON object to set as the output of this node.
        </p>
        {errors.data && (
          <p className="text-sm text-red-500">{errors.data.message}</p>
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
