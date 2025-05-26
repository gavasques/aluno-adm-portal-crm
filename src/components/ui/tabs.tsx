
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

// Nova variante do TabsTrigger com contador e layout compacto
const TabsTriggerWithBadge = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    badgeCount?: number;
    compact?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
    shortLabel?: string;
  }
>(({ className, badgeCount, compact = false, icon: Icon, shortLabel, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      compact 
        ? "data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-2 py-2 flex flex-col items-center gap-1 text-xs min-w-0 flex-1"
        : "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  >
    {compact && Icon ? (
      <>
        <Icon className="h-4 w-4 flex-shrink-0" />
        <div className="flex flex-col items-center gap-0.5">
          <span className="hidden xl:block text-xs font-medium truncate">{children}</span>
          <span className="xl:hidden text-xs font-medium truncate">{shortLabel || children}</span>
          {typeof badgeCount === 'number' && (
            <span className="bg-secondary text-secondary-foreground text-xs px-1.5 py-0.5 rounded-full h-auto min-h-0">
              {badgeCount}
            </span>
          )}
        </div>
      </>
    ) : (
      <>
        {children}
        {typeof badgeCount === 'number' && (
          <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
            {badgeCount}
          </span>
        )}
      </>
    )}
  </TabsPrimitive.Trigger>
))
TabsTriggerWithBadge.displayName = "TabsTriggerWithBadge";

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsTriggerWithBadge }
