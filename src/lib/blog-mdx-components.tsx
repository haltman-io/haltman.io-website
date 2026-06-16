import type { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";
import { resolveBlogImageSrc } from "@/lib/blog-image-manifest";
import {
  ContentImage,
  getMDXComponents,
  PostImage,
} from "../../mdx-components";

function resolveSrc(
  src: ComponentProps<"img">["src"],
  sourceFilename: string,
) {
  return typeof src === "string" ? resolveBlogImageSrc(src, sourceFilename) : src;
}

export function createBlogMDXComponents(sourceFilename: string): MDXComponents {
  return getMDXComponents({
    img: (props) => (
      <ContentImage {...props} src={resolveSrc(props.src, sourceFilename)} />
    ),
    PostImage: (props: ComponentProps<typeof PostImage>) => (
      <PostImage {...props} src={resolveSrc(props.src, sourceFilename)} />
    ),
  });
}
