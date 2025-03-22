"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { MobileNav } from "./mobile-nav";
import { CommandMenu } from "./command-menu";
import { GithubIcon, StarIcon, TwitterIcon } from "lucide-react";
import ShinyButton from "./ui/shiny-button";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b h-16 sticky top-0 z-50 lg:px-4 px-2 backdrop-filter backdrop-blur-xl bg-opacity-5">
      <div className="sm:p-3 p-2 max-w-[1530px] mx-auto h-full flex items-center justify-between gap-2">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="relative mr-6 flex items-center space-x-2">
            <Icons.favicon className="size-6 dark:invert" />
            <span className="hidden font-bold md:inline-block">Docsframe</span>
            <Badge variant="outline">Beta</Badge>
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium xl:flex">
            <Link
              href="/docs"
              aria-label="Docs"
              className={cn(
                "flex items-center justify-center transition-colors hover:text-foreground/80",
                pathname?.startsWith("/docs")
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              <span className="shrink-0">Documentation</span>
            </Link>
            <Link
              href="/docs/components"
              aria-label="Components"
              className={cn(
                "flex items-center justify-center transition-colors hover:text-foreground/80",
                pathname?.startsWith("/docs/components")
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              <span className="shrink-0">Components</span>
            </Link>
          </nav>
        </div>
        <MobileNav />
        <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
          <Link href="https://github.com/sprechblase/docsframe" className="md:pr-16 hidden sm:block">
            <ShinyButton className="flex items-center justify-center">
              <GithubIcon className="size-4 inline-block" />
              <span className="mx-2">Star on GitHub</span>
              <StarIcon className="inline-block size-4" />
            </ShinyButton>
          </Link>
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <nav className="flex items-center gap-2">
            <Link
              href="https://github.com/sprechblase/docsframe"
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                <GithubIcon className="size-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href="https://x.com/docsframe"
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                <TwitterIcon className="size-4" />
                <span className="sr-only">Twitter / X</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
      <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-100/0 via-neutral-300/20 to-neutral-100/0" />
    </header>
  );
}
