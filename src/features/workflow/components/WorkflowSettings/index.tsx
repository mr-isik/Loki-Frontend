/**
 * Workflow Settings Component
 * Allows users to manage workflow settings including deletion
 */

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteWorkflow } from "../../hooks/useQueries";

interface WorkflowSettingsProps {
  workflowId: string;
  workspaceId: string;
  workflowName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkflowSettings({
  workflowId,
  workspaceId,
  workflowName,
  open,
  onOpenChange,
}: WorkflowSettingsProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate: deleteWorkflow, isPending } = useDeleteWorkflow();

  const handleDelete = () => {
    deleteWorkflow(workflowId, {
      onSuccess: () => {
        toast.success("Workflow deleted successfully");
        setShowDeleteDialog(false);
        onOpenChange(false);
        router.push(`/workspace/${workspaceId}/workflows`);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete workflow");
      },
    });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Workflow Settings</SheetTitle>
            <SheetDescription>
              Manage settings for &quot;{workflowName}&quot;
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6 px-4">
            {/* General Settings Section */}
            <div>
              <h3 className="text-sm font-medium mb-3">General</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Workflow ID:</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {workflowId}
                  </code>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div>
              <div className="border border-destructive/20 rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-1">Delete Workflow</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Once you delete a workflow, there is no going back. Please
                    be certain.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Workflow
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              workflow &quot;{workflowName}&quot; and remove all associated
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Workflow
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
