/**
 * Node Style Utilities
 * Following Single Responsibility Principle
 */

import {
  Globe,
  Terminal,
  MessageSquare,
  Zap,
  GitBranch,
  RefreshCw,
  Webhook as WebhookIcon,
  Clock,
  Timer,
  GitMerge,
  Settings as SettingsIcon,
  Code2,
  FileText,
  FileInput,
  FileOutput,
  Database,
  Mail,
  LucideIcon,
  Slack,
  Share2,
} from "lucide-react";

export interface NodeColors {
  main: string;
  border: string;
  borderBottom: string;
  borderRight: string;
  icon: string;
  iconBg: string;
}

/**
 * Get icon component for node type
 */
export const getNodeIcon = (nodeType: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    // Integration nodes
    http_request: Globe,
    db_postgres: Database,
    db_mysql: Database,
    email_smtp: Mail,
    slack: Slack,
    mq_rabbitmq_publish: Share2,

    // Utility nodes
    shell_command: Terminal,
    set_data: SettingsIcon,
    code_js: Code2,
    log: FileText,
    file_read: FileInput,
    file_write: FileOutput,

    // Control nodes
    condition: GitBranch,
    loop: RefreshCw,
    wait: Timer,
    merge: GitMerge,

    // Trigger nodes
    webhook: WebhookIcon,
    cron: Clock,

    // Deprecated/Legacy
    api_call: Globe,
    discord_message: MessageSquare,
  };

  return iconMap[nodeType] || Zap;
};

/**
 * Get color scheme for node category
 */
export const getNodeColor = (nodeType: string): NodeColors => {
  // Category-based colors
  const categoryColors: Record<string, NodeColors> = {
    integration: {
      main: "#3B82F6", // Blue
      border: "border-[#3B82F6]",
      borderBottom: "border-b-[#2563EB]",
      borderRight: "border-r-[#2563EB]",
      icon: "text-white",
      iconBg: "bg-[#3B82F6]",
    },
    utility: {
      main: "#10B981", // Green
      border: "border-[#10B981]",
      borderBottom: "border-b-[#059669]",
      borderRight: "border-r-[#059669]",
      icon: "text-white",
      iconBg: "bg-[#10B981]",
    },
    control: {
      main: "#F59E0B", // Amber/Orange
      border: "border-[#F59E0B]",
      borderBottom: "border-b-[#D97706]",
      borderRight: "border-r-[#D97706]",
      icon: "text-white",
      iconBg: "bg-[#F59E0B]",
    },
    trigger: {
      main: "#8B5CF6", // Purple
      border: "border-[#8B5CF6]",
      borderBottom: "border-b-[#7C3AED]",
      borderRight: "border-r-[#7C3AED]",
      icon: "text-white",
      iconBg: "bg-[#8B5CF6]",
    },
  };

  // Map node types to categories
  const integrationNodes = [
    "http_request",
    "db_postgres",
    "db_mysql",
    "email_smtp",
    "slack",
    "mq_rabbitmq_publish",
    "api_call",
  ];
  const utilityNodes = [
    "shell_command",
    "set_data",
    "code_js",
    "log",
    "file_read",
    "file_write",
  ];
  const controlNodes = ["condition", "loop", "wait", "merge"];
  const triggerNodes = ["webhook", "cron"];

  if (integrationNodes.includes(nodeType)) return categoryColors.integration;
  if (utilityNodes.includes(nodeType)) return categoryColors.utility;
  if (controlNodes.includes(nodeType)) return categoryColors.control;
  if (triggerNodes.includes(nodeType)) return categoryColors.trigger;

  if (nodeType === "discord_message") {
    return {
      main: "#5865F2",
      border: "border-[#5865F2]",
      borderBottom: "border-b-[#4752C4]",
      borderRight: "border-r-[#4752C4]",
      icon: "text-white",
      iconBg: "bg-[#5865F2]",
    };
  }

  return {
    main: "#6B7280",
    border: "border-[#6B7280]",
    borderBottom: "border-b-[#4B5563]",
    borderRight: "border-r-[#4B5563]",
    icon: "text-white",
    iconBg: "bg-[#6B7280]",
  };
};
