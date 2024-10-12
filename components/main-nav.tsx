"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MobileNav } from "./mobile-nav";
import { mainConfig } from "@/config/main";
import { CommandMenu } from "./command-menu";
import { GithubIcon } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [color, setColor] = useState("invert-0");

  useEffect(() => {
    setColor(theme === "dark" ? "invert" : "invert-0");
  }, [theme]);

  return (
    <header className="w-full border-b h-16 sticky top-0 z-50 lg:px-4 px-2 backdrop-filter backdrop-blur-xl bg-opacity-5">
      <div className="sm:p-3 p-2 max-w-[1530px] mx-auto h-full flex items-center justify-between gap-2">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="relative mr-6 flex items-center space-x-2">
            <Icons.favicon className={cn("size-6", color)} />
            <span className="hidden font-bold md:inline-block">
              Docsframe
            </span>
            <Badge variant="outline">Beta</Badge>
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium xl:flex">
            {mainConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href!}
                aria-label={item.title}
                target={item.external ? "_blank" : undefined}
                className={cn(
                  "flex items-center justify-center transition-colors hover:text-foreground/80",
                  item.disabled && "cursor-not-allowed opacity-60",
                  pathname?.startsWith(item.href!)
                    ? "text-foreground"
                    : "text-foreground/60",
                )}
              >
                <span className="shrink-0">{item.title}</span>
                {item.label && (
                  <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-xs leading-none text-muted-foreground no-underline group-hover:no-underline">
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <MobileNav />
        <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <nav className="flex items-center gap-1">
            <Link
              href="https://github.com/skredev/docsframe"
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0",
                )}
              >
                <GithubIcon className="size-4" />
                <span className="sr-only">GitHub</span>
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
