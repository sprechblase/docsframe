"use client";

import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

type BaseTabProps = {
  children?: React.ReactNode;
  className?: string;
};

type TabsProps = BaseTabProps & TabsPrimitive.TabsProps;
type TabsListProps = BaseTabProps & TabsPrimitive.TabsListProps;
type TabTriggerProps = BaseTabProps & TabsPrimitive.TabsTriggerProps;
type TabContentProps = BaseTabProps & TabsPrimitive.TabsContentProps;

export function Tabs({ children, className, ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      className={cn("relative mt-6 w-full", className)}
      {...props}
    >
      {children}
    </TabsPrimitive.Root>
  );
}

export function TabsList({ children, className, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex h-9 items-center text-muted-foreground w-full justify-start rounded-none border-b bg-transparent p-0",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({
  children,
  className,
  ...props
}: TabTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({
  children,
  className,
  ...props
}: TabContentProps) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Content>
  );
}
