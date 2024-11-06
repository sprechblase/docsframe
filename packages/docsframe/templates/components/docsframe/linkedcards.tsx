"use client";

import { FC, ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LinkedCardsProps {
  children?: ReactNode;
  className?: string;
}

interface LinkedCardProps {
  children?: string;
  className?: string;
  href: string;
}

export const LinkedCards: FC<LinkedCardsProps> = ({ children, className }) => {
  return (
    <div className={cn("mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6", className)}>
      {children}
    </div>
  );
};

export const LinkedCardItem: FC<LinkedCardProps> = ({
  children,
  className,
  href,
}) => {
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
};
