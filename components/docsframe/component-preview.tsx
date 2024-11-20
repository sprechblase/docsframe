"use client";

import React from "react";
import { cn } from "@/lib/utils";

type ComponentPreviewProps = {
  children?: React.ReactNode;
  className?: string;
};

export function ComponentPreview({
  children,
  className,
}: ComponentPreviewProps) {
  return (
    <div
      className={cn(
        "relative my-4 flex flex-col space-y-2 lg:max-w-[120ch]",
        className
      )}
    >
      <div
        className={cn(
          "max-w-screen relative flex flex-col items-center justify-center rounded-xl bg-background p-0 md:border md:p-16",
          className
        )}
      >
        <React.Suspense
          fallback={
            <div className="flex items-center text-sm text-muted-foreground">
              Loading...
            </div>
          }
        >
          {children}
        </React.Suspense>
      </div>
    </div>
  );
}
