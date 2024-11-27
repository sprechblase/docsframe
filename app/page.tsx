"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import BlurFade from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import Particles from "@/components/ui/particles";
import ShimmerButton from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#030303");
  }, [theme]);

  return (
    <main className="mx-auto flex-1">
      <section id="hero" className="relative mx-auto mt-28 max-w-[80rem] text-center px-6 md:px-8">
        <Particles
          className="absolute inset-0"
          quantity={100}
          ease={80}
          color={color}
          refresh
        />
        
        <BlurFade delay={0.1} yOffset={-6} inView>
          <div className="z-10 h-12 flex items-center justify-center">
            <div
              onClick={() => router.push("/docs")}
              className="group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            >
              <AnimatedShinyText className="inline-flex items-center justify-center text-sm px-4 py-1 transition ease-out hover:text-neutral-600 hover:dark:text-neutral-400">
                <span>✨ Introducing Docsframe</span>
                <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedShinyText>
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={0.2} yOffset={-6} inView>
          <h1 className="font-semibold text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-foreground to-zinc-500 text-transparent bg-clip-text p-2">
            The easiest way to build
            <br className="block" />
            your documentation
          </h1>
        </BlurFade>
        <BlurFade delay={0.3} yOffset={-6} inView>
          <p className="mt-6 text-lg font-medium tracking-tight text-zinc-600 dark:text-zinc-300 md:text-lg">
            Beautifully designed framework built with Tailwind CSS and React.
            <br className="block" />
            Customizable. Open Source.
          </p>
        </BlurFade>
        <BlurFade delay={0.4} yOffset={-6} inView>
          <div className="flex justify-center group mt-24">
            <ShimmerButton
              className="shadow-2xl"
              onClick={() => router.push("/docs/getting-started")}
            >
              <ChevronLeft className="text-white size-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-white pl-2">Get Started</span>
            </ShimmerButton>
          </div>
        </BlurFade>
      </section>

      <section id="preview" className="relative mx-auto mt-36 max-w-[80rem] px-6 md:px-8">
        <BlurFade delay={0.5} inView>
          <div className="p-1 border rounded-[1.25rem] md:shadow-2xl dark:shadow-white/10 bg-zinc-50 dark:bg-zinc-950">
            <div className="relative select-none flex h-[536px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border bg-background pointer-events-none">
              <Image
                src={`/preview_${color === "#030303" ? "light" : "dark"}.png`}
                height={536}
                width={1200}
                alt="Preview picture"
                priority
              />
              <BorderBeam
                size={250}
                duration={12}
                delay={9}
                colorFrom={color}
                colorTo={color}
              />
            </div>
          </div>
          
          <p className="pl-2 py-10 text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://twitter.com/skredev"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              skredev
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/skredev/docsframe"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </BlurFade>
      </section>
    </main>
  );
}
