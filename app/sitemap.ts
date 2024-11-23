import { allDocs } from "content-collections";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `https://docsframe.work`,
      lastModified: new Date(),
      priority: 1,
    },
    ...allDocs.map((post) => ({
      url: `https://docsframe.work/docs/${post.slugAsParams}`,
      priority: 0.8,
    })),
  ];
}
