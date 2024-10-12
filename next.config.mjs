/** @type {import('next').NextConfig} */

const nextConfig = {
    async redirects() {
      return [
        {
          source: "/r/:name",
          destination: "/r/styles/default/:name.json",
          permanent: true,
        },
      ];
    },
  };

export default nextConfig;
