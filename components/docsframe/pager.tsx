import { NavItem, NavItemWithChildren } from "@/types/index";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Doc } from "content-collections";
import Link from "next/link";
import { getDocsConfig, DocsConfig } from "@/lib/docsConfig";

interface DocsPagerProps {
  doc: Doc;
}

export async function DocPager({ doc }: DocsPagerProps) {
  const docsConfig = await getDocsConfig();
  const pager = getPagerForDoc(doc, docsConfig);

  if (!pager) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-between">
      {pager?.prev?.href && (
        <Link
          href={pager.prev.href}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
        >
          <ChevronLeftIcon className="mr-2 size-4" />
          {pager.prev.title}
        </Link>
      )}
      {pager?.next?.href && (
        <Link
          href={pager.next.href}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2ml-auto"
        >
          {pager.next.title}
          <ChevronRightIcon className="ml-2 size-4" />
        </Link>
      )}
    </div>
  );
}

function getPagerForDoc(doc: Doc, config: DocsConfig) {
  const flattenedLinks = [null, ...flatten(config.sidebarNav), null];
  const activeIndex = flattenedLinks.findIndex(
    (link) => doc.slug === link?.href
  );
  const prev = activeIndex !== 0 ? flattenedLinks[activeIndex - 1] : null;
  const next =
    activeIndex !== flattenedLinks.length - 1
      ? flattenedLinks[activeIndex + 1]
      : null;
  return {
    prev,
    next,
  };
}

function flatten(links: NavItemWithChildren[]): NavItem[] {
  return links
    .reduce<NavItem[]>((flat, link) => {
      return flat.concat(link.items?.length ? flatten(link.items) : link);
    }, [])
    .filter((link) => !link?.disabled);
}
