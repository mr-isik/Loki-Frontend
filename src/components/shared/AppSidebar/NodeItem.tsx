import * as React from 'react';
import { AutomationNode } from '@/types/node.types';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * NodeItem Props Interface
 * Following Interface Segregation Principle - only necessary props
 */
interface NodeItemProps {
  node: AutomationNode;
  onClick?: (node: AutomationNode) => void;
  className?: string;
  isDragging?: boolean;
}

/**
 * NodeItem Component
 * Single Responsibility: Render a single node item
 * Open/Closed: Open for extension (styling, events) but closed for modification
 */
export const NodeItem: React.FC<NodeItemProps> = ({
  node,
  onClick,
  className,
  isDragging = false,
}) => {
  // Dynamically get the icon component
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[node.icon] || LucideIcons.Circle;

  const handleClick = () => {
    onClick?.(node);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(node));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 rounded-lg',
        'cursor-grab active:cursor-grabbing',
        'hover:bg-accent transition-colors duration-200',
        'border border-transparent hover:border-border',
        isDragging && 'opacity-50',
        className
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
        <IconComponent className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{node.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {node.description}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          {node.category}
        </span>
      </div>
    </div>
  );
};

NodeItem.displayName = 'NodeItem';
