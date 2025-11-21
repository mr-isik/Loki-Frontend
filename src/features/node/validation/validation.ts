import { z } from "zod";

// Helper for JSON string validation
const jsonStringSchema = z.string().refine(
  (val) => {
    if (!val) return true; // Allow empty string
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Invalid JSON format" }
);

export const httpRequestSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  url: z.string().url("Invalid URL format"),
  headers: jsonStringSchema.optional(),
  body: jsonStringSchema.optional(),
});

export const logSchema = z.object({
  level: z.enum(["debug", "info", "warn", "error"]),
  message: z.string().min(1, "Message is required"),
  dataToLog: z.string().optional(),
});

export const codeJsSchema = z.object({
  code: z.string().optional(),
});

export const conditionSchema = z.object({
  field: z.string().min(1, "Field path is required"),
  operator: z.enum([
    "equals",
    "not_equals",
    "greater_than",
    "less_than",
    "contains",
    "starts_with",
    "ends_with",
    "is_empty",
    "is_not_empty",
  ]),
  value: z.string().optional(),
  description: z.string().optional(),
});

export const cronSchema = z.object({
  cronExpression: z.string().min(1, "Cron expression is required"),
  timezone: z.string().default("America/New_York"),
  description: z.string().optional(),
});

export const databaseSchema = z.object({
  host: z.string().min(1, "Host is required"),
  port: z.number().min(1, "Port is required"),
  database: z.string().min(1, "Database name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().optional(),
  query: z.string().min(1, "Query is required"),
});

export const emailSchema = z.object({
  smtpHost: z.string().min(1, "SMTP Host is required"),
  smtpPort: z.number().min(1, "SMTP Port is required"),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  from: z.string().email("Invalid sender email"),
  to: z.string().email("Invalid recipient email"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().optional(),
});

export const fileReadSchema = z.object({
  filePath: z.string().min(1, "File path is required"),
  encoding: z.string().default("utf8"),
  parseAs: z.enum(["text", "json", "binary", "base64"]).default("text"),
});

export const fileWriteSchema = z.object({
  filePath: z.string().min(1, "File path is required"),
  content: z.string().min(1, "Content is required"),
  encoding: z.string().default("utf8"),
  mode: z.enum(["overwrite", "append"]).default("overwrite"),
});

export const loopSchema = z.object({
  loopType: z.enum(["array", "object", "range"]).default("array"),
  dataSource: z.string().min(1, "Data source is required"),
  itemVariable: z.string().default("item"),
  indexVariable: z.string().default("index"),
  maxIterations: z.number().optional(),
});

export const mergeSchema = z.object({
  mergeMode: z
    .enum(["wait_all", "first_complete", "combine_data"])
    .default("wait_all"),
  description: z.string().optional(),
});

export const rabbitMQSchema = z.object({
  host: z.string().min(1, "Host is required"),
  port: z.number().min(1, "Port is required"),
  username: z.string().optional(),
  password: z.string().optional(),
  queue: z.string().min(1, "Queue is required"),
  exchange: z.string().optional(),
  routingKey: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export const setDataSchema = z.object({
  data: jsonStringSchema.optional(),
});

export const shellCommandSchema = z.object({
  command: z.string().min(1, "Command is required"),
  shell: z.enum(["bash", "sh", "powershell", "cmd"]).default("bash"),
});

export const slackSchema = z.object({
  webhookUrl: z.string().url("Invalid Webhook URL"),
  channel: z.string().optional(),
  username: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export const waitSchema = z.object({
  duration: z.number().min(0, "Duration must be positive"),
  unit: z.enum(["seconds", "minutes", "hours", "days"]).default("seconds"),
});

export const webhookSchema = z.object({
  path: z.string().min(1, "Path is required"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).default("POST"),
  description: z.string().optional(),
});

export type HttpRequestFormValues = z.infer<typeof httpRequestSchema>;
export type LogFormValues = z.infer<typeof logSchema>;
export type CodeJsFormValues = z.infer<typeof codeJsSchema>;
export type ConditionFormValues = z.infer<typeof conditionSchema>;
export type CronFormValues = z.infer<typeof cronSchema>;
export type DatabaseFormValues = z.infer<typeof databaseSchema>;
export type EmailFormValues = z.infer<typeof emailSchema>;
export type FileReadFormValues = z.infer<typeof fileReadSchema>;
export type FileWriteFormValues = z.infer<typeof fileWriteSchema>;
export type LoopFormValues = z.infer<typeof loopSchema>;
export type MergeFormValues = z.infer<typeof mergeSchema>;
export type RabbitMQFormValues = z.infer<typeof rabbitMQSchema>;
export type SetDataFormValues = z.infer<typeof setDataSchema>;
export type ShellCommandFormValues = z.infer<typeof shellCommandSchema>;
export type SlackFormValues = z.infer<typeof slackSchema>;
export type WaitFormValues = z.infer<typeof waitSchema>;
export type WebhookFormValues = z.infer<typeof webhookSchema>;
