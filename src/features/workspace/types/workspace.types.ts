/**
 * Workspace type definitions
 * Following Single Responsibility Principle - clear type definitions
 */

import { Workspace as WorkspaceFromAPI } from "../validation";

// Re-export the API workspace type as the primary workspace type
export type Workspace = WorkspaceFromAPI;

export interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  setCurrentWorkspace: (workspace: Workspace) => void;
}
