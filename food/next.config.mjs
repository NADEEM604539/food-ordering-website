/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow any HTTPS domain
      },
    ],
    unoptimized: true, // disable image optimization to allow all domains
  },
};

export default nextConfig;
