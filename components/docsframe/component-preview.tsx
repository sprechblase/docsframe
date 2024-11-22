"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { GridPattern } from "../ui/grid-pattern";

type ComponentPreviewProps = {
  children?: React.ReactNode;
  className?: string;
  demo?: boolean;
};

export function ComponentPreview({
  children,
  className,
  demo = false,
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
        {!demo && (
          <GridPattern
            width={30}
            height={30}
            x={-1}
            y={-1}
            strokeDasharray={"4 2"}
            className={cn(
              "[mask-image:radial-gradient(600px_circle_at_center,transparent,white)]"
            )}
          />
        )}
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
