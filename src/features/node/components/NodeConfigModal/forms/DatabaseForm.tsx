import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    DatabaseFormValues,
    databaseSchema,
} from "@/features/node/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const DatabaseForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<DatabaseFormValues>({
    resolver: zodResolver(databaseSchema),
    defaultValues: {
      host: nodeData.host || "localhost",
      port: nodeData.port || 5432,
      database: nodeData.database || "",
      username: nodeData.username || "",
      password: nodeData.password || "",
      query: nodeData.query || "",
    },
  });

  const onSubmit = (data: DatabaseFormValues) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            placeholder="localhost"
            {...register("host")}
          />
          {errors.host && (
            <p className="text-sm text-red-500">{errors.host.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            placeholder="5432"
            type="number"
            {...register("port", { valueAsNumber: true })}
          />
          {errors.port && (
            <p className="text-sm text-red-500">{errors.port.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="database">Database Name</Label>
        <Input
          id="database"
          placeholder="my_database"
          {...register("database")}
        />
        {errors.database && (
          <p className="text-sm text-red-500">{errors.database.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="user"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="query">SQL Query</Label>
        <Textarea
          id="query"
          className="font-mono text-sm"
          placeholder="SELECT * FROM users WHERE id = $1"
          rows={6}
          {...register("query")}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Use $1, $2, etc. for parameterized queries
        </p>
        {errors.query && (
          <p className="text-sm text-red-500">{errors.query.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
