import { Mdx } from "@/components/docsframe/mdx-components";
import { DocPager } from "@/components/docsframe/pager";
import { ScrollArea } from "@/components/docsframe/scroll-area";
import { getTableOfContents } from "@/lib/toc";
import { cn } from "@/lib/utils";

import "@/app/mdx.css";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import { allDocs } from "content-collections";
import { notFound } from "next/navigation";

import { Contribute } from "@/components/docsframe/contribute";
import { TableOfContents } from "@/components/docsframe/toc";

interface DocPageProps {
  params: {
    slug: string[];
  };
}

async function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug?.join("/") || "";
  const doc = allDocs.find((doc) => doc.slugAsParams === slug);

  if (!doc) {
    return null;
  }

  return doc;
}

export async function generateStaticParams(): Promise<
  DocPageProps["params"][]
> {
  return allDocs.map((doc) => ({
    slug: doc.slugAsParams.split("/"),
  }));
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params });

  if (!doc || !doc.published) {
    notFound();
  }

  const toc = await getTableOfContents(doc.body.raw);

  return (
    <main
      className={cn("relative lg:gap-10 xl:grid ", {
        "xl:grid-cols-[1fr_300px]": doc.toc,
      })}
    >
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="truncate">Docs</div>
          <ChevronRightIcon className="size-4" />
          <div className="font-medium text-foreground">{doc.title}</div>
        </div>
        <div className="space-y-2">
          <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>
            {doc.title}
          </h1>
          {doc.description && (
            <p className="text-balance text-lg text-muted-foreground">
              {doc.description}
            </p>
          )}
        </div>
        <div className="pb-12 pt-8">
          <Mdx code={doc.body.code} />
        </div>
        <DocPager doc={doc} />
      </div>
      {doc.toc && (
        <div className="hidden text-sm xl:block">
          <div className="sticky -mt-10 pt-9">
            <ScrollArea className="pb-10">
              <div className="sticky -mt-10 h-[calc(100vh-3.5rem)] space-y-4 py-12">
                <TableOfContents toc={toc} />
                <Contribute doc={doc} />
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </main>
  );
}
