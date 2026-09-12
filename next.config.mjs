/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // The dev-mode route indicator (bottom-left "N" icon) only ever shows in
  // `next dev`, never in a production build -- disabled anyway since it
  // clutters every screenshot while working locally.
  devIndicators: false,
};

export default nextConfig;
