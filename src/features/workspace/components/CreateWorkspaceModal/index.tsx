/**
 * Create Workspace Modal Component
 * Following Single Responsibility Principle
 */

"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useCreateWorkspace } from "../../hooks/useQueries";
import { CreateWorkspaceFormData } from "../../validation";
import { CreateWorkspaceForm } from "../CreateWorkspaceForm";

interface CreateWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateWorkspaceModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateWorkspaceModalProps) {
  const { mutate: createWorkspace, isPending } = useCreateWorkspace();

  const handleSubmit = (data: CreateWorkspaceFormData) => {
    createWorkspace(data, {
      onSuccess: () => {
        toast.success("Workspace created successfully");
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create workspace");
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Create Workspace</SheetTitle>
          <SheetDescription>
            Create a new workspace to organize your workflows and team.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 px-4">
          <CreateWorkspaceForm
            onSubmit={handleSubmit}
            isPending={isPending}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
