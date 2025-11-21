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
    FileReadFormValues,
    fileReadSchema,
} from "@/features/node/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const FileReadForm = ({
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
  } = useForm<FileReadFormValues>({
    resolver: zodResolver(fileReadSchema),
    defaultValues: {
      filePath: nodeData.filePath || "",
      encoding: nodeData.encoding || "utf8",
      parseAs: nodeData.parseAs || "text",
    },
  });

  const parseAs = watch("parseAs");
  const encoding = watch("encoding");

  const onSubmit = (data: FileReadFormValues) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="filePath">File Path</Label>
        <Input
          id="filePath"
          placeholder="/path/to/file.txt or ./data/config.json"
          {...register("filePath")}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Absolute or relative path to the file
        </p>
        {errors.filePath && (
          <p className="text-sm text-red-500">{errors.filePath.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="parseAs">Parse As</Label>
        <Select
          value={parseAs}
          onValueChange={(val) =>
            setValue("parseAs", val as FileReadFormValues["parseAs"])
          }
        >
          <SelectTrigger id="parseAs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="binary">Binary</SelectItem>
            <SelectItem value="base64">Base64</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {parseAs === "text" && (
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
              <SelectItem value="utf16le">UTF-16 LE</SelectItem>
              <SelectItem value="latin1">Latin-1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

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
