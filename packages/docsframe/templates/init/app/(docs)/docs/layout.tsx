import { getDocsConfig } from "@/lib/docsConfig";
import { DocsSidebarNav } from "@/components/docsframe/sidebar-nav";
import { ScrollArea } from "@/components/docsframe/scroll-area";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default async function DocsLayout({ children }: DocsLayoutProps) {
  const docsConfig = await getDocsConfig();

  return (
    <div className="flex place-content-center p-12">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full pr-6">
            <DocsSidebarNav items={docsConfig.sidebarNav} />
          </ScrollArea>
        </aside>
        {children}
      </div>
    </div>
  );
}
