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
    MergeFormValues,
    mergeSchema,
} from "@/features/node/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const MergeForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<MergeFormValues>({
    resolver: zodResolver(mergeSchema),
    defaultValues: {
      mergeMode: nodeData.mergeMode || "wait_all",
      description: nodeData.description || "",
    },
  });

  const mergeMode = watch("mergeMode");

  const onSubmit = (data: MergeFormValues) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="mergeMode">Merge Mode</Label>
        <Select
          value={mergeMode}
          onValueChange={(val) =>
            setValue("mergeMode", val as MergeFormValues["mergeMode"])
          }
        >
          <SelectTrigger id="mergeMode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wait_all">Wait for All Branches</SelectItem>
            <SelectItem value="first_complete">First to Complete</SelectItem>
            <SelectItem value="combine_data">Combine All Data</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          {mergeMode === "wait_all" &&
            "Wait until all branches complete before continuing"}
          {mergeMode === "first_complete" &&
            "Continue as soon as any branch completes"}
          {mergeMode === "combine_data" &&
            "Wait for all and merge their data into one object"}
        </p>
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="What are you merging?"
          rows={2}
          {...register("description")}
        />
      </div>

      <div className="bg-muted/50 p-3 rounded-md">
        <p className="text-sm text-muted-foreground">
          This node will receive data from multiple branches and merge them
          according to the selected mode.
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
