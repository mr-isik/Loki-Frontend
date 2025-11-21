/**
 * HTTP Request Form Component
 * Following Single Responsibility Principle
 */

"use client";

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
    HttpRequestFormValues,
    httpRequestSchema,
} from "@/features/node/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BaseNodeFormProps } from "../BaseNodeForm";

export const HttpRequestForm = ({
  nodeData,
  onSave,
  onCancel,
}: BaseNodeFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HttpRequestFormValues>({
    resolver: zodResolver(httpRequestSchema),
    defaultValues: {
      method: nodeData.method || "GET",
      url: nodeData.url || "",
      headers:
        typeof nodeData.headers === "string"
          ? nodeData.headers
          : JSON.stringify(nodeData.headers || {}, null, 2),
      body:
        typeof nodeData.body === "string"
          ? nodeData.body
          : JSON.stringify(nodeData.body || {}, null, 2),
    },
  });

  const method = watch("method");

  const onSubmit = (data: HttpRequestFormValues) => {
    onSave({
      ...data,
      headers: data.headers ? JSON.parse(data.headers) : {},
      body: data.body ? JSON.parse(data.body) : {},
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="method">HTTP Method</Label>
        <Select
          value={method}
          onValueChange={(val) =>
            setValue("method", val as HttpRequestFormValues["method"])
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
        {errors.method && (
          <p className="text-sm text-red-500">{errors.method.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          placeholder="https://api.example.com/endpoint"
          {...register("url")}
        />
        {errors.url && (
          <p className="text-sm text-red-500">{errors.url.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="headers">Headers (JSON)</Label>
        <Textarea
          id="headers"
          placeholder='{"Content-Type": "application/json"}'
          rows={4}
          {...register("headers")}
        />
        {errors.headers && (
          <p className="text-sm text-red-500">{errors.headers.message}</p>
        )}
      </div>

      {method !== "GET" && (
        <div className="space-y-2">
          <Label htmlFor="body">Body (JSON)</Label>
          <Textarea
            id="body"
            placeholder='{"key": "value"}'
            rows={6}
            {...register("body")}
          />
          {errors.body && (
            <p className="text-sm text-red-500">{errors.body.message}</p>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)}>Save</Button>
      </div>
    </div>
  );
};
