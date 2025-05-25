
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CheckboxGroupProps {
  className?: string;
  children: React.ReactNode;
}

interface CheckboxItemProps {
  id: string;
  label: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  CheckboxGroupProps
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {children}
    </div>
  );
});
CheckboxGroup.displayName = "CheckboxGroup";

const CheckboxItem = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  CheckboxItemProps
>(({ id, label, description, checked, onCheckedChange, disabled, ...props }, ref) => {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox 
        id={id} 
        checked={checked} 
        onCheckedChange={onCheckedChange} 
        disabled={disabled}
        ref={ref} 
        {...props}
      />
      <div className="grid gap-1 leading-none">
        <Label htmlFor={id} className={disabled ? "text-muted-foreground" : ""}>{label}</Label>
        {description && (
          <p className={cn("text-sm text-muted-foreground", disabled && "opacity-50")}>{description}</p>
        )}
      </div>
    </div>
  );
});
CheckboxItem.displayName = "CheckboxItem";

export { CheckboxGroup, CheckboxItem };
