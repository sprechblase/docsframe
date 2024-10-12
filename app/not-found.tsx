"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <section>
      <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center px-6 py-12">
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <h1 className="mt-3 text-2xl font-semibold md:text-3xl">
            Page not found
          </h1>

          <div className="group mt-8 flex w-full items-center gap-x-3 sm:w-auto">
            <Button
              onClick={() => router.back()}
              className={buttonVariants({ variant: "default" })}
            >
              <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              <span>Go back</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
