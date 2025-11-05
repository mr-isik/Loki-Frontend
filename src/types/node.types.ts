/**
 * Node type definitions for the automation system
 * Following Single Responsibility Principle - each type has a clear purpose
 */

export enum NodeType {
  API_CALL = 'api_call',
  SHELL_COMMAND = 'shell_command',
  DISCORD_MESSAGE = 'discord_message',
}

export interface BaseNode {
  id: string;
  name: string;
  type: NodeType;
  description: string;
  icon: string;
  category: string;
}

export interface ApiCallNode extends BaseNode {
  type: NodeType.API_CALL;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
}

export interface ShellCommandNode extends BaseNode {
  type: NodeType.SHELL_COMMAND;
  command: string;
  shell: 'bash' | 'powershell' | 'cmd';
}

export interface DiscordMessageNode extends BaseNode {
  type: NodeType.DISCORD_MESSAGE;
  webhookUrl?: string;
  channelId?: string;
}

export type AutomationNode = ApiCallNode | ShellCommandNode | DiscordMessageNode;

/**
 * Type guard functions for type safety
 * Following Interface Segregation Principle
 */
export const isApiCallNode = (node: AutomationNode): node is ApiCallNode => {
  return node.type === NodeType.API_CALL;
};

export const isShellCommandNode = (node: AutomationNode): node is ShellCommandNode => {
  return node.type === NodeType.SHELL_COMMAND;
};

export const isDiscordMessageNode = (node: AutomationNode): node is DiscordMessageNode => {
  return node.type === NodeType.DISCORD_MESSAGE;
};
