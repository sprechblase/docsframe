"use client";

import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  return (
    <section className="absolute inset-0 flex items-center justify-center px-6">
      <div className="mx-auto text-center">
        <h1 className="mt-3 text-2xl font-semibold md:text-3xl">
          Page not found
        </h1>
        <div className="group mt-8 flex w-full items-center justify-center gap-x-3 sm:w-auto">
          <Button
            onClick={() => router.back()}
            className={buttonVariants({ variant: "default" })}
          >
            <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span>Go back</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
