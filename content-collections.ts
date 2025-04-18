import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { codeImport } from "remark-code-import";
import remarkGfm from "remark-gfm";
import { createHighlighter } from "shiki";
import { visit } from "unist-util-visit";
import path from 'path';

const prettyCodeOptions: Options = {
  theme: "github-dark",
  getHighlighter: (options) =>
    createHighlighter({
      ...options,
    }),
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className ??= [];
    node.properties.className.push("line--highlighted");
  },
  onVisitHighlightedChars(node) {
    node.properties.className ??= [];
    node.properties.className = ["word--highlighted"];
  },
};

const documents = defineCollection({
  name: "Doc",
  directory: "content",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    description: z.string().optional(),
    published: z.boolean().default(true),
    toc: z.boolean().optional().default(true),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      remarkPlugins: [codeImport, remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        () => (tree) => {
          visit(tree, (node) => {
            if (node?.type === "element" && node?.tagName === "pre") {
              const [codeEl] = node.children;
              if (codeEl.tagName !== "code") return;

              if (codeEl.data?.meta) {
                // Extract event from meta and pass it down the tree.
                const regex = /event="([^"]*)"/;
                const match = codeEl.data?.meta.match(regex);
                if (match) {
                  node.__event__ = match ? match[1] : null;
                  codeEl.data.meta = codeEl.data.meta.replace(regex, "");
                }
              }

              node.__rawString__ = codeEl.children?.[0].value;
              node.__src__ = node.properties?.__src__;
              node.__style__ = node.properties?.__style__;
            }
          });
        },
        [rehypePrettyCode, prettyCodeOptions],
        () => (tree) => {
          visit(tree, (node) => {
            if (node?.type === "element" && node?.tagName === "figure") {
              if (!("data-rehype-pretty-code-figure" in node.properties)) {
                return;
              }

              const preElement = node.children.at(-1);
              if (preElement.tagName !== "pre") {
                return;
              }

              preElement.properties["__withMeta__"] =
                node.children.at(0).tagName === "div";
              preElement.properties["__rawString__"] = node.__rawString__;

              if (node.__src__) {
                preElement.properties["__src__"] = node.__src__;
              }

              if (node.__event__) {
                preElement.properties["__event__"] = node.__event__;
              }

              if (node.__style__) {
                preElement.properties["__style__"] = node.__style__;
              }
            }
          });
        },
      ],
    });

    const pathToDocument = document._meta.path.split(path.sep).slice(1).join("/");

    return {
      ...document,
      image: `${process.env.NEXT_PUBLIC_APP_URL}`,
      slug: `/${document._meta.path}`,
      slugAsParams: pathToDocument,
      body: {
        raw: document.content,
        code: body,
      },
    };
  },
});

export default defineConfig({
  collections: [documents],
});
