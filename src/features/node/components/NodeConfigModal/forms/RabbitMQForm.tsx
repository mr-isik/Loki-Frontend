import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    RabbitMQFormValues,
    rabbitMQSchema,
} from "@/features/node/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const RabbitMQForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RabbitMQFormValues>({
    resolver: zodResolver(rabbitMQSchema),
    defaultValues: {
      host: nodeData.host || "localhost",
      port: nodeData.port || 5672,
      username: nodeData.username || "",
      password: nodeData.password || "",
      queue: nodeData.queue || "",
      exchange: nodeData.exchange || "",
      routingKey: nodeData.routingKey || "",
      message: nodeData.message || "",
    },
  });

  const onSubmit = (data: RabbitMQFormValues) => {
    onSave(data);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3 p-3 border rounded-md">
        <h4 className="text-sm font-medium">Connection</h4>
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
              placeholder="5672"
              type="number"
              {...register("port", { valueAsNumber: true })}
            />
            {errors.port && (
              <p className="text-sm text-red-500">{errors.port.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="guest"
              {...register("username")}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="guest"
              {...register("password")}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="queue">Queue Name</Label>
          <Input
            id="queue"
            placeholder="my_queue"
            {...register("queue")}
          />
          {errors.queue && (
            <p className="text-sm text-red-500">{errors.queue.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="exchange">Exchange (Optional)</Label>
          <Input
            id="exchange"
            placeholder="amq.direct"
            {...register("exchange")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="routingKey">Routing Key (Optional)</Label>
        <Input
          id="routingKey"
          placeholder="my.routing.key"
          {...register("routingKey")}
        />
      </div>

      <div>
        <Label htmlFor="message">Message Content</Label>
        <Textarea
          id="message"
          placeholder='{"task": "process_image", "id": 123}'
          rows={4}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message.message}</p>
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
