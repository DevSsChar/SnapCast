import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        hostname: 'dev-snap-cast.b-cdn.net', 
        protocol:'https', 
        port:'',
        pathname:'/**'
      },
      {
        hostname: 'lh3.googleusercontent.com', 
        protocol:'https', 
        port:'',
        pathname:'/**'
      }
    ],
    // to allow the images from our bunny servers
    dangerouslyAllowSVG: true,
    unoptimized: true,
  }
  /* config options here */
  // reactCompiler: true,
};

export default nextConfig;
