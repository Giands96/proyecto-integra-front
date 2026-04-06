"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type OptionItem = {
  value: string;
  label: React.ReactNode;
};

type SelectContextValue = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: OptionItem[];
  setOptions: (options: OptionItem[]) => void;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const ctx = React.useContext(SelectContext);
  if (!ctx) {
    throw new Error("Select components must be used within Select");
  }
  return ctx;
}

function Select({
  value,
  defaultValue,
  onValueChange,
  children,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}) {
  const [options, setOptions] = React.useState<OptionItem[]>([]);

  const contextValue = React.useMemo(
    () => ({ value, defaultValue, onValueChange, options, setOptions }),
    [value, defaultValue, onValueChange, options]
  );

  return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>;
}

function SelectTrigger({ className, children }: React.ComponentProps<"div">) {
  const { value, defaultValue, onValueChange, options } = useSelectContext();

  const placeholder = React.useMemo(() => {
    let detected: string | undefined;
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === SelectValue) {
        detected = child.props.placeholder;
      }
    });
    return detected;
  }, [children]);

  return (
    <select
      className={cn(
        "h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        className
      )}
      value={value}
      defaultValue={defaultValue}
      onChange={(event) => onValueChange?.(event.target.value)}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label as React.ReactNode}
        </option>
      ))}
    </select>
  );
}

function SelectValue(props: { placeholder?: string }) {
  void props;
  return null;
}

function SelectContent({ children }: { children: React.ReactNode }) {
  const { setOptions } = useSelectContext();

  React.useEffect(() => {
    const parsed: OptionItem[] = [];

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        return;
      }

      const props = child.props as { value?: string; children?: React.ReactNode };
      if (typeof props.value !== "string") {
        return;
      }

      parsed.push({
        value: props.value,
        label: props.children,
      });
    });

    setOptions(parsed);
  }, [children, setOptions]);

  return null;
}

function SelectItem(props: { value: string; children: React.ReactNode }) {
  void props;
  return null;
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
