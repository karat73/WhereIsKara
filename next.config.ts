import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Static branding assets (logo, sprites, favicon) rarely change and
        // aren't content-hashed, so Next's default max-age=0 forces a
        // revalidation request on every load. A week-long cache is a
        // reasonable middle ground: real caching, without a year-long risk
        // if one of these is ever swapped without a rename.
        source: "/(kara/.*|icon.png|opengraph-image.png)",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
    ];
  },
};

export default nextConfig;
