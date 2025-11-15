/**
 * Workflow Detail Page
 * Shows the workflow editor
 */

"use client";

import { AppHeader } from "@/components/shared/AppHeader";
import { Skeleton } from "@/components/ui/skeleton";
import WorkflowEditor from "@/features/workflow/components/WorkflowEditor";
import { WorkflowSettings } from "@/features/workflow/components/WorkflowSettings";
import { useLastWorkflow } from "@/features/workflow/hooks/useLastWorkflow";
import {
  useArchiveWorkflow,
  usePublishWorkflow,
  useUpdateWorkflow,
  useWorkflow,
} from "@/features/workflow/hooks/useQueries";
import { WorkflowStatus } from "@/types/workflow.types";
import { ReactFlowProvider } from "@xyflow/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function WorkflowPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const workflowId = params.workflowId as string;
  const { data: workflow, isLoading } = useWorkflow(workflowId);
  const { saveLastWorkflow } = useLastWorkflow(workspaceId);
  const { mutate: updateWorkflow } = useUpdateWorkflow();
  const { mutate: publishWorkflow } = usePublishWorkflow();
  const { mutate: archiveWorkflow } = useArchiveWorkflow();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Save as last workflow when viewing
  useEffect(() => {
    if (workflowId) {
      saveLastWorkflow(workflowId);
    }
  }, [workflowId, saveLastWorkflow]);

  const handleNameChange = (name: string) => {
    updateWorkflow(
      {
        workflowId,
        updates: { title: name },
      },
      {
        onSuccess: () => {
          toast.success("Workflow name updated");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update workflow name");
        },
      }
    );
  };

  const handlePublish = () => {
    publishWorkflow(workflowId, {
      onSuccess: () => {
        toast.success("Workflow published successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to publish workflow");
      },
    });
  };

  const handleArchive = () => {
    archiveWorkflow(workflowId, {
      onSuccess: () => {
        toast.success("Workflow archived");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to archive workflow");
      },
    });
  };

  const handleRun = () => {
    // TODO: Implement run workflow
    toast.info("Run workflow - Coming soon");
  };

  const handleSettings = () => {
    setSettingsOpen(true);
  };

  const handleSaveStateChange = (saving: boolean, unsaved: boolean) => {
    setIsSaving(saving);
    setHasUnsavedChanges(unsaved);
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Workflow not found</h2>
          <p className="text-muted-foreground">
            The workflow you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  // Map API status to WorkflowStatus enum
  const mapStatus = (status: string): WorkflowStatus => {
    const statusMap: Record<string, WorkflowStatus> = {
      draft: WorkflowStatus.DRAFT,
      running: WorkflowStatus.RUNNING,
      published: WorkflowStatus.PUBLISHED,
      paused: WorkflowStatus.PAUSED,
      failed: WorkflowStatus.FAILED,
    };
    return statusMap[status.toLowerCase()] || WorkflowStatus.DRAFT;
  };

  return (
    <>
      <AppHeader
        workflow={{
          id: workflow.id,
          name: workflow.title,
          status: mapStatus(workflow.status),
          createdAt: new Date(workflow.created_at),
          updatedAt: new Date(workflow.updated_at),
        }}
        onWorkflowNameChange={handleNameChange}
        onRun={handleRun}
        onPublish={handlePublish}
        onArchive={handleArchive}
        onSettings={handleSettings}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      <ReactFlowProvider>
        <WorkflowEditor
          workflowId={workflowId}
          onSaveStateChange={handleSaveStateChange}
        />
      </ReactFlowProvider>
      <WorkflowSettings
        workflowId={workflowId}
        workspaceId={workspaceId}
        workflowName={workflow.title}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </>
  );
}
