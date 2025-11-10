import { Workspace } from "../types/workspace.types";

/**
 * Mock workspace data for demonstration
 * In production, this would come from an API
 */
export const mockWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Personal Projects",
    created_at: "2024-01-15",
  },
  {
    id: "ws-2",
    name: "Team Automations",
    created_at: "2024-02-01",
  },
  {
    id: "ws-3",
    name: "Development",
    created_at: "2024-02-10",
  },
];
