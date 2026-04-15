import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostLayout } from "@/components/blog-post-layout";
import { getBlogPostBySlug, getBlogStaticParams } from "@/lib/blog";
import { useMDXComponents } from "../../../../mdx-components";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getBlogStaticParams();
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.meta.title,
    description: post.meta.subtitle,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const Content = post.Content;

  return (
    <BlogPostLayout meta={post.meta} sourceFilename={post.filename}>
      <Content components={useMDXComponents()} />
    </BlogPostLayout>
  );
}
