import { AutomationNode, NodeType } from "@/types/node.types";

/**
 * Mock data for demonstration
 * In a real application, this would come from an API
 * Following Dependency Inversion Principle - data source is abstracted
 */

export const mockNodes: AutomationNode[] = [
  // API Call Nodes
  {
    id: "api-1",
    name: "Fetch User Data",
    type: NodeType.API_CALL,
    description: "Get user information from REST API",
    icon: "Globe",
    category: "API",
    method: "GET",
    endpoint: "/api/users",
  },
  {
    id: "api-2",
    name: "Create New User",
    type: NodeType.API_CALL,
    description: "POST request to create a new user",
    icon: "UserPlus",
    category: "API",
    method: "POST",
    endpoint: "/api/users",
  },
  {
    id: "api-3",
    name: "Update Profile",
    type: NodeType.API_CALL,
    description: "Update user profile information",
    icon: "RefreshCw",
    category: "API",
    method: "PUT",
    endpoint: "/api/users/:id",
  },
  {
    id: "api-4",
    name: "Delete Resource",
    type: NodeType.API_CALL,
    description: "Delete a resource from the server",
    icon: "Trash2",
    category: "API",
    method: "DELETE",
    endpoint: "/api/resources/:id",
  },
  {
    id: "api-5",
    name: "Fetch Analytics",
    type: NodeType.API_CALL,
    description: "Get analytics data from API",
    icon: "BarChart",
    category: "API",
    method: "GET",
    endpoint: "/api/analytics",
  },

  // Shell Command Nodes
  {
    id: "shell-1",
    name: "List Files",
    type: NodeType.SHELL_COMMAND,
    description: "List all files in directory",
    icon: "FolderOpen",
    category: "Shell",
    command: "ls -la",
    shell: "bash",
  },
  {
    id: "shell-2",
    name: "Git Status",
    type: NodeType.SHELL_COMMAND,
    description: "Check git repository status",
    icon: "GitBranch",
    category: "Shell",
    command: "git status",
    shell: "bash",
  },
  {
    id: "shell-3",
    name: "NPM Install",
    type: NodeType.SHELL_COMMAND,
    description: "Install npm dependencies",
    icon: "Package",
    category: "Shell",
    command: "npm install",
    shell: "bash",
  },
  {
    id: "shell-4",
    name: "Build Project",
    type: NodeType.SHELL_COMMAND,
    description: "Build the project for production",
    icon: "Hammer",
    category: "Shell",
    command: "npm run build",
    shell: "bash",
  },
  {
    id: "shell-5",
    name: "Docker Build",
    type: NodeType.SHELL_COMMAND,
    description: "Build Docker image",
    icon: "Container",
    category: "Shell",
    command: "docker build -t myapp .",
    shell: "bash",
  },
  {
    id: "shell-6",
    name: "PowerShell Script",
    type: NodeType.SHELL_COMMAND,
    description: "Run PowerShell script",
    icon: "Terminal",
    category: "Shell",
    command: "Get-Process",
    shell: "powershell",
  },

  // Discord Message Nodes
  {
    id: "discord-1",
    name: "Send Notification",
    type: NodeType.DISCORD_MESSAGE,
    description: "Send a notification to Discord channel",
    icon: "MessageSquare",
    category: "Discord",
    channelId: "123456789",
  },
  {
    id: "discord-2",
    name: "Alert on Error",
    type: NodeType.DISCORD_MESSAGE,
    description: "Send error alert to Discord",
    icon: "AlertTriangle",
    category: "Discord",
    webhookUrl: "https://discord.com/api/webhooks/...",
  },
  {
    id: "discord-3",
    name: "Daily Report",
    type: NodeType.DISCORD_MESSAGE,
    description: "Send daily report to team channel",
    icon: "FileText",
    category: "Discord",
    channelId: "987654321",
  },
  {
    id: "discord-4",
    name: "Deployment Success",
    type: NodeType.DISCORD_MESSAGE,
    description: "Notify team about successful deployment",
    icon: "CheckCircle",
    category: "Discord",
    webhookUrl: "https://discord.com/api/webhooks/...",
  },
  {
    id: "discord-5",
    name: "Status Update",
    type: NodeType.DISCORD_MESSAGE,
    description: "Send status update message",
    icon: "Bell",
    category: "Discord",
    channelId: "456789123",
  },
];

/**
 * Service class for node operations
 * Following Single Responsibility Principle
 */
export class NodeService {
  static searchNodes(nodes: AutomationNode[], query: string): AutomationNode[] {
    if (!query.trim()) return nodes;

    const lowerQuery = query.toLowerCase();
    return nodes.filter(
      (node) =>
        node.name.toLowerCase().includes(lowerQuery) ||
        node.description.toLowerCase().includes(lowerQuery) ||
        node.category.toLowerCase().includes(lowerQuery)
    );
  }

  static getNodesByType(
    nodes: AutomationNode[],
    type: NodeType
  ): AutomationNode[] {
    return nodes.filter((node) => node.type === type);
  }

  static getNodesByCategory(
    nodes: AutomationNode[],
    category: string
  ): AutomationNode[] {
    return nodes.filter((node) => node.category === category);
  }

  static getAllCategories(nodes: AutomationNode[]): string[] {
    return Array.from(new Set(nodes.map((node) => node.category)));
  }
}
