"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

type FormFieldContextValue = {
  name: string;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
  props: ControllerProps<TFieldValues, TName>
) {
  return (
    <FormFieldContext.Provider value={{ name: String(props.name) }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    return {
      name: "",
      error: undefined as ReturnType<typeof getFieldState>["error"],
    };
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  return {
    name: fieldContext.name,
    error: fieldState.error,
  };
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { error } = useFormField();
  return (
    <Label
      className={cn(error && "text-destructive", className)}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<"div">) {
  return <div {...props} />;
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error } = useFormField();
  if (!error?.message) {
    return null;
  }

  return (
    <p className={cn("text-sm text-destructive", className)} {...props}>
      {String(error.message)}
    </p>
  );
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage };
