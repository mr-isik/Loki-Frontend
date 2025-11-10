/**
 * Create Workspace Form Component
 * Following Single Responsibility Principle
 */

"use client";

import { DynamicFormField } from "@/components/shared/DynamicFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  CreateWorkspaceFormData,
  createWorkspaceSchema,
} from "../../validation";

interface CreateWorkspaceFormProps {
  onSubmit: (data: CreateWorkspaceFormData) => void;
  isPending?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}

export function CreateWorkspaceForm({
  onSubmit,
  isPending = false,
  onCancel,
  submitLabel = "Create Workspace",
}: CreateWorkspaceFormProps) {
  const form = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DynamicFormField
          control={form.control}
          name="name"
          label="Workspace Name"
          placeholder="Enter workspace name"
          type="text"
          required
        />

        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
