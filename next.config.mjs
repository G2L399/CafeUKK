/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.dicebear.com", "i.waifu.pics"], // Add the domain here
    dangerouslyAllowSVG: true, // Enable this option
  },
};

export default nextConfig;
