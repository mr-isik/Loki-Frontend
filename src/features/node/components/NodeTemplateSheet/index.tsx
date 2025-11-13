/**
 * NodeTemplateSheet Component
 * Following Single Responsibility Principle - Handles node template selection
 */

"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNodeTemplates } from "../../hooks/useQueries";
import { NodeTemplateResponse } from "../../validation";

interface NodeTemplateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: NodeTemplateResponse) => void;
}

/**
 * NodeTemplateSheet - Shows available node templates
 * Following Open/Closed Principle - Easy to extend with new categories
 */
export const NodeTemplateSheet = ({
  open,
  onOpenChange,
  onSelectTemplate,
}: NodeTemplateSheetProps) => {
  const { data: templatesData, isLoading } = useNodeTemplates();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter templates based on search query
  const filteredTemplates = useMemo(() => {
    if (!templatesData?.templates) return [];
    if (!searchQuery.trim()) return templatesData.templates;

    const query = searchQuery.toLowerCase();
    return templatesData.templates.filter(
      (template: NodeTemplateResponse) =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query)
    );
  }, [templatesData, searchQuery]);

  // Group templates by category
  const groupedTemplates = useMemo(() => {
    const groups: Record<string, NodeTemplateResponse[]> = {};
    filteredTemplates.forEach((template: NodeTemplateResponse) => {
      if (!groups[template.category]) {
        groups[template.category] = [];
      }
      groups[template.category].push(template);
    });
    return groups;
  }, [filteredTemplates]);

  const handleSelectTemplate = (template: NodeTemplateResponse) => {
    onSelectTemplate(template);
    onOpenChange(false);
    setSearchQuery(""); // Reset search on close
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Node</SheetTitle>
          <SheetDescription>
            Choose a node template to add to your workflow
          </SheetDescription>
        </SheetHeader>

        {/* Search Input */}
        <div className="mt-6 mb-4 px-4">
          <InputGroup>
            <InputGroupAddon>
              <Search className="w-4 h-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </div>

        {/* Templates List */}
        <div className="space-y-6 mt-4 px-4">
          {isLoading ? (
            // Loading state
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : Object.keys(groupedTemplates).length === 0 ? (
            // Empty state
            <div className="text-center py-8 text-muted-foreground">
              <p>No templates found</p>
              {searchQuery && (
                <p className="text-sm mt-2">Try adjusting your search query</p>
              )}
            </div>
          ) : (
            // Templates grouped by category
            Object.entries(groupedTemplates).map(([category, templates]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-accent hover:border-primary transition-colors"
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <div className="font-semibold text-left">
                        {template.name}
                      </div>
                      <div className="text-xs text-muted-foreground text-left line-clamp-2">
                        {template.description}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
