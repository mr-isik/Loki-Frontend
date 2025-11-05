"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { mockNodes, NodeService } from "@/data/mockNodes";
import { AutomationNode } from "@/types/node.types";
import { Zap } from "lucide-react";
import * as React from "react";
import { NodeList } from "./NodeList";
import { SearchInput } from "./SearchInput";

/**
 * AppSidebar Component
 * Single Responsibility: Main sidebar container with logo, search, and node list
 * Open/Closed Principle: Open for extension through props and composition
 *
 * Features:
 * - Logo display
 * - Search functionality with real-time filtering
 * - Scrollable node list with categorization
 * - Drag-and-drop support for nodes
 */
export function AppSidebar() {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Memoize filtered nodes for performance
  const filteredNodes = React.useMemo(() => {
    return NodeService.searchNodes(mockNodes, searchQuery);
  }, [searchQuery]);

  // Get unique categories for potential filtering
  const categories = React.useMemo(() => {
    return NodeService.getAllCategories(mockNodes);
  }, []);

  const handleNodeClick = React.useCallback((node: AutomationNode) => {
    console.log("Node selected:", node);
    // Here you can add logic to handle node selection
    // For example, opening a detail panel or adding to workflow
  }, []);

  const handleSearchChange = React.useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <Sidebar className="border-r">
      {/* Header with Logo */}
      <SidebarHeader className="border-b px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="w-full">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-base font-semibold">
                    Loki Automation
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Workflow Builder
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent className="flex flex-col gap-0">
        {/* Search Section */}
        <div className="px-4 py-3">
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search nodes..."
          />
        </div>

        {/* Node Categories Info */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Available Nodes</span>
            <span>
              {filteredNodes.length} of {mockNodes.length}
            </span>
          </div>
        </div>

        {/* Scrollable Node List */}
        <NodeList
          nodes={filteredNodes}
          onNodeClick={handleNodeClick}
          emptyMessage={
            searchQuery ? "No nodes match your search" : "No nodes available"
          }
        />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((category) => {
            const count = NodeService.getNodesByCategory(
              mockNodes,
              category
            ).length;
            return (
              <span
                key={category}
                className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                title={`${count} ${category} nodes`}
              >
                {category} ({count})
              </span>
            );
          })}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
