"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { WorkflowsSection } from "@/features/workflow/components/WorkflowsSection";
import { Navigation } from "@/features/workspace/components/Navigation";
import { WorkspaceSwitcher } from "@/features/workspace/components/WorkspaceSwitcher";

export function AppSidebar() {
  return (
    <Sidebar className="!border-r-2">
      {/* Workspace Switcher */}
      <SidebarHeader className="border-b-2 px-4 py-4">
        <WorkspaceSwitcher />
      </SidebarHeader>

      {/* Navigation Menu */}
      <SidebarContent className="px-2 py-4">
        <Navigation />
        <WorkflowsSection />
      </SidebarContent>
    </Sidebar>
  );
}
