/**
 * Auto-save hook for workflow changes
 * Following Single Responsibility - Handles debounced save logic
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface UseAutoSaveOptions {
  onSave: () => void | Promise<void>;
  delay?: number; // Delay in milliseconds
  enabled?: boolean;
}

/**
 * Hook for auto-saving with debounce
 * Following Dependency Inversion - Depends on save callback abstraction
 */
export const useAutoSave = ({
  onSave,
  delay = 2000,
  enabled = true,
}: UseAutoSaveOptions) => {
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger auto-save with debounce
  const triggerAutoSave = useCallback(() => {
    if (!enabled) return;

    setHasUnsavedChanges(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await onSave();
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setIsSaving(false);
      }
    }, delay);
  }, [onSave, delay, enabled]);

  // Manual save
  const saveNow = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsSaving(true);
    try {
      await onSave();
      setHasUnsavedChanges(false);
      toast.success("Workflow saved");
    } catch (error) {
      toast.error("Failed to save workflow");
      console.error("Manual save failed:", error);
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isSaving,
    hasUnsavedChanges,
    triggerAutoSave,
    saveNow,
  };
};
