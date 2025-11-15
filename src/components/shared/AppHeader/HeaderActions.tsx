import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Workflow,
  canPublishWorkflow,
  canRunWorkflow,
} from "@/types/workflow.types";
import { Archive, Check, Play, Settings, Upload } from "lucide-react";
import * as React from "react";

/**
 * HeaderActions Props
 * Following Interface Segregation Principle - only necessary callbacks
 */
interface HeaderActionsProps {
  workflow: Workflow;
  onRun: () => void;
  onPublish: () => void;
  onArchive?: () => void;
  onSettings: () => void;
  isRunning?: boolean;
  isPublishing?: boolean;
  isArchiving?: boolean;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  className?: string;
}

/**
 * HeaderActions Component
 * Single Responsibility: Render action buttons for workflow operations
 * Dependency Inversion: Depends on workflow interface, not concrete implementation
 */
export const HeaderActions: React.FC<HeaderActionsProps> = ({
  workflow,
  onRun,
  onPublish,
  onArchive,
  onSettings,
  isRunning = false,
  isPublishing = false,
  isArchiving = false,
  isSaving = false,
  hasUnsavedChanges = false,
  className,
}) => {
  const canRun = canRunWorkflow(workflow);
  const canPublish = canPublishWorkflow(workflow);

  // Show "Saved" message briefly after save completes
  const [showSaved, setShowSaved] = React.useState(false);
  const prevSavingRef = React.useRef(isSaving);

  React.useEffect(() => {
    // When saving transitions from true to false, show "Saved" message
    if (prevSavingRef.current && !isSaving && !hasUnsavedChanges) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      prevSavingRef.current = isSaving;
      return () => clearTimeout(timer);
    }

    prevSavingRef.current = isSaving;

    if (hasUnsavedChanges) {
      setShowSaved(false);
    }
  }, [isSaving, hasUnsavedChanges]);

  return (
    <div className={className}>
      <TooltipProvider>
        <div className="flex items-center gap-2">
          {/* Auto-save Status Indicator */}
          {(isSaving || showSaved) && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 text-sm">
              {isSaving ? (
                <>
                  <Spinner className="h-3 w-3" />
                  <span className="text-muted-foreground">Saving...</span>
                </>
              ) : (
                <>
                  <Check className="h-3 w-3 text-green-600" />
                  <span className="text-green-600 font-medium">Saved</span>
                </>
              )}
            </div>
          )}

          {/* Run Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onRun}
                disabled={!canRun || isRunning}
                variant="default"
                size="sm"
              >
                {isRunning ? (
                  <>
                    <Spinner />
                    Running
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {!canRun ? "Workflow is already running" : "Run the workflow"}
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Publish Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onPublish}
                disabled={!canPublish || isPublishing}
                variant="secondary"
                size="sm"
              >
                {isPublishing ? (
                  <>
                    <Spinner />
                    Publishing
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Publish
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {!canPublish
                  ? "Workflow must be in draft or paused state"
                  : "Publish the workflow"}
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Archive Button */}
          {onArchive && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onArchive}
                  disabled={isArchiving}
                  variant="outline"
                  size="sm"
                >
                  {isArchiving ? (
                    <>
                      <Spinner />
                      Archiving
                    </>
                  ) : (
                    <>
                      <Archive className="h-4 w-4" />
                      Archive
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Archive the workflow</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Settings Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onSettings} variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Workflow settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

HeaderActions.displayName = "HeaderActions";
