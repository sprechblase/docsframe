"use client";

import React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LinkedCardsProps {
  children?: React.ReactNode;
  className?: string;
}

interface LinkedCardProps {
  children?: React.ReactNode;
  className?: string;
  href: string;
}

export function LinkedCards({ children, className }: LinkedCardsProps) {
  return (
    <div className={cn("mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6", className)}>
      {children}
    </div>
  );
}

export function LinkedCardItem({ children, className, href }: LinkedCardProps) {
  return (
    <Link
      className={cn(
        "flex w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10",
        className
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
