/**
 * NodeFormRegistry
 * Following Registry Pattern - Maps node types to their forms
 * Following Open/Closed Principle - Easy to add new forms without modifying existing code
 */

import { ComponentType } from "react";
import { BaseNodeFormProps } from "./BaseNodeForm";
import { CodeJsForm } from "./forms/CodeJsForm";
import { ConditionForm } from "./forms/ConditionForm";
import { CronForm } from "./forms/CronForm";
import { DatabaseForm } from "./forms/DatabaseForm";
import { DefaultForm } from "./forms/DefaultForm";
import { EmailForm } from "./forms/EmailForm";
import { FileReadForm } from "./forms/FileReadForm";
import { FileWriteForm } from "./forms/FileWriteForm";
import { HttpRequestForm } from "./forms/HttpRequestForm";
import { LogForm } from "./forms/LogForm";
import { LoopForm } from "./forms/LoopForm";
import { MergeForm } from "./forms/MergeForm";
import { RabbitMQForm } from "./forms/RabbitMQForm";
import { SetDataForm } from "./forms/SetDataForm";
import { ShellCommandForm } from "./forms/ShellCommandForm";
import { SlackForm } from "./forms/SlackForm";
import { WaitForm } from "./forms/WaitForm";
import { WebhookForm } from "./forms/WebhookForm";

type NodeFormComponent = ComponentType<BaseNodeFormProps>;

// Registry: Maps type_key to form component
const formRegistry: Record<string, NodeFormComponent> = {
  // Integration nodes
  http_request: HttpRequestForm,
  db_postgres: DatabaseForm,
  db_mysql: DatabaseForm,
  email_smtp: EmailForm,
  slack: SlackForm,
  mq_rabbitmq_publish: RabbitMQForm,

  // Utility nodes
  shell_command: ShellCommandForm,
  set_data: SetDataForm,
  code_js: CodeJsForm,
  log: LogForm,
  file_read: FileReadForm,
  file_write: FileWriteForm,

  // Control nodes
  condition: ConditionForm,
  loop: LoopForm,
  wait: WaitForm,
  merge: MergeForm,

  // Trigger nodes
  webhook: WebhookForm,
  cron: CronForm,
};

/**
 * Get form component for a node type
 * Returns DefaultForm as fallback for unmapped types
 */
export const getNodeForm = (typeKey: string): NodeFormComponent => {
  return formRegistry[typeKey] || DefaultForm;
};
