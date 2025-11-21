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
    ConditionFormValues,
    conditionSchema,
} from "@/features/node/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const ConditionForm = ({
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
  } = useForm<ConditionFormValues>({
    resolver: zodResolver(conditionSchema),
    defaultValues: {
      field: nodeData.field || "",
      operator: nodeData.operator || "equals",
      value: nodeData.value || "",
      description: nodeData.description || "",
    },
  });

  const operator = watch("operator");

  const onSubmit = (data: ConditionFormValues) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="field">Field Path</Label>
        <Input
          id="field"
          placeholder="e.g., data.status or response.code"
          {...register("field")}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Path to the field you want to check
        </p>
        {errors.field && (
          <p className="text-sm text-red-500">{errors.field.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="operator">Operator</Label>
        <Select
          value={operator}
          onValueChange={(val) =>
            setValue("operator", val as ConditionFormValues["operator"])
          }
        >
          <SelectTrigger id="operator">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">Equals (==)</SelectItem>
            <SelectItem value="not_equals">Not Equals (!=)</SelectItem>
            <SelectItem value="greater_than">Greater Than (&gt;)</SelectItem>
            <SelectItem value="less_than">Less Than (&lt;)</SelectItem>
            <SelectItem value="contains">Contains</SelectItem>
            <SelectItem value="starts_with">Starts With</SelectItem>
            <SelectItem value="ends_with">Ends With</SelectItem>
            <SelectItem value="is_empty">Is Empty</SelectItem>
            <SelectItem value="is_not_empty">Is Not Empty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {operator !== "is_empty" && operator !== "is_not_empty" && (
        <div>
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            placeholder="Value to compare"
            {...register("value")}
          />
        </div>
      )}

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="What does this condition check?"
          rows={2}
          {...register("description")}
        />
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
