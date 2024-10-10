/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.dicebear.com"], // Add the domain here
    dangerouslyAllowSVG: true, // Enable this option
  },
};

export default nextConfig;
