"use client";

import { useRouter } from "next/navigation";
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
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
          >
            <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span>Go back</span>
          </button>
        </div>
      </div>
    </section>
  );
}
