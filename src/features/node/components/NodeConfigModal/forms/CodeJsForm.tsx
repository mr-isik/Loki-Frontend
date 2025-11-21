import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    CodeJsFormValues,
    codeJsSchema,
} from "@/features/node/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const CodeJsForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CodeJsFormValues>({
    resolver: zodResolver(codeJsSchema),
    defaultValues: {
      code:
        nodeData.code ||
        `// Available variables:
// - input: Data from previous node
// - context: Workflow context

function execute(input, context) {
  // Your code here
  
  return {
    success: true,
    result: input
  };
}

return execute(input, context);`,
    },
  });

  const onSubmit = (data: CodeJsFormValues) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="code">JavaScript Code</Label>
        <Textarea
          id="code"
          className="font-mono text-sm"
          rows={16}
          {...register("code")}
        />
        {errors.code && (
          <p className="text-sm text-red-500">{errors.code.message}</p>
        )}
      </div>

      <div className="bg-muted/50 p-3 rounded-md space-y-2">
        <p className="text-sm font-medium">📝 Available Variables:</p>
        <ul className="text-xs text-muted-foreground space-y-1 ml-4">
          <li>
            <code className="bg-background px-1 rounded">input</code> - Data
            from previous node
          </li>
          <li>
            <code className="bg-background px-1 rounded">context</code> -
            Workflow context and metadata
          </li>
          <li>
            <code className="bg-background px-1 rounded">console.log()</code> -
            Write to workflow logs
          </li>
        </ul>
        <p className="text-xs text-muted-foreground pt-2">
          Return an object with your result. Use try/catch for error handling.
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
