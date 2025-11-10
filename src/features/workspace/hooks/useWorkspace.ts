/**
 * Workspace management hook
 * Following Single Responsibility Principle
 */

import { useState } from "react";
import { mockWorkspaces } from "../data/mockWorkspaces";
import { Workspace } from "../types/workspace.types";

export const useWorkspace = () => {
  const [workspaces] = useState<Workspace[]>(mockWorkspaces);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    mockWorkspaces[0]
  );

  return {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
  };
};
