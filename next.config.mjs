/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/privacy.html", destination: "/privacy", permanent: true },
      { source: "/recorder/privacy", destination: "/privacy", permanent: true },
    ];
  },
};

export default nextConfig;
