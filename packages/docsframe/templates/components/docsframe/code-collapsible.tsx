"use client";

import React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cn } from "@/lib/utils";

interface CodeCollapsibleProps {
  children?: React.ReactNode;
  className?: string;
}

const { Root, CollapsibleTrigger, CollapsibleContent } = CollapsiblePrimitive;

export function CodeCollapsible({ children, className }: CodeCollapsibleProps) {
  const [isOpened, setIsOpened] = React.useState(false);

  return (
    <Root open={isOpened} onOpenChange={setIsOpened}>
      <div
        className={cn("relative overflow-hidden my-6 rounded-md", className)}
      >
        <CollapsibleContent
          forceMount
          className={cn("overflow-hidden", !isOpened && "max-h-72")}
        >
          <div
            className={cn(
              "[&_pre]:my-0 [&_pre]:max-h-[650px] [&_pre]:pb-[100px]",
              !isOpened ? "[&_pre]:overflow-hidden" : "[&_pre]:overflow-auto]"
            )}
          >
            {children}
          </div>
        </CollapsibleContent>

        <div
          className={cn(
            "absolute flex items-center justify-center bg-gradient-to-b from-background/10 to-background to-90% p-2",
            isOpened ? "inset-x-0 bottom-0 h-12 from-gray-900/30" : "inset-0 "
          )}
        >
          <CollapsibleTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 px-4 py-2 mb-8 h-8 text-xs">
              {isOpened ? "Collapse" : "Expand"}
            </button>
          </CollapsibleTrigger>
        </div>
      </div>
    </Root>
  );
}
