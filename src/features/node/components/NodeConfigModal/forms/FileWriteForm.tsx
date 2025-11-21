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
    FileWriteFormValues,
    fileWriteSchema,
} from "@/features/node/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const FileWriteForm = ({
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
  } = useForm<FileWriteFormValues>({
    resolver: zodResolver(fileWriteSchema),
    defaultValues: {
      filePath: nodeData.filePath || "",
      content: nodeData.content || "",
      encoding: nodeData.encoding || "utf8",
      mode: nodeData.mode || "overwrite",
    },
  });

  const mode = watch("mode");
  const encoding = watch("encoding");

  const onSubmit = (data: FileWriteFormValues) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="filePath">File Path</Label>
        <Input
          id="filePath"
          placeholder="/path/to/output.txt or ./data/result.json"
          {...register("filePath")}
        />
        {errors.filePath && (
          <p className="text-sm text-red-500">{errors.filePath.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="mode">Write Mode</Label>
          <Select
            value={mode}
            onValueChange={(val) =>
              setValue("mode", val as FileWriteFormValues["mode"])
            }
          >
            <SelectTrigger id="mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overwrite">Overwrite</SelectItem>
              <SelectItem value="append">Append</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="encoding">Encoding</Label>
          <Select
            value={encoding}
            onValueChange={(val) => setValue("encoding", val)}
          >
            <SelectTrigger id="encoding">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utf8">UTF-8</SelectItem>
              <SelectItem value="ascii">ASCII</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          className="font-mono text-sm"
          placeholder="Content to write or data path (e.g., data.output)"
          rows={8}
          {...register("content")}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
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
