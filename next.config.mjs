import { withContentCollections } from "@content-collections/next";
  /** @type {import('next').NextConfig} */

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/docs/components",
        destination: "/docs/components/callout",
        permanent: true,
      },
    ];
  },
};

export default withContentCollections(nextConfig);