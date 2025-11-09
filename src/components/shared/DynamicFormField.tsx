"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { Checkbox } from "../ui/checkbox";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DynamicFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  placeholder?: string;
  description?: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "checkbox"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week"
    | "file"
    | "hidden"
    | "textarea"
    | "select";
  options?: SelectOption[]; // For select fields
  rows?: number; // For textarea
  disabled?: boolean;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  checkboxLabel?: string;
  showLabel?: boolean;
  size?: "sm" | "default";
}

export function DynamicFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder,
  description,
  type = "text",
  options = [],
  rows = 4,
  disabled = false,
  required = false,
  className,
  inputClassName,
  labelClassName,
  checkboxLabel,
  showLabel = true,
  size = "default",
}: DynamicFormFieldProps<TFieldValues, TName>) {
  const [showPassword, setShowPassword] = useState(false);

  const renderInput = (
    field: any,
    fieldState: { error?: { message?: string } }
  ) => {
    const isInvalid = !!fieldState.error;
    const baseProps = {
      ...field,
      placeholder,
      disabled,
      className: cn(inputClassName),
      "aria-invalid": isInvalid,
    };

    switch (type) {
      case "textarea":
        return <Textarea {...baseProps} rows={rows} />;

      case "select":
        return (
          <Select
            disabled={disabled}
            value={field.value || ""}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              aria-invalid={isInvalid}
              className={cn(inputClassName)}
              size={size}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  disabled={option.disabled}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "password":
        return (
          <div className="relative">
            <Input
              {...baseProps}
              className={cn("pr-10", inputClassName)}
              type={showPassword ? "text" : "password"}
            />
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className={cn("h-4 w-4 transition-colors")} />
              ) : (
                <Eye className={cn("h-4 w-4 transition-colors")} />
              )}
            </button>
          </div>
        );

      case "checkbox":
        return (
          <div className="inline-flex items-center">
            <Checkbox
              {...baseProps}
              checked={!!field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
            />
            {checkboxLabel && (
              <Label className={cn("ml-2 select-none", labelClassName)}>
                {checkboxLabel}
              </Label>
            )}
          </div>
        );

      default:
        return <Input {...baseProps} type={type} />;
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn("space-y-2", className)}>
          {showLabel && label && (
            <FormLabel
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 m-0",
                required &&
                  "after:content-['*'] after:ml-0.5 after:text-destructive",
                labelClassName
              )}
            >
              {label}
            </FormLabel>
          )}
          <FormControl>{renderInput(field, fieldState)}</FormControl>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Convenience wrapper for standalone use (without react-hook-form)
export interface StandaloneFormFieldProps {
  label?: string;
  placeholder?: string;
  description?: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week"
    | "file"
    | "hidden"
    | "textarea"
    | "select";
  options?: SelectOption[];
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
  size?: "sm" | "default";
}

export function StandaloneFormField({
  label,
  placeholder,
  description,
  type = "text",
  options = [],
  rows = 4,
  disabled = false,
  required = false,
  value = "",
  onChange,
  error,
  className,
  inputClassName,
  labelClassName,
  showLabel = true,
  size = "default",
}: StandaloneFormFieldProps) {
  const handleChange = (newValue: string) => {
    onChange?.(newValue);
  };

  const renderInput = () => {
    const isInvalid = !!error;
    const baseProps = {
      value,
      placeholder,
      disabled,
      className: cn(inputClassName),
      "aria-invalid": isInvalid,
    };

    switch (type) {
      case "textarea":
        return (
          <Textarea
            {...baseProps}
            rows={rows}
            onChange={(e) => handleChange(e.target.value)}
          />
        );

      case "select":
        return (
          <Select
            disabled={disabled}
            value={value}
            onValueChange={handleChange}
          >
            <SelectTrigger
              aria-invalid={isInvalid}
              className={cn(inputClassName)}
              size={size}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  disabled={option.disabled}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            {...baseProps}
            type={type}
            onChange={(e) => handleChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && label && (
        <Label
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            required &&
              "after:content-['*'] after:ml-0.5 after:text-destructive",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}
      {renderInput()}
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}

// Export both components
export default DynamicFormField;

/* 
USAGE EXAMPLES:

1. With React Hook Form:
```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { DynamicFormField } from "@/components/shared/DynamicFormField";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  bio: z.string().optional(),
  country: z.string().min(1, "Please select a country"),
});

function MyForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      bio: "",
      country: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DynamicFormField
          control={form.control}
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          required
        />
        
        <DynamicFormField
          control={form.control}
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          required
        />
        
        <DynamicFormField
          control={form.control}
          name="bio"
          type="textarea"
          label="Bio"
          placeholder="Tell us about yourself..."
          rows={6}
        />
        
        <DynamicFormField
          control={form.control}
          name="country"
          type="select"
          label="Country"
          placeholder="Select your country"
          required
          options={[
            { value: "us", label: "United States" },
            { value: "uk", label: "United Kingdom" },
            { value: "tr", label: "Turkey" },
          ]}
        />
      </form>
    </Form>
  );
}
```

2. Standalone (without React Hook Form):
```tsx
import { StandaloneFormField } from "@/components/shared/DynamicFormField";

function SimpleForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  return (
    <div>
      <StandaloneFormField
        type="email"
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChange={setEmail}
        error={error}
        required
      />
    </div>
  );
}
```
*/
