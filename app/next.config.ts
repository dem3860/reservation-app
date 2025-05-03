import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           key: "Content-Security-Policy",
  //           value:
  //             "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:8787; connect-src 'self' http://localhost:8787; frame-src 'self' http://localhost:8787;",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
