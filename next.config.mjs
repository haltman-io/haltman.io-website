import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-mdx-frontmatter"],
  },
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  reactCompiler: true,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: { unoptimized: true },
  trailingSlash: true,
};

export default withMDX(nextConfig);
