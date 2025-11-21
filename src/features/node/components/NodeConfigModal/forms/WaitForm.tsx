
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
import {
    WaitFormValues,
    waitSchema,
} from "@/features/node/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const WaitForm = ({
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
  } = useForm<WaitFormValues>({
    resolver: zodResolver(waitSchema),
    defaultValues: {
      duration: nodeData.duration || 1,
      unit: nodeData.unit || "seconds",
    },
  });

  const unit = watch("unit");

  const onSubmit = (data: WaitFormValues) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            type="number"
            min="0"
            placeholder="5"
            {...register("duration", { valueAsNumber: true })}
          />
          {errors.duration && (
            <p className="text-sm text-red-500">{errors.duration.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="unit">Unit</Label>
          <Select
            value={unit}
            onValueChange={(val) =>
              setValue("unit", val as WaitFormValues["unit"])
            }
          >
            <SelectTrigger id="unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seconds">Seconds</SelectItem>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="days">Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-muted/50 p-3 rounded-md">
        <p className="text-sm text-muted-foreground">
          The workflow execution will pause for the specified duration before
          continuing to the next node.
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
