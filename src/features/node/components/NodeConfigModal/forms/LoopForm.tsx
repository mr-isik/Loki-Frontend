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
    LoopFormValues,
    loopSchema,
} from "@/features/node/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const LoopForm = ({
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
  } = useForm<LoopFormValues>({
    resolver: zodResolver(loopSchema),
    defaultValues: {
      dataSource: nodeData.dataSource || "",
      loopType: nodeData.loopType || "array",
      itemVariable: nodeData.itemVariable || "item",
      indexVariable: nodeData.indexVariable || "index",
      maxIterations: nodeData.maxIterations,
    },
  });

  const loopType = watch("loopType");

  const onSubmit = (data: LoopFormValues) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="loopType">Loop Type</Label>
        <Select
          value={loopType}
          onValueChange={(val) =>
            setValue("loopType", val as LoopFormValues["loopType"])
          }
        >
          <SelectTrigger id="loopType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="array">Array/List</SelectItem>
            <SelectItem value="object">Object Keys</SelectItem>
            <SelectItem value="range">Number Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dataSource">Data Source</Label>
        <Input
          id="dataSource"
          placeholder="e.g., data.items or response.users"
          {...register("dataSource")}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Path to the data you want to loop over
        </p>
        {errors.dataSource && (
          <p className="text-sm text-red-500">{errors.dataSource.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="itemVariable">Item Variable Name</Label>
          <Input
            id="itemVariable"
            placeholder="item"
            {...register("itemVariable")}
          />
        </div>
        <div>
          <Label htmlFor="indexVariable">Index Variable Name</Label>
          <Input
            id="indexVariable"
            placeholder="index"
            {...register("indexVariable")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="maxIterations">Max Iterations (Optional)</Label>
        <Input
          id="maxIterations"
          type="number"
          placeholder="Leave empty for unlimited"
          {...register("maxIterations", { valueAsNumber: true })}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Safety limit to prevent infinite loops
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
